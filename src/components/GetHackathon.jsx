import React, { useEffect } from 'react';

const GetHackathon = () => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/getHackathon",{method:'GET',headers: {
            "Content-type": "application/json",
          },});
        if (!res.ok) {
          throw new Error("Failed to fetch hackathons");
        }
    
        return res.json();
      } catch (error) {
        console.log("Error loading hackathons: ", error);
      }
    };
    useEffect(() => {
     const dataa = getData();
     console.log(dataa);
   }, []);
  return (
    <div>
      
    </div>
  )
}

export default GetHackathon
