
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const postRef = ref(db, `posts/${id}`);
    const unsubscribe = onValue(postRef, snapshot => {
      const updatedPost = snapshot.val();
      setPost({
        ...updatedPost,
        likedBy: Object.keys(updatedPost.likedBy ?? {}),
      });
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleDelete = () => {
    navigate('/posts'); 
  };

  return (
    <div className="single-post-page">
      <h1>Single Post</h1>
      {post ? <Post post={post} onDelete={handleDelete} /> : <p>Loading...</p>}
    </div>
  );
}
