"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const page = () => {
  const [currentUser, setCurrentUser] = useState();
  const [currentRoom, setCurrentRoom] = useState("");
  const { data: session }: any = useSession();
  const router = useRouter();
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<
    Array<{ sender: string; message: string; date: string;avatar_url:string }>
  >([]);
  const [userAvatar,setUserAvatar] = useState("");
  const [message, setMessage] = useState<any>("");
  const [roomName, setRoomName] = useState<any>("");
  const [sender, setSender] = useState("");
  // function formatISODate(isoString: any) {
  //   const date = new Date(isoString);
  //   const formattedDate = new Intl.DateTimeFormat("en-US", {
  //     day: "2-digit",
  //     month: "short",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(date);
  //   return formattedDate;
  // }
  const getCurrentUser = async (email: any) => {
    try {
      const res = await fetch(`/api/getCurrentUser?userEmail=${email}`);
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  const fetchCurrentUserData = async () => {
    try {
      const data = await getCurrentUser(session?.user.email);
      if (data) {
        setCurrentUser(data.currentUser);
        setSender(data.currentUser?.username);
        setUserAvatar(data.currentUser?.avatar);
        if(data.currentUser?.rooms.length>0){
          setRoomName(data.currentUser?.rooms[0])
        }
      }
    } catch (error) {
      console.error("Error fetching current user data: ", error);
    }
  };
  const updateInbox = async () => {
    try {
      const response = await axios.put('/api/addMessageToInbox', {
        id: roomName,
        time: new Date(),
        sender: sender,
        message: message,
        avatar_url: userAvatar,
      });
  
      console.log('Response:', response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  useEffect(() => {
    const socket = io("https://github-finder-server.onrender.com");
    socket.on("message", (message, sender, date,avatar_url) => {
      const newMessage = {
        sender: sender,
        message: message,
        date: date,
        avatar_url : avatar_url
      };
      setInbox((prevInbox) => [...prevInbox, newMessage]);
    });
    setSocket(socket);
  }, []);
  useEffect(()=>{
    if(session?.user?.email){
     fetchCurrentUserData();
    }
  },[session?.user?.email])
  const handleSendMessage = () => {
    socket.emit("message", message, roomName, sender, new Date(),userAvatar);
    updateInbox();
  };
  const handleJoinRoom = (room: string) => {
    socket?.emit("joinRoom", room);
  };
  const getRoom = async()=>{
    try {
      const res = await fetch(`/api/getRoomById?id=${roomName}`);
      if (!res.ok) {
        throw new Error("Failed to fetch Rooms");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading Rooms: ", error);
    }
  }
  const setRoom = async ()=>{
    const room = await getRoom()
      setCurrentRoom(room.currentRoom);
      setInbox(room.currentRoom.messages)
  }
  useEffect(()=>{
    handleJoinRoom(roomName);
    if(roomName!=""){
      setRoom();
    }
  },[roomName])
  return (
    <div className="flex h-screen">
      {/* Left Sidebar (Inbox) */}
      <div className="w-1/4 bg-red-900 p-4">
        <h1 className="text-xl font-bold">Inbox</h1>
        <ul>
          {(currentUser as any)?.rooms.map((item:any,i:any) => (
            <button key={i} className="py-2 border rounded text-sm" onClick={()=>{setRoomName(item)}}>
              {item}
            </button>
          ))}
        </ul>
      </div>

      {/* Right Chat Section */}
      {roomName!=""? (<div className="w-3/4 p-4 bg-blue-900 overflow-scroll">
        Members : 
        <div className="flex flex-row gap-3">
         {(currentRoom as any)?.members?.map((m:any,i:any)=>{
          return <button key={i} onClick={() => router.push(`/profile/${m}`)}>{m}</button>
         })}
        </div>
        <h1 className="text-xl font-bold">Chat</h1>
        <div>
          {inbox.map((i: any,id:any) => (
            <div className="py-2" key={id}>
              {i.message} by : {i.sender}
              {/* at : {formatISODate(i.date)} */}
              <img src={i.avatar_url} alt="lolo" className="rounded-full w-16 h-16 object-cover"/>
            </div>
          ))}
        </div>
        <div className="flex flex-row">
          <input
            className="text-black"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>):<div className="text-xl font-bold text-gray-700 mt-4">
    You have no rooms
  </div>}
    </div>
  );
};

export default page;
