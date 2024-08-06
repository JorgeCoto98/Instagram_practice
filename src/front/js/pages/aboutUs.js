import React from "react";
import { Link } from "react-router-dom";

export const AboutUs = () => {
  return (
    <>
      <div className="container d-flex justify-content-center mt-5 vh-100">

        <div>
        <div className=" mb-5">
          <Link to="/">
            <i className="fa-solid fa-arrow-left arrow-back"></i>
          </Link>
        </div>
          <div className="mb-5">
            <h2 className="text-line ">Welcome!</h2>
            <p>
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue ex at dolor maximus, ac varius odio pharetra. Vestibulum placerat lorem vitae pharetra fringilla. Vivamus eros nulla, convallis vitae cursus et, eleifend non ipsum. Maecenas efficitur libero sed erat maximus, vel sodales mauris porta. Maecenas aliquam mi aliquam odio venenatis, ac malesuada augue sodales.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-line">
              Our <span className="text-color-primary">vision</span>
            </h2>
            <p>
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue ex at dolor maximus, ac varius odio pharetra. Vestibulum placerat lorem vitae pharetra fringilla. Vivamus eros nulla, convallis vitae cursus et, eleifend non ipsum. Maecenas efficitur libero sed erat maximus, vel sodales mauris porta. Maecenas aliquam mi aliquam odio venenatis, ac malesuada augue sodales.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-line">
              Join <span className="text-color-primary">Us!</span>
            </h2>
            <p>
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue ex at dolor maximus, ac varius odio pharetra. Vestibulum placerat lorem vitae pharetra fringilla. Vivamus eros nulla, convallis vitae cursus et, eleifend non ipsum. Maecenas efficitur libero sed erat maximus, vel sodales mauris porta. Maecenas aliquam mi aliquam odio venenatis, ac malesuada augue sodales.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
