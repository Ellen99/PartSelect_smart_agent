# PartSelect Chat Agent

This project is a chat-based customer support interface designed specifically for the [PartSelect](https://www.partselect.com/) e-commerce platform. It focuses on assisting users with Refrigerator and Dishwasher parts, helping them get accurate product information and support throughout their purchase journey.

> **Note**: This project was originally forked from [Instalily's case-study repository](https://github.com/Instalily/case-study) as a starting point. The fork has since been removed, and this project has evolved into its own standalone implementation.

## ✨ Features

- 🔍 **Contextual Chat Agent**: Users can ask about product compatibility, installation instructions, and troubleshooting steps.
- 🧠 **Deepseek Integration**: The agent uses the Deepseek language model (served via [Ollama](https://ollama.com/)) to generate helpful and accurate responses based on the chat history.
- 💬 **Modern React Frontend**: Built using [Create React App](https://github.com/facebook/create-react-app) to ensure responsiveness and scalability.
- 🖥 **Flask Backend**: A lightweight Flask server that handles communication with the language model and manages the chat history.
- 📦 **Focused Use Case**: The assistant is limited to product-related inquiries within the Refrigerator and Dishwasher categories, maintaining relevance and reliability.

## 🚧 Coming Soon

- 🌐 Web Search Integration for real-time answers and broader context.
-  Order support and post-purchase assistance workflows.

## 🧪 Example Queries

Here are some examples the assistant is designed to handle:

- *How can I install part number PS11752778?*
- *Is this part compatible with my WDT780SAEM1 model?*
- *The ice maker on my Whirlpool fridge is not working. How can I fix it?*

## 🛠 Getting Started

### Prerequisites

- **Node.js** (v16+ recommended)
- **Python 3.x** (with `Flask` installed)
- **[Ollama](https://ollama.com/)** installed locally and running a Deepseek model

### Installation

#### 1. Frontend (React App)

Navigate to the `client/` directory and install the dependencies:

```bash
cd client
npm install
```

#### 2. Backend (Flask App)

Navigate to the `server/` directory and install the required Python dependencies:

```bash
cd server
pip install -r requirements.txt
```

### Run the Flask Server

In the `server/` directory, run the Flask server:

```bash
python run.py
```

### Run the Frontend (React App)

In the `client/` directory, start the React app:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📁 Project Structure

```
PartSelect_smart_agent/
├── server/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── requirements.txt
│   └── run.py
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🧱 Tech Stack

- **Frontend**: React + JavaScript
- **Backend**: Flask (Python)
- **AI Integration**: Deepseek via Ollama

## 📌 Goals

This project was created as a case study to demonstrate:

- Design of a scoped, domain-specific assistant
- Integration with modern LLM tooling
- User-focused UI design
- Extensibility for future enhancements

## 📄 License

This project is for educational/demo purposes and not intended for production use (yet!).