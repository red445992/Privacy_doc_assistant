from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Document, DocumentCategory
from .serializers import DocumentSerializer, DocumentCategorySerializer
from utils.pdf_processor import PDFProcessor


class DocumentCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DocumentCategory.objects.all()


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(
            Q(user=user) | Q(shared_with=user)
        ).distinct()

    def perform_create(self, serializer):
        document = serializer.save(user=self.request.user)
        try:
            pdf_processor = PDFProcessor()
            text = pdf_processor.extract_text(document.file.path)
            if text:
                cleaned_text = pdf_processor.clean_text(text)
                document.processed_text = cleaned_text
                document.is_processed = True
                document.save()
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        document = self.get_object()
        if document.file:
            return Response({
                'file_url': request.build_absolute_uri(document.file.url)
            })
        return Response(
            {'error': 'File not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    @action(detail=True, methods=['get'])
    def versions(self, request, pk=None):
        document = self.get_object()
        versions = document.get_version_history()
        serializer = self.get_serializer(versions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        document = self.get_object()
        user_ids = request.data.get('user_ids', [])
        try:
            document.share_with(user_ids)
            return Response({'status': 'Document shared successfully'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def unshare(self, request, pk=None):
        document = self.get_object()
        user_ids = request.data.get('user_ids', [])
        try:
            document.unshare_with(user_ids)
            return Response({'status': 'Sharing removed successfully'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        category = request.query_params.get('category')
        is_processed = request.query_params.get('is_processed')
        
        queryset = self.get_queryset()
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(processed_text__icontains=query)
            )
        
        if category:
            queryset = queryset.filter(category_id=category)
            
        if is_processed is not None:
            queryset = queryset.filter(is_processed=is_processed.lower() == 'true')
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def batch_process(self, request):
        document_ids = request.data.get('document_ids', [])
        if not document_ids:
            return Response(
                {'error': 'No document IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        documents = self.get_queryset().filter(id__in=document_ids)
        pdf_processor = PDFProcessor()
        results = []

        for document in documents:
            try:
                text = pdf_processor.extract_text(document.file.path)
                if text:
                    cleaned_text = pdf_processor.clean_text(text)
                    document.processed_text = cleaned_text
                    document.is_processed = True
                    document.save()
                    results.append({
                        'id': document.id,
                        'status': 'success'
                    })
                else:
                    results.append({
                        'id': document.id,
                        'status': 'error',
                        'message': 'No text extracted'
                    })
            except Exception as e:
                results.append({
                    'id': document.id,
                    'status': 'error',
                    'message': str(e)
                })

        return Response(results)

    @action(detail=False, methods=['post'])
    def batch_export(self, request):
        document_ids = request.data.get('document_ids', [])
        if not document_ids:
            return Response(
                {'error': 'No document IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        documents = self.get_queryset().filter(id__in=document_ids)
        export_format = request.data.get('format', 'json')
        
        if export_format == 'json':
            serializer = self.get_serializer(documents, many=True)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Unsupported export format'},
                status=status.HTTP_400_BAD_REQUEST
            ) 