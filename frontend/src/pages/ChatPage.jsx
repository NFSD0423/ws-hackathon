import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom'
import '../style.css'

const ChatPage = () => {

  const [messages, setMessages] = useState([]);
  const [isConnectionOpen, setConnectionOpen] = useState(false)
  const [messageBody, setMessageBody] = useState("");

  const { username } = useParams();
  const ws = useRef();

  const sendMessage = (emoji) => {

    ws.current.send(
      JSON.stringify({
        sender: username,
        body: emoji
      })
    );
    console.log(Date)
  };

  const scrollTarget = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(window.location.href.includes('localhost') ? "ws://localhost:8080" : 'wss://ws-hackathon.onrender.com');
    ws.current.onopen = () => {
      console.log("Connection Opened");
      setConnectionOpen(true);
    }
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('mensaje', data)
      setMessages((_messages) => [..._messages, data]);
    };
    return () => {
      console.log("Cleaning up...");
      ws.current.close();
    }
  }, []);

  useEffect(() => {
    if (scrollTarget.current) {
      scrollTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);


  const arrayEmojis = [

    {
      id: 1,
      name: 'heart',
      emoji: "😍",

    },
    {
      id: 2,
      name: 'vomit',
      emoji: "🤮",
    },
    {
      id: 3,
      name: 'shit',
      emoji: "💩",
    },
    {
      id: 4,
      name: 'clap',
      emoji: "👏",

    }
  ]

  const currTime = new Date().toLocaleTimeString();

  return (
    <Layout>
      <div id="chat-view-container" className="flex flex-col w-1/3" style={{ height: '30vh', overflowY: 'auto', width: '40vw' }}>
        {messages.map((message, index) => (
          <div key={index} className={`my-3 rounded py-3 w-1/3 text-white ${message.sender === username ? "self-end bg-purple-600" : "bg-blue-600"
            }`}>
            <div className="flex items-center">
              <div className="ml-2">
                <div className="flex flex-row">
                  <div className="text-sm font-medium leading-5 text-gray-900">
                    {message.sender} at
                  </div>
                  <div className="ml-1">
                    <div className="text-sm font-bold leading-5 text-gray-900">
                      {currTime}

                    </div>
                  </div>
                </div>
                <div className="mt-1 text-sm font-semibold leading-5">
                  <span className='emojis'>{message.body}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollTarget} />
      </div>
      <footer className="w-1/3">
        <h3>
          Chiquitor <span className="font-bold">{username}</span>
        </h3>

        <div className="containerEmojis">
          <button
            value={messageBody}
            required
            aria-label="Send"
            onClick={() => sendMessage(arrayEmojis[0].emoji)}
            disabled={!isConnectionOpen}
            className='botonemojis btn fb-btn'
          >
            {arrayEmojis[0].emoji}
          </button>
          <button
            value={messageBody}
            required
            aria-label="Send"
            onClick={() => sendMessage(arrayEmojis[1].emoji)}
            disabled={!isConnectionOpen}
            className='botonemojis btn fb-btn'
          >
            {arrayEmojis[1].emoji}
          </button>
          <button
            value={messageBody}
            required
            aria-label="Send"
            onClick={() => sendMessage(arrayEmojis[2].emoji)}
            disabled={!isConnectionOpen}
            className='botonemojis btn fb-btn'
          >
            {arrayEmojis[2].emoji}
          </button>
          <button
            value={messageBody}
            required
            aria-label="Send"
            onClick={() => sendMessage(arrayEmojis[3].emoji)}
            disabled={!isConnectionOpen}
            className='botonemojis btn fb-btn'
          >
            {arrayEmojis[3].emoji}
          </button>
        </div>
      </footer>
    </Layout>
  )
}

export default ChatPage
