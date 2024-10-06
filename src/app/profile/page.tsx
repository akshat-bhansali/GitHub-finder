"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Dropdown } from "flowbite-react";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import HackCard from "@/components/HackCard";

const Page = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [repos, setRepos] = useState([]);
  const [pages, setPages] = useState(0);
  const [repoNumber, setRepoNumber] = useState(1);
  const [repoShown, setRepoShown] = useState([]);
  const [userTags, setUserTags] = useState<any>([]);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [userHackathons, setUserHackathons] = useState([]);
  const [ongoingHackathons, setOngoingHackathons] = useState(false);
  const [closedHackathons, setClosedHackathons] = useState(false);

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
  const getCurrentUser = async (email: any) => {
    try {
      const res = await fetch(`/api/getCurrentUser?userEmail=${email}`);
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading hackathons: ", error);
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
          setUserTags(data.currentUser?.tags);
          fetchRepoData();
          getUserHackathons(data.currentUser?.hackathon);
        }
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };
    const getUserHackathons = async (arr: any) => {
      try {
        const res = await axios.post(`/api/fetchHackathonById`, arr);
        setUserHackathons(res.data.hackathons);
      } catch (error) {
        console.log("Error loading hackathons: ", error);
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

  useEffect(() => {
    if (userHackathons) {
      const ongoing = userHackathons.filter(
        (hackathon: any) => new Date(hackathon.deadline) > new Date()
      );
      const closed = userHackathons.filter(
        (hackathon: any) => new Date(hackathon.deadline) < new Date()
      );
      if (ongoing.length > 0) {
        setOngoingHackathons(true);
      }
      if (closed.length > 0) {
        setClosedHackathons(true);
      }
    }
  }
    , [userHackathons]);

  const removeTag = (tagToRemove: any) => {
    const updatedTags = userTags.filter((tag: any) => tag !== tagToRemove);
    setUserTags(updatedTags);
    setButtonDisabled(false);
  };
  const convertDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear().toString();

    return day + "/" + month + "/" + year;
  };
  const addTag = (tagToAdd: any) => {
    if (userTags.length != 2) {
      if (!userTags.includes(tagToAdd)) {
        setUserTags([...userTags, tagToAdd]);
        setButtonDisabled(false);
      } else {
        alert("Tag already present");
      }
    } else {
      alert("Only 2 tags are allowed");
    }
  };
  const handleUpdateTags = async () => {
    try {
      const response = await axios.put(
        `/api/updateTags?userEmail=${(currentUser as any)?.email}`,
        userTags
      );
      console.log("Tags updated successfully", response);
      setButtonDisabled(true);
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  return (
    <>
      <div className="mx-7">
        <div className="md:flex-row flex-col flex justify-center items-center align-middle p-10 mb-5">
          <div className="w-[270px] md:w-[320px]">
            <img
              src={currentUser?.["avatar"]}
              alt="Profile Picture"
              className="h-60 sm:h-80 w-full md:rounded-tl-[10px]"
            />
            <p
              className="text-white w-full text-xl font-extrabold text-center py-5 md:rounded-bl-[10px]"
              style={{
                background: 'linear-gradient(to right, blue, red)',
              }}
            >
              {currentUser?.["name"]}
            </p>
          </div>
          <div className="md:bg-transparent text-[15px]">
            <p className="m-4 flex hover:bg-[rgb(61,74,216)] hover:translate-y-[-10px] transition duration-500 rounded-[10px] cursor-pointer px-4 py-4">
              <span className="">
                <MdOutlineMarkEmailRead className="w-[30px] h-[30px] mr-4 my-auto" />
              </span>
              <span className="font-semibold text-white">{currentUser?.["email"]}</span>
            </p>

            <p className="m-4 flex hover:bg-[rgb(61,74,216)] hover:translate-y-[-10px] transition duration-500 rounded-[10px] cursor-pointer px-4 py-4">
              <span className="">
                <FaRegUserCircle className="w-[30px] h-[30px] mr-4 my-auto" />
              </span>
              <span className="font-semibold text-white">{currentUser?.["username"]}</span>
            </p>

            <p className="m-4 flex hover:bg-[rgb(61,74,216)] hover:translate-y-[-10px] transition duration-500 rounded-[10px] cursor-pointer px-4 py-4">
              <span className="">
                <FaGithub className="w-[30px] h-[30px] mr-4 my-auto" />
              </span>
              <span className="font-semibold text-white">{currentUser?.["link"]}</span>
            </p>

            <div className="flex gap-4 p-2 border-none">
              <div className="pl-4">
                <Dropdown label="Tags" dismissOnClick={false}
                  style=
                  {{
                    backgroundColor: 'blue',
                    borderWidth: '0px',
                    outline: 'none',
                    fontWeight: 'bold'
                  }}
                  >
                  {(userTags[0] !== "Frontend" && userTags[1] !== "Frontend") ? (
                    <Dropdown.Item
                      className="bg-white hover:bg-[rgb(61,74,216)] hover:text-[white]"
                      onClick={() => {
                        addTag("Frontend");
                      }}
                    >
                      Frontend
                    </Dropdown.Item>
                  ) : null}
                  {(userTags[1] !== "Backend" && userTags[0] !== "Backend") ? (
                    <Dropdown.Item
                      className="bg-white hover:bg-[rgb(61,74,216)] hover:text-[white]"
                      onClick={() => {
                        addTag("Backend");
                      }}
                    >
                      Backend
                    </Dropdown.Item>
                  ) : null}
                  {(userTags[0] !== "Blockchain" && userTags[1] !== "Blockchain") ? (
                    <Dropdown.Item
                      className="bg-white hover:bg-[rgb(61,74,216)] hover:text-[white]"
                      onClick={() => {
                        addTag("Blockchain");
                      }}
                    >
                      Blockchain
                    </Dropdown.Item>
                  ) : null}
                  {(userTags[0] !== "Full Stack" && (userTags[1] !== "Full Stack")) ? (
                    <Dropdown.Item
                      className="bg-white hover:bg-[rgb(61,74,216)] hover:text-[white]"
                      onClick={() => {
                        addTag("Full Stack");
                      }}
                    >
                      Full Stack
                    </Dropdown.Item>
                  ) : null}
                  {(userTags[0] !== "AI & ML" && userTags[1] !== "AI & ML") ? (
                    <Dropdown.Item
                      className="bg-white hover:bg-[rgb(61,74,216)] hover:text-[white]"
                      onClick={() => {
                        addTag("AI & ML");
                      }}
                    >
                      AI & ML
                    </Dropdown.Item>
                  ) : null}
                </Dropdown>
              </div>
              <div className="flex flex-col gap-3 justify-start">
                {userTags.map((u: any, i: any) => {
                  return (
                    <button
                      onClick={() => {
                        removeTag(u);
                      }}
                      className="bg-[rgb(216,4,4)] text-white font-semibold pl-3 pr-2 py-1 text-[15px] rounded-[5px]"
                    >
                      {u} <span className="text-black justify-center items-center mx-1 pt-1">X</span>
                    </button>
                  );
                })}
              </div>
              <div>
                <button
                  disabled={isButtonDisabled}
                  onClick={() => {
                    handleUpdateTags();
                  }}
                  className={`${isButtonDisabled ? "invisible" : "bg-[rgb(4,21,216)]"
                    } text-white font-bold px-5  py-2 text-[15px] rounded-[5px] mr-4`}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <>
          <p>
            Ongoing
          </p>
          <div className="rounded-xl ">
            <table className="min-w-full overflow-x-auto border-gray-600 border  mb-4 rounded-xl container">
              <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Hackathon Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Apply
                  </th>
                </tr>
              </thead>
              {ongoingHackathons ? (
                <tbody>
                  {userHackathons?.map(
                    (hackathon: any, index: any) =>
                      new Date(hackathon.deadline) > new Date() && (
                        <tr key={index}>
                          <td className="py-2 px-3 text-sm">{hackathon.name}</td>
                          <td className="py-2 px-3 text-sm">
                            {convertDate(hackathon.deadline)}
                          </td>
                          <td className="py-2 px-3 text-sm">
                            <a
                              href={hackathon.link}
                              target="_blank"
                              className="text-blue-500"
                            >
                              Website
                            </a>
                          </td>
                          <td className="py-2 px-3 text-sm">
                            {hackathon.description}
                          </td>
                          <td className="py-2 px-3 text-sm">
                            <button
                              onClick={() => {
                                router.push(`/hackathon/${hackathon._id}`);
                              }}
                              className="flex flex-row w-1/2 border text-center bg-red-600 rounded-xl justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium   px-2 py-1 border-gray-600  mx-4 text-xs"
                            >
                              Visit
                            </button>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              ) : <p className="my-4">No Ongoing hackathons</p>}
            </table>
          </div>
        </> */}

        <div className="">
          <div className="block text-white text-2xl font-extrabold mt-20 ">
            <div className="mx-auto w-[300px] text-center">Ongoing Hackathons</div>
          </div>
          <div className="flex flex-wrap gap-10 justify-center items-center">
            {ongoingHackathons ? (
              userHackathons.map((hackathon: any, index: number) => (
                new Date(hackathon.deadline) > new Date() && (
                <HackCard
                  key={index}  // Don't forget to add the key prop
                  name={hackathon.name}
                  deadline={hackathon.deadline}
                  link={hackathon.link}
                  description={hackathon.description}
                  currentUserRole={'user'}
                  id={hackathon._id}
                  userEmail={session?.user?.email}
                  isActive={true}
                  viewOnly={true}
                />)
              ))
            ) : (
              <div className="block text-white text-[20px] font-semibold">
                <div className="mx-auto w-[310px]">No Ongoing Hackathons</div>
              </div>
            )}
          </div>
        </div>

        {/* <>
          <p>Closed</p>
          <table className="min-w-full overflow-x-auto border-gray-600 border  mb-7">
            <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Hackathon Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Apply
                </th>
              </tr>
            </thead>
            {closedHackathons ? (
              <tbody>
                {userHackathons?.map(
                  (hackathon: any, index: any) =>
                    new Date(hackathon.deadline) < new Date() && (
                      <tr key={index}>
                        <td className="py-2 px-3 text-sm">{hackathon.name}</td>
                        <td className="py-2 px-3 text-sm">
                          {convertDate(hackathon.deadline)}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <a
                            href={hackathon.link}
                            target="_blank"
                            className="text-blue-500"
                          >
                            Website
                          </a>
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {hackathon.description}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <button
                            onClick={() => {
                              router.push(`/hackathon/${hackathon._id}`);
                            }}
                            className="flex flex-row w-1/2 border text-center bg-red-600 rounded-xl justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium   px-2 py-1 border-gray-600  mx-4 text-xs"
                          >
                            Visit
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            ) : <p className="my-4">No Closed hackathons</p>}
          </table>
        </> */}

        <div className="">
          <div className="block text-white text-2xl font-extrabold mt-20 ">
            <div className="mx-auto w-[300px] text-center">Closed Hackathons</div>
          </div>
          <div className="flex flex-wrap gap-10 justify-center items-center">
            {closedHackathons ? (
              userHackathons.map((hackathon: any, index: number) => (
                new Date(hackathon.deadline) < new Date() && (
                <HackCard
                  key={index}  // Don't forget to add the key prop
                  name={hackathon.name}
                  deadline={hackathon.deadline}
                  link={hackathon.link}
                  description={hackathon.description}
                  currentUserRole={'user'}
                  id={hackathon._id}
                  userEmail={session?.user?.email}
                  isActive={true}
                  viewOnly={true}
                />)
              ))
            ) : (
              <div className="block text-white text-[20px] font-semibold">
                <div className="mx-auto w-[310px] text-center">No Ongoing Hackathons</div>
              </div>
            )}
          </div>
        </div>


        <div className="flex flex-col mt-20">
          <div className="block text-white text-[30px] font-semibold mb-5 mx-2">Repositories</div>
          <div className="flex flex-row ">
            {Array.from({ length: pages }, (_, index) => index + 1).map(
              (i, id) => {
                return (
                  <button
                    className="mx-2 border border-gray-600 py-1 px-4 rounded mb-2 text-[15px] hover:border-none hover:bg-[rgb(4,21,216)]"
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
          <div className="mt-8 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3  grid-rows-3 lg:gap-8 gap-4 ">
            {repoShown.map((repo, i) => (
              <div className="rounded-md p-5 hover:bg-[rgb(10,1,31)] hover:translate-y-[-10px] transition duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-semibold text-sm">
                      {(repo as any)?.name}
                    </span>
                  </div>
                  <a
                    href={(repo as any)?.html_url}
                    className="flex flex-row text-center bg-red-600 rounded-xl justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium px-5 py-3 border-gray-600 mx-4 text-xs"
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
      </div>
    </>
  );
};

export default Page;