from rest_framework import serializers


class PolicyAnalysisSerializer(serializers.Serializer):
    policy_text = serializers.CharField(required=True)
    summary = serializers.ListField(child=serializers.CharField(), required=False)
    risk_score = serializers.IntegerField(required=False)
    found_risks = serializers.ListField(child=serializers.CharField(), required=False)


class PolicyComparisonSerializer(serializers.Serializer):
    policy_text_1 = serializers.CharField(required=True)
    policy_text_2 = serializers.CharField(required=True)
    comparison = serializers.DictField(required=False) 