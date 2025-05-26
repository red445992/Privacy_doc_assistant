import fitz  # PyMuPDF
from typing import Optional
import re


class PDFProcessor:
    """Utility class for processing PDF documents."""

    @staticmethod
    def extract_text(pdf_path: str) -> Optional[str]:
        """
        Extract text from a PDF file.
        
        Args:
            pdf_path (str): Path to the PDF file
            
        Returns:
            Optional[str]: Extracted text or None if processing fails
        """
        try:
            doc = fitz.open(pdf_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return None

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean extracted text by removing unwanted elements.
        
        Args:
            text (str): Text to clean
            
        Returns:
            str: Cleaned text
        """
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        
        return text.strip()

    @staticmethod
    def get_metadata(pdf_path: str) -> dict:
        """
        Extract metadata from a PDF file.
        
        Args:
            pdf_path (str): Path to the PDF file
            
        Returns:
            dict: PDF metadata
        """
        try:
            doc = fitz.open(pdf_path)
            metadata = doc.metadata
            doc.close()
            return metadata
        except Exception as e:
            print(f"Error extracting metadata: {str(e)}")
            return {} 