import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import aboutbanner from "../../assets/images/aboutbanner.jpg";

import "./TermsAndCondition.scss";
import { Link } from "react-router-dom";
import { getTnCApi } from "../../services/cmsServices";
import API from "../../api";
import Loader from "../../components/Loader/Loader";

function TermsAndCondition() {
  const [tncData, setTncData] = useState();
  const [isLoader, setIsLoader] = useState(true);

  const tncCall = () => {
    getTnCApi().then((res) => {
      setIsLoader(false)
      if (res.status === "success") {
        setTncData(res.data);
        console.log(res.data);
      }
    }).catch((e)=>{console.log(e);setIsLoader(false)});
  };

  useEffect(() => {
    tncCall();
    window.scrollTo(0,0)
  }, []);
  return (
    <div className="tncpage">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-12 px-0 banner-img"
            // style={{
            //   backgroundImage: tncData
            //     ? `url( ${API.backendApi}${tncData?.section_1_image})`
            //     : `url(${aboutbanner})`,
            // }}
          >
            <div className="container px-lg-0">
              <div className="row ">
                <div className="pagename">
                  <h1>
                    {tncData
                      ? tncData?.section_1_heading
                      : "Terms and Conditions"}
                  </h1>
                  {/* <Link to="/">
                    {tncData?.section_1_button_text
                      ? tncData?.section_1_button_text
                      : "Back to Home"}
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tncContent">
        <div className="container">
          {/* <h3>
            {tncData ? tncData?.section_1_heading : "Terms and Conditions"}
          </h3> */}
          <div className="row">
            <div className="col-md-12 col-sm-12 col-12 px-lg-0  mt-5">
              <p className="unset-list terms-text"
                dangerouslySetInnerHTML={{
                  __html: tncData?.section_2_description,
                }}
              >
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {isLoader ? <Loader /> : ""}
    </div>
  );
}

export default TermsAndCondition;
