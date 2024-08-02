import { useContext, useState } from "react";
import { AppContext } from "../state/app.context";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { getUserData } from "../services/users.service";

export default function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  const login = async () => {
    if (!user.email || !user.password) {
      alert('No credentials provided!');
      return;
    }

    try {
      const credentials = await loginUser(user.email, user.password);
      const userData = await getUserData(credentials.user.uid);
      setAppState({
        user: credentials.user,
        userData: userData[Object.keys(userData)[0]],
      });
      navigate(location.state?.from.pathname ?? '/');
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <label htmlFor="email">Email: </label>
      <input
        value={user.email}
        onChange={updateUser('email')}
        type="text"
        name="email"
        id="email"
      /><br /><br />
      <label htmlFor="password">Password: </label>
      <input
        value={user.password}
        onChange={updateUser('password')}
        type="password"
        name="password"
        id="password"
      /><br />
      <button onClick={login}>Login</button>
    </div>
  );
}
