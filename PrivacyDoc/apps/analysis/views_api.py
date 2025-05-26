from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import PolicyAnalysisSerializer, PolicyComparisonSerializer
from .services import PolicyAnalyzer


class PolicyAnalysisViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    analyzer = PolicyAnalyzer()

    @action(detail=False, methods=['post'])
    def analyze(self, request):
        serializer = PolicyAnalysisSerializer(data=request.data)
        if serializer.is_valid():
            try:
                summary, risk_score, found_risks = self.analyzer.analyze_policy(
                    serializer.validated_data['policy_text']
                )
                return Response({
                    'summary': summary,
                    'risk_score': risk_score,
                    'found_risks': found_risks
                })
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def compare(self, request):
        serializer = PolicyComparisonSerializer(data=request.data)
        if serializer.is_valid():
            try:
                comparison = self.analyzer.compare_policies(
                    serializer.validated_data['policy_text_1'],
                    serializer.validated_data['policy_text_2']
                )
                return Response(comparison)
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 