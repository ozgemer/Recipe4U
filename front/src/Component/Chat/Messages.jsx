import React, { useEffect, useState, useRef } from "react";
import { UseSession } from "../../Context/Session";
import "./Messages.css";

function Messages({ socket }) {
  const session = UseSession();
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messageListener = async (message) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[message.id] = message;
        return newMessages;
      });
    };

    const deleteMessageListener = (messageID) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[messageID];
        return newMessages;
      });
    };

    socket.on("message", messageListener);
    socket.on("deleteMessage", deleteMessageListener);
    socket.emit("getMessages");
    return () => {
      socket.off("message", messageListener);
      socket.off("deleteMessage", deleteMessageListener);
    };
  }, [socket]);

  useEffect(() => {
    const empt = {};
    setMessages(empt);
  }, [session.session.userId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="message-list">
      {[...Object.values(messages)]
        .sort((a, b) => a.time - b.time)
        .map((message) => (
          <div
            key={message.id}
            className={
              (message.user.name === `Recipe4U`
                ? `systemMessage`
                : `userMessage`) + " message-container"
            }
            title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
          >
            <div className="message">
              {message.user.name}:<br />
              <div className="date-message">
                {new Date(message.time).toLocaleTimeString()} <br />
              </div>
              {message.value.split("\n").map((m, index) => (
                <span key={index}>
                  {m}
                  <br key={index} />
                </span>
              ))}
            </div>
          </div>
        ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default Messages;
