"use client";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  const [hackathon, setHackathon] = useState();
  const [hackathonUsers, setHackathonUsers] = useState([]);
  const getData = async () => {
    try {
      const res = await fetch(`/api/getHackathon/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  const getHackathonUsers = async (arr: any) => {
    try {
      const res = await axios.post(`/api/fetchUsersByUsername`, arr);
      setHackathonUsers(res.data.users);
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  const fetchCurrentUserData = async () => {
    try {
      const data = await getData();
      setHackathon(data);
      getHackathonUsers(data.user);
    } catch (error) {
      console.error("Error fetching current user data: ", error);
    }
  };
  useEffect(() => {
    fetchCurrentUserData();
  }, []);
  return (
    <div>
      <p>Hackathon Data :</p>
      <div>name : {hackathon?.["name"]}</div>
      <div>link : {hackathon?.["link"]}</div>
      <div>dealine : {new Date(hackathon?.["deadline"]!).toDateString()}</div>
      <div>description : {hackathon?.["description"]}</div>
      <div className="flex flex-col">
        <table>
          <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {hackathonUsers.map((u: any, index: any) => (
              <tr key={index}>
                <td className="flex flex-row gap-2">
                  <img
                    className="rounded-full w-16 h-16 object-cover"
                    src={u.avatar}
                    alt={`Avatar of ${u.username}`}
                  />
                  {u.username}
                </td>
                <td>{u.tags.join(", ")}</td>
                <td>
                  <button
                    onClick={() => router.push(`/profile/${u.username}`)}
                    className="bg-blue-900"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
