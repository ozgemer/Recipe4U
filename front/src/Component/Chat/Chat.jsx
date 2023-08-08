import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { v4 as uuidv4 } from "uuid";
import "./Chat.css";
import Button from "../Button/Button";
import { UseSession } from "../../Context/Session";
import { BsChatDots } from "react-icons/bs";

function Chat() {
  const session = UseSession();
  const [socket, setSocket] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [userID, setUserID] = useState({});
  useEffect(() => {
    setUserID(
      session.session.userId !== null
        ? {
            id: session.session.userId,
            name: session.session.name,
          }
        : {
            id: uuidv4(),
            name: "Anonymous",
          }
    );
    if (socket) {
      socket.emit("addUser", userID);
    }
  }, [session.session.userId]);
  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    newSocket.emit("addUser", userID);
    return () => newSocket.close();
  }, [setSocket, userID]);

  return (
    <div>
      {!clicked && (
        <Button className="chatButton" onClick={() => setClicked(!clicked)}>
          Talk with us ! {"\u00A0"} {"\u00A0"} <BsChatDots />
        </Button>
      )}
      {clicked && (
        <div className="floating-chat-header">
          {socket ? (
            <div className="chat-container">
              <header
                className="chat-header"
                onClick={() => setClicked(!clicked)}
              >
                Recipe4U Chat
              </header>
              <Messages socket={socket} />
              <MessageInput socket={socket} />
            </div>
          ) : (
            <div>Not Connected</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
