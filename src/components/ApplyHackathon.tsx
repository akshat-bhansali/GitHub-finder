"use client";
import { useRouter } from "next/navigation";

const ApplyHackathon = ({ id, userEmail }: any) => {
  const router = useRouter();
  const addUsertoHackathon = async () => {
    try {
      const res = await fetch(`/api/addUsertoHackathon`, {
        method: "PUT",
        body: JSON.stringify({ userEmail, id }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        throw new Error("Failed to add");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={() => {
        addUsertoHackathon();
      }}
      className="bg-[rgb(4,21,216)] text-white font-bold px-10 py-3 text-[15px] rounded-[5px] mr-1"
    >
      Apply
    </button>
  );
};

export default ApplyHackathon;
