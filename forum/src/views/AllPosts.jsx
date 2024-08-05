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
  const [sort, setSort] = useState('newest'); 

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

  useEffect(() => {
    filterPosts(posts, category, sort);
  }, [category, posts, sort]);

  const setSearch = (value) => {
    setSearchParams({
      search: value,
    });
  };

  const filterPosts = (posts, category, sort) => {
    let filtered = posts;
    if (category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }

    if (sort === 'mostLiked') {
      filtered = filtered.sort((a, b) => b.likedBy.length - a.likedBy.length);
    } else if (sort === 'newest') {
      filtered = filtered.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
    }

    setFilteredPosts(filtered);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div>
      <h1>Posts:</h1>
      <div className="filters-container">
        <label htmlFor="search">Search: </label>
        <input value={search} onChange={e => setSearchParams({ search: e.target.value })} type="text" name="search" id="search" />

        <label htmlFor="category">Category: </label>
        <select value={category} onChange={handleCategoryChange} name="category" id="category">
          <option value="all">All</option>
          <option value="Soups">Soups</option>
          <option value="Salads">Salads</option>
          <option value="Main courses">Main courses</option>
          <option value="Vegetarian">Vegetarian</option>
        </select>

        <label htmlFor="sort">Sort by: </label>
        <select value={sort} onChange={handleSortChange} name="sort" id="sort">
          <option value="newest">Newest</option>
          <option value="mostLiked">Most Liked</option>
        </select>
      </div>

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
