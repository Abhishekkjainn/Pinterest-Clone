import { useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebase';
import '../App.css';
import MainPage from '../mainpage/mainPage';

export default function DeciderPage() {
  const [loggedin, setLoggedin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedin(true);
        console.log(user.displayName);
        console.log('Already logged in');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setLoggedin(true);
      console.log(user.displayName);
      console.log('Logged in Successfully');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return loggedin ? (
    <MainPage />
  ) : (
    <LoginScreen handleGoogleLogin={handleGoogleLogin} />
  );
}

function LoginScreen({ handleGoogleLogin }) {
  return (
    <div className="mainLoginpage">
      <div className="pintrestlogologin">
        <img
          src="pintrestlogo.png"
          alt="Pintrestmainlogo"
          className="pintrestlogo"
        />
      </div>
      <p className="taglineLogin">Welcome to Pinterest</p>
      <div className="googleLoginButton" onClick={handleGoogleLogin}>
        <img
          src="googleicon.png"
          alt="Google Icon"
          className="googleLoginIcon"
        />
        <span className="logintext">Continue with Google</span>
      </div>
    </div>
  );
}
