import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom'
import sendIcon from '../components/sendIcon'

const ChatPage = () => {

    const [messages, setMessages] = useState([]);
    const [isConnectionOpen, setConnectionOpen] = useState(false)
    const [messageBody, setMessageBody] = useState("");

    const { username } = useParams();
    const ws = useRef();

    const sendMessage = () => {
        if(messageBody) {
            ws.current.send(
                JSON.stringify({
                    sender: username,
                    body: messageBody,
                })
            );
            setMessageBody("");
        }
    };

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8080");
        ws.current.onopen = () => {
            console.log("Connection Opened");
            setConnectionOpen(true);
        }
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((_messages) => [..._messages, data]);
        };
        return () => {
            console.log("Cleaning up...");
            ws.current.close();
        }
    }, []);

    const scrollTarget = useRef(null);

    useEffect(() => {
        if(scrollTarget.current) {
            scrollTarget.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages.length]);

  return (
    <Layout>
        <div id="chat-view-container" className="flex flex-col w-1/3">
        {messages.map((message, index) => (
          <div key={index} className={`my-3 rounded py-3 w-1/3 text-white ${
            message.sender === username ? "self-end bg-purple-600" : "bg-blue-600"
          }`}>
            <div className="flex items-center">
              <div className="ml-2">
                <div className="flex flex-row">
                  <div className="text-sm font-medium leading-5 text-gray-900">
                    {message.sender} at
                  </div>
                  <div className="ml-1">
                    <div className="text-sm font-bold leading-5 text-gray-900">
                      {new Date(message.sentAt).toLocaleTimeString(undefined, {
                        timeStyle: "short",
                      })}{" "}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-sm font-semibold leading-5">
                  {message.body}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollTarget} />
      </div>
      <footer className="w-1/3">
        <p>
          You are chatting as <span className="font-bold">{username}</span>
        </p>

        <div className="flex flex-row">
          
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen}
          >
            👏
            {sendIcon}
          </button>
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen}
          >
            👏
            {sendIcon}
          </button>
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen}
          >
            👏
            {sendIcon}
          </button>
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen}
          >
            👏
            {sendIcon}
          </button>
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen}
          >
            👏
            {sendIcon}
          </button>
        </div>
      </footer>
    </Layout>
  )
}

export default ChatPage
