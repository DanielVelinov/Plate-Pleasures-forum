import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getComments, addComment } from '../services/posts.service';
import { getUserNameByHandle } from '../services/users.service';
import { AppContext } from '../state/app.context';

const Comments = ({ postId, limit = 3 }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [userNames, setUserNames] = useState({});
  const { userData } = useContext(AppContext);

  const fetchUserNames = async (commentsData) => {
    const handles = commentsData.map(comment => comment.userHandle);
    const uniqueHandles = [...new Set(handles)];
    const names = {};

    try {
      await Promise.all(uniqueHandles.map(async (handle) => {
        const name = await getUserNameByHandle(handle);
        names[handle] = name;
      }));
    } catch (error) {
      console.error('Failed to fetch user names:', error);
    }

    setUserNames(names);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(postId);
        setComments(commentsData);
        await fetchUserNames(commentsData);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() && userData?.handle) {
      try {
        await addComment(postId, newComment, userData.handle);
        setNewComment('');
        const commentsData = await getComments(postId);
        setComments(commentsData);
        await fetchUserNames(commentsData);
      } catch (error) {
        console.error('Failed to add comment:', error);
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
            <p><strong>{userNames[comment.userHandle] || comment.userHandle}:</strong> {comment.content}</p>
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
};

export default Comments;
