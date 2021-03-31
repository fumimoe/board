import React from "react";
import { auth } from "../firebase";
import TweetInput from './TweetInput';

const Fead = () => {
  return (
    <div>
      <TweetInput/>
      <button onClick={() => auth.signOut().catch((error) => error.message)}>
        Logout
      </button>
    </div>
  );
};

export default Fead;
