// import React, { useState, useEffect, useContext } from 'react';
// import PropTypes from 'prop-types';
// import {
//   getComments,
//   addComment,
//   deleteComment,
//   addReply,
//   deleteReply,
// } from '../services/posts.service';
// import { getUserNameByHandle } from '../services/users.service'; 
// import { AppContext } from '../state/app.context';

// const Comments = ({ postId, limit = 3, postAuthor }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [showAll, setShowAll] = useState(false);
//   const [userNames, setUserNames] = useState({});
//   const { userData } = useContext(AppContext);
//   const [replyText, setReplyText] = useState({});
//   const [showReplyInput, setShowReplyInput] = useState({});

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const commentsData = await getComments(postId);
//         setComments(commentsData);
//         await fetchUserNames(commentsData);
//       } catch (error) {
//         console.error('Error fetching comments:', error);
//       }
//     };

//     fetchComments();
//   }, [postId]);

//   const fetchUserNames = async (commentsData) => {
//     const handles = commentsData.flatMap(comment => [
//       comment.userHandle,
//       ...Object.values(comment.replies || {}).map(reply => reply.userHandle)
//     ]);

//     const uniqueHandles = [...new Set(handles)];
//     const names = {};

//     await Promise.all(uniqueHandles.map(async (handle) => {
//       const name = await getUserNameByHandle(handle);
//       names[handle] = name;
//     }));

//     setUserNames(names);
//   };

//   const handleAddComment = async () => {
//     if (newComment.trim()) {
//       try {
//         await addComment(postId, newComment, userData.handle);
//         setNewComment('');
//         const commentsData = await getComments(postId);
//         setComments(commentsData);
//         await fetchUserNames(commentsData);
//       } catch (error) {
//         console.error('Error adding comment:', error);
//         alert('Failed to add comment. Please try again.');
//       }
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (window.confirm('Are you sure you want to delete this comment?')) {
//       try {
//         await deleteComment(postId, commentId);
//         setComments(comments.filter(comment => comment.id !== commentId)); 
//       } catch (error) {
//         console.error('Failed to delete comment:', error);
//         alert('Failed to delete comment. Please try again.');
//       }
//     }
//   };

//   const handleAddReply = async (commentId) => {
//     if (replyText[commentId]?.trim()) {
//       try {
//         await addReply(postId, commentId, replyText[commentId], userData.handle);
//         setReplyText(prev => ({ ...prev, [commentId]: '' }));
//         const commentsData = await getComments(postId);
//         setComments(commentsData);
//         await fetchUserNames(commentsData);
//       } catch (error) {
//         console.error('Error adding reply:', error);
//         alert('Failed to add reply. Please try again.');
//       }
//     }
//   };

//   const handleDeleteReply = async (commentId, replyId) => {
//     if (window.confirm('Are you sure you want to delete this reply?')) {
//       try {
//         await deleteReply(postId, commentId, replyId);
//         const commentsData = await getComments(postId);
//         setComments(commentsData);
//         await fetchUserNames(commentsData);
//       } catch (error) {
//         console.error('Failed to delete reply:', error);
//         alert('Failed to delete reply. Please try again.');
//       }
//     }
//   };

//   const handleShowReplyInput = (commentId) => {
//     setShowReplyInput((prevState) => ({
//       ...prevState,
//       [commentId]: !prevState[commentId],
//     }));
//   };

//   const displayedComments = showAll ? comments : comments.slice(0, limit);

//   return (
//     <div className="comments-section">
//       <h3 className="comments-title">Comments</h3>
//       <ul className="comments-list">
//         {displayedComments.map(comment => (
//           <li key={comment.id} className="comment-item">
//             <p>
//               <strong>{userNames[comment.userHandle] || comment.userHandle}:</strong> {comment.content}
//               {(userData.handle === comment.userHandle || userData.handle === postAuthor) && (
//                 <button className="comment-delete-btn" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
//               )}
//               <button className="comment-reply-btn" onClick={() => handleShowReplyInput(comment.id)}>Reply</button>
//             </p>
//             {showReplyInput[comment.id] && (
//               <div className="reply-input-section">
//                 <input
//                   type="text"
//                   className="reply-input"
//                   value={replyText[comment.id] || ''}
//                   onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
//                   placeholder="Add a reply"
//                 />
//                 <button className="add-reply-btn" onClick={() => handleAddReply(comment.id)}>Reply</button>
//               </div>
//             )}
//             {comment.replies && Object.keys(comment.replies).map(replyId => (
//               <div key={replyId} className="reply-item">
//                 <p>
//                   <strong>{userNames[comment.replies[replyId].userHandle] || comment.replies[replyId].userHandle}:</strong> {comment.replies[replyId].content}
//                   {(userData.handle === comment.replies[replyId].userHandle || userData.handle === postAuthor) && (
//                     <button className="reply-delete-btn" onClick={() => handleDeleteReply(comment.id, replyId)}>Delete</button>
//                   )}
//                 </p>
//               </div>
//             ))}
//           </li>
//         ))}
//       </ul>
//       {comments.length > limit && (
//         <button className="toggle-comments-btn" onClick={() => setShowAll(!showAll)}>
//           {showAll ? 'Show Less' : 'Show All'}
//         </button>
//       )}
//       <div className="comment-input-section">
//         <input
//           type="text"
//           className="comment-input"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Add a comment"
//         />
//         <button className="add-comment-btn" onClick={handleAddComment}>Comment</button>
//       </div>
//     </div>
//   );
// };

// Comments.propTypes = {
//   postId: PropTypes.string.isRequired,
//   limit: PropTypes.number,
//   postAuthor: PropTypes.string.isRequired, 
// };

// export default Comments;
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  getComments,
  addComment,
  deleteComment,
  addReply,
  deleteReply,
} from '../services/posts.service';
import { getUserNameByHandle } from '../services/users.service'; 
import { AppContext } from '../state/app.context';

const Comments = ({ postId, limit = 3, postAuthor }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [userNames, setUserNames] = useState({});
  const { userData } = useContext(AppContext);
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(postId);
        setComments(commentsData);
        await fetchUserNames(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const fetchUserNames = async (commentsData) => {
    const handles = commentsData.flatMap(comment => [
      comment.userHandle,
      ...Object.values(comment.replies || {}).map(reply => reply.userHandle)
    ]);

    const uniqueHandles = [...new Set(handles)];
    const names = {};

    await Promise.all(uniqueHandles.map(async (handle) => {
      const name = await getUserNameByHandle(handle);
      names[handle] = name;
    }));

    setUserNames(names);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      // Проверка за блокиран акаунт
      if (userData.isBlocked) {
        alert('Your account is blocked. You cannot add comments.');
        return;
      }

      try {
        await addComment(postId, newComment, userData.handle);
        setNewComment('');
        const commentsData = await getComments(postId);
        setComments(commentsData);
        await fetchUserNames(commentsData);
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(postId, commentId);
        setComments(comments.filter(comment => comment.id !== commentId)); 
      } catch (error) {
        console.error('Failed to delete comment:', error);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  const handleAddReply = async (commentId) => {
    if (replyText[commentId]?.trim()) {
      // Проверка за блокиран акаунт
      if (userData.isBlocked) {
        alert('Your account is blocked. You cannot add replies.');
        return;
      }

      try {
        await addReply(postId, commentId, replyText[commentId], userData.handle);
        setReplyText(prev => ({ ...prev, [commentId]: '' }));
        const commentsData = await getComments(postId);
        setComments(commentsData);
        await fetchUserNames(commentsData);
      } catch (error) {
        console.error('Error adding reply:', error);
        alert('Failed to add reply. Please try again.');
      }
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await deleteReply(postId, commentId, replyId);
        const commentsData = await getComments(postId);
        setComments(commentsData);
        await fetchUserNames(commentsData);
      } catch (error) {
        console.error('Failed to delete reply:', error);
        alert('Failed to delete reply. Please try again.');
      }
    }
  };

  const handleShowReplyInput = (commentId) => {
    setShowReplyInput((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const displayedComments = showAll ? comments : comments.slice(0, limit);

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments</h3>
      <ul className="comments-list">
        {displayedComments.map(comment => (
          <li key={comment.id} className="comment-item">
            <p>
              <strong>{userNames[comment.userHandle] || comment.userHandle}:</strong> {comment.content}
              {(userData.handle === comment.userHandle || userData.handle === postAuthor) && (
                <button className="comment-delete-btn" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              )}
              <button className="comment-reply-btn" onClick={() => handleShowReplyInput(comment.id)}>Reply</button>
            </p>
            {showReplyInput[comment.id] && (
              <div className="reply-input-section">
                <input
                  type="text"
                  className="reply-input"
                  value={replyText[comment.id] || ''}
                  onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                  placeholder="Add a reply"
                />
                <button className="add-reply-btn" onClick={() => handleAddReply(comment.id)}>Reply</button>
              </div>
            )}
            {comment.replies && Object.keys(comment.replies).map(replyId => (
              <div key={replyId} className="reply-item">
                <p>
                  <strong>{userNames[comment.replies[replyId].userHandle] || comment.replies[replyId].userHandle}:</strong> {comment.replies[replyId].content}
                  {(userData.handle === comment.replies[replyId].userHandle || userData.handle === postAuthor) && (
                    <button className="reply-delete-btn" onClick={() => handleDeleteReply(comment.id, replyId)}>Delete</button>
                  )}
                </p>
              </div>
            ))}
          </li>
        ))}
      </ul>
      {comments.length > limit && (
        <button className="toggle-comments-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      )}
      <div className="comment-input-section">
        <input
          type="text"
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button className="add-comment-btn" onClick={handleAddComment}>Comment</button>
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
