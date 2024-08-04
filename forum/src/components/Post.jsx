
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { getUserByHandle } from '../services/users.service';
import Comments from './Comments';
import EditPost from './EditPost';  
import { dislikePost, likePost, deletePost } from '../services/posts.service';

export default function Post({ post, onDelete }) {
  const { userData } = useContext(AppContext);
  const [authorName, setAuthorName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  

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

    const isLiked = Array.isArray(post.likedBy) && post.likedBy.includes(userData.handle);

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
          onDelete(post.id);
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const formattedDate = new Date(post.createdOn).toLocaleDateString();
  const snippet = post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content;

  return (
    <div>
      <h3>{post.title}</h3>
      <p>Category: {post.category}</p>
      <p>Tags: {post.tags?.join(', ')}</p>
      <p>{isExpanded ? post.content : snippet}</p>
      {post.content.length > 100 && (
        <button onClick={toggleExpanded}>
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
      <p>Posted By: {authorName} on {formattedDate}</p>
      <button onClick={toggleLike}>
        {Array.isArray(post.likedBy) && post.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}
      </button>
      {(userData?.handle === post.author || userData?.isAdmin) && (
        <>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={toggleEdit}>{isEditing ? 'Cancel' : 'Edit'}</button>
        </>
      )}
      {isEditing && <EditPost post={post} onSave={handleSave} />}  
      <Comments postId={post.id} postAuthor={post.author} />
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
    tags: PropTypes.arrayOf(PropTypes.string),  
  }).isRequired,
  onDelete: PropTypes.func,
};
