import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { getUserByHandle } from '../services/users.service';
import Comments from './Comments';
import { dislikePost, likePost, deletePost } from '../services/posts.service';

export default function Post({ post, onDelete }) { // Accept onDelete prop
  const { userData } = useContext(AppContext);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserByHandle(post.author);
        setAuthorName(user?.name || post.author);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [post.author]);

  const toggleLike = async () => {
    if (!userData) {
      alert('You must be logged in to like a post.');
      return;
    }

    const isLiked = (post.likedBy || []).includes(userData.handle); // Ensure likedBy is always an array

    try {
      if (isLiked) {
        await dislikePost(userData.handle, post.id);
      } else {
        await likePost(userData.handle, post.id);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      alert('Failed to like/dislike post. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
        if (onDelete) {
          onDelete(post.id); // Call onDelete callback if provided
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const formattedDate = new Date(post.createdOn).toLocaleDateString();

  return (
    <div>
      <h3>{post.title}</h3>
      <p>Category: {post.category}</p>
      <p>{post.content}</p>
      <p>Posted By: {authorName} on {formattedDate}</p>
      <button onClick={toggleLike}>
        {(post.likedBy || []).includes(userData?.handle) ? 'Dislike' : 'Like'} {/* Ensure likedBy is an array */}
      </button>
      {userData?.handle === post.author && ( // Show delete button only for post author
        <button onClick={handleDelete}>Delete</button>
      )}
      <Comments postId={post.id} />
      <p>Created on: {formattedDate}</p>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    likedBy: PropTypes.arrayOf(PropTypes.string), // Ensure likedBy is an array
  }).isRequired,
  onDelete: PropTypes.func, // Optional onDelete prop
};
