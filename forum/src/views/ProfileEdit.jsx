
import React, { useState, useContext } from 'react';
import { AppContext } from '../state/app.context';
import { saveUserDetails } from '../services/users.service';

export default function ProfileEdit() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [profile, setProfile] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
    });

    const updateProfile = (key, value) => {
        setProfile({
            ...profile,
            [key]: value,
        });
    };

    const handleSaveProfile = async () => {
        try {
            await saveUserDetails({
                uid: user.uid,
                email: user.email,
                ...profile,
            });

            setAppState(prevState => ({
                ...prevState,
                userData: {
                    ...prevState.userData,
                    ...profile,
                },
            }));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            <label htmlFor="firstName">First Name: </label>
            <input
                value={profile.firstName}
                onChange={e => updateProfile('firstName', e.target.value)}
                type="text"
                name="firstName"
                id="firstName"
            /><br /><br />
            <label htmlFor="lastName">Last Name: </label>
            <input
                value={profile.lastName}
                onChange={e => updateProfile('lastName', e.target.value)}
                type="text"
                name="lastName"
                id="lastName"
            /><br /><br />
            <label htmlFor="phoneNumber">Phone Number: </label>
            <input
                value={profile.phoneNumber}
                onChange={e => updateProfile('phoneNumber', e.target.value)}
                type="text"
                name="phoneNumber"
                id="phoneNumber"
            /><br /><br />
            <button onClick={handleSaveProfile}>Save</button>
        </div>
    );
}
