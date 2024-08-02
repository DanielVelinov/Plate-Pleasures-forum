import { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import Comments from '../components/Comments';
import Post from '../components/Post'; // Import Post component

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsData = await getAllPosts(search);
        setPosts(postsData);
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

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId)); // Remove post from state
  };

  return (
    <div>
      <h1>Posts:</h1>
      <label htmlFor="search">Search: </label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br /><br />
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map(t => (
          <div key={t.id}>
            <Post post={t} onDelete={handleDelete} />
            <Comments postId={t.id} limit={3} />
          </div>
        ))
      ) : (
        'No posts found'
      )}
    </div>
  );
}
