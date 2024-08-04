import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../state/app.context";
import { logoutUser } from "../services/auth.service";

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutUser();
      setAppState({ user: null, userData: null });
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <header>
      <h1>Culinary Forum</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/posts">All posts</NavLink> {/* Always show this link */}
        {user ? (
          <>
            <NavLink to="/posts-create">Create post</NavLink>
            <button onClick={logout}>Logout</button>
            {userData && <span>Welcome, {userData.handle}</span>}
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

