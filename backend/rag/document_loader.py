import os
import glob
from typing import List, Dict, Any
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
    UnstructuredEPubLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from config.settings import settings

class DocumentLoader:
    def __init__(self):
        self.data_dir = settings.DATA_DIR
        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""]
        )
    
    def load_documents(self) -> List[Document]:
        """Load all documents from the data directory"""
        documents = []
        
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            print(f"Created data directory: {self.data_dir}")
            return documents
        
        for pdf_path in glob.glob(os.path.join(self.data_dir, "**/*.pdf"), recursive=True):
            try:
                loader = PyPDFLoader(pdf_path)
                documents.extend(loader.load())
                print(f"Loaded PDF: {pdf_path}")
            except Exception as e:
                print(f"Error loading PDF {pdf_path}: {str(e)}")
        
        for txt_path in glob.glob(os.path.join(self.data_dir, "**/*.txt"), recursive=True):
            try:
                loader = TextLoader(txt_path)
                documents.extend(loader.load())
                print(f"Loaded text file: {txt_path}")
            except Exception as e:
                print(f"Error loading text file {txt_path}: {str(e)}")
        
        for docx_path in glob.glob(os.path.join(self.data_dir, "**/*.docx"), recursive=True):
            try:
                loader = Docx2txtLoader(docx_path)
                documents.extend(loader.load())
                print(f"Loaded DOCX file: {docx_path}")
            except Exception as e:
                print(f"Error loading DOCX file {docx_path}: {str(e)}")
        
        for epub_path in glob.glob(os.path.join(self.data_dir, "**/*.epub"), recursive=True):
            try:
                loader = UnstructuredEPubLoader(epub_path)
                documents.extend(loader.load())
                print(f"Loaded EPUB file: {epub_path}")
            except Exception as e:
                print(f"Error loading EPUB file {epub_path}: {str(e)}")
        
        print(f"Loaded {len(documents)} documents in total")
        return documents
    
    def split_documents(self, documents: List[Document]) -> List[Document]:
        """Split documents into chunks"""
        chunks = self.text_splitter.split_documents(documents)
        print(f"Split documents into {len(chunks)} chunks")
        return chunks