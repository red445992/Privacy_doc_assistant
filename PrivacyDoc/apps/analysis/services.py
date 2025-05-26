import spacy
from typing import List, Tuple, Dict
from django.conf import settings


class PolicyAnalyzer:
    """Service class for analyzing privacy policies."""

    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.risky_terms = [
            "third party", "share with third parties", "sell your data",
            "no encryption", "data retention", "tracking", "personal data",
            "consent", "collect", "disclose", "transfer"
        ]

    def analyze_policy(self, text: str) -> Tuple[List[str], int, List[str]]:
        """
        Analyze a privacy policy text.
        
        Args:
            text (str): The privacy policy text to analyze
            
        Returns:
            Tuple[List[str], int, List[str]]: Summary sentences, risk score, and found risks
        """
        doc = self.nlp(text)
        
        # Extract summary sentences
        sentences = [sent.text for sent in doc.sents][:5]
        
        # Calculate risk score
        risk_score = 0
        found_risks = []

        for term in self.risky_terms:
            if term.lower() in text.lower():
                risk_score += 1
                found_risks.append(term)

        return sentences, risk_score, found_risks

    def compare_policies(self, policy1: str, policy2: str) -> Dict:
        """
        Compare two privacy policies.
        
        Args:
            policy1 (str): First policy text
            policy2 (str): Second policy text
            
        Returns:
            Dict: Comparison results
        """
        summary1, risk_score1, risks1 = self.analyze_policy(policy1)
        summary2, risk_score2, risks2 = self.analyze_policy(policy2)
        
        return {
            'policy1': {
                'summary': summary1,
                'risk_score': risk_score1,
                'risks': risks1
            },
            'policy2': {
                'summary': summary2,
                'risk_score': risk_score2,
                'risks': risks2
            },
            'comparison': {
                'risk_difference': risk_score1 - risk_score2,
                'common_risks': list(set(risks1) & set(risks2)),
                'unique_risks_policy1': list(set(risks1) - set(risks2)),
                'unique_risks_policy2': list(set(risks2) - set(risks1))
            }
        } 