import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import aboutbanner from "../../assets/images/aboutbanner.jpg";

import slider from "../../assets/images/bookclub1.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Aboutus.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import NewestCourse from "../../components/newestCourse/NewestCourse";
import TextArea from "../../components/TextArea/TextArea";
import CountryCodeSelect from "../../components/CountryCodeSelect/CountryCodeSelect";
import { contactUsApi, getAboutUsApi } from "../../services/cmsServices";
import API from "../../api";
import PhoneInput from "react-phone-number-input";
import Popup from "../../components/popup/popup";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import { encrypt } from "../../utils/encrypt";
import CryptoJS from "crypto-js";

const Aboutus = () => {
  //const [aboutUsData, setAboutUsData] = useState();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const platform = localStorage.getItem("Platform");

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const fnameref = useRef();
  const lnameref = useRef();
  const emailref = useRef();
  const phonenoref = useRef();
  const messageref = useRef();
  const [aboutUsData, setAboutUsData] = useState();
  const [value, setValue] = useState();
  const [contactUsResponce, setContactUsResponce] = useState("");
  const [loderBtn, setLoderBtn] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [error, setError] = useState({
    fname: "",
    email: "",
    phone: "",
    message: "",
  });
  const isLoggedin = localStorage.getItem("logedInUser");
  const videoRef = useRef(null);

  const aboutUsCall = () => {
    setIsLoader(true);
    getAboutUsApi()
      .then((res) => {
        if (res.status === "success") {
          setAboutUsData(res.data);
          setIsLoader(false);
        }
      })
      .catch((e) => {
        setIsLoader(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    aboutUsCall();
  }, []);

  // useEffect(() => {
  //   const video = videoRef.current;

  //   const handleEnded = () => {
  //     video.currentTime = 0; // Reset the video to the beginning
  //     video.play(); // Play the video again
  //   };

  //   video.addEventListener("ended", handleEnded);

  //   return () => {
  //     video.removeEventListener("ended", handleEnded);
  //   };
  // }, []);

  const validate = () => {
    let fnameVal = fnameref?.current?.value;
    let emailVal = emailref?.current?.value;
    let phonenoVal = phonenoref?.current?.value;
    let messageVal = messageref?.current?.value;

    if (
      fnameVal?.trim() === "" &&
      emailVal?.trim() === "" &&
      phonenoVal?.trim() === "" &&
      messageVal?.trim() === ""
    ) {
      setError({
        ...error,
        fname: "*Name is Required",
        email: "*Email is Required",
        phone: "*Phone is Required",
        message: "*Message is Required",
      });
      return false;
    } else if (fnameVal?.trim() == "") {
      setError({ ...error, fname: "*Name is Required" });
      return false;
    } else if (emailVal?.trim() == "") {
      setError({ ...error, email: "*Email is Required" });
      return false;
    } else if (!emailRegex.test(emailVal)) {
      setError({ ...error, email: "*Enter Valid Email" });
      return false;
    } else if (phonenoVal?.trim() == "") {
      setError({ ...error, phone: "*Phone is Required" });
      return false;
    } else if (messageVal?.trim() == "") {
      setError({ ...error, message: "*Message is Required" });
      return false;
    } else {
      return true;
    }
  };

  const contactUsCall = async () => {
    let fnameVal = fnameref?.current?.value;
    let lnameVal = lnameref?.current?.value;
    let emailVal = emailref?.current?.value;
    let phonenoVal = phonenoref?.current?.value;
    let messageVal = messageref?.current?.value;
    let validation = await validate();
    if (validation == true) {
      var bodyFormData = new FormData();

      const encryptedEmail = encrypt(emailVal);

      bodyFormData.append("fullname", fnameVal);
      bodyFormData.append("email_id", encryptedEmail);
      bodyFormData.append("phone_number", phonenoVal);
      bodyFormData.append("message", messageVal);
      setLoderBtn(true);
      contactUsApi(bodyFormData)
        .then((res) => {
          setLoderBtn(false);
          if (res.status === "success") {
            fnameref.current.value = "";
            emailref.current.value = "";
            phonenoref.current.value = "";
            messageref.current.value = "";
            setValue("");
            preventScroll();
            // toast.success(lan == "en" ? res.data :res?.data_sv)
            setContactUsResponce(lan == "en" ? res.data : res?.data_sv);
          } else {
            preventScroll();
            // toast.error(lan == "en" ? res.data :res?.data_sv);
            setContactUsResponce(lan == "en" ? res.data : res?.data_sv);
          }
          setError({
            fname: "",
            email: "",
            phone: "",
            message: "",
          });
        })
        .catch((err) => {
          console.log("shdgfhdjs", err.data);
          setLoderBtn(false);
          preventScroll();
          setContactUsResponce(err?.data);
        });
    }
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };
  const handleClosePopup = () => {
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setContactUsResponce("");
    fnameref.current.value = "";
    emailref.current.value = "";
    phonenoref.current.value = "";
    messageref.current.value = "";
    // window.location.reload()
  };

  return (
    <div className="aboutPage">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-12 px-0 banner-img"
            style={{
              backgroundImage: aboutUsData
                ? `url(${aboutUsData?.section_1_image})`
                : `url(${aboutbanner})`,
            }}
          >
            <div className="container">
              <div className="row ">
                <div className="pagename px-0">
                  <h1>
                    {aboutUsData
                      ? aboutUsData?.section_1_heading
                      : t("AboutUs", "en")}
                  </h1>
                  <Link to="/">
                    {aboutUsData
                      ? aboutUsData?.section_1_button_text
                      : "Back to Home"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="howitwork">
        <div className="container">
          <h2>
            {aboutUsData ? aboutUsData?.section_2_heading : "How It Works"}
          </h2>
          <p
            className="col-md-8 col-12 mx-auto"
            dangerouslySetInnerHTML={{
              __html: aboutUsData?.section_2_description,
            }}
          >
            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nisl,
            amet, lacinia feugiat at. Ipsum quisque mauris eget semper massa
            aliquam imperdiet volutpat lectus. Sem lectus non eget gravida mus.
            Ultricieselit aenean enim est quam facilisis scelerisque. */}
          </p>
          <div className="col-md-6 col-12 mx-auto mt-5">
            {/* <video width={'100%'}  controls>
                      <source src={ aboutUsData?.section_2_video ? `${API.backendApi}${aboutUsData?.section_2_video}` :"https://player.vimeo.com/video/76979871?pip=1&speed=1" } type="video/mp4"/>
            </video> */}
            <video
              src={
                aboutUsData?.section_2_video
                  ? aboutUsData?.section_2_video
                  : "https://player.vimeo.com/video/76979871?pip=1&speed=1"
              }
              preload="auto"
              autoplay="true"
              controls
              style={{ width: " 100%", height: " 100%" }}
            >
              {/* <source
                src={
                  aboutUsData?.section_2_video
                    ? aboutUsData?.section_2_video
                    : "https://player.vimeo.com/video/76979871?pip=1&speed=1"
                }
                type="video/mp4"
              /> */}
            </video>
            {/* <ReactPlayer
              className=" react-player"
              url={
                aboutUsData?.section_2_video
                  ? `${aboutUsData?.section_2_video}`
                  : "https://player.vimeo.com/video/76979871?pip=1&speed=1"
              }
              controls={true}
              playing={true}
              style={{ maxWidth: "100%" }}
            /> */}
          </div>
        </div>
      </div>

      <div className="become-suppliers">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-12">
              <div className="abt-image">
                <img
                  src={
                    aboutUsData?.section_3_image
                      ? `${aboutUsData?.section_3_image}`
                      : slider
                  }
                  className="w-100"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = slider;
                  }}
                />
              </div>
            </div>
            <div className="col-md-5 offset-md-1 col-12">
              <h2>{aboutUsData?.section_3_heading}</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: aboutUsData?.section_3_description,
                }}
              ></p>
              {isLoggedin == null && (
                <a
                  href={aboutUsData?.section_3_button_link}
                  className="btn btn-green"
                >
                  {/* {t("GETSTARTED", "en")} */}
                  {aboutUsData?.section_3_button_text}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 
      <div className="newestcourse">
        <div className="container">
          <div className="col-md-12 col-12 mx-auto">
            <NewestCourse
              name="Our Newest Courses"
              data={aboutUsData?.section_4_courses}
            />
          </div>
        </div>
      </div> */}

      <div className="abt-form-section">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto text-center">
              <h2 className="mb-5">{t("WhatEddiCanDo", lan)}</h2>

              <div className="row">
                <div className="col-md-12 col-12">
                  <div className="input-main">
                    <div className="form-group position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("FullNameAbout", lan)}
                        ref={fnameref}
                        onChange={() => setError({ ...error, fname: "" })}
                      />
                      {error.fname && (
                        <p className="errorText">{error.fname}</p>
                      )}
                    </div>
                  </div>
                  {/* <InputText type="text" placeholder={t("FirstName", "en")} ref={fnameref} /> */}
                </div>
                {/* <div className="col-md-6 col-12">
                  <div className="input-main">
                    <div className="form-group position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("LastName", "en")}
                        ref={lnameref}
                      />

                    </div>
                  </div>
             
                </div> */}
              </div>
              <div className="row ">
                <div className="col-md-6 col-12">
                  <div className="input-main">
                    <div className="form-group position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("Email", lan)}
                        ref={emailref}
                        onChange={() => setError({ ...error, email: "" })}
                      />
                      {error.email && (
                        <p className="errorText">{error.email}</p>
                      )}
                    </div>
                  </div>
                  {/* <InputText type="text" placeholder={t("email", "en")} ref={emailref} /> */}
                </div>
                <div className="col-md-6 col-12">
                  <div className="selectbox-main">
                    <PhoneInput
                      placeholder={t("phonnumber", lan)}
                      value={value}
                      defaultCountry="SE"
                      onChange={() => {
                        setValue();
                        setError({ ...error, phone: "" });
                      }}
                      flags={false}
                      ref={phonenoref}
                    />
                    {error.phone && <p className="errorText">{error.phone}</p>}
                  </div>
                  {/* <CountryCodeSelect ref={phonenoref} /> */}
                </div>
              </div>

              <div className="row ">
                <div className="col-md-12 col-12">
                  <div className="textArea-main">
                    <div className="form-group position-relative">
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder={t("Message", lan)}
                        rows="3"
                        ref={messageref}
                        onChange={() => setError({ ...error, message: "" })}
                      ></textarea>
                      {error.message && (
                        <p className="errorText">{error.message}</p>
                      )}
                    </div>
                  </div>
                  {/* <TextArea type="text" placeholder={t("Message", "en")} ref={messageref} /> */}
                </div>
              </div>
              <div className="text-start">
                <button
                  className="btn btn-green border-0"
                  onClick={contactUsCall}
                  disabled={loderBtn}
                >
                  {loderBtn ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    t("submit", lan)
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {contactUsResponce !== "" && (
        <Popup
          show={contactUsResponce !== "" ? true : false}
          header="Status"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            {console.log("contactUsResponce", contactUsResponce)}
            <p>{contactUsResponce}</p>
          </div>
          <div>
            <button
              onClick={handleClosePopup}
              className="btn btn-green text-uppercase w-100 mt-2"
            >
              {t("Okbutton", "en")}
            </button>
          </div>
        </Popup>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default Aboutus;
