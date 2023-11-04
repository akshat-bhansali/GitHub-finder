"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddHackathon from "@/components/AddHackathon";
import { useRouter } from "next/navigation";
import RemoveHackathon from "@/components/RemoveHackathon";
import ApplyHackathon from "@/components/ApplyHackathon";



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

const page = () => {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        if (data) {
          setHackathons(data.hackathons); // Set the fetched data in state
        }
      } catch (error) {
        console.error("Error fetching hackathons: ", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div>{session?.user.role != "admin" ? <AddHackathon /> : <></>}</div>
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
                    <ApplyHackathon
                      id={`${hackathon?.["_id"]}`}
                      userEmail={`${session?.user?.email}`}
                    />
                    {session?.user.role != "admin" ? (
                      <RemoveHackathon id={`${hackathon?.["_id"]}`} />
                    ) : (
                      <></>
                    )}
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

export default page;
