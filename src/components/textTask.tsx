import React, { useState } from "react";
import styles from "./textTask.module.css";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { IconButton } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import { useDispatch, useSelector } from "react-redux";
import { editTask,deleteTask } from "../features/taskSlice";
import { BrowserRouter as Router, Link } from "react-router-dom";

interface PropTypes {
  task: { id: number; title: string; completed: boolean };
}

const TextTask: React.FC<PropTypes> = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const dispatch = useDispatch();
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editTaskModal = () => {
    dispatch(editTask({id:task.id,title:title}));
    handleClose();
  }
  return (
    <>
      <Router>
    <Link to="/">タスク一覧</Link>
    <Link to="/completed_task">完了済タスク</Link>
    <Link to="/garbage_task">ゴミ行きタスク</Link>
    </Router>
    
    <div className={styles.root}>
     
      <div className={styles.title_text}>
        {/* propsで受け取る */}
        {task.title}
      </div>

      <div className={styles.right_item}>
        <IconButton>
          <CheckBoxIcon className={styles.icon} />
        </IconButton>
        <IconButton className={styles.edit_button} onClick={handleOpen}>
          <EditIcon className={styles.icon} />
        </IconButton>
        <IconButton className={styles.delete_button} onClick={() => dispatch(deleteTask(task))}>
          <DeleteIcon className={styles.icon} />
        </IconButton>
      </div>
      <Modal open={open} onClose={handleClose} className={styles.modal}>
        <div className={styles.modal_content}>
          <div className={styles.modal_title}>edit task</div>
          <div className={styles.text_input}>
            <TextField
              id="standard-basic"
              label="テキスト入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className={styles.send_icon}>
            <button  onClick={editTaskModal} className={styles.button_change} >
              変更する
            </button>
            <button  onClick={handleClose} className={styles.button_chancel}>
            キャンセル
            </button>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
};

export default TextTask;
