"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Hackathon from "@/models/Hackathon";
import { useRouter } from "next/navigation";

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
  const { data: session }: any = useSession();
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState();
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
        const data = await getCurrentUser(session?.user.email);
        if (data) {
          setCurrentUser(data.currentUser);
        }
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };

    if (session?.user?.email) {
      fetchCurrentUserData();
    }
  }, [session?.user?.email]);
  return (
    <div className="flex justify-evenly align-middle p-10">
      <div>
          <img
            src={currentUser?.["avatar"]} 
            alt="Profile Picture"
            className="rounded-full h-30 w-30"
          />
          <p className="ml-10 mt-6 text-3xl">{currentUser?.["name"]}</p>
          </div>
          <div>
            
            <p className="m-4">Email: {currentUser?.["email"]}</p>
            <p className="m-4">Username: {currentUser?.["username"]}</p>
            <p className="m-4">Link: {currentUser?.["link"]}</p>
            <p className="m-4">Repo: {currentUser?.["repo"]}</p>
            
            <p className="m-4">Hackathons:</p>
            <ul>
              {currentUser?.hackathon?.map((h:any,id:any)=>{
                return(<button onClick={()=>{
                  router.push(`/hackathon/${h}`)
                }}>{h}</button>)
              })}
            </ul>
          </div>
      </div>
  );
};

export default Page;
