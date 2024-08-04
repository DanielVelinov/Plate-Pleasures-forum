import { ref as dbRef, push, get, set, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config';


export const getAllPosts = async (search = '') => {
  try {
    const snapshot = await get(dbRef(db, 'posts'));
    if (!snapshot.exists()) return [];

    const posts = Object.values(snapshot.val()).map(post => ({
      ...post,
      likedBy: post.likedBy ? Object.keys(post.likedBy) : [], 
    }));

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


export const createPost = async (author, title, content, category, tags = []) => {
  const post = {
    author,
    title,
    content,
    category,
    tags,  
    createdOn: new Date().toISOString(),
    likedBy: {}
  };

  try {
    const postRef = await push(dbRef(db, 'posts'), post);
    const id = postRef.key;
    await update(dbRef(db, `posts/${id}`), { id });

    console.log('Post created successfully:', id);
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post.');
  }
};


export const updatePost = async (id, updatedData) => {
  try {
    await update(dbRef(db, `posts/${id}`), updatedData);
    console.log('Post updated successfully:', id);
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post.');
  }
};


export const addComment = async (postId, content, userHandle) => {
  const comment = { content, userHandle, timestamp: new Date().toISOString() };
  const commentsRef = dbRef(db, `posts/${postId}/comments`);
  const newCommentRef = push(commentsRef);

  try {
    await set(newCommentRef, comment);
    console.log('Comment added successfully:', comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Unable to add comment.');
  }
};


export const getComments = async (postId) => {
  const commentsRef = dbRef(db, `posts/${postId}/comments`);

  try {
    const snapshot = await get(commentsRef);
    if (!snapshot.exists()) return [];

    const comments = snapshot.val();
    return Object.keys(comments).map(key => ({
      id: key,
      ...comments[key],
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Unable to fetch comments.');
  }
};


export const deleteComment = async (postId, commentId) => {
  try {
    await remove(dbRef(db, `posts/${postId}/comments/${commentId}`));
    console.log('Comment deleted successfully:', commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment.');
  }
};


export const likePost = async (handle, postId) => {
  const updateObject = {
    [`posts/${postId}/likedBy/${handle}`]: true,
    [`users/${handle}/likedPosts/${postId}`]: true,
  };

  try {
    await update(dbRef(db), updateObject);
    console.log(`Post ${postId} liked by user ${handle}`);
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Unable to like post.');
  }
};


export const dislikePost = async (handle, postId) => {
  const updateObject = {
    [`posts/${postId}/likedBy/${handle}`]: null,
    [`users/${handle}/likedPosts/${postId}`]: null,
  };

  try {
    await update(dbRef(db), updateObject);
    console.log(`Post ${postId} disliked by user ${handle}`);
  } catch (error) {
    console.error('Error disliking post:', error);
    throw new Error('Unable to dislike post.');
  }
};


export const deletePost = async (postId) => {
  try {
    await remove(dbRef(db, `posts/${postId}`));
    console.log('Post deleted successfully:', postId);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post.');
  }
};


export const getPostById = async (id) => {
  try {
    const snapshot = await get(dbRef(db, `posts/${id}`));
    if (!snapshot.exists()) {
      throw new Error('Post not found!');
    }

    const post = snapshot.val();
    post.likedBy = post.likedBy ? Object.keys(post.likedBy) : [];
    return post;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw new Error('Unable to fetch post.');
  }
};
