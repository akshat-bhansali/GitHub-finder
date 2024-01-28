"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Hackathon from "@/models/Hackathon";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Dropdown } from 'flowbite-react';

const getCurrentUser = async (email: any) => {
  try {
    const res = await fetch(
      `/api/getCurrentUser?userEmail=${email}`
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
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [repos, setRepos] = useState([]);
  const [pages, setPages] = useState(0);
  const [repoNumber, setRepoNumber] = useState(1);
  const [repoShown, setRepoShown] = useState([]);
  const [userTags,setUserTags] = useState<any>([]);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  // Function to calculate and format time difference
  const formatTimeDifference = (updated_at: string | number | Date) => {
    const currentTime = new Date();
    const updatedAtTime = new Date(updated_at);
    const timeDifference = (currentTime as any) - (updatedAtTime as any);

    // Convert the time difference to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    // You can format the time difference according to your needs
    if (secondsDifference < 60) {
      return `${secondsDifference} seconds ago`;
    } else if (secondsDifference < 3600) {
      const minutes = Math.floor(secondsDifference / 60);
      return `${minutes} minutes ago`;
    } else if (secondsDifference < 86400) {
      const hours = Math.floor(secondsDifference / 3600);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(secondsDifference / 86400);
      return `${days} days ago`;
    }
  };

  useEffect(() => {
    let url = "";
    const fetchCurrentUserData = async () => {
      try {
        const data = await getCurrentUser(session?.user.email);
        if (data) {
          setCurrentUser(data.currentUser);
          url = data.currentUser?.repo;
          setUserTags(data.currentUser?.tags)
          fetchRepoData();
        }
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };
    const fetchRepoData = async () => {
      try {
        const res = await axios.get(String(url));
        setRepos(res.data);
        console.log(res.data, "66");
        if (res.data.length % 9 == 0) {
          setPages(res.data.length / 9);
        } else {
          setPages(res.data.length / 9 + 1);
        }
      } catch (error) {
        console.error("Error fetching repo data: ", error);
      }
    };
    if (session?.user?.email) {
      fetchCurrentUserData();
    }
  }, [session?.user?.email]);
  useEffect(() => {
    let tempArray: SetStateAction<never[]> = [];
    for (let i = 9 * (repoNumber - 1); i < 9 * repoNumber; i++) {
      if (repos[i] != undefined) {
        tempArray.push(repos[i]);
      }
    }
    setRepoShown(tempArray);
  }, [repoNumber, pages]);
  const removeTag = (tagToRemove: any) => {
    const updatedTags = userTags.filter((tag: any) => tag !== tagToRemove);
    setUserTags(updatedTags);
    setButtonDisabled(false);
  };
  const addTag = (tagToAdd : any) => {
    if(userTags.length!=2){
      if(!userTags.includes(tagToAdd)){
        setUserTags([...userTags, tagToAdd]);
        setButtonDisabled(false);
       } else {
        alert("Tag already present");
       }
    } else{
      alert("Only 2 tags are allowed");
    }
  };
  const handleUpdateTags = async () => {
    try {
      const response = await axios.put(`/api/updateTags?userEmail=${(currentUser as any)?.email}`,  userTags );
      console.log('Tags updated successfully',response);
      setButtonDisabled(true)
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  return (
    <>
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
          <p className="m-4">Hackathons:</p>
          <ul>
            {(currentUser as any)?.hackathon?.map((h: any, id: any) => {
              return (
                <button
                  onClick={() => {
                    router.push(`/hackathon/${h}`);
                  }}
                >
                  {h}
                </button>
              );
            })}
          </ul>
          <div className="flex flex-row gap-5">
          <Dropdown label="Tags" dismissOnClick={false} >
            <Dropdown.Item className="bg-white" onClick={()=>{addTag("Frontend")}}>Frontend</Dropdown.Item>
            <Dropdown.Item className="bg-white" onClick={()=>{addTag("Backend")}}>Backend</Dropdown.Item>
            <Dropdown.Item className="bg-white" onClick={()=>{addTag("Full Stack")}}>Full Stack</Dropdown.Item>
            <Dropdown.Item className="bg-white" onClick={()=>{addTag("Blockchain")}}>Blockchain</Dropdown.Item>
            <Dropdown.Item className="bg-white" onClick={()=>{addTag("AI & ML")}}>AI & ML</Dropdown.Item>
          </Dropdown>
          <div className="flex flex-col gap-3">
              {
                userTags.map((u:any,i:any)=>{
                  return(<button onClick={()=>{removeTag(u)}} className="bg-red-900 w-fit rounded border">{u} X</button>)
                })
              }
          </div>
          <button disabled={isButtonDisabled} onClick={()=>{handleUpdateTags()}} className={`${isButtonDisabled?"bg-red-900":"bg-blue-900"} border`}>
            SAVE
          </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row">
          {Array.from({ length: pages }, (_, index) => index + 1).map(
            (i, id) => {
              return (
                <button
                  className="mx-4"
                  onClick={() => {
                    setRepoNumber(id + 1);
                  }}
                >
                  {id + 1}
                </button>
              );
            }
          )}
        </div>
        <div className="grid grid-cols-3 grid-rows-3 gap-4">
          {repoShown.map((repo, i) => (
            <div className="border rounded-md px-2 py-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-blue-500 font-semibold text-sm">
                    {(repo as any)?.name}
                  </span>
                </div>
                <a
                  href={(repo as any)?.html_url}
                  className="bg-blue-500 text-white rounded-md p-2 text-xs hover:bg-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                </a>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {(repo as any)?.description || "No description available"}
              </p>
              <div className="flex items-center text-xs text-gray-600">
                <span>{(repo as any)?.language}</span>
                <span className="mx-2">•</span>
                <span>{formatTimeDifference((repo as any)?.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
