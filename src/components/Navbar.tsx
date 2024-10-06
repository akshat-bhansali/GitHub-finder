"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FiAlignRight } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";

const Navbar = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [crossButton, setCrossButton] = useState(false);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [searchedUser, setSearchedUser] = useState<any>([]);
  const [inputText, setInputText] = useState("");
  const getUsers = async () => {
    try {
      const res = await fetch("/api/fetchAllUsers");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading users: ", error);
    }
  };

  const getTop5Users = (allUsers: any[], searchInput: string): any[] => {
    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().startsWith(searchInput.toLowerCase())
    );
    const sortedUsers = filteredUsers.sort((a, b) => {
      if (a.name.length < b.name.length) return -1;
      if (a.name.length > b.name.length) return 1;
      return 0;
    });
    const top5Users = sortedUsers.slice(0, 5);
    return top5Users;
  };


  const Menu = () => {
    return (
      <div className="z-[1000] flex pt-8 bg-[rgb(10,1,31)] w-[290px] delay-75 rounded-lg shadow-[0px_-8px_10px_0px_rgba(107,114,128,0.5)] flex-col list-none md:invisible visible absolute right-2 top-20 items-end justify-end p-4">
        <Link href="/" passHref className="w-full">
          <div className="hover:bg-[rgb(4,21,216)] hover:translate-y-[-10px] h-[40px] transition duration-500 rounded-[5px] text-center py-1 w-full list-none text-[16px] align-middle font-mono" onClick={() => setToggleBtn(!toggleBtn)}>
            Home
          </div>
        </Link>
        <Link href="/hackathon" passHref className="w-full mt-[8px]">
          <li className="hover:bg-[rgb(4,21,216)] mt-2 hover:translate-y-[-10px] h-[40px] transition duration-500 rounded-[5px] text-center py-1 w-full list-none text-[16px] font-mono" onClick={() => setToggleBtn(!toggleBtn)}>
            Hackathons
          </li>
        </Link>
        <li className="text-black pt-2 mb-[10px] flex justify-end w-full">
          <input
            className="input h-8 text-base px-4 py-2 focus:outline-none w-full rounded-[8px]"
            value={inputText}
            onChange={handleSearch}
            placeholder="Search..."
          />
          {/* {crossButton ?
            (<button
              onClick={() => { setSearchedUser([]); setInputText(""); setCrossButton(false) }}
              className="font-bold text-black bg-white px-2 rounded-r-md">X</button>) :
            <CiSearch className="font-bold h-8 text-black bg-white text-3xl rounded-r-md" />
          } */}
        </li>
        {session ? (
          <Link href="/chat" className="w-full" passHref onClick={() => setToggleBtn(!toggleBtn)}>
            <div className="hover:bg-[rgb(4,21,216)] mt-3 hover:translate-y-[-10px] h-[40px] transition duration-500 rounded-[5px] text-center py-1 w-full list-none text-[16px] align-middle font-mono" onClick={() => setToggleBtn(!toggleBtn)}>
              Chat
            </div>
          </Link>
        ) : (
          <></>
        )}
        {!session ? (
          <Link href="/login" passHref className="mx-auto" onClick={() => setToggleBtn(!toggleBtn)}>
            <button className="login-btn">
              <span className="login-btn-content text-[18px] font-mono">Login</span>
            </button>
          </Link>
        ) : (
          <>
            <Link href="/profile" className="w-full" passHref onClick={() => setToggleBtn(!toggleBtn)}>
              <li className="hover:bg-[rgb(4,21,216)] mt-4 hover:translate-y-[-10px] h-[40px] transition duration-500 rounded-[5px] text-center py-1 w-full list-none text-[16px] align-middle font-mono" onClick={() => setToggleBtn(!toggleBtn)}>
                Profile
              </li>
            </Link>

            <button className="login-btn mx-auto mt-3" onClick={() => signOut()}>
              <span className="login-btn-content text-[20px] font-mono">Logout</span>
            </button>
          </>
        )}
      </div>
    )
  }

  const handleSearch = (e: any) => {

    setInputText(e.target.value)
    if (e.target.value === "") {
      return setSearchedUser([]);
    }
    const top5Users = getTop5Users(allUsers, inputText);
    if (top5Users) {
      setCrossButton(true);
    }
    setSearchedUser(top5Users);
  }

  useEffect(() => {
    setInputText("");
    setSearchedUser([]);
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        if (data) {
          console.log(data.allUsers);
          setAllUsers(data.allUsers);
        }
      } catch (error) {
        console.error("Error fetching hackathons: ", error);
      }
    };

    fetchData();
  }, [inputText]);

  const { data: session }: any = useSession();
  return (
    <div className="bg-[rgb(10,1,31)]">
      {toggleBtn && <Menu />}
      <div className="mx-4">
        <ul className="flex justify-between items-center p-4">
          <div className="">
            <Link href="/">
              <li>
                <Image src="/logo.jpg" className="rounded-[50px]" height={50} width={50} alt="Logo" />
              </li>
            </Link>
          </div>
          <div className="flex gap-10">
            <div className="flex gap-10 invisible md:visible absolute md:relative">
              <Link href="/" passHref className="hover:text-gray-300 hover:scale-[1.1] transition duration-500 text-[20px] pt-2 hover:cursor-pointer font-mono">
                Home
              </Link>
              <Link href="/hackathon" passHref className="hover:text-gray-300 hover:scale-[1.1] transition duration-500 text-[20px] pt-2 hover:cursor-pointer font-mono">
                Hackathons
              </Link>
            </div>
            <div className="input-container text-black pt-2 font-mono flex md:visible invisible">
              <input
                className="input w-full h-8 align-middle text-base px-4 py-2 focus:outline-none rounded-[8px]"
                value={inputText}
                onChange={handleSearch}
              />
              {/* {crossButton ?
                (<button
                  onClick={() => { setSearchedUser([]); setInputText(""); setCrossButton(false) }}
                  className="font-bold text-black bg-white px-2 rounded-r-md">X</button>) :
                <CiSearch className="font-bold h-[38px] input w-[10px] text-black bg-white text-3xl rounded-r-md" />
              } */}
            </div>
            <div className="absolute">
              {searchedUser != "" ? (
                <div className=" absolute md:left-0 right-100 top-14 bg-[rgb(10,1,31)] w-60 rounded-lg border border-gray-500 z-[1000]">
                  {searchedUser.map((user: any) => (
                    <Link href={`/profile/${user.username}`} key={user._id} onClick={() => {
                      setSearchedUser([]);
                      setInputText("");
                      setCrossButton(false)
                    }}>
                      <li className="hover:text-gray-300 text-sm px-4 py-2 font-mono">
                        {user.name}
                      </li>
                    </Link>
                  ))}
                </div>
              ) : (<div className=" invisible">
                <p className="">NO USER FOUND</p>
              </div>)}
            </div>
            <div className="flex gap-10 invisible md:visible absolute md:relative">
              {session ? (
                <Link href="/chat" passHref>
                  <li className="hover:text-gray-300 hover:scale-[1.1] transition duration-500 text-[20px] pt-2 hover:cursor-pointer font-mono">
                    Chat
                  </li>
                </Link>
              ) : (
                <></>
              )}
              {!session ? (
                <Link href="/login" passHref>
                  <button className="login-btn">
                    <span className="login-btn-content text-[20px] font-mono">Login</span>
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/profile" passHref>
                    <li className="hover:text-gray-300 hover:scale-[1.1] transition duration-500 text-[20px] pt-2 hover:cursor-pointer font-mono">
                      Profile
                    </li>
                  </Link>
                  <button className="login-btn" onClick={() => signOut()}>
                    <span className="login-btn-content text-[20px] font-mono">Logout</span>
                  </button>
                </>
              )}
            </div>
            <button className="visible md:invisible md:absolute mt-2"
              onClick={() => setToggleBtn(!toggleBtn)}
            >
              <FiAlignRight/>
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;