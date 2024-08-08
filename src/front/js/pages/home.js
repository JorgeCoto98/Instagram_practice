import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/index.css";
import { Card, Image, Button } from 'react-bootstrap';

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    try {
      // Cargar todos los posts
      const response = await actions.getAllPosts();
      console.log('Posts loaded:', response);

      // Asegúrate de que la respuesta sea un array
      if (Array.isArray(response)) {
        setPosts(response);
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [actions]);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id_post} className="mt-3 mb-3 w-50 h-70 container">
            {/* Usuario que creó la publicación */}
            <Card.Header className="d-flex align-items-center">
              <Image src={post.author.img || "https://via.placeholder.com/40"} roundedCircle width={40} height={40} className="me-2" />
              <Card.Title className="mb-0">{post.author.user_name || "Unknown User"}</Card.Title>
            </Card.Header>
            
            {/* Fotografía */}
            <Card.Img variant="top" src={post.image || "https://via.placeholder.com/500x500"} alt="Post image" />

            <Card.Body>
              {/* Likes */}
              <Button variant="link" className="p-0 text-decoration-none">
                <i className="fas fa-heart"></i> {post.likes ? post.likes.length : 0} likes
              </Button>

              {/* Descripción */}
              <Card.Text>
                <strong>{post.author.user_name || "Unknown User"}</strong> {post.message}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};
