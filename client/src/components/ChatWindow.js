import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAgentResponse } from "../api/api";
import { marked } from "marked";
import agentLogo from "../images/agent_img.png";

function ChatWindow() {

  const defaultMessage = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }];

  const predefinedMessages = [
    "What are your hours of operation?",
    "How can I track my order?",
    "Can you help me find a part?",
    "What is your return policy?",
  ];

  const [messages,setMessages] = useState(defaultMessage)
  const [input, setInput] = useState("");
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  const handleSend = async (message) => {
    
    // const userMessage = message || input.trim();
    if (input.trim() !== "" || message) {
      let extra_instructions ="";
      // If message is not empty, use it as the user message
      if (message) {
        extra_instructions = "User selected from quick options, ask follow up questions based on selection to get more details and help user: selected option text is " + message;
      }
      // Set user message
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input}]);
      setInput("");
  
      setIsLoading(true);
      // Call API & set assistant message
      const newMessage = await getAgentResponse(input + extra_instructions, messages);
      typeAssistantMessage(newMessage.content)
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsLoading(false); 
    }
  };
  const typeAssistantMessage = async (fullMessage) => {
    const words = fullMessage.split(" "); // Split the message into words
    let currentMessage = "";
  
    for (let index = 0; index < words.length; index++) {
      await new Promise((resolve) => {
        const delay = 100 + Math.random() * 50; // Add slight randomness to the delay
        setTimeout(() => {
          currentMessage += (index === 0 ? "" : " ") + words[index]; // Add a space between words
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
  
            // If the last message is not from the assistant, add a new one
            if (lastMessage.role !== "assistant") {
              updatedMessages.push({ role: "assistant", content: currentMessage });
            } else {
              // Update the last assistant message
              updatedMessages[updatedMessages.length - 1].content = currentMessage;
            }
  
            return updatedMessages;
          });
          resolve();
        }, delay); // Delay for each word
      });
    }
  
    setIsLoading(false); // Stop loading after the full message is displayed
  };
  const typeAssistantMessage3 = (fullMessage) => {
    const words = fullMessage.split(" "); // Split the message into words
    let currentMessage = "";

    words.forEach((word, index) => {
      setTimeout(() => {
        currentMessage += (index === 0 ? "" : " ") + word; // Add a space between words
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessage = updatedMessages[updatedMessages.length - 1];

          // If the last message is not from the assistant, add a new one
          if (lastMessage.role !== "assistant") {
            updatedMessages.push({ role: "assistant", content: currentMessage });
          } else {
            // Update the last assistant message
            updatedMessages[updatedMessages.length - 1].content = currentMessage;
          }

          return updatedMessages;
        });

        if (index === words.length - 1) {
          setIsLoading(false); // Stop loading after the full message is displayed
        }
      }, index * 100); // Delay of 200ms per word
    });
  };

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    setIsInputEmpty(newInput.trim() === "");
  };

  
  return (
   <div className="messages-container">
    
          {messages.map((message, index) => (
              <div key={index} className={`${message.role}-message-container`}>
              {/* Only show the agent logo for assistant messages */}
              {message.role === "assistant" && message.content &&(
                <div className="assistant-message-wrapper">
                <img
                  src={agentLogo}
                  alt="Agent Logo"
                  className="message-logo" />
                  <div className={`message ${message.role}-message`}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: marked(message.content).replace(/<p>|<\/p>/g, ""),
                      }}
                    ></div>
                  </div>
                </div>
              )}
                {message.role != "assistant" &&message.content && (
                    <div className={`message ${message.role}-message`}>
                        <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}}></div>
                    </div>
                )}
                {/* Render predefined buttons after the first assistant message */}
          {index === 0 && message.role === "assistant" && (
            <div className="predefined-buttons">
              {predefinedMessages.map((msg, btnIndex) => (
                <button
                  key={btnIndex}
                  className="predefined-button"
                  onClick={() => handleSend(msg)}
                >
                  {msg}
                </button>
              ))}
            </div>
          )}
            </div>
          ))}
          
          {isLoading && (
            <div className="messages-container">
              <div className="assistant-message-wrapper">
              <img
                src={agentLogo}
                alt="Agent Logo"
                className="message-logo"
              />
              <div className="message assistant-message">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
              </div>
            </div>)}
          <div ref={messagesEndRef} />

          <div className="input-area">
            <input
              value={input}
              // onChange={(e) => setInput(e.target.value)}
              onChange={handleInputChange}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isInputEmpty && !isLoading) {
                  handleSend(input);
                  e.preventDefault();
                }
              }}
              rows="3"
            />
            <button 
              className="send-button"
              onClick={handleSend}
              disabled={isInputEmpty || isLoading }
              style={{
                backgroundColor: isInputEmpty || isLoading ? "#d3d3d3" : "#337878",
              }}>
              {isLoading ? "..." : "Send"}
            </button>
          </div>
      </div>
);
}

export default ChatWindow;
