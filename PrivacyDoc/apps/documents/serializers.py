from rest_framework import serializers
from .models import Document, DocumentCategory


class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = ['id', 'name', 'description', 'created_at']


class DocumentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    file_url = serializers.SerializerMethodField()
    version_history = serializers.SerializerMethodField()
    shared_with = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Document.objects.all(),
        required=False
    )
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'file_url', 'uploaded_at',
            'processed_text', 'is_processed', 'file_size', 'file_type',
            'user', 'category', 'category_name', 'version', 'parent_version',
            'is_shared', 'shared_with', 'version_history', 'search_vector'
        ]
        read_only_fields = [
            'uploaded_at', 'processed_text', 'is_processed',
            'file_size', 'file_type', 'user', 'version', 'parent_version',
            'version_history', 'search_vector'
        ]

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None

    def get_version_history(self, obj):
        history = obj.get_version_history()
        return [{
            'version': doc.version,
            'uploaded_at': doc.uploaded_at,
            'file_url': self.get_file_url(doc)
        } for doc in history]

    def validate_file(self, value):
        if value:
            if value.size > 10 * 1024 * 1024:  # 10MB
                raise serializers.ValidationError('File size must be under 10MB')
            if not value.name.lower().endswith('.pdf'):
                raise serializers.ValidationError('Only PDF files are allowed')
        return value

    def create(self, validated_data):
        shared_with = validated_data.pop('shared_with', [])
        document = super().create(validated_data)
        if shared_with:
            document.share_with(shared_with)
        return document

    def update(self, instance, validated_data):
        shared_with = validated_data.pop('shared_with', None)
        document = super().update(instance, validated_data)
        if shared_with is not None:
            document.shared_with.set(shared_with)
            document.is_shared = bool(shared_with)
            document.save()
        return document 