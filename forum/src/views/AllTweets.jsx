import { useEffect, useState } from "react"
import { getAllTweets } from "../services/tweets.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import Comments from '../components/Comments';

export default function AllTweets() {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  console.log(tweets);

  useEffect(() => {
    getAllTweets(search)
      .then(tweets => setTweets(tweets))
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
      {tweets.length > 0
      ? tweets.map(t => (
        <div key={t.id}>
          <h3>{t.title}</h3>
          <p>{t.content} <button onClick={() => navigate(`/tweets/${t.id}`)}>See more</button></p>
          <Comments tweetId={t.id} limit={3} />
        </div>
      ))
      : 'No tweets'
      }
    </div>
  )
}