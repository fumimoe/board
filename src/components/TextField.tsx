import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./TextField.module.css";
import { taskUser, createTask } from "../features/taskSlice";
import TextTask from "./textTask";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";

const TextFields: React.FC = () => {
  const tasks = useSelector(taskUser);
  const dispatch = useDispatch();
  const [title, setTtile] = useState("");
  return (
    <div className={styles.text_field}>
        <div className={styles.container}>
        <div className={styles.text_input}>
        <TextField
          id="standard-basic"
          label="テキスト入力"
          value={title}
          onChange={(e) => setTtile(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        </div>
        <div className={styles.send_icon}>
            
        <IconButton onClick={() => dispatch(createTask(title))} disabled={!title}>
          <SendIcon onClick={()=>setTtile("")} />
        </IconButton>
        </div>
        </div>
      
      {tasks.map((task) => (
          
        <TextTask key={task.id} task={task} />
        
      ))}
      
      
    </div>
  );
};

export default TextFields;
