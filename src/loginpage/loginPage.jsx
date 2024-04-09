// LoginPage.jsx
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import '../App.css';
import { useHistory } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const history = useHistory(); // Import useHistory from react-router-dom

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    onLogin(); // Call onLogin function passed from App.jsx
    history.push('/mainPage'); // Redirect to mainPage
    console.log(user.displayName);
    console.log('Logged in Successfully');
  };

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
