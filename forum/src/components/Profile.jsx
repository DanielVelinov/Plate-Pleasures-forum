import React from 'react';
import profilePicture from '../assets/profile-picture.jpg/Logo.png'; // Проверете дали файлът съществува и пътят е правилен

const Profile = () => {
    return (
        <div className="profile-info">
            <img src={profilePicture} alt="Profile" className="profile-image" />
            <span>Добре дошли, потребител!</span>
        </div>
    );
}

export default Profile;
