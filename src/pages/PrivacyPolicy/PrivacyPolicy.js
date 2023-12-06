import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { getTranslatedText as t } from "../../translater/index";
import "./PrivacyPolicy.scss";
import { Link } from "react-router-dom";
import { getPrivacyPolicyApi } from "../../services/cmsServices";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";

function PrivacyPolicy() {
  const [privacyPolicyData, setPrivacyPolicyData] = useState();
  const [isLoader, setIsLoader] = useState(true);

  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;

  const privacyCall = () => {
    getPrivacyPolicyApi().then((res) => {
      setIsLoader(false)
      if (res.status === "success") {
        setPrivacyPolicyData(res.data);
        console.log(res.data);
      }
    }).catch((e)=>{  setIsLoader(false)
    });
  };

  useEffect(() => {
    privacyCall();
  }, []);
  return (
    <div className="privacypolicypage">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-12 px-0 banner-img"
            // style={{
            //   backgroundImage: privacyPolicyData? `url( ${API.backendApi}${privacyPolicyData?.section_1_image})`  : `url(${aboutbanner})`,
            // }}
          >
            <div className="container px-lg-0">
              <div className="row ">
                <div className="pagename">
                  <h1>
                    {privacyPolicyData
                      ? privacyPolicyData?.section_1_heading
                      : t("privacy",lan)}
                  </h1>
                  {/* <Link to="/">
                    {privacyPolicyData?.section_1_button_text
                      ? privacyPolicyData?.section_1_button_text
                      : t("Back",lan)}
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
            {privacyPolicyData
              ? privacyPolicyData?.section_1_heading
              : "Privacy Policy"}
          </h3> */}
          <div className="row">
            <div className="col-md-12 col-sm-12 col-12 px-lg-0 ">
              <p className="unset-list"
                dangerouslySetInnerHTML={{
                  __html: privacyPolicyData?.section_2_description,
                }}
              >
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-12 px-lg-0 ">
              <p className="unset-list"
                dangerouslySetInnerHTML={{
                  __html: privacyPolicyData?.section_2_sub_description,
                }}
              >             
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-12 px-lg-0 ">
              <p className="unset-list"
                dangerouslySetInnerHTML={{
                  __html: privacyPolicyData?.section_2_last_description,
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

export default PrivacyPolicy;
