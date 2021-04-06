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
    editTask:(state,action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if(task){
        task.title = action.payload.title
      }

    },
    deleteTask:(state,action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload.id)
    }
   

  },
});

export const { createTask,editTask,deleteTask } = taskSlice.actions;

export const taskUser = (state: RootState): TaskState["tasks"] => state.task.tasks;
export const selectSelectedTask = (state: RootState): TaskState["selectedTask"] => state.task.selectedTask;
export default taskSlice.reducer;
