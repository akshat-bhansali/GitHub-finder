"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatBox = () => {
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
  // Temporary data for inbox and chat
  const inboxData = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    // Add more inbox items as needed
  ];

  return (
    <div className="flex h-screen">
      {/* Left Sidebar (Inbox) */}
      <div className="w-1/4 bg-red-900 p-4">
        <h1 className="text-xl font-bold">Inbox</h1>
        <ul>
          {inboxData.map((item) => (
            <li key={item.id} className="py-2">
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Chat Section */}
      <div className="w-3/4 p-4 bg-blue-900">
        <h1 className="text-xl font-bold">Chat</h1>
        <div>
          {inbox.map((message:any) => (
            <div className="py-2">
              {/* <strong>{message.sender}:</strong> */}
               {message}
            </div>
          ))}
        </div>
        <div className='flex flex-row'>
        <input className='text-black' onChange={(e)=>{setMessage(e.target.value)}}/>
        <button onClick={handleSendMessage}>Send</button>
        </div>
        <div className='flex flex-row mt-4'>
        <input className='text-black'  onChange={(e)=>{setRoomName(e.target.value)}}/>
        <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
