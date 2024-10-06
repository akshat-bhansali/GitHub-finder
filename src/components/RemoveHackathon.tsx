"use client";
import { useRouter } from "next/navigation";
const RemoveHackathon = ({ id }: any) => {
  const router = useRouter();
  const removeTopic = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`/api/deleteHackathon?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };
  return (
    <button onClick={removeTopic} className="bg-[rgb(216,4,4)] text-white font-bold px-10 py-3 text-[15px] rounded-[5px] mr-2">
      Delete
    </button>
  );
};

export default RemoveHackathon;
