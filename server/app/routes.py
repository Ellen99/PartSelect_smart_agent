# /server/app/routes.py
from flask import Blueprint, jsonify, request
bp = Blueprint('routes', __name__)
import requests
import re
def extract_answer(response):
    match = re.search(r"Answer:\s*(.*?)(?:,|$)", response)
    return match.group(1) if match else None

from general_instructions import general_instructions

OLLAMA_API_URL = "http://localhost:11434/api"  # Replace with your OLLAMA API URL

def filter_final_answer(response_text):
    # Remove anything between <think> and </think>
    final_answer = re.sub(r"<think>.*?</think>", "", response_text, flags=re.DOTALL).strip()
    return final_answer

@bp.route('/api/chat', methods=['POST'])
def chat():
    # Get the user query from the request JSON
    data = request.get_json()
    user_query = data.get('query', '')
    chat_history = data.get('history', '')
    
    context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])

    # prompt deepseek to answer the question
    payload = {
        "model": "deepseek-r1:7b",  # Specify the DeepSeek model
        "prompt": (
            f"general instructions: {general_instructions}, "
            f"the prompt {context}\nuser: {user_query}\nassistant:"
        ),  # Provide context and user query
        "stream": False,  # Enable streaming
    }
    
    if not user_query:
        return jsonify(error="Query parameter is required"), 400
    try:
        response = requests.post(f"{OLLAMA_API_URL}/generate", json=payload)
        response.raise_for_status()  # Raise an error for bad responses

        ollama_repsonse = response.json()
        ai_response = filter_final_answer(ollama_repsonse['response'])
        # total_duration = ollama_repsonse['total_duration']
    except requests.exceptions.RequestException as e:
        return jsonify(error=f"Error communicating with OLLAMA API: {str(e)}"), 500
    except KeyError:
        return jsonify(error="Invalid response from OLLAMA API"), 500
    
    # ai_response = f"{ai_response}\n______\n duration: {total_duration//1_000_000_000:.2f}s"
    return jsonify(response=ai_response)


@bp.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="Hello from Flask!")
