
import { useContext, useState } from "react";
import { createPost as apiCreatePost } from "../services/posts.service";
import { AppContext } from '../state/app.context';

export default function CreatePostComponent() {
  const titleMinLength = 16;
  const titleMaxLength = 64;
  const contentMinLength = 32;
  const contentMaxLength = 8192;

  const [post, setPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],  
  });
  const [tagInput, setTagInput] = useState('');
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

    if (post.title.trim().length < titleMinLength || post.title.trim().length > titleMaxLength) {
      alert('The title must be between 16 and 64 symbols');
      return;
    }
    if (post.content.trim().length < contentMinLength || post.content.trim().length > contentMaxLength) {
      alert('Content too short!');
      return;
    }
    if (post.category === '') {
      alert('Please select a category!');
      return;
    }

    try {
      await apiCreatePost(userData.handle, post.title, post.content, post.category, post.tags);  
      setPost({ title: '', content: '', category: '', tags: [] });
      setTagInput('');
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const addTag = () => {
    if (tagInput && !post.tags.includes(tagInput)) {
      setPost({ ...post, tags: [...post.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPost({ ...post, tags: post.tags.filter(tag => tag !== tagToRemove) });
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
      <label htmlFor="tags">Tags: </label>
      <input value={tagInput} onChange={e => setTagInput(e.target.value)} type="text" name="tags" id="tags" />
      <button onClick={addTag}>Add Tag</button>
      <ul>
        {post.tags.map(tag => (
          <li key={tag}>
            {tag} <button onClick={() => removeTag(tag)}>Remove</button>
          </li>
        ))}
      </ul><br />
      <button onClick={handleCreatePost}>Create</button>
    </div>
  );
}
