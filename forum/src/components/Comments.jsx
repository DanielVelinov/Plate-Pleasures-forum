import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getComments, addComment, deleteComment } from '../services/posts.service';
import { getUserNameByHandle } from '../services/users.service'; 
import { AppContext } from '../state/app.context';

const Comments = ({ postId, limit = 3, postAuthor }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [userNames, setUserNames] = useState({});
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(postId);
      setComments(commentsData);

      const handles = commentsData.map(comment => comment.userHandle);
      const uniqueHandles = [...new Set(handles)];
      const names = {};

      await Promise.all(uniqueHandles.map(async (handle) => {
        const name = await getUserNameByHandle(handle);
        names[handle] = name;
      }));

      setUserNames(names);
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(postId, newComment, userData.handle);
      setNewComment('');
      const commentsData = await getComments(postId);
      setComments(commentsData);

      const handles = commentsData.map(comment => comment.userHandle);
      const uniqueHandles = [...new Set(handles)];
      const names = {};

      await Promise.all(uniqueHandles.map(async (handle) => {
        const name = await getUserNameByHandle(handle);
        names[handle] = name;
      }));

      setUserNames(names);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(postId, commentId);
        setComments(comments.filter(comment => comment.id !== commentId)); // Remove the comment from the state
      } catch (error) {
        console.error('Failed to delete comment:', error);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  const displayedComments = showAll ? comments : comments.slice(0, limit);

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {displayedComments.map(comment => (
          <li key={comment.id}>
            <p>
              <strong>{userNames[comment.userHandle] || comment.userHandle}:</strong> {comment.content}
              {(userData.handle === comment.userHandle || userData.handle === postAuthor) && (
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              )}
            </p>
          </li>
        ))}
      </ul>
      {comments.length > limit && (
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      )}
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  limit: PropTypes.number,
  postAuthor: PropTypes.string.isRequired, 
};

export default Comments;
