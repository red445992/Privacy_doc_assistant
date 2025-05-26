from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from .services import PolicyAnalyzer


class PolicyAnalysisView(LoginRequiredMixin, TemplateView):
    template_name = 'analysis/policy_analysis.html'

    def post(self, request, *args, **kwargs):
        policy_text = request.POST.get('policy_text', '')
        analyzer = PolicyAnalyzer()
        
        try:
            summary, risk_score, found_risks = analyzer.analyze_policy(policy_text)
            context = {
                'summary': summary,
                'risk_score': risk_score,
                'found_risks': found_risks,
                'policy_text': policy_text
            }
        except Exception as e:
            context = {
                'error': str(e),
                'policy_text': policy_text
            }
        
        return render(request, self.template_name, context)


class PolicyComparisonView(LoginRequiredMixin, TemplateView):
    template_name = 'analysis/policy_comparison.html'

    def post(self, request, *args, **kwargs):
        policy1 = request.POST.get('policy_text_1', '')
        policy2 = request.POST.get('policy_text_2', '')
        analyzer = PolicyAnalyzer()
        
        try:
            comparison_results = analyzer.compare_policies(policy1, policy2)
            context = {
                'comparison': comparison_results,
                'policy_text_1': policy1,
                'policy_text_2': policy2
            }
        except Exception as e:
            context = {
                'error': str(e),
                'policy_text_1': policy1,
                'policy_text_2': policy2
            }
        
        return render(request, self.template_name, context) 