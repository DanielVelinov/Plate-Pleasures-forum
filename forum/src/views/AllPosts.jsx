import { useEffect, useState } from "react"
import { getAllPosts } from "../services/posts.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import Comments from '../components/Comments';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  console.log(posts);

  useEffect(() => {
    getAllPosts(search)
      .then(posts => setPosts(posts))
      .catch(error => alert(error.message));
  }, [search]);

  const setSearch = (value) => {
    setSearchParams({
      search: value,
    });
  }

  return (
    <div>
      <h1>Posts:</h1>
      <label htmlFor="search"></label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/>
      {posts.length > 0
      ? posts.map(t => (
        <div key={t.id}>
          <h3>{t.title}</h3>
          <p>{t.content} <button onClick={() => navigate(`/posts/${t.id}`)}>See more</button></p>
          <Comments postId={t.id} limit={3} />
        </div>
      ))
      : 'No posts'
      }
    </div>
  )
}