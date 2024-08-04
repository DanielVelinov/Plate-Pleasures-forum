import { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import Post from '../components/Post'; 

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsData = await getAllPosts(search);
        const transformedPosts = postsData.map(post => ({
          ...post,
          likedBy: Array.isArray(post.likedBy) ? post.likedBy : Object.keys(post.likedBy ?? {}),
          comments: post.comments || {}, 
        }));
        setPosts(transformedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        alert('Failed to fetch posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [search]);

  const setSearch = (value) => {
    setSearchParams({
      search: value,
    });
  };
  useEffect(() => {
    filterPosts(posts, category);
  }, [category, posts]);

  const filterPosts = (posts, category) => {
    if (category === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === category));
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div>
      <h1>Posts:</h1>
      <label htmlFor="search">Search: </label>
      <input value={search} onChange={e => setSearchParams({ search: e.target.value })} type="text" name="search" id="search" /><br /><br />
      <label htmlFor="category">Category: </label>
      <select value={category} onChange={handleCategoryChange} name="category" id="category">
        <option value="all">All</option>
        <option value="Soups">Soups</option>
        <option value="Salads">Salads</option>
        <option value="Main courses">Main courses</option>
        <option value="Vegetarian">Vegetarian</option>
      </select><br /><br />
      {loading ? (
        <p>Loading posts...</p>
      ) : filteredPosts.length > 0 ? (
        filteredPosts.map(t => (
          <Post key={t.id} post={t} onDelete={handleDelete} />
        ))
      ) : (
        'No posts'
      )}
    </div>
  );
}
