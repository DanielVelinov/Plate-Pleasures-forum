import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../state/app.context';
import { getAllUsers, toggleUserBlockStatus } from '../services/users.service';

export default function AdminPanel() {
    const { userData } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Fetch users if userData.isAdmin is true
    useEffect(() => {
        if (!userData?.isAdmin) {
            console.log('User is not an admin.');
            return;
        }

        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(Object.values(usersData));
            } catch (error) {
                console.error('Failed to fetch users:', error);
                alert('Failed to fetch users. Please try again.');
            }
        };

        fetchUsers();
    }, [userData]);

    // Filter users based on search input
    useEffect(() => {
        if (search) {
            setFilteredUsers(
                users.filter(user =>
                    user.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    user.lastName.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase()) ||
                    user.handle.toLowerCase().includes(search.toLowerCase()) // Added username search
                )
            );
        } else {
            setFilteredUsers(users);
        }
    }, [search, users]);

    const handleBlockToggle = async (userHandle, currentBlockStatus) => {
        try {
            await toggleUserBlockStatus(userHandle, !currentBlockStatus);
            setUsers(prevUsers =>
                prevUsers.map(user => {
                    if (user.handle === userHandle) {
                        return { ...user, isBlocked: !user.isBlocked };
                    }
                    return user;
                })
            );
        } catch (error) {
            console.error('Failed to toggle block status:', error);
            alert('Failed to toggle user block status. Please try again.');
        }
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="search-section">
                <label htmlFor="search">Search Users: </label>
                <input
                    className="search-input"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search by name, email, or username"
                />
            </div>
            <ul className="user-list">
                {filteredUsers.map(user => (
                    <li key={user.uid || user.email} className="user-item"> {/* Ensure each user has a unique key */}
                        <span className="user-info">
                            {user.firstName} {user.lastName} ({user.email})
                        </span>
                        <button
                            className="block-toggle-btn"
                            onClick={() => handleBlockToggle(user.handle, user.isBlocked)}
                        >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

AdminPanel.propTypes = {
    userData: PropTypes.shape({
        handle: PropTypes.string,
        isAdmin: PropTypes.bool,
    })
};
