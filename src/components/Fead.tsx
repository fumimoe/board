import React from "react";
import { auth } from "../firebase";

const Fead = () => {
  return (
    <div>
      <button onClick={() => auth.signOut().catch((error) => error.message)}>
        Logout
      </button>
    </div>
  );
};

export default Fead;
