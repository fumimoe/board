import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectCount } from "../features/userSlice";
import { Avatar, Button, IconButton } from "@material-ui/core";
import { auth, storage, db } from "../firebase";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import firebase from "firebase/app";

const TweetInput = () => {
  const user = useSelector(selectCount);

  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   !をつける理由としてNon-null assertion operatorなのでこれは非nullでかつ非undefinedであること意味する
    // 画像が選択された時に入る
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // 62文字
      var N = 16;
      // Uint32Arrayは符号なしの３２ビットで表現できる
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);

      uploadTweetImg.on(
        //   storgeに対してstateの変化があった時に動作する
        // 3つ引数を持つことができる
        // ①進捗を確認するメソッド()=>{},
        // ②errorが発生した時のメソッド
        // ③正常に処理が終了した時のメソッド
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (error) => {
          alert(error.message);
        },
        async () => {
          // 画像をimagesから取得して対象のファイルを選択する（child）そのURLを取得してdbに保存する
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              console.log(url);
              await db.collection("posts").add({
                avatar: user.photoURL,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoURL,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }
    // これで初期化する
    setTweetImage(null);
    setTweetMsg("");
  };

  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoURL}
            onClick={async () => await auth.signOut()}
          />
          <input
            type="text"
            className={styles.tweet_input}
            placeholder="メッセージを入力"
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          // メッセージが入力されてない時のcssの切り替え
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;