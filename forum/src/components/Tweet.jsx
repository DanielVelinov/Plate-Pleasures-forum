import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { dislikeTweet, likeTweet } from '../services/tweets.service';
import { getUserByHandle } from '../services/users.service'; // Import the function
import Comments from './Comments';

export default function Tweet({ tweet }) {
  const { userData } = useContext(AppContext);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserByHandle(tweet.author);
      setAuthorName(user?.name || tweet.author); // Assuming `name` is the field for the user's name
    };

    fetchUser();
  }, [tweet.author]);

  const toggleLike = async () => {
    const isLiked = tweet.likedBy.includes(userData.handle);
    try {
      if (isLiked) {
        await dislikeTweet(userData.handle, tweet.id);
      } else {
        await likeTweet(userData.handle, tweet.id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>{tweet.title}</h3>
      <p>{tweet.content}</p>
      <h2>Posted By: {authorName}</h2> 
      <button onClick={toggleLike}>
        {tweet.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}
      </button>
      <Comments tweetId={tweet.id} />
      <p>Created on: {new Date(tweet.createdOn).toLocaleDateString()}</p>
    </div>
  );
}

Tweet.propTypes = {
  tweet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired, 
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    likedBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired
};