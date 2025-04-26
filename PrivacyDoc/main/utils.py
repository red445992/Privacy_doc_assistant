import os
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_file):
    try:
        file_path = pdf_file.path  # Path to the uploaded PDF file
        print(f"Attempting to open file at: {file_path}")
        doc = fitz.open(file_path)  # Open the PDF
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error opening file: {e}")
        return "Error opening PDF file."
