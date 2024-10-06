import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddHackathon = () => {
  const router = useRouter();
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  //function to check every field is filled
  const isValid = () => {
    return deadline && link && name && description;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // Perform actions with the form data, for example, send it to an API or perform other operations
    // console.log('Form submitted:', formData);
    if (!isValid()) {
      setError("Please fill all the fields");
    } else {
      try {
        const res = await fetch("/api/addHackathon", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ deadline, name, link, description }),
        });

        if (res.ok) {
          router.push("/");
        } else {
          throw new Error("Failed to create a topic");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="form-container-hack mx-auto mt-10">
        <form className="form" onSubmit={handleSubmit}>
          <span className="heading">Create a hackathon</span>
          <label className="input-hack">Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={deadline}
            onChange={(e: any) => {
              setDeadline(e.target.value);
            }}
            className="input-hack"
          />
          <input
            type="text"
            name="link"
            value={link}
            onChange={(e: any) => {
              setLink(e.target.value);
            }}
            placeholder="Link"
            className="input-hack"
          />
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e: any) => {
              setName(e.target.value);
            }}
            placeholder="Name of the Hackathon"
            className="input-hack"
          />
          <textarea
            name="description"
            value={description}
            onChange={(e: any) => {
              setDescription(e.target.value);
            }}
            className="textarea"
            placeholder="Description"
          />
          <div className="button-container">
            <button type="submit" className="send-button">Create</button>
            <div className="reset-button-container">
              <div id="reset-btn" className="reset-button"
              onClick={()=>{
                setDescription("")
                setLink("")
                setName("")
                setDeadline("")
              }}
              >Reset</div>
            </div>
          </div>
        </form>
      </div>

    </>
  );
};

export default AddHackathon;
