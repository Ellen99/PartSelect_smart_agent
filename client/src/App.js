import large_logo from './images/ps-large-logo.svg';
import small_logo from './images/ps-small-logo.svg';
import React, { useEffect, useState } from 'react';
import "./styles/App.css";
import ChatWindow from "./components/ChatWindow";
import { getAgentResponse } from './api/api';


// enrty point of the app
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // call getAgentResponse and set the message
    const fetchMessage = async (userQuery) => {
        try {
          const data = await getAgentResponse(userQuery); 
          setMessage(data);
        } catch (error) {
          console.error('There was an error fetching the message:', error);
        }
      };
  }, []);

  return (
    <div className="App">
      <div className="heading">
      <img src={large_logo} alt="PartSelect Logo" className="logo" />
      </div>
        <ChatWindow/>
    </div>
  );
}

export default App;
