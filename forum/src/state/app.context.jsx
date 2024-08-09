import React, { createContext, useState, useEffect } from 'react';
import { getUserData } from '../services/users.service';
import { auth } from '../config/firebase-config';

export const AppContext = createContext({
  user: null,
  userData: null,
  setAppState: () => {},
  isAdmin: false,
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userDetails = await getUserData(currentUser.uid);
          if (userDetails) {
            setUserData(userDetails);
            setIsAdmin(userDetails.isAdmin || false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const setAppState = (newState) => {
    setUserData((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <AppContext.Provider value={{ user, userData, setAppState, isAdmin }}>
      {children}
    </AppContext.Provider>
  );
};
