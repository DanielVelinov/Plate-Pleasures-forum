
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { getUserByHandle } from '../services/users.service';
import Comments from './Comments';
import EditPost from './EditPost';
import { dislikePost, likePost, deletePost } from '../services/posts.service';
import { Link } from 'react-router-dom';

export default function Post({ post, onDelete }) {
    const { userData } = useContext(AppContext);
    const [authorName, setAuthorName] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [likedBy, setLikedBy] = useState(post.likedBy || []);

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


        if (userData.isBlocked) {
            alert('Your account is blocked. You cannot like posts.');
            return;
        }

        const isLiked = Array.isArray(likedBy) && likedBy.includes(userData.handle);

        try {
            if (isLiked) {
                await dislikePost(userData.handle, post.id);
                setLikedBy(likedBy.filter(handle => handle !== userData.handle));
            } else {
                await likePost(userData.handle, post.id);
                setLikedBy([...likedBy, userData.handle]);
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
        <div className="post-card">
            <Link to={`/posts/${post.id}`}>
                <h3 className="post-title">{post.title}</h3>
            </Link> 
            <p className="post-category">Category: {post.category}</p>
            <p className="post-tags">Tags: {post.tags?.join(', ')}</p>
            <p className="post-content">{isExpanded ? post.content : snippet}</p>
            {post.content.length > 100 && (
                <button className="toggle-content-btn" onClick={toggleExpanded}>
                    {isExpanded ? 'See Less' : 'See More'}
                </button>
            )}
            <p className="post-author">Posted By: {authorName} on {formattedDate}</p>
            <button className="like-btn" onClick={toggleLike}>
                {Array.isArray(likedBy) && likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}
            </button>
            <span>{likedBy.length} {likedBy.length === 1 ? ' Like' : ' Likes'}</span>
            {(userData?.handle === post.author || userData?.isAdmin) && (
                <>
                    <button className="delete-btn" onClick={handleDelete}>Delete</button>
                    <button className="edit-btn" onClick={toggleEdit}>{isEditing ? 'Cancel' : 'Edit'}</button>
                </>
            )}
            {isEditing && <EditPost post={post} onSave={handleSave} />}
            <Comments postId={post.id} postAuthor={post.author} />
            <p className="post-date">Created on: {formattedDate}</p>
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
        comments: PropTypes.object,
    }).isRequired,
    onDelete: PropTypes.func,
};



