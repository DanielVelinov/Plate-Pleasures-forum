
import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { AppContext } from '../state/app.context';
import { updatePost } from '../services/posts.service';

export default function EditPost({ post, onSave }) {
    const { userData } = useContext(AppContext);
    const [editedPost, setEditedPost] = useState({
        title: post.title,
        content: post.content,
        category: post.category,
    });

    const updateEditedPost = (key, value) => {
        setEditedPost({
            ...editedPost,
            [key]: value,
        });
    };

    const handleSave = async () => {
        if (!userData) {
            alert('You must be logged in to edit a post.');
            return;
        }

        if (editedPost.title.trim().length < 16 || editedPost.title.trim().length > 64) {
            alert('The title must be between 16 and 64 symbols');
            return;
        }
        if (editedPost.content.trim().length < 32 || editedPost.content.trim().length > 8192) {
            alert('Content too short!');
            return;
        }
        if (editedPost.category === '') {
            alert('Please select a category!');
            return;
        }

        try {
            await updatePost(post.id, editedPost);
            alert('Post updated successfully!');
            onSave(); 
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('Failed to update post. Please try again.');
        }
    };

    return (
        <div>
            <h1>Edit post</h1>
            <label htmlFor="title">Title: </label>
            <input
                value={editedPost.title}
                onChange={e => updateEditedPost('title', e.target.value)}
                type="text"
                name="title"
                id="title"
            /><br />
            <label htmlFor="content">Content: </label>
            <textarea
                value={editedPost.content}
                onChange={e => updateEditedPost('content', e.target.value)}
                name="content"
                id="content"
            /><br />
            <label htmlFor="category">Category: </label>
            <select
                value={editedPost.category}
                onChange={e => updateEditedPost('category', e.target.value)}
                name="category"
                id="category"
            >
                <option value="">Select a category</option>
                <option value="Soups">Soups</option>
                <option value="Salads">Salads</option>
                <option value="Main courses">Main courses</option>
                <option value="Vegetarian">Vegetarian</option>
            </select><br /><br />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

EditPost.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};
