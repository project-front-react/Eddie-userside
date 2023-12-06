import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import img404 from "../../assets/images/404.png";

import "./Page404.scss";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="Page404">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12 text-center page404-blcok">
            <div>
              <img src={img404} />
            </div>
            <p className="text-center mt-2">
              The page you are looking for doesn’t exist.{" "}
            </p>
            <p className="text-center">
              Please check the URL for proper spelling. If you're having trouble
              locating your destination, please click the links below to go Home
              or to the last page you visited.
            </p>
            <Link to="/" className="btn btn-green ">
              RETURN TO HOME
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page404;
