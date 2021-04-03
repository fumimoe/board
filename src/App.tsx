import { AlarmAddRounded } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";
import { login, logout, selectUser } from "./features/userSlice";
import { auth, provider } from "./firebase";
import AuthLog from './components/AuthLog';
import Feed from "./components/Feed";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoURL: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout())
      }
    });

    return () => {
      unSub();
    }
  }, [dispatch]);
  return <div className={styles.App}>

    {user.uid ? <Feed/>:<AuthLog/>}
  </div>;
};

export default App;
