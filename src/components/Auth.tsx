import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { auth, provider, storage } from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Modal from "@material-ui/core/Modal";
import Container from "@material-ui/core/Container";

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

export const Auth: React.FC = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [userName,setUserName] = useState('');
//   <File | null>はファイル型かnullのどちらかが入ってくる
  const [avatarImage,setAvatarImage] = useState<File | null>(null);

  const onChangeImageHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    //   !をつける理由としてNon-null assertion operatorなのでこれは非nullでかつ非undefinedであること意味する
    if(e.target.files![0]){
        setAvatarImage(e.target.files![0]);
        e.target.value ="";
    }
  }


  //   ログインする時の関数
  const SignInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  //   新規ユーザーを作成する時
  const SignUpEmail = async () => {
   const authUser =  await auth.createUserWithEmailAndPassword(email, password);
   let url = "";
   if(avatarImage){
       
    //    refとすることで階層を決めることができる
    // この一文でfire sotorageにアップロードすることができる
       await storage.ref(`avatars/${fileName}`).put(avatarImage);
    //    下記一文でさっきアップロードした画像のURLを取り出すことができる
       url = storage.ref("avatars").child(fileName).getDownloadURL()
   }
  };

  //   googleでログインする時の実装→エラーした時のみ実行する
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
       
        <Typography component="h1" variant="h5">
          {isLogin ? "signIn" : "SignUp"}
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
            //   イベント時のに型定義をしてる
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />

          <Button
            //   type属性を消す理由としてはsubmitの既定の処理をさせない為。またはSignInEmailにpreventDefault()を指定する
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            //   emailのアイコンを先頭につける
            startIcon={<EmailIcon />}
            onClick={
              isLogin
                ? async () => {
                    try {
                      await SignInEmail();
                    } catch (error) {
                      alert(error.message);
                    }
                  }
                : async () => {
                    try {
                      await SignUpEmail();
                    } catch (error) {
                      alert(error.message);
                    }
                  }
            }
          >
            {isLogin ? "signIn" : "SignUp"}
          </Button>
          <Grid container>
              {/* xsでサイズを指定することができる→片方だけにxsを指定することで指定した方だけが全体を占めるので片方が右寄せになる */}
          <Grid item xs>
            <span className={styles.login_reset}></span>
            
                <span>パスワード忘れた方</span>
              </Grid>
              <Grid item >
            {/* ボタンを押すたびにbooleanが反転する */}
            <span
              className={styles.login_toggleMode}
              onClick={() => setIsLogin(!isLogin)}
            >
              
                {isLogin ? "新しいアカウントを作成する" : "ログイン画面に戻る"}</span>
              </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signInGoogle}
          >
            Sign In With Google
          </Button>
        </form>
      </div>
    </Container>
  );
};
