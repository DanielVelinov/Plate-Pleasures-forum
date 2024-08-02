import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getComments, addComment } from '../services/tweets.service';
import { getUserNameByHandle } from '../services/users.service'; // Import the function
import { AppContext } from '../state/app.context';

const Comments = ({ tweetId, limit = 3 }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [userNames, setUserNames] = useState({});
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(tweetId);
      setComments(commentsData);
      
      // Fetch user names for the comments
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
  }, [tweetId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(tweetId, newComment, userData.handle);
      setNewComment('');
      const commentsData = await getComments(tweetId);
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
  tweetId: PropTypes.string.isRequired,
  limit: PropTypes.number,
};

export default Comments;
