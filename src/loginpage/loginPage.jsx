import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import '../App.css';

export default function LoginPage() {
  return loggedin ? <LoginScreen /> : <MainPage />;
}
var loggedin = false;
const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  loggedin = true;
  console.log(user.displayName);
  console.log('Logged in Succesfully');
};

function LoginScreen() {
  return (
    <div className="mainLoginpage">
      <div className="pintrestlogologin">
        <img
          src="pintrestlogo.png"
          alt="Pintrestmainlogo"
          className="pintrestlogo"
        />
      </div>
      <p className="taglineLogin">Welcome to Pintrest</p>
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
