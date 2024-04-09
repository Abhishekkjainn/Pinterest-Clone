import '../App.css';

export default function LoginPage() {
  return (
    <div className="mainLoginpage">
      <div className="pintrestlogologin">
        <img
          src="pintrestlogo.png"
          alt="Pintrestmainlogo"
          className="pintrestlogo"
        />
        <p>Welcome to Pintrest</p>
        <div className="googleLoginButton"></div>
      </div>
    </div>
  );
}
