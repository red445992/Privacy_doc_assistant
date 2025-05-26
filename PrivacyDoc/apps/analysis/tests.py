from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from .services import PolicyAnalyzer

User = get_user_model()


class AnalysisTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.login(username='testuser', password='testpass123')
        self.analyzer = PolicyAnalyzer()

    def test_policy_analysis(self):
        test_policy = """
        This privacy policy states that we may share your data with third parties.
        We collect personal information and may disclose it to our partners.
        Your data might be transferred to other countries.
        We use tracking cookies to monitor your behavior.
        """
        
        summary, risk_score, found_risks = self.analyzer.analyze_policy(test_policy)
        
        self.assertIsInstance(summary, list)
        self.assertIsInstance(risk_score, int)
        self.assertIsInstance(found_risks, list)
        self.assertTrue(risk_score > 0)  # Should find some risks

    def test_policy_comparison(self):
        policy1 = "We share data with third parties."
        policy2 = "We never share your data."
        
        comparison = self.analyzer.compare_policies(policy1, policy2)
        
        self.assertIn('policy1', comparison)
        self.assertIn('policy2', comparison)
        self.assertIn('comparison', comparison)
        self.assertNotEqual(
            comparison['policy1']['risk_score'],
            comparison['policy2']['risk_score']
        )

    def test_analysis_view(self):
        response = self.client.post(reverse('analysis:analyze'), {
            'policy_text': 'Test policy text'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'analysis/policy_analysis.html')

    def test_comparison_view(self):
        response = self.client.post(reverse('analysis:compare'), {
            'policy_text_1': 'First policy',
            'policy_text_2': 'Second policy'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'analysis/policy_comparison.html') 