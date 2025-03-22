import asyncio
import os
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from rag.document_loader import DocumentLoader
from rag.vector_store import VectorStoreManager
from config.settings import settings

class RAGPipeline:
    def __init__(self):
        self.document_loader = DocumentLoader()
        self.vector_store_manager = VectorStoreManager()
        
        self.llm = ChatOpenAI(
            model=settings.CHAT_MODEL,
            temperature=0.7,
            openai_api_key=settings.OPENAI_API_KEY
        )
        
        self.system_prompt = """
        You are an expert academic assistant with access to a large collection of books.
        Your goal is to provide accurate, comprehensive, and helpful responses to questions 
        based on the academic content in your knowledge base.
        
        Use the following context from relevant books to answer the user's question:
        
        {context}
        
        If the context doesn't provide enough information to answer the question fully, 
        say so and provide the best answer you can based on the available information.
        
        Format your answer in a clear, concise, and academic style. Use markdown formatting 
        for better readability when appropriate.
        """
        
        self.query_prompt = """
        Human: {question}
        """
        
        # Initialize the vector store 
        self._initialize_vector_store()
    
    def _initialize_vector_store(self):
        """Initialize the vector store"""
        try:
            if not self.vector_store_manager.vector_store_exists():
                print("Vector store not found. Creating new vector store...")
                self._create_vector_store()
            else:
                print("Vector store found. Loading existing vector store...")
                self.vector_store = self.vector_store_manager.load_vector_store()
        except Exception as e:
            print(f"Error initializing vector store: {str(e)}")
            # If loading fails, create a new vector store
            self._create_vector_store()
    
    def _create_vector_store(self):
        """Create a new vector store from documents"""
        try:
            # Load documents
            documents = self.document_loader.load_documents()
            
            # Split documents into chunks
            chunks = self.document_loader.split_documents(documents)
            
            # Create vector store
            self.vector_store = self.vector_store_manager.create_vector_store(chunks)
            print("Vector store created successfully")
        except Exception as e:
            print(f"Error creating vector store: {str(e)}")
            raise
    
    async def query(self, question: str) -> str:
        """Query the RAG pipeline with a question"""
        try:
            # Create retriever
            retriever = self.vector_store.as_retriever(search_kwargs={"k": 5})
            
            # Create prompt template
            prompt = ChatPromptTemplate.from_messages([
                ("system", self.system_prompt),
                ("human", "{question}")
            ])
            
            # Create RAG pipeline
            rag_chain = (
                {"context": retriever, "question": RunnablePassthrough()}
                | prompt
                | self.llm
                | StrOutputParser()
            )
            
            # Execute query
            result = await rag_chain.ainvoke(question)
            return result
        except Exception as e:
            print(f"Error querying RAG pipeline: {str(e)}")
            # Return a fallback response if the RAG pipeline fails
            return "I apologize, but I'm having trouble processing your question. Please try again later."