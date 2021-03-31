import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { auth, provider, storage } from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
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
import { updateUserProfile } from "../features/userSlice";
import IconButton from "@material-ui/core/IconButton";




const  getModalStyle = () =>{
  // 画面の真ん中にmodalが表示される
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    // 現状左上の角が真ん中にくるからtransformで調整することで真ん中に配置することができる
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
 
  paper: {
    position: 'absolute',
    top:"50%",
    left:"50%",
    transform: `translate(-50%, -50%)`,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root:{
    height:100
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  // モーダルクラスのCSSを指定する
  modal:{
    outline:"none",
    position:"absolute",
    width:400,
    borderRadius:20,
    boxShadow:theme.shadows[5],
    padding:theme.spacing(10),
    backgroundColor: "white",
  }
}));

export const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [userName, setUserName] = useState("");
  //   <File | null>はファイル型かnullのどちらかが入ってくる
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [openModal,setOpenModal] = useState(false);
  const [resetEmail,setResetEmail] = useState("");

  const sendResetEmail = async(e:React.MouseEvent<HTMLElement>) => {
    await auth.sendPasswordResetEmail(resetEmail).then(() =>{
      // 成功したらモーダルを閉じる＆resetEmailを初期化する
        setOpenModal(false);
        setResetEmail("")
    }).catch((error) => {
      alert(error.message)
      setResetEmail("")
    })
  }
 
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   !をつける理由としてNon-null assertion operatorなのでこれは非nullでかつ非undefinedであること意味する
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  //   googleでログインする時の実装→エラーした時のみ実行する
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  //   ログインする時の関数
  const SignInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  //   新規ユーザーを作成する時
  const SignUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // 62文字
      var N = 16;
      // Uint32Arrayは符号なしの３２ビットで表現できる
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;

      //    refとすることで階層を決めることができる
      // この一文でfire sotorageにアップロードすることができる
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      //    下記一文でさっきアップロードした画像のURLを取り出すことができる
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }

    // プロフィールを更新することができる→authUser.user?userオブジェクトがあれば追加で名前と写真を追加することができる
    await authUser.user?.updateProfile({
      displayName: userName,
      photoURL: url,
    });
    // その後dispatchでreduxstateを変更する
    dispatch(
      updateUserProfile({
        displayName: userName,
        photoURL: url,
      })
    );
  };

  return (
    <Container component="main" className={styles.container} >
      <CssBaseline />
      
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar} >
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography className={styles.title} component="h1" variant="h5">
          {isLogin ? "signIn" : "SignUp"}
        </Typography>
        <form className={classes.form} noValidate>
          {/* 条件式で新規でアカウント作成した時は名前を入力する */}
          {!isLogin && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="userName"
                label="userName"
                name="userName"
                autoComplete="userName"
                autoFocus
                value={userName}
                //   イベント時のに型定義をしてる
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserName(e.target.value);
                }}
              />
              <Box textAlign="center">
                <IconButton>
                  {/* labelを指定することでiconを押すとファイルが表示されるようになる */}
                  <label>
                    <AccountCircleIcon
                      fontSize="large"
                      className={
                        avatarImage
                          ? styles.login_addIconLoaded
                          : styles.login_addIcon
                      }
                    />
                    <input
                      type="file"
                      className={styles.login_hiddenIcon}
                      onChange={onChangeImageHandler}
                    />
                  </label>
                </IconButton>
              </Box>
            </>
          )}
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
            // disabledは無効化する→右が無効化する条件
            // ボタンが押せなくなる
            disabled={
              // ログイン時と新規作成の時で処理を分ける条件分岐
              isLogin
                ? !email || password.length < 6
                : !userName || !email || password.length < 6 || !avatarImage
            }
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
            {isLogin ? "サインイン" : "サインアップ"}
          </Button>
          <Grid container>
            {/* xsでサイズを指定することができる→片方だけにxsを指定することで指定した方だけが全体を占めるので片方が右寄せになる */}
            <Grid item xs>
              <span className={styles.login_reset} onClick={()=>setOpenModal(true)}>パスワード忘れた方</span>

              
            </Grid>
            <Grid item>
              {/* ボタンを押すたびにbooleanが反転する */}
              <span
                className={styles.login_toggleMode}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "新しいアカウントを作成する" : "ログイン画面に戻る"}
              </span>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signInGoogle}
            // 文字の最初にmaterial ui のiconを表示することができる
            startIcon={<CameraIcon/>}
          >
            Sign In With Google
          </Button>
        </form>
        <Modal open={openModal} className={styles.modal_top}  onClose={() => setOpenModal(false)}>
              <div style={getModalStyle()} className={classes.modal}>
                <div className={styles.login_modal}>
                  <TextField
                  InputLabelProps={{
                    shrink:true
                  }}
                  type="email"
                  name="email"
                  label="reset Email"
                  value={resetEmail}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                    setResetEmail(e.target.value);
                  }}
                  />
                  <IconButton>
                    <SendIcon onClick={()=>sendResetEmail}/>
                  </IconButton>
                </div>
              </div>
        </Modal>
      </div>
      </Container>
    
  );
};
