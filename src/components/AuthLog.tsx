import React, { useState } from "react";
import styles from "./AuthLog.module.css";
import { auth, db, storage, provider } from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const AuthLog: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const classes = useStyles();

  const GoogleSing = async () => {
    await auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  const signLogin = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };
  const signUp = async () => {
    await auth.createUserWithEmailAndPassword(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {isLogin ? "サインイン" : "サインアップ"}
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            startIcon={<EmailIcon />}
            onClick={
                isLogin
                  ? async () => {
                      signLogin().catch((error) => alert(error.message));
                    }
                  : async () => {
                      await signUp().catch((error) => alert(error.message));
                    }
              }
          >
              {isLogin ? "サインイン" : "サインアップ"}
            
          </Button>

          <span>
                <Grid container>
                    <Grid item xs >パスワードを忘れた方</Grid>
                    <Grid item xs onClick={() =>setIsLogin(!isLogin)}>{isLogin ? 'アカウントの新規作成':'ログインページに戻る'}</Grid>
              
              </Grid></span>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            startIcon={<CameraIcon />}
            onClick={GoogleSing}
          >
            google sign in
          </Button>

          
        </form>
      </div>
      <Box mt={8}></Box>
    </Container>
  );
};

export default AuthLog;
