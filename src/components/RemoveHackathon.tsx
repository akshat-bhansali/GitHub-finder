"use client";
import { useRouter } from "next/navigation";

const RemoveHackathon = ({id}:any) => {

  const router = useRouter();
  const removeTopic = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/deleteHackathon?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };
  return (
    <button onClick={removeTopic} className="text-red-400">
    delete
  </button>
  )
}

export default RemoveHackathon
