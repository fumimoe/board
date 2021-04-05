import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";


interface TaskState {
// タスクが何個あるのか
    idCount : number;
tasks:{id:number,title:string,completed:boolean}[],
selectedTask:{id:number,title:string,completed:boolean},
isModalOpen: boolean;
}

const initialState:TaskState = {
    idCount: 1,
  tasks: [{ id: 1, title: "Task1", completed: false }],
  selectedTask: { id: 0, title: "", completed: false },
  isModalOpen: false,
};


export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    
    createTask: (state, action) => {
      state.idCount++;
      const newTask = {
        id: state.idCount,
        // titleを受け取る
        title: action.payload,
        completed: false,
      };
      // 新しいtasksを生成する
      state.tasks = [newTask, ...state.tasks];
    },
   

  },
});

export const { createTask } = taskSlice.actions;

export const taskUser = (state: RootState): TaskState["tasks"] => state.task.tasks;

export default taskSlice.reducer;
