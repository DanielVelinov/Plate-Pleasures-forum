import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../state/app.context';
import { getAllUsers, toggleUserBlockStatus } from '../services/users.service';

export default function AdminPanel() {
    const { userData } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredUsers(users.filter(user =>
                user.firstName.toLowerCase().includes(search.toLowerCase()) ||
                user.lastName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setFilteredUsers(users);
        }
    }, [search, users]);

    const handleBlockToggle = async (uid) => {
        try {
            await toggleUserBlockStatus(uid);
            setUsers(prevUsers => prevUsers.map(user => {
                if (user.uid === uid) {
                    return { ...user, isBlocked: !user.isBlocked };
                }
                return user;
            }));
        } catch (error) {
            console.error('Failed to toggle block status:', error);
            alert('Failed to toggle user block status. Please try again.');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <label htmlFor="search">Search Users: </label>
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                name="search"
                id="search"
            /><br /><br />
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.uid}>
                        <span>{user.firstName} {user.lastName} ({user.email})</span>
                        <button onClick={() => handleBlockToggle(user.uid)}>
                            {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
