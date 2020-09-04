import React, { useState, useEffect } from "react";
import "./Chat.css";
import { useParams } from "react-router-dom";
import {
  StarBorderOutlined as StarBorderOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@material-ui/icons";
import db from "./firebase";
import Message from "./Message";
import ChatInput from "./ChatInput";

function Chat() {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomDetails(snapshot.data()));
    }

    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setRoomMessages(snapshot.docs.map((doc) => doc.data()))
      );
  }, [roomId]);

  useEffect(() => {
    var messageBody = document.querySelector("#divChatContainer");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  });

  console.log(roomDetails);
  console.log(roomMessages);

  return (
    <div className="chat" id="divChatContainer">
      <div className="chat__header">
        <div className="chat__headerLeft">
          <h4 className="chat__channelName">
            <strong>#{roomDetails?.name}</strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="chat__headerRight">
          <p>
            <InfoOutlinedIcon /> Details
          </p>
        </div>
      </div>

      <div className="chat__messages">
        {roomMessages?.map(({ message, user, timestamp, userImage }) => (
          <Message
            message={message}
            user={user}
            userImage={userImage}
            timestamp={timestamp}
          />
        ))}
      </div>

      <ChatInput channelName={roomDetails?.name} channelId={roomId} />
    </div>
  );
}

export default Chat;
