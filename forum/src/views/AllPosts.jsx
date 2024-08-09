import { useEffect, useState, useCallback } from "react";
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
    const [searchTerm, setSearchTerm] = useState(search); // Държим стойността на полето за търсене

    const fetchPosts = async (searchTerm) => {
        setLoading(true);
        try {
            const postsData = await getAllPosts(searchTerm);
            console.log('Fetched Posts:', postsData); 
            const transformedPosts = postsData.map(post => ({
                ...post,
                likedBy: Array.isArray(post.likedBy) ? post.likedBy : Object.keys(post.likedBy ?? {}),
                dislikedBy: Array.isArray(post.dislikedBy) ? post.dislikedBy : Object.keys(post.dislikedBy ?? {}), 
                comments: post.comments || {},
                createdOn: post.createdOn || new Date().toISOString(),
            }));
            setPosts(transformedPosts);
            filterPosts(transformedPosts, category, sort); // Приложете филтрирането върху заредените публикации
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            alert('Failed to fetch posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(search); // Зарежда публикации веднага след зареждане на страницата
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setSearchParams({ search: searchTerm });
        fetchPosts(searchTerm);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const filterPosts = (posts, category, sort) => {
        let filtered = posts;
        if (category !== 'all') {
            filtered = filtered.filter(post => post.category === category);
        }

        if (sort === 'mostLiked') {
            filtered.sort((a, b) => b.likedBy.length - a.likedBy.length);
        } else if (sort === 'newest') {
            filtered.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        }

        setFilteredPosts([...filtered]); 
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        filterPosts(posts, event.target.value, sort); // Актуализирайте филтрирането
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
        filterPosts(posts, category, event.target.value); // Актуализирайте филтрирането
    };

    const handleDelete = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
        filterPosts(posts.filter(post => post.id !== postId), category, sort); // Актуализирайте филтрирането след изтриване
    };

    return (
        <div className="content">
            <h1>Posts</h1>
            <div className="filters-container">
                <label htmlFor="search">Search: </label>
                <input
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    type="text"
                    name="search"
                    id="search"
                />
                <button onClick={handleSearchSubmit}>Search</button> 

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
                <p>No posts found.</p>
            )}
        </div>
    );
}
