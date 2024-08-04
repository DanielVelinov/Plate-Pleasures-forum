import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { getUserByHandle } from '../services/users.service';
import Comments from './Comments';
import { dislikePost, likePost, deletePost } from '../services/posts.service';

export default function Post({ post, onDelete }) {
  const { userData } = useContext(AppContext);
  const [authorName, setAuthorName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPost, setCurrentPost] = useState(post); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserByHandle(currentPost.author);
        setAuthorName(user?.name || currentPost.author);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [currentPost.author]);

  const toggleLike = async () => {
    if (!userData) {
      alert('You must be logged in to like a post.');
      return;
    }

    const isLiked = Array.isArray(currentPost.likedBy) && currentPost.likedBy.includes(userData.handle);

    try {
      if (isLiked) {
        await dislikePost(userData.handle, currentPost.id);
        setCurrentPost({
          ...currentPost,
          likedBy: currentPost.likedBy.filter(handle => handle !== userData.handle),
        });
      } else {
        await likePost(userData.handle, currentPost.id);
        setCurrentPost({
          ...currentPost,
          likedBy: [...currentPost.likedBy, userData.handle],
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      alert('Failed to like/dislike post. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(currentPost.id);
        if (onDelete) {
          onDelete(currentPost.id);
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formattedDate = new Date(currentPost.createdOn).toLocaleDateString();
  const snippet = currentPost.content.length > 100 ? `${currentPost.content.substring(0, 100)}...` : currentPost.content;

  return (
    <div>
      <h3>{currentPost.title}</h3>
      <p>Category: {currentPost.category}</p>
      <p>{isExpanded ? currentPost.content : snippet}</p>
      {currentPost.content.length > 100 && (
        <button onClick={toggleExpanded}>
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
      <p>Posted By: {authorName} on {formattedDate}</p>
      <p>Likes: {currentPost.likedBy.length} Comments: {Object.keys(currentPost.comments || {}).length}</p>
      <button onClick={toggleLike}>
        {Array.isArray(currentPost.likedBy) && currentPost.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}
      </button>
      {userData?.handle === currentPost.author && (
        <button onClick={handleDelete}>Delete</button>
      )}
      <Comments postId={currentPost.id} postAuthor={currentPost.author} />
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
    likedBy: PropTypes.arrayOf(PropTypes.string), 
    comments: PropTypes.object,
  }).isRequired,
  onDelete: PropTypes.func,
};
