import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";
import { login, logout, selectCount } from "./features/userSlice";
import { auth, provider } from "./firebase";
import Fead from "./components/Fead";
import {Auth} from "./components/Auth";

const App: React.FC = () => {
  const user = useSelector(selectCount);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // dispacthでsliceに接続してpayloadに値を考える
        dispatch(
          login({
            uid: authUser.uid,
            photoURL: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);

  // ユーザーが存在してる時はFeadコンポーネントを表示する
  return <>{user.uid ? <div className={styles.app}><Fead /></div> : <Auth />}</>;
};

export default App;
