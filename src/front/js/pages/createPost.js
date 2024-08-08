import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/index.css";
import { Card, Form, Image, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";


export const CreatePost = () => {
    const { store, actions } = useContext(Context);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setImageUrl('');  // Clear imageUrl when a file is selected
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if ((!image && !imageUrl) || !description) {
            setError('Please fill out all fields and upload an image or provide an image URL.');
            return;
        }

        const postData = {
            message: description,
            image: imageUrl ? imageUrl : image,
            status: "PUBLISHED",  // Example status, adjust as needed
            created_at: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
        };

        actions.createPost(postData);
        
        navigate('/home'); // Redirige a la página de inicio después de una publicación exitosa
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

                        <p>or</p>

                        {/* Input para ingresar URL de la imagen */}
                        <Form.Group controlId="formImageUrl" className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter image URL" 
                                value={imageUrl} 
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setImage(null);  // Clear image file if URL is provided
                                }} 
                            />
                        </Form.Group>

                        {/* Vista previa de foto */}
                        {(imageUrl || image) && (
                            <Card.Img 
                                variant="top" 
                                src={imageUrl || URL.createObjectURL(image)} 
                                alt="Post preview" 
                            />
                        )}

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
