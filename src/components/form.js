import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import "./form.css";
import { getDatabase, ref, set } from "firebase/database";
import { auth, storage } from "../firebase";
import { ref as storageRef, uploadBytes } from "firebase/storage";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [signupError, setSignupError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("userCredential", userCredential);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      console.log("User DisplayName:", user.displayName);
      console.log("Updated User Profile:", user);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      if (!avatar) {
        setAvatar("default_avatar.png");
        console.log("Default");
      } else {
        const avatarRef = storageRef(storage, `avatars/${user.uid}`);

        uploadBytes(avatarRef, avatar).then(() => {
          console.log("uploaded");
        });
      }
      await set(userRef, {
        email: user.email,
        username: username,
        avatar: avatar,
      });
    } catch (error) {
      setSignupError(error.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      setLoginError(error.message);
    });
  };
  return (
    <div className="main">
      <input type="checkbox" id="chk" aria-hidden="true" />
      <div className="signup">
        <form onSubmit={handleSignup}>
          <label htmlFor="chk" aria-hidden="true">
            Sign up
          </label>

          <input
            type="text"
            name="txt"
            placeholder="User name"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {signupError && (
            <p className="error-message">
              Password should be at least 6 characters
            </p>
          )}
          <p className="registration-switch">Don't have an account? Sign Up</p>
          <label
            htmlFor="dropzone-file"
            className="file-upload flex items-center justify-center h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="ml-2 mr-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  Click to upload or drag and drop
                </span>
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </label>
          <button type="submit">Sign up</button>
        </form>
      </div>

      <div className="login">
        <form onSubmit={handleLogin}>
          <label htmlFor="chk" aria-hidden="true">
            Login
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && (
            <p className="error-message">Incorrect credential details</p>
          )}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
