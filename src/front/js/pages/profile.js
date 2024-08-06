import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Context } from "../store/appContext";

export const Profile = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { store, actions } = useContext(Context);
    const initialFormData = {
        id: store.user.id,
        firstName: store.user.firstName,
        lastName: store.user.lastName,
        user_name: store.user.user_name,
        email: store.user.email,
        img: store.user.img
    };
    const [formData, setFormData] = useState({ ...initialFormData });

 
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Realiza la transformación de la primera letra en mayúscula
        const updatedValue =
            name === "firstName" || name === "lastName"
                ? value
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : value;
        const updatedFormData = { ...formData, [name]: updatedValue };
        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName) {
            setErrorMessage("First Name and Last Name are required");
            setShowAlert(true);
            return;
        }

        try {
            const baseUrl = "https://ui-avatars.com/api";
            const size = 200;
            const rounded = true;
            const background = "random";
            const name = formData.firstName + " " + formData.lastName;
            const user_name = formData.user_name;
            const imgURL = `${baseUrl}/?name=${encodeURIComponent(name)}&size=${size}&rounded=${rounded}&background=${background}`;
            const updatedFormData = { ...formData, img: imgURL};
            await actions.updateUser(updatedFormData);
            setErrorMessage("");
            setShowAlert(true);
        } catch (error) {
            console.error('Error al actualizar el usuario: ', error);
        }
    };


    return (
        <div className="container vh-100 d-flex flex-column justify-content-center">
            <div className="row mb-4">
                <div className="col mt-4">
                    <Link to="/home"><i className="fa-solid fa-arrow-left arrow-back"></i></Link>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-6 text-start pe-4">
                    <h2 className='bigtext text-line text-break'>
                        Hi <span className='text-color-primary'>{store.user.firstName}</span>! This is your profile
                    </h2>
                </div>
                <div className="col-lg-6 mt-4">
                    {showAlert && (
                        <div className={`alert ${errorMessage ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
                            {errorMessage ? errorMessage : "User updated successfully!"}
                            <button type="button" className="btn-close" onClick={() => { setShowAlert(false); setErrorMessage(""); }}></button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label className='form-label'>First Name:</label>
                            <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Last Name:</label>
                            <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>User name: </label>
                            <input type="text" className="form-control" id="user_name" name="user_name" value={formData.user_name} onChange={handleChange} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>E-mail:</label>
                            <input type="text" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} disabled={true} />
                        </div>
                        <div className='container '>
                            <div className="row mt-5 d-flex justify-content-between">
                                <div className="col-6">
                                    <button type="submit" className="btn btn-primary">
                                        Update User
                                    </button>
                                </div>
                                <div className='col-6'>
                                    <Link to={"/changepassword"} className="btn btn-outline-secondary ms-2 text-black ">Change password</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
