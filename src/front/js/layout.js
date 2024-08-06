import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from "./store/appContext";
import { Index } from "./pages/index";
import { Home } from "./pages/home";

import { Profile } from "./pages/profile";
import { ChangePassword } from "./pages/changePassword";
import { ForwotPassword } from "./pages/forwotpassword";
import { SendPassword } from "./pages/sendpassword";

import { AboutUs } from "./pages/aboutUs";

import { Demo } from "./pages/demo";


import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Registro } from "./pages/registro";
import { Login } from "./pages/login";
import { Landing } from "./pages/landing";
import { NotFound } from "./pages/NotFound";
import { CreatePost } from "./pages/createPost";

//create your first component
const Layout = () => {
  const { store, actions } = useContext(Context);
  const basename = process.env.BASENAME || "";
  const [token, setToken] = useState();

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "")
    return <BackendURL />;

  useEffect(() => {
    if (!store.token) {
      setToken(store.token);
      
    }
  }, [store.token]);

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />

          <Routes>
            <Route element={<Landing />} path="/" />
            <Route element={<Index />} path="/Index" />
            <Route element={<Registro />} path="/registro" />
            <Route element={<Login />} path="/login" />
            <Route element={<ChangePassword />} path="/changepassword"/>
            <Route element={<ForwotPassword />} path="/forwotpassword" />
            <Route element={<SendPassword />} path="/sendpassword" />
            <Route element={<AboutUs />} path="/about" />
            {store.token ? (
              <>
                <Route element={<Profile />} path="/profile" />
                <Route element={<Home />} path="/home" />
                <Route element={<CreatePost />} path="/createPost" />
                <Route element={<Demo />} path="/demo" />
                <Route element={<Single />} path="/single/:theid" />
              </>
              
            ):null}

            <Route element={<NotFound/>} path="*"/>
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default injectContext(Layout);
