import React, { useContext, useState, useEffect } from "react";
import "../../styles/index.css";
import { Login } from './login';
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import { Modal, Button } from 'react-bootstrap'; // Asegúrate de importar Modal y Button

export const Landing = () => {
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [showModal, setShowModal] = useState(false); // Inicialmente, el modal no se muestra

    useEffect(() => {
        // Si hay un token, redirige a /home
        if (store.token) {
            navigate('/home');
        } else {
            // Mostrar el modal solo si no hay un token
            setShowModal(true);
        }
    }, [navigate, store.token]);

    const handleCloseModal = () => setShowModal(false);

    const landing = (
        <div className='vh-100'>
            <div className='pb-5'>
                <div className='container'>
                    <div className="row mt-4 pt-4 justify-content-between">
                        <div className="col-md-7 col-lg-3 col-xl-7 order-2 order-md-1">
                            <div className="p-4">
                                <h1 className="titulo-landing text-center">
                                    Digital Tech Inc
                                </h1>
                            </div>
                            <div className='m-5'>
                                <h4>
                                    <a href="" className="typewrite ms-2" data-period="2000" data-type='[ "Transformando Ideas en Innovación Digital", "Conectando el Futuro con Tecnología de Hoy", "Tu Visión, Nuestra Tecnología: Juntos Hacemos Más" ]'>
                                        <span className="wrap ms-3"></span>
                                    </a>
                                </h4>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-5 col-xl-5 order-1 order-md-2">
                            <Login />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para la información del perfil de prueba */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Información del Perfil de Prueba</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Necesitas cargar la data desde el seerder en la interfaz del backend si lo abriste desde el repositorio.</p>
                    <h3>Ignora el mensaje anterior si presionaste algún link o alguna página y estás viendo esto.</h3>
                    <span>ATENCIÓN: Puedes crear un nuevo perfil</span>
                    <span> o usar estas credenciales:</span>
                    <p><strong>Email:</strong> jcoto@gmail.com</p>
                    <p><strong>Clave:</strong> 123</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

    return (
        <>{landing}</>
    );
};
