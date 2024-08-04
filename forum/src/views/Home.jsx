
import { useState, useEffect } from "react";
import { getAllPosts } from "../services/posts.service";  
import { getAllUsers } from "../services/users.service";

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

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

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to the Culinary Forum</h1>
        <p>Join a vibrant community of food enthusiasts!</p>
      </div>

      <div className="features">
        <h2>Core Features</h2>
        <ul>
          <li>Share your culinary creations</li>
          <li>Connect with fellow foodies</li>
          <li>Discover new recipes and tips</li>
        </ul>
      </div>

      <div className="statistics">
        <h2>Our Community</h2>
        <p><strong>Members:</strong> {userCount}</p>
        <p><strong>Posts:</strong> {postCount}</p>
      </div>
    </div>
  );
}
