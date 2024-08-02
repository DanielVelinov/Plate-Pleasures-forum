import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { getUserByHandle } from '../services/users.service'; // Import the function
import Comments from './Comments';
import { dislikePost, likePost } from '../services/posts.service';

export default function Post({ post }) {
  const { userData } = useContext(AppContext);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserByHandle(post.author);
      setAuthorName(user?.name || post.author); 
    };

    fetchUser();
  }, [post.author]);

  const toggleLike = async () => {
    const isLiked = post.likedBy.includes(userData.handle);
    try {
      if (isLiked) {
        await dislikePost(userData.handle, post.id);
      } else {
        await likePost(userData.handle, post.id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>{post.title}</h3>
      <p>Category: {post.category}</p>
      <p>{post.content}</p>
      <p>Posted By: {authorName} on {new Date(post.createdOn).toLocaleDateString()}</p> 
      <button onClick={toggleLike}>
        {post.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}
      </button>
      <Comments postId={post.id} />
      <p>Created on: {new Date(post.createdOn).toLocaleDateString()}</p>
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
  }).isRequired
};