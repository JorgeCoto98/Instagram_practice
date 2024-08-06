import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/index.css";
import { Card,Form, Image, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";


export const CreatePost = () => {
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleImageChange = (e) => {
      setImage(URL.createObjectURL(e.target.files[0]));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!image || !description) {
        setError('Please fill out all fields and upload an image.');
        return;
      }
  
      console.log('Publicación creada:', { image, description });
      
      // Redirige a la página de inicio después de una publicación exitosa
      navigate('/home');
    }

  return (
    <div className="d-flex justify-content-center">
       <Card className="container m-3">
            <Card.Header>
                <h5>Create a New Post</h5>
            </Card.Header>

            <Card.Body>
                <Form onSubmit={handleSubmit}>
                {/* Input para subir la imagen */}
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>

                {/* Vista previa de foto */}
                {image && <Card.Img variant="top" src={image} alt="Post preview" />}

                {/* Descripcion */}
                <Form.Group controlId="formDescription" className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Write a caption..." 
                    />
                </Form.Group>

                {/* Error mensaje */}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                <Button variant="primary" type="submit" className="mt-3">
                    Post
                </Button>
                </Form>
            </Card.Body>
        </Card>
    </div>
    
  );
};
