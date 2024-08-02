import { useContext, useState } from "react";
import { createPost as apiCreatePost } from "../services/posts.service";
import { AppContext } from '../state/app.context';

export default function CreatePostComponent() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: '',
  });
  const { userData } = useContext(AppContext);

  const updatePost = (key, value) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const handleCreatePost = async () => {
    if (!userData) {
      alert('You must be logged in to create a post.');
      return;
    }

    if (post.title.trim().length < 3) {
      alert('Title too short!');
      return;
    }
    if (post.content.trim().length < 3) {
      alert('Content too short!');
      return;
    }
    if (post.category === '') {
      alert('Please select a category!');
      return;
    }

    try {
      await apiCreatePost(userData.handle, post.title, post.content, post.category);
      setPost({ title: '', content: '', category: '' });
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div>
      <h1>Create post</h1>
      <label htmlFor="title">Title: </label>
      <input value={post.title} onChange={e => updatePost('title', e.target.value)} type="text" name="title" id="title" /><br />
      <label htmlFor="content">Content: </label>
      <textarea value={post.content} onChange={e => updatePost('content', e.target.value)} name="content" id="content" /><br />
      <label htmlFor="category">Category: </label>
      <select value={post.category} onChange={e => updatePost('category', e.target.value)} name="category" id="category">
        <option value="">Select a category</option>
        <option value="Soups">Soups</option>
        <option value="Salads">Salads</option>
        <option value="Main courses">Main courses</option>
        <option value="Vegetarian">Vegetarian</option>
      </select><br /><br />
      <button onClick={handleCreatePost}>Create</button>
    </div>
  );
}
