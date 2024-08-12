import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../state/app.context';
import { saveUserDetails, getUserData } from '../services/users.service';
import defaultProfilePicture from '../assets/profile-picture.jpg/profilePicture.png';
import { uploadProfilePhoto } from '../services/storage.service';

export default function Profile() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [profile, setProfile] = useState({
        handle: userData.handle || '',  
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
        profilePicture: userData.profilePicture || null,
    });
    const [newProfilePicture, setNewProfilePicture] = useState(null);

    useEffect(() => {
        // Извличане на най-новите данни от базата данни при първоначално зареждане на страницата
        const fetchUserData = async () => {
            if (!userData || !userData.handle) {  // Проверете дали данните вече са налични
                try {
                    const freshUserData = await getUserData(user.uid);
                    setProfile({
                        handle: freshUserData.handle || '',
                        lastName: freshUserData.lastName || '',
                        phoneNumber: freshUserData.phoneNumber || '',
                        profilePicture: freshUserData.profilePicture || null,
                    });
                    setAppState(prevState => ({
                        ...prevState,
                        userData: freshUserData,
                    }));
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };

        fetchUserData();
    }, [user.uid, setAppState, userData]); // Уверете се, че се извиква само когато данните не са налични

    const updateProfile = (key, value) => {
        setProfile({
            ...profile,
            [key]: value,
        });
    };

    const handleSaveProfile = async () => {
        if (userData.isBlocked) {
            alert('Your account is blocked. You cannot edit your profile.');
            return;
        }

        try {
            let profilePictureUrl = profile.profilePicture;
            if (newProfilePicture) {
                profilePictureUrl = await uploadProfilePhoto(user.uid, newProfilePicture);
                setProfile(prevProfile => ({
                    ...prevProfile,
                    profilePicture: profilePictureUrl, 
                }));
            }

            await saveUserDetails({
                handle: profile.handle,  
                uid: user.uid,
                email: user.email,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber,
                profilePicture: profilePictureUrl,
            });

            setAppState(prevState => ({
                ...prevState,
                userData: {
                    ...prevState.userData,
                    handle: profile.handle,
                    lastName: profile.lastName,
                    phoneNumber: profile.phoneNumber,
                    profilePicture: profilePictureUrl,
                },
            }));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewProfilePicture(e.target.files[0]);
        }
    };

    return (
        <div className="profile-edit-page">
            <h1>Edit Profile</h1>
            <div className="form-section">
                <div className="profile-picture-section">
                    <img
                        src={profile.profilePicture || defaultProfilePicture}
                        alt="Profile"
                        className="profile-image"
                    />
                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                </div>
                <label htmlFor="handle">First Name (Username): </label>
                <input
                    className="input-field"
                    value={profile.handle}  
                    onChange={e => updateProfile('handle', e.target.value)}  
                    type="text"
                    name="handle"
                    id="handle"
                    placeholder="Enter your first name or username"
                /><br />
                <label htmlFor="lastName">Last Name: </label>
                <input
                    className="input-field"
                    value={profile.lastName}
                    onChange={e => updateProfile('lastName', e.target.value)}
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter your last name"
                /><br />
                <label htmlFor="phoneNumber">Phone Number: </label>
                <input
                    className="input-field"
                    value={profile.phoneNumber}
                    onChange={e => updateProfile('phoneNumber', e.target.value)}
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                /><br />
                <button className="save-profile-btn" onClick={handleSaveProfile}>Save</button>
            </div>
        </div>
    );
}
