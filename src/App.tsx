import React,{useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux'
import styles from './App.module.css';
import {login,logout,selectCount} from './features/userSlice'
import {auth,provider} from './firebase'

const App:React.FC = ()=> {
  const user = useSelector(selectCount)
  const dispatch = useDispatch();

  return (
    <div className="App">
      aaaa
    </div>
  );
}

export default App;
