"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddHackathon from "@/components/AddHackathon";
import { useRouter } from "next/navigation";
import RemoveHackathon from "@/components/RemoveHackathon";
import ApplyHackathon from "@/components/ApplyHackathon";
import Link from "next/link";
import ViewHackathon from "@/components/ViewHackathon";
import HackCard from "@/components/HackCard";
import axios from "axios";

const getCurrentUser = async (email: string) => {
  try {
    const res = await axios.get(`/api/getCurrentUser`, {
      params: { userEmail: email }
    });
    return res.data;
  } catch (error) {
    console.log("Error fetching user:", error);
    return null;
  }
};

const getData = async () => {
  try {
    const res = await axios.get("/api/getHackathon");
    return res.data;
  } catch (error) {
    console.log("Error fetching hackathons:", error);
    return null;
  }
};

const Page = () => {
  const { data: session } = useSession();
  const [hackathons, setHackathons] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data after hydration
  useEffect(() => {
    const fetchData = async () => {
      const hackathonData = await getData();
      const userData = session?.user?.email ? await getCurrentUser(session.user.email) : null;
      setHackathons(hackathonData?.hackathons || []);
      setCurrentUser(userData?.currentUser || null);
      setLoading(false);
    };
    fetchData();
  }, [session?.user?.email]);

  const convertDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const ongoingHackathons = hackathons.filter((hackathon: any) => new Date(hackathon.deadline) > new Date());
  const closedHackathons = hackathons.filter((hackathon: any) => new Date(hackathon.deadline) < new Date());

  return (
    <div>
      <div>
        {currentUser?.role === "admin" && <AddHackathon />}
      </div>
      <div className="mx-4 mt-4">
        {/* <div>
          <div className="block text-white text-xl font-extrabold mb-5">Ongoing Hackathons</div>
          {ongoingHackathons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-gray-600 border mb-4 rounded-xl">
                <thead className="dark:bg-[rgb(4,21,216)] text-gray-100 bg-[rgb(249,249,250)] text-[20px]">
                  <tr>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Hackathon Name</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Deadline</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Link</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Description</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {ongoingHackathons.map((hackathon: any, index: number) => (
                    <tr key={index}>
                      <td className="py-2 px-4 text-sm whitespace-nowrap">{hackathon.name}</td>
                      <td className="py-2 px-4 text-sm whitespace-nowrap">{convertDate(hackathon.deadline)}</td>
                      <td className="py-2 px-4 text-sm whitespace-nowrap">
                        <a href={hackathon.link} target="_blank" className="text-blue-500">Website</a>
                      </td>
                      <td className="py-2 px-4 text-sm whitespace-normal max-w-xs break-words">{hackathon.description}</td>
                      <td className="py-2 px-4 text-sm whitespace-nowrap">
                        <ApplyHackathon id={hackathon._id} userEmail={session?.user?.email} />
                        {currentUser?.role === "admin" && <RemoveHackathon id={hackathon._id} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No ongoing hackathons</p>
          )}
        </div> */}

        <div className="">
          <div className="block text-white text-xl font-extrabold mt-20">
            <div className="mx-auto w-[300px]">Ongoing Hackathons</div>
          </div>
          <div className="flex flex-wrap gap-10 justify-center items-center">
            {ongoingHackathons.length > 0 ? (
              ongoingHackathons.map((hackathon: any, index: number) => (
                <HackCard
                  key={index}  // Don't forget to add the key prop
                  name={hackathon.name}
                  deadline={hackathon.deadline}
                  link={hackathon.link}
                  description={hackathon.description}
                  currentUserRole={currentUser?.role}
                  id={hackathon._id}
                  userEmail={session?.user?.email}
                  isActive={true}
                />
              ))
            ) : (
              <div className="block text-white text-[20px] font-semibold">
                <div className="mx-auto w-[310px]">No Ongoing Hackathons</div>
              </div>
            )}
          </div>
        </div>



        {/* <div>
          <h3>Closed Hackathons</h3>
          {closedHackathons.length > 0 ? (
            <table className="min-w-full border-gray-600 border mb-4 rounded-xl container">
              <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Hackathon Name</th>
                  <th className="px-6 py-3 text-left">Deadline</th>
                  <th className="px-6 py-3 text-left">Link</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {closedHackathons.map((hackathon: any, index: number) => (
                  <tr key={index}>
                    <td className="py-2 px-3 text-sm">{hackathon.name}</td>
                    <td className="py-2 px-3 text-sm">{convertDate(hackathon.deadline)}</td>
                    <td className="py-2 px-3 text-sm">
                      <a href={hackathon.link} target="_blank" className="text-blue-500">Website</a>
                    </td>
                    <td className="py-2 px-3 text-sm">{hackathon.description}</td>
                    <td className="py-2 px-3 text-sm">
                      <ViewHackathon hackathon={hackathon} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No closed hackathons</p>
          )}
        </div> */}

        <div className="">
          <div className="block text-white text-xl font-extrabold mt-20">
            <div className="mx-auto w-[300px]">Closed Hackathons</div>
          </div>
          <div className="flex flex-wrap gap-10 justify-center items-center">
            {closedHackathons.length > 0 ? (
              closedHackathons.map((hackathon: any, index: number) => (
                <HackCard
                  key={index}  // Don't forget to add the key prop
                  name={hackathon.name}
                  deadline={hackathon.deadline}
                  link={hackathon.link}
                  description={hackathon.description}
                  currentUserRole={currentUser?.role}
                  id={hackathon._id}
                  userEmail={session?.user?.email}
                  isActive={false}
                  viewOnly={false}
                />
              ))
            ) : (
              <div className="block text-white text-[20px] font-semibold">
                <div className="mx-auto w-[310px]">No Closed Hackathons</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
