import { AlarmAddRounded } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";
import { login, logout, selectUser } from "./features/userSlice";
import { auth, provider } from "./firebase";
import AuthLog from "./components/AuthLog";
import Feed from "./components/Feed";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const classes = useStyles();
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
        dispatch(logout());
      }
    });

    return () => {
      unSub();
    };
  }, [dispatch]);
  return (
    <div className={styles.App}>
      <div className={classes.root}>
        {user.uid && (
          <>
            <AppBar position="fixed" className={styles.bar}>
              <Toolbar>
                <button
                  className={styles.button}
                  onClick={() =>
                    auth.signOut().catch((error) => alert(error.message))
                  }
                >
                  ログアウト
                </button>
              </Toolbar>
            </AppBar>
          </>
        )}

        <div className={styles.text_container}>
          {user.uid ? <Feed /> : <AuthLog />}
        </div>
      </div>
    </div>
  );
};

export default App;
