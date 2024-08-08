import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/index.css";
import { Card, Image, Button, Row, Col, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa'; // Asegúrate de importar el ícono correctamente

export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const loadUserProfile = async () => {
    try {
      const userId = store.user.id;

      // Cargar perfil de usuario
      const userResponse = await actions.getUser(userId);
      console.log('User profile loaded:', userResponse);

      if (userResponse) {
        setUser(userResponse.user);
      } else {
        console.error('Unexpected response format:', userResponse);
      }

      // Cargar posts del usuario
      const postsResponse = await actions.getUserPosts(userId);
      console.log('User posts loaded:', postsResponse);

      if (postsResponse && Array.isArray(postsResponse)) {
        setPosts(postsResponse);
      } else {
        console.error('Unexpected posts response format:', postsResponse);
      }
      
    } catch (error) {
      console.error('Error loading user profile or posts:', error);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [actions, store.user.id]);

  const handleShowModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const handleEdit = () => {
    // Implement your edit logic here
    console.log('Edit post:', selectedPost);
    handleCloseModal();
  };

  const handleDelete = () => {
    // Implement your delete logic here
    console.log('Delete post:', selectedPost);
    handleCloseModal();
  };

  const handleArchive = () => {
    // Implement your archive logic here
    console.log('Archive post:', selectedPost);
    handleCloseModal();
  };

  return (
    <div>
      {user ? (
        <Card className="mt-3 mb-3 w-75 mx-auto">
          {/* Cabecera del perfil */}
          <Card.Header className="d-flex align-items-center">
            <Image src={user.img || "https://via.placeholder.com/100"} roundedCircle width={100} height={100} className="me-2" />
            <Card.Title className="mb-0">{user.user_name || "Unknown User"}</Card.Title>
          </Card.Header>
          
          <Card.Body>
            {/* Información del usuario */}
            <Card.Text>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </Card.Text>
            <Card.Text>
              <strong>Email:</strong> {user.email}
            </Card.Text>
          </Card.Body>
          
          <Card.Footer>
            <Button variant="primary">Edit Profile</Button>
          </Card.Footer>
        </Card>
      ) : (
        <p>Loading user profile...</p>
      )}

      <div className="mt-4 container bg-light">
        <h4 className="pt-3 pb-3 text-center">User Posts</h4>
        {posts.length > 0 ? (
          <Row xs={1} md={3} className="g-3 p-3">
            {posts.map((post) => (
              <Col key={post.id_post}>
                <Card className="mb-3 position-relative">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={post.image || "https://via.placeholder.com/500x500"}
                      alt="Post image"
                      onClick={() => handleShowModal(post)}
                      className="post-image"
                      style={{ cursor: 'pointer' }}
                    />
                    <DropdownButton
                      variant="link"
                      id="dropdown-custom-components"
                      title={<FaEllipsisV />}
                      drop="start"
                      className="position-absolute top-0 start-0 mt-2 ms-2 bg-transparent border-0"
                    >
                      <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                      <Dropdown.Item onClick={handleArchive}>Archive</Dropdown.Item>
                    </DropdownButton>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {/* Modal para ver imagen en grande y opciones */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Body>
          <div className="mt-3 text-center">
            <DropdownButton
              variant="secondary"
              id="dropdown-custom-components"
              title={<FaEllipsisV />}
              drop="end"
            >
              <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
              <Dropdown.Item onClick={handleArchive}>Archive</Dropdown.Item>
            </DropdownButton>
          </div>
          <Image
            src={selectedPost?.image || "https://via.placeholder.com/1000x1000"}
            className="modal-image"
            fluid
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
