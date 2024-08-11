import React, { useState, useEffect } from "react";
import { getAllPosts } from "../services/posts.service";  
import { getAllUsers } from "../services/users.service";
import { getTopCommentedPosts, getRecentPosts } from "../services/posts.service";
import { Link } from "react-router-dom";
export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const posts = await getAllPosts();
        const users = await getAllUsers();

        setPostCount(posts.length);
        setUserCount(Object.keys(users).length);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
  }, []);

  useEffect (() => {
    const fetchPosts = async () => {
      try {
        const topCommented = await getTopCommentedPosts();
        const recent = await getRecentPosts();
        setTopCommentedPosts(topCommented);
        setRecentPosts(recent);
      } catch (error) {
          console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to the Culinary Forum</h1>
        <p>Join a vibrant community of food enthusiasts!</p>
        <button className="hero-button">Explore Recipes</button>
      </div>

      <div className="features-section">
        <h2>Core Features</h2>
        <ul>
          <li>Share your culinary creations</li>
          <li>Connect with fellow foodies</li>
          <li>Discover new recipes and tips</li>
        </ul>
      </div>

      <div className="statistics-section">
        <h2>Our Community</h2>
        <p><strong>Members:</strong> {userCount}</p>
        <p><strong>Posts:</strong> {postCount}</p>
      </div>

      <section>
        <h2>10 Most commented Posts</h2>
          <ul>
            {topCommentedPosts.map(post => (
              <li key={post.id}>
                 <Link to={`/posts/${post.id}`}>
                <h3 className="post-title">{post.title}</h3>
            </Link> 
                <p>{post.commentCount} comments</p>
              </li>
            ))}
          </ul>
      </section>

      <section>
            <h2>10 Most Recently Created Posts</h2>
            <ul>
              {recentPosts.map(post => (
                <li key={post.id}>
                   <Link to={`/posts/${post.id}`}>
                <h3 className="post-title">{post.title}</h3>
            </Link> 
                  <p>Created at: {new Date(post.createdOn).toLocaleString()}</p>
                </li>
              ))}
            </ul>
      </section>
    </div>
  );
};
