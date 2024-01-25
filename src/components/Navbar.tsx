"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session }: any = useSession();
  return (
    <div className=" max-w-full bg-gray-700 rounded-lg">
      <ul className="flex justify-between items-center  p-4">
        <div>
          <Link href="/">
            <li>
              <img src="/favicon.ico" className="h-12" alt="Logo" />
            </li>
          </Link>
        </div>
        <div className="flex gap-10">
          <Link href="/" passHref>
            <li className="hover:text-gray-300">Home</li>
          </Link>
          <Link href="/hackathon" passHref>
            <li className="hover:text-gray-300">Hackathons</li>
          </Link>
          <Link href="/" passHref>
            <li className="hover:text-gray-300">
              Search
              {/* Need to add input */}
            </li>
          </Link>
          {!session ? (
            <Link href="/login" passHref>
              <li className="hover:text-gray-300">Login</li>
            </Link>
          ) : (
            <>
              <Link href="/profile" passHref>
                <li className="hover:text-gray-300">Profile</li>
              </Link>
              <li>
                <button
                  onClick={() => signOut()}
                  className="p-2 px-5 -mt-1 bg-blue-800 rounded-full hover:bg-blue-600 transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
