import { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import Comments from "../components/Comments";

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const navigate = useNavigate();
    const [category, setCategory] = useState('all');

    useEffect(() => {
        getAllPosts(search)
            .then(posts => {
                setPosts(posts);
                filterPosts(posts, category);
            })
            .catch(error => alert(error.message));
    }, [search]);

    useEffect(() => {
        filterPosts(posts, category);
    }, [category, posts]);

    const filterPosts = (posts, category) => {
        if (category === 'all') {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(posts.filter(posts => posts.category === category));
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <div>
            <h1>Posts:</h1>
            <label htmlFor="search">Search: </label>
            <input value={search} onChange={e => setSearchParams({ search: e.target.value })} type="text" name="search" id="search" /><br/><br/>
            <label htmlFor="category">Category: </label>
            <select value={category} onChange={handleCategoryChange} name="category" id="category">
                <option value="all">All</option>
                <option value="Soups">Soups</option>
                <option value="Salads">Salads</option>
                <option value="Main courses">Main courses</option>
                <option value="Vegetarian">Vegetarian</option>
            </select><br/><br/>
            {filteredPosts.length > 0
            ? filteredPosts.map(t => (
                <div key={t.id}>
                    <h3>{t.title}</h3>
                    <p>{t.content} <button onClick={() => navigate(`/posts/${t.id}`)}>See more</button></p>
                    <Comments postId={t.id} limit={3} />
                </div>
            ))
            : 'No posts'
            }
        </div>
    );
}
