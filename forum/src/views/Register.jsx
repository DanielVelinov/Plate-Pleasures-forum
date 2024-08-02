import { useContext, useState } from "react"
import { registerUser } from "../services/auth.service";
import { AppContext } from "../state/app.context";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";

export default function Register() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    })
  };

  const register = async () => {
    if (!user.email || !user.password) {
      alert('No credentials provided!');
      return;
    }

    try {
      const userFromDB = await getUserByHandle(user.firstName);
      if (userFromDB) {
        alert(`User {${user.firstName}} already exists!`);
        return;
      }
      const credential = await registerUser(user.email, user.password);
      await createUserHandle(user.firstName, credential.user.uid, user.email);
      setAppState({ user: credential.user, userData: null });
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <>
      <h1>Register</h1>
      <label htmlFor="firstName">First Name: </label>
      <input value={user.firstName} onChange={updateUser('firstName')} type="text" name="firstName" id="firstName" /><br /><br />
      <label htmlFor="lastName">Last Name: </label>
      <input value={user.lastName} onChange={updateUser('lastName')} type="text" name="lastName" id="lastName" /><br /><br />
      <label htmlFor="email">Email: </label>
      <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /><br /><br />
      <label htmlFor="password">Password: </label>
      <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br />
      <button onClick={register}>Register</button>
    </>
  )
}
