import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logoCM from "../../img/LOGO.png";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const { user } = store;
  const location = useLocation()
  const navigate = useNavigate();
  const defaultUserImg = "https://images.squarespace-cdn.com/content/v1/5e6cfa89c315535aba12ee9d/1620070500897-0BUOX95Q8M9ZB3WQQPPR/Logo+-+Einstein+%282%29.png";
  const [userImg, setUserImg] = useState(user ? user.img : defaultUserImg);

  const [navActive, setNavActive] = useState(null)

  const shouldHide = !navActive; // Ocultar cuando la barra no esté desplegada

  useEffect(() => {
    setNavActive(location.pathname)
    if (user) {
      setUserImg(user.img || defaultUserImg)
    } else {
      setUserImg(defaultUserImg);

    }

  }, [location.pathname, user, store.user]);

  const [checked, setChecked] = useState(true)
  const [checkedTwo, setCheckedTwo] = useState(false)
  const toggleLogOut = (active) => {
    setChecked(active)
    if (active === true) {
      setCheckedTwo(false)
    }
  }

  useEffect(() => {
    // console.log(location)
  if(location.pathname == '/changepassword'){
      
      return
    }

  if(!store.token) {
      navigate("/")

    }
  }, [store.token])


  const handleLogout = async (e) => {
    e.preventDefault();
    console.log("Handle logout called");
    actions.logout();



  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const defaultNavbar = (
    <nav id='login-section' className="navbar navbar-expand-lg bg-body-tertiary ms-4 me-4 mt-3 mb-4 p-2">
      <div className="container-fluid d-flex align-items-center">


        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="menuBurger"><i className="fas fa-bars"></i></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">

          <ul className="navbar-nav ms-auto mb-2 mb-lg-2 d-flex align-items-end ">
            <li className="nav-item">
              <Link to={"/about"} className="nav-link">About us</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  )

  const userNavbar= (
    <nav className="navbar navbar-expand-sm navbar-light bg-light" style={{ maxHeight: '100px' }}>
    <ul className="navbar-nav w-100 d-flex justify-content-between">
      <li className="nav-item">
        <div id="nav-title" className="d-flex justify-content-center align-items-center ">
          <img src={logoCM} alt="Logo" className="img-fluid" style={{ maxWidth: '70px' }} />
          <Link to="/home" className="text-secondary navbar-title ms-2" aria-current="page">D tech Inc</Link>
        </div>
      </li>
      <li className="nav-item">
        <Link to="/home" className="btn btn-outline-dark">
          <i className="fas fa-home"></i>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/createPost" className="btn btn-outline-dark">
          <i className="fas fa-plus-square"></i>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/" className="btn btn-outline-dark" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i></Link>
      </li>
      <li className="nav-item">
        <div>
          <div className="d-flex align-items-start">
            <div id="nav-footer-avatar">
              <Link to="/profile">
                <img src={userImg} alt="Avatar" className="rounded-circle" />
              </Link>
            </div>
            <div className={`ms-2 ${shouldHide ? 'hide-element' : ''}`}>
              <Link to="/profile">
                {user && user.user_name}
              </Link>
            </div>
          </div>
        </div>
      </li>
     
    </ul>
  </nav>
  )

const userNavbar2 = (
  <div id="nav-bar">
    <input id="nav-toggle" checked={checked} type="checkbox" onClick={() => toggleLogOut(!checked)} />
    <div id="nav-header">
      <div id="nav-title" target="_blank">
        <Link to={"/modules"} className="text-primary navbar-title ms-2" aria-current="page" href="#">CodeMind</Link>
      </div>
      <label htmlFor="nav-toggle">
        <span id="nav-toggle-burger"></span>
      </label>
      <hr />
    </div>
    <div id="nav-content">
      <div className="nav-button">
        <Link to="/modules"><i className="fas fa-palette"></i><span>Modules</span> </Link>
      </div>
      {/* <div className="nav-button">
        <i className="fas fa-images"></i><span>Library</span>
      </div> */}
      <hr />

      <div className="nav-button">
        <Link to="/progress"><i className="fas fa-chart-line"></i><span>Progress</span> </Link>
      </div>

      <div className="nav-button">
        <Link to="/roadMap"> <i className="fas fa-fire"></i><span>Road Map</span> </Link>
      </div>
      <div className="nav-button">
        <Link to="/about"><i className="fas fa-heart"></i><span>About Us</span> </Link>
      </div>
      <div id="nav-content-highlight"></div>
    </div>

    <input id="nav-footer-toggle" type="checkbox" checked={checkedTwo} onClick={() => setCheckedTwo(!checkedTwo)} />
    <div id="nav-footer">
      <div id="nav-footer-heading" className="d-flex align-items-start">
        <div id="nav-footer-avatar">
          <Link to={"/profile"}><img src={userImg} alt="Avatar" className="rounded-circle" /></Link>
        </div>
        <div id="nav-footer-titlebox" className={`ms-2 ${shouldHide ? 'hide-element' : ''}`}>
      
          <Link to={"/profile"}>{user && user.firstName ? user.firstName : null} {user && user.lastName ? user.lastName : null}</Link>
    
        </div>
        <label htmlFor="nav-footer-toggle">
          <i className="fas fa-caret-up"></i>
        </label>
      </div>
      <div id="nav-footer-content">
        <div className="nav-item pt-4">
          <Link to={"/"} className="btn btn-outline-primary d-flex justify-content-center" onClick={handleLogout} >Log out</Link>
        </div>
      </div>
    </div>
  </div>)
  


  const renderNavbar = () => {
    const screenWidth = window.innerWidth;
    if (['/registro', '/', '/login', '/forwotpassword', '/sendpassword', '/changepassword'].includes(navActive)) {
      return defaultNavbar;
    }else{
      return userNavbar;
    }

    
  };

  return (
    <>
      {renderNavbar()}
    </>
  );
};
