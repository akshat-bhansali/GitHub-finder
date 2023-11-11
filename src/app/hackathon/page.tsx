"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddHackathon from "@/components/AddHackathon";
import { useRouter } from "next/navigation";
import RemoveHackathon from "@/components/RemoveHackathon";
import ApplyHackathon from "@/components/ApplyHackathon";
import Link from "next/link";
import ViewHackathon from "@/components/ViewHackathon";

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

const getData = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/getHackathon");
    if (!res.ok) {
      throw new Error("Failed to fetch hackathons");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading hackathons: ", error);
  }
};

const Page = () => {
  const convertDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear().toString();

    return day + "/" + month + "/" + year;
  };
  const { data: session }: any = useSession();

  const router = useRouter();
  const [hackathons, setHackathons] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  // const [reg, setReg] = useState(false);
  let reg = false;
  const getReg = () => {
    return reg;
  };
  const setReg = (change: any) => {
    reg = change;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        if (data) {
          setHackathons(data.hackathons);
        }
      } catch (error) {
        console.error("Error fetching hackathons: ", error);
      }
    };

    fetchData();
  }, []);

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
    <div>
      <div>{currentUser?.["role"] === "admin" ? <AddHackathon /> : <></>}</div>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Apply</th>
            </tr>
          </thead>
          <tbody>
            {hackathons.map((hackathon, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{hackathon?.["name"]}</td>
                <td className="border px-4 py-2">
                  {convertDate(hackathon?.["deadline"])}
                </td>
                <td className="border px-4 py-2">
                  <a
                    href={hackathon?.["link"]}
                    target="_blank"
                    className="text-blue-500"
                  >
                    Website
                  </a>
                </td>
                <td className="border px-4 py-2">
                  {hackathon?.["description"]}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex flex-row">
                    {currentUser?.["hackathon"].map((h: any, index: any) => {
                      h === hackathon?.["_id"] ? setReg(true) : null;
                    })}
                    {getReg() ? (
                      null
                    ) : (
                      <ApplyHackathon
                        id={`${hackathon?.["_id"]}`}
                        userEmail={`${session?.user?.email}`}
                      />
                    )}
                    {setReg(false)}
                    {currentUser?.["role"] === "admin" ? (
                      <RemoveHackathon id={`${hackathon?.["_id"]}`} />
                    ) : (
                      <></>
                    )}
                    <ViewHackathon hackathon={hackathon}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
