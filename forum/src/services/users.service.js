import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = async (handle) => {
  try {
    const snapshot = await get(ref(db, `users/${handle}`));
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching user by handle:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const createUserHandle = async (handle, uid, email) => {
  const user = { handle, uid, email, createdOn: new Date().toString() };
  try {
    await set(ref(db, `users/${handle}`), user);
  } catch (error) {
    console.error('Error creating user handle:', error);
    throw new Error('Unable to create user handle.');
  }
};

export const getUserData = async (uid) => {
  try {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Unable to fetch user data.');
  }
};

export const getUserNameByHandle = async (handle) => {
  try {
    const user = await getUserByHandle(handle);
    return user?.name || handle; // Assuming `name` is the field for the user's name
  } catch (error) {
    console.error('Error fetching user name by handle:', error);
    throw new Error('Unable to fetch user name.');
  }
};
