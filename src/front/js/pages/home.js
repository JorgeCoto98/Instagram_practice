import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/index.css";
import { Card, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import logoCM from "../../img/LOGO.png";

export const Home = () => {
  const { store, actions } = useContext(Context);

  const userImg = "https://via.placeholder.com/40";
  const userName = "john_doe";
  const postImg = "https://via.placeholder.com/500x500";
  const likes = 120;
  const description = "This is a sample description for the post.";




  return (
    <div>
      <Card className="mt-3 mb-3 w-50 h-70 container">
        {/* Usuario que creó la publicación */}
        <Card.Header className="d-flex align-items-center">
          <Image src={userImg} roundedCircle width={40} height={40} className="me-2" />
          <Card.Title className="mb-0">{userName}</Card.Title>
        </Card.Header>
        
        {/* Fotografía */}
        <Card.Img variant="top" src={postImg} alt="Post image" />

        <Card.Body>
          {/* Likes */}
          <Button variant="link" className="p-0 text-decoration-none">
            <i className="fas fa-heart"></i> {likes} likes
          </Button>

          {/* Descripción */}
          <Card.Text>
            <strong>{userName}</strong> {description}
          </Card.Text>
        </Card.Body>
      </Card>
      
    </div>
    
  );
};
