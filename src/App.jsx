// App.jsx
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import LoginPage from './loginpage/loginPage';
import MainPage from './mainpage/mainPage'; // Import MainPage component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const handleLogin = () => {
    // Set isLoggedIn to true when user logs in successfully
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {isLoggedIn ? (
            <Redirect to="/mainPage" />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )}
        </Route>
        <Route path="/mainPage">
          {isLoggedIn ? <MainPage /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
