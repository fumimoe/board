import React from "react";
import { auth } from "../firebase";
import TextFields from "./TextField";
import styles from "./Feed.module.css";

const Feed: React.FC = () => {
  return (
    <div>
      <TextFields />
    </div>
  );
};

export default Feed;
