
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
      setAppState({ user: null, userData: null, isAdmin: false });
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

        {user && (
          <>
            <NavLink to="/posts">All posts</NavLink>
            <NavLink to="/posts-create">Create post</NavLink>
            <NavLink to="/profile-edit">Edit Profile</NavLink>
            {userData?.isAdmin && <NavLink to="/admin-panel">Admin Panel</NavLink>}
          </>
        )}
        {!user && <NavLink to="/login">Login</NavLink>}
        {!user && <NavLink to="/register">Register</NavLink>}
        {user && <button onClick={logout}>Logout</button>}
        {userData && <span>Welcome, {userData.handle}</span>}


      </nav>
    </header>
  );
}

