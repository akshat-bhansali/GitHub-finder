"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<any>([]);
  const [message,setMessage] = useState<any>("");
  const [roomName,setRoomName] = useState<any>("");

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("message",(message)=>{
      setInbox((inbox:any)=>[...inbox,message])
    })

    setSocket(socket);
  }, []);
  const handleSendMessage=()=>{
    socket.emit("message",message,roomName)
  }
  const handleJoinRoom=()=>{
    socket.emit("joinRoom",roomName)
  }
  return (
    <main className="">
      <h1>Home Pages</h1>
      <div>
        <div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">
          {/* showing messages */}
          <div className="flex flex-col gap-2 border rounded-lg p-10">
            {inbox.map((message: any, i: any) => {
              return <div className="border rounded px-4 py-2">{message}</div>;
            })}
          </div>
            <div className="flex gap-2 align-center justify-center">
              <input name="message" onChange={(e)=>{setMessage(e.target.value)}} className="text-black"/>
              <button onClick={handleSendMessage}>send message</button>
            </div>
            <div className="flex gap-2 align-center justify-center">
              <input name="room" onChange={(e)=>{setRoomName(e.target.value)}} className="text-black"/>
              <button onClick={handleJoinRoom}>join room</button>
            </div>
        </div>
      </div>
    </main>
  );
}
