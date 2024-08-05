import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaPlus, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { AppContext } from '../state/app.context';
import { logoutUser } from '../services/auth.service';
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
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
        <div className="sidebar">
            <div className="sidebar-icon-container">
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}
                >
                    <FaHome />
                    <span className="tooltip">Home</span>
                </NavLink>
            </div>
            <div className="sidebar-icon-container">
                <NavLink
                    to="/posts"
                    className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}
                >
                    <FaClipboardList />
                    <span className="tooltip">All Posts</span>
                </NavLink>
            </div>
            <div className="sidebar-icon-container">
                <NavLink
                    to="/posts-create"
                    className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}
                >
                    <FaPlus />
                    <span className="tooltip">Create Post</span>
                </NavLink>
            </div>
            {userData?.isAdmin && (
                <div className="sidebar-icon-container">
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}
                    >
                        <FaUserShield />
                        <span className="tooltip">Admin Panel</span>
                    </NavLink>
                </div>
            )}
            {user && (
                <div className="sidebar-icon-container">
                    <button
                        className="sidebar-icon"
                        onClick={logout}
                    >
                        <FaSignOutAlt />
                        <span className="tooltip">Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}
