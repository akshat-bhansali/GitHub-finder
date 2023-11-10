// components/UserProfileDetails.js
import React from 'react';

const UserProfileDetails = ({
  profilePicture : any,
  username : any ,
  email : any,
  repositories : any,
  name : any,
  link : any,
  creationDate : any,
  updationDate : any,
  role : any,
}) => {
  return (
    <div>
      <div>
        <img src={profilePicture} alt="Profile" />
        <h2>{username}</h2>
        <p>Email: {email}</p>
      </div>
      <div>
        <h3>Repositories:</h3>
        <ul>
          {repositories.map((repo, index) => (
            <li key={index}>{repo.detail}</li>
          ))}
        </ul>
      </div>
      <div>
        <p>Name: {name}</p>
        <p>Link: {link}</p>
        <p>Creation Date: {creationDate}</p>
        <p>Updation Date: {updationDate}</p>
        <p>Role: {role}</p>
      </div>
    </div>
  );
};

export default UserProfileDetails;
