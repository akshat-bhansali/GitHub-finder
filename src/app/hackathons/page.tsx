"use client";
import {useEffect,useState} from "react";
import { useSession } from "next-auth/react";
import AddHackathon from "@/components/AddHackathon";
import { useRouter } from "next/navigation";
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
  const { data: session }: any = useSession();
  const router = useRouter();
  const [hackathons, setHackathons] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        if (data) {
          console.log(data.hackathons); // This will log the array of objects
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
      <div>
      {
          session?.user.role != "admin" ? (<AddHackathon/>) :(<></>)
        }
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Apply</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">{hackathons[0]?.name}</td>
              <td className="border px-4 py-2">November 15, 2023</td>
              <td className="border px-4 py-2">November 10, 2023</td>
              <td className="border px-4 py-2">Virtual</td>
              <td className="border px-4 py-2">
                <a
                  href="https://codefest2023.com"
                  target="_blank"
                  className="text-blue-500"
                >
                  Website
                </a>
              </td>
              <td className="border px-4 py-2">
                CodeFest 2023 is a global hackathon focusing on innovation and
                coding challenges.
              </td>
              <td className="border px-4 py-2">
                <button onClick={()=>{console.log(session)}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Apply
                </button>
              </td>
            </tr>
            {/* <tr>
              <td className="border px-4 py-2">HackX 2023</td>
              <td className="border px-4 py-2">December 3, 2023</td>
              <td className="border px-4 py-2">November 25, 2023</td>
              <td className="border px-4 py-2">New York, NY</td>
              <td className="border px-4 py-2">
                <a
                  href="https://hackx2023.com"
                  target="_blank"
                  className="text-blue-500"
                >
                  Website
                </a>
              </td>
              <td className="border px-4 py-2">
                Join HackX 2023 to compete with innovators and developers from
                around the world.
              </td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Apply
                </button>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
