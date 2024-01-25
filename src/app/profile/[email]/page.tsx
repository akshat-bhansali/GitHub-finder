"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Hackathon from "@/models/Hackathon";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const router = useRouter()
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const email = pathParts[pathParts.length - 1];
  const [repos, setRepos] = useState([]);
  const [pages, setPages] = useState(0);
  const [repoNumber, setRepoNumber] = useState(1);
  const [repoShown, setRepoShown] = useState([]);

  const [user, setUser] = useState();
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
    let tempArray: SetStateAction<never[]> = [];
    for (let i = 9 * (repoNumber - 1); i < 9 * repoNumber; i++) {
      if (repos[i] != undefined) {
        tempArray.push(repos[i]);
      }
    }
    setRepoShown(tempArray);
  }, [repoNumber, pages]);
  useEffect(() => {
    let url ="";
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
    const fetchCurrentUserData = async () => {
      try {
        const data = await getCurrentUser(email);
        if (data) {
          setUser(data.currentUser);
          url = data.currentUser?.repo;
          fetchRepoData();
        }
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };
      fetchCurrentUserData();
  }, []);
  return (
    <>
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
            {(user as any)?.hackathon?.map((h: any, id: any) => {
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
