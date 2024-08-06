import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, deletePost, likePost, dislikePost } from '../services/posts.service';
import Comments from './Comments';
import { useContext } from 'react';
import { AppContext } from '../state/app.context';

export default function SinglePost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const [post, setPost] = useState(null);
    const [likedBy, setLikedBy] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const postData = await getPostById(id);
                setPost(postData);
                setLikedBy(postData.likedBy || []);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                setError('Failed to load the post. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = async () => {
        if (!userData) {
            alert('You must be logged in to like a post.');
            return;
        }

        try {
            if (likedBy.includes(userData.handle)) {
                await dislikePost(userData.handle, id);
                setLikedBy(likedBy.filter(handle => handle !== userData.handle));
            } else {
                await likePost(userData.handle, id);
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
                await deletePost(id);
                navigate('/posts'); 
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Failed to delete post. Please try again.');
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>Post not found.</p>;
    }

    const formattedDate = new Date(post.createdOn).toLocaleDateString();
    const isLiked = likedBy.includes(userData?.handle);

    return (
        <div className="single-post">
            <h1>{post.title}</h1>
            <p>Category: {post.category}</p>
            <p>Tags: {post.tags?.join(', ')}</p>
            <p>{post.content}</p>
            <p>Posted by: {post.author} on {formattedDate}</p>
            <button onClick={handleLike}>
                {isLiked ? 'Dislike' : 'Like'}
            </button>
            <span>{likedBy.length} {likedBy.length === 1 ? 'Like' : 'Likes'}</span>
            {(userData?.handle === post.author || userData?.isAdmin) && (
                <>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
            <Comments postId={post.id} postAuthor={post.author} />
        </div>
    );
}

