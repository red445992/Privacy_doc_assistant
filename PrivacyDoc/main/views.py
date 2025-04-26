# from django.shortcuts import render,redirect
# from .forms import DocumentForm
# from .models import Document
# from .utils import extract_text_from_pdf  # Assuming you have a utility function for text extraction
# import os


# import spacy
# import nltk
# # Create your views here.
# # def index(request):
# #     extracted_text = ""
# #     if request.method == 'POST':
# #         form = DocumentForm(request.POST, request.FILES)
# #         if form.is_valid():
# #             doc = form.save()
# #             extracted_text = extract_text_from_pdf(doc.file)
# #     else:
# #         form = DocumentForm()
    
# #     documents = Document.objects.all().order_by('-uploaded_at')
# #     return render(request, 'index.html', {'form': form, 'documents': documents,'extracted_text':extracted_text})  # Replace with actual template name



# nlp = spacy.load("en_core_web_sm")

# def home(request):
#     if request.method == 'POST':
#         document = request.POST.get("policy_text", "")
#         summary = summarize_policy(document)
#         return render(request, 'result.html', {'summary': summary})
#     return render(request, 'home.html')

# def summarize_policy(text):
#     doc = nlp(text)
#     sentences = [sent.text for sent in doc.sents]
#     return sentences[:5]  # Returning top 5 sentences as a summary



# views.py
from django.shortcuts import render
import spacy
import nltk

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Define a list of risky terms
risky_terms = [
    "third party", "share with third parties", "sell your data", 
    "no encryption", "data retention", "tracking", "personal data", 
    "consent", "collect", "disclose", "transfer"
]

# views.py
def home(request):
    if request.method == 'POST':
        policy_1 = request.POST.get("policy_text_1", "")
        policy_2 = request.POST.get("policy_text_2", "")
        
        summary_1, risk_score_1, found_risks_1 = analyze_policy(policy_1)
        summary_2, risk_score_2, found_risks_2 = analyze_policy(policy_2)
        
        return render(request, 'compare_result.html', {
            'summary_1': summary_1, 'summary_2': summary_2,
            'risk_score_1': risk_score_1, 'risk_score_2': risk_score_2,
            'found_risks_1': found_risks_1, 'found_risks_2': found_risks_2
        })
    return render(request, 'main/home.html')



def analyze_policy(text):
    doc = nlp(text)
    
    # Summarize the policy (returning top 5 sentences as an example)
    sentences = [sent.text for sent in doc.sents][:5]
    
    # Risk scoring: Count risky terms
    risk_score = 0
    found_risks = []

    for term in risky_terms:
        if term.lower() in text.lower():
            risk_score += 1
            found_risks.append(term)

    # Higher score = riskier policy
    return sentences, risk_score, found_risks
