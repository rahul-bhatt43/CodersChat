import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'


const socket = io.connect("http://localhost:3000", { transports: ['websocket'] });

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomOn, setRoomOn] = useState(true);
  const [messageRec, setMessageRec] = useState([]);

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("sent_message", { message, room });
      setMessageRec([...messageRec, { text: message, sender: "me" }]);
      setMessage("");
    } else {
      alert("empty message");
    }
  }

  const joinRoom = () => {
    if (room !== "") {
      setRoomOn(false)
      socket.emit("join_room", room);
    }
  }

  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessageRec([...messageRec, { text: data.message, sender: "other" }]);
    });


    return () => {
      socket.off("received_message");
    };
  }, [messageRec]);


  return (
    <div className="App">
      <div className="top">
        <h3>Coder's Chat</h3>
        {
          !roomOn ? (<button className='leaveRoom' onClick={() => { setRoomOn(true); setMessageRec([]) }} style={{ backgroundColor: "crimson", color: "white" }} >Leave Room</button>) : null
        }
      </div>
      <h3>{roomOn ? "Set a chat room" : `Messages(${room})`}</h3>
      <div className="message">
        {messageRec.map((msg, index) => (
          <div key={index} className="box" style={msg.sender === "me" ? { textAlign: "end", borderRight: "2px solid #007bff" } : { textAlign: "start", borderLeft: "2px solid #28a745" }} >
            <p className={msg.sender}>{msg.sender}</p>
            <p className={msg.text}>{msg.text}</p>
          </div>
        ))}
      </div>

      {
        roomOn ? (
          <div className="roomContainer">
            <input type='text' placeholder="enter the room" value={room} onChange={(e) => setRoom(e.target.value)} />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        ) : (
          <div className="roomFalse">
            <input type='text' placeholder="enter the message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        )
      }
    </div>
  )
}

export default App;
