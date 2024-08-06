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
            return posts.filter(
                post => post.title.toLowerCase().includes(search.toLowerCase()) ||
                    post.tags.some(tag => tag.includes(search.toLowerCase())) // Search by tag
            );
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

export const addReply = async (postId, commentId, content, userHandle) => {
    const reply = { content, userHandle, timestamp: new Date().toISOString() };
    const repliesRef = dbRef(db, `posts/${postId}/comments/${commentId}/replies`);
    const newReplyRef = push(repliesRef);

    try {
        await set(newReplyRef, reply);
        console.log('Reply added successfully:', reply);
    } catch (error) {
        console.error('Error adding reply:', error);
        throw new Error('Unable to add reply.');
    }
};

export const getReplies = async (postId, commentId) => {
    const repliesRef = dbRef(db, `posts/${postId}/comments/${commentId}/replies`);

    try {
        const snapshot = await get(repliesRef);
        if (!snapshot.exists()) return [];

        const replies = snapshot.val();
        return Object.keys(replies).map(key => ({
            id: key,
            ...replies[key],
        }));
    } catch (error) {
        console.error('Error fetching replies:', error);
        throw new Error('Unable to fetch replies.');
    }
};


export const deleteReply = async (postId, commentId, replyId) => {
    try {
        await remove(dbRef(db, `posts/${postId}/comments/${commentId}/replies/${replyId}`));
        console.log('Reply deleted successfully:', replyId);
    } catch (error) {
        console.error('Error deleting reply:', error);
        throw new Error('Failed to delete reply.');
    }
};

export const likeComment = async (postId, commentId, userHandle) => {
  const likesRef = dbRef(db, `posts/${postId}/comments/${commentId}/likes/${userHandle}`);
  try {
    await set(likesRef, true);
    console.log(`Comment ${commentId} liked by user ${userHandle}`);
  } catch (error) {
    console.error('Error liking comment:', error);
    throw new Error('Unable to like comment.');
  }
};

export const unlikeComment = async (postId, commentId, userHandle) => {
  const likesRef = dbRef(db, `posts/${postId}/comments/${commentId}/likes/${userHandle}`);
  try {
    await remove(likesRef);
    console.log(`Comment ${commentId} unliked by user ${userHandle}`);
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw new Error('Unable to unlike comment.');
  }
};

export const getCommentLikes = async (postId, commentId) => {
  const likesRef = dbRef(db, `posts/${postId}/comments/${commentId}/likes`);
  try {
    const snapshot = await get(likesRef);
    if (!snapshot.exists()) return {};
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching comment likes:', error);
    throw new Error('Unable to fetch comment likes.');
  }
};
