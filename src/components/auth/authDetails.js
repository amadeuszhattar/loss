import React, { useEffect, useState } from "react";
import { auth, storage } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginForm from "../../components/form";
import "../../components/form.css";
import { getDatabase, ref, onValue } from "firebase/database";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null); //Realtime Database
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        const database = getDatabase();
        const userRef = ref(database, `/users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserData(data);
        });
        let avatarRef = storageRef(
          storage,
          `gs://loss-gg-19261.appspot.com/avatars/${user.uid}`
        );

        console.log("Whats that:", avatarRef);
        getDownloadURL(storageRef(storage, avatarRef))
          .then((url) => {
            setImageUrl(url);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            const defaultAvatarUrl =
              "https://firebasestorage.googleapis.com/v0/b/loss-gg-19261.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=5c5ce219-aa5d-40af-898a-ca2638beeb22";
            setImageUrl(defaultAvatarUrl);
          });
      } else {
        setAuthUser(null);
        setUserData(null);
      }
    });

    return () => {
      authListener();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth).catch((error) => console.log(error));
  };

  return (
    <div>
      {authUser && userData && imageUrl ? (
        <div className="logged-in-box">
          <p>{`Signed In as ${authUser.displayName || "Loading"}`}</p>
          <p className="logged">{`Realtime Databse ${
            userData.username || "Loading"
          }`}</p>
          <div className="avatar-container">
            <img className="avatar" src={imageUrl} alt="User Avatar" />
          </div>
          {console.log("User data", userData)}
          <button onClick={userSignOut}>Sign out</button>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default AuthDetails;
