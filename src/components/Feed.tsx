import React from "react";
import { auth } from "../firebase";
import TextFields from "./TextField";
import styles from "./Feed.module.css";


const Feed: React.FC = () => {
  return (
    <div>
       <div className={styles.header}>
         <div className={styles.header_item}>
         <button
                  className={styles.button}
                  onClick={() =>
                    auth.signOut().catch((error) => alert(error.message))
                  }
                >
                  ログアウト
                </button>
       </div>
        </div>

      <TextFields />
    </div>
  );
};

export default Feed;
