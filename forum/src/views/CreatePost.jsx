import { useContext, useState } from "react";
import { createPost as apiCreatePost } from "../services/posts.service"; // Use alias to avoid conflict
import { AppContext } from '../state/app.context';

// Renaming the function to avoid naming conflict
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
    if (post.title.length < 3) {
      return alert('Title too short!');
    }
    if (post.content.length < 3) {
      return alert('Content too short!');
    }
    if (post.category === '') {
      return alert('Please select a category!');
    }

    try {
      // Using the imported function with an alias to avoid conflict
      await apiCreatePost(userData.handle, post.title, post.content, post.category);
      setPost({ title: '', content: '', category: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Create post</h1>
      <label htmlFor="title">Title: </label>
      <input value={post.title} onChange={e => updatePost('title', e.target.value)} type="text" name="title" id="title" /><br/>
      <label htmlFor="content">Content: </label>
      <textarea value={post.content} onChange={e => updatePost('content', e.target.value)} name="content" id="content" /><br/>
      <label htmlFor="category">Category: </label>
      <select value={post.category} onChange={e => updatePost('category', e.target.value)} name="category" id="category">
        <option value="">Select a category</option>
        <option value="Soups">Soups</option>
        <option value="Salads">Salads</option>
        <option value="Main courses">Main courses</option>
        <option value="Vegetarian">Vegetarian</option>
      </select><br/><br/>
      <button onClick={handleCreatePost}>Create</button>
    </div>
  );
} 
