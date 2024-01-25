"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const router = useRouter()
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  const [hackathon, setHackathon] = useState();
  const getData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/getHackathon/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const data = await getData();
        console.log(data);
        setHackathon(data);
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };
    fetchCurrentUserData();
  }, []);
  return (
    <div>
      <p>Hackathon Data :</p>
      <div>name : {hackathon?.["name"]}</div>
      <div>link : {hackathon?.["link"]}</div>
      <div>dealine : {new Date(hackathon?.["deadline"]!).toDateString()}</div>
      <div>description : {hackathon?.["description"]}</div>
      <div>users :</div>
      <div>
        {(hackathon as any)?.user.map((u: any, index: any) => {
          return <button onClick={()=>{
            router.push(`/profile/${u}`)
          }}>{u}</button>;
        })}
      </div>
    </div>
  );
};

export default page;
