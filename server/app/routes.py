# /server/app/routes.py
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from ollama import Client
import requests
import re
import threading
import os
from utils.build_chroma_data import process_html_file, save_products_to_chromadb, query_chromadb, save_products_to_json
# from chromadb_utils import get_embedding, save_products_to_chromadb

load_dotenv()
from general_instructions import general_instructions

chat_agent = Blueprint('chat_agent', __name__)

ollama_client = Client()

def extract_answer(response):
    match = re.search(r"Answer:\s*(.*?)(?:,|$)", response)
    return match.group(1) if match else None

OLLAMA_API_URL = "http://localhost:11434/api"  # Replace with your OLLAMA API URL

def filter_final_answer(response_text):
    # Remove anything between <think> and </think>
    final_answer = re.sub(r"<think>.*?</think>", "", response_text, flags=re.DOTALL).strip()
    return final_answer

@chat_agent.route('/api/chat', methods=['POST'])
def chat():
    # Get the user query from the request JSON
    data = request.get_json()
    user_query = data.get('query', '')
    chat_history = data.get('history', '')
    
    context = query_chromadb(user_query, n_results=3)["metadatas"][0]

    general_instructions = f"""
    You are PartSelect.com's dedicated chat agent for refrigerator and dishwasher parts.
    You will be chatting with a customer who will be seeking guidance on products and installations. If a query does not pertain to dishwasher or refridgerator parts, or does not adhere to the context of the conversation, do not answer it. Say \"I can't answer that question, but I'd be happy to help you with any appliance-related concerns.
    """

    user_prompt = f"""Actual query:{user_query}"""
    messages = [
    {"role": "system", "content": general_instructions},
    {"role": "user", "content": user_prompt} ]
    
    payload = {
        "model": "deepseek-r1:1.5b",
        "prompt": (
            f"{general_instructions}, "
            f"context information {context}\nuser: {user_query}\nassistant:"
        ), 
        "stream": False,  # Enable streaming
    }
    try:
        response = requests.post(f"{OLLAMA_API_URL}/generate", json=payload)
        response.raise_for_status()  # Raise an error for bad responses

        ollama_repsonse = response.json()
        ai_response = filter_final_answer(ollama_repsonse['response'])
        
        print(f"HERE")  
        # print(f"Assistant Response: {assistant_response}")
        final_answer = re.search(r"\*\*Final Answer:\*\* (.+)", ai_response)
        if final_answer:
            final_answer_text = final_answer.group(1)
            print("Final Answer:", final_answer_text)
        else:
            print("Final answer not found.")
        return jsonify(response=ai_response)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": str(e),
            "response": "I'm having trouble processing your request. Please try again later."
        }), 500



@chat_agent.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="Hello from Flask!")
