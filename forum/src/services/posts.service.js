import { ref, push, get, set, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createPost = async (author, title, content, category) => {
  const post = { 
    author,title, content, category, createdOn: new Date().toISOString(), likedBy: {} 
  };

  try {
    const postRef = await push(ref(db, 'posts'), post);
    const id = postRef.key; 
    await update(ref(db, `posts/${id}`), { id });

    console.log('Post created successfully:', id);
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post.');
  }
};

export const getAllPosts = async (search = '') => {
  try {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists()) return []; 

    const posts = Object.values(snapshot.val());
    console.log('Fetched posts:', posts); 

    if (search) {
      
      return posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()));
    }

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Unable to fetch posts.');
  }
};


export const getPostById = async (id) => {
  const snapshot = await get(ref(db, `posts/${id}`));
  if (!snapshot.exists()) {
    throw new Error('Post not found!');
  }

  const post = snapshot.val();
  post.likedBy = Object.keys(post.likedBy ?? {});
  return post;
};

export const likePost = (handle, postId) => {
  const updateObject = {
    [`posts/${postId}/likedBy/${handle}`]: true,
    [`users/${handle}/likedPosts/${postId}`]: true,
  };

  return update(ref(db), updateObject);
};

export const dislikePost = (handle, postId) => {
  const updateObject = {
    [`posts/${postId}/likedBy/${handle}`]: null,
    [`users/${handle}/likedPosts/${postId}`]: null,
  };

  return update(ref(db), updateObject);
};

export const addComment = async (postId, content, userHandle) => {
  const comment = { content, userHandle, timestamp: new Date().toISOString() };
  const commentsRef = ref(db, `posts/${postId}/comments`);
  const newCommentRef = push(commentsRef);
  await set(newCommentRef, comment);
};

export const getComments = async (postId) => {
  const commentsRef = ref(db, `posts/${postId}/comments`);
  const snapshot = await get(commentsRef);
  if (!snapshot.exists()) return [];

  const comments = snapshot.val();
  return Object.keys(comments).map(key => ({
    id: key,
    ...comments[key],
  }));
};
// export const createPost = async (title, content) => {
//   const response = await fetch('http://127.0.0.1:3000/posts', {
//     method: 'POST',
//     body: JSON.stringify({ title, content }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// export const getAllPosts = async (search = '') => {
//   const response = await fetch(`http://127.0.0.1:3000/posts?search=${search}`);

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// export const getPostById = async (id) => {
//   const response = await fetch(`http://127.0.0.1:3000/posts/${id}`);

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// /**
//  * 
//  * @param {{
// *  id: number,
// *  title: string,
// *  content: string,
// *  createdOn: string,
// *  liked: boolean
// * }} post
//  * @returns 
//  */
// export const updatePost = async (post) => {
//   const response = await fetch(`http://127.0.0.1:3000/posts/${post.id}`, {
//     method: 'PUT',
//     body: JSON.stringify(post),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };
