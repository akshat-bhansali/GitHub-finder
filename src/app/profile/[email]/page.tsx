"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Hackathon from "@/models/Hackathon";
import { usePathname } from "next/navigation";

const getCurrentUser = async (email: any) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/getCurrentUser?userEmail=${email}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch hackathons");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading hackathons: ", error);
  }
};


const Page = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const email = pathParts[pathParts.length - 1];

  const [user, setUser] = useState();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getData();
  //       if (data) {
  //         setHackathons(data.hackathons);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching hackathons: ", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const data = await getCurrentUser(email);
        if (data) {
          setUser(data.currentUser);
        }
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };
      fetchCurrentUserData();
  }, []);
  return (
    <div className="flex justify-evenly align-middle p-10">
      <div>
          <img
            src={user?.["avatar"]} 
            alt="Profile Picture"
            className="rounded-full h-30 w-30"
          />
          <p className="ml-10 mt-6 text-3xl">{user?.["name"]}</p>
          </div>
          <div>
            
            <p className="m-4">Email: {user?.["email"]}</p>
            <p className="m-4">Username: {user?.["username"]}</p>
            <p className="m-4">Link: {user?.["link"]}</p>
            <p className="m-4">Repo: {user?.["repo"]}</p>
            
            <p className="m-4">Hackathons:</p>
            <ul>
              {(user?.['hackathon'] as any).map((h:any,id:any)=>{
                return(<li>{h}</li>)
              })}
            </ul>
          </div>
        
      </div>
  );
};

export default Page;
