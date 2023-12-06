import React, { useEffect, useRef , useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import IcLoc from "../../assets/images/ic_location.svg";

import IcCall from "../../assets/images/ic_call.svg";
import IcEmail from "../../assets/images/icEmail.svg";

import "./Contactus.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import CountryCodeSelect from "../../components/CountryCodeSelect/CountryCodeSelect";
import PhoneInput from "react-phone-number-input";
import { contactUsApi, getContactUsDataApi } from "../../services/cmsServices";
import Popup from "../../components/popup/popup";
import API from "../../api";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import CryptoJS from "crypto-js";
import { encrypt } from "../../utils/encrypt";

const Contactus = () => {
  const state = useSelector(state=>state?.Eddi)
  let lan=state?.language;
  const platform=localStorage.getItem("Platform")

  const fnameref = useRef();
  const emailref = useRef();
  const phonenoref = useRef();
  const messageref = useRef();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const [value, setValue] = useState()
  const [contactUsResponce, setContactUsResponce] = useState("");
  const [contactUsData,setContactUsData] = useState();
  const [isLoader,setIsLoader] = useState(false)
  const [fnameError, setFnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [messageError, setMessageError] = useState("");
  let latitude = contactUsData?.section_2_latitude 
  let lagitude = contactUsData?.section_2_longitude
  const contactUsDataCall = () =>{
    setIsLoader(true)
      getContactUsDataApi().then((res)=>{
        setIsLoader(false)
        if(res.status === "success"){
          setContactUsData(res.data);

        }
      }).catch((e)=>{
        setIsLoader(false)
      })
    }
  
    useEffect(()=>{
      window.scrollTo(0, 0)
      contactUsDataCall()
    },[])

  const contactUsApiCall = () =>{

    let fnameVal = fnameref?.current?.value
    let emailVal = emailref?.current?.value
    let phonenoVal = phonenoref?.current?.value;
    let messageVal = messageref?.current?.value;

    var bodyFormData = new FormData();

    const encryptedEmail=encrypt(emailVal)
    
    bodyFormData.append('fullname', fnameVal);
    bodyFormData.append('email_id', encryptedEmail);
    bodyFormData.append('phone_number', phonenoVal);
    bodyFormData.append('message', messageVal);
    setIsLoader(true)
    contactUsApi(bodyFormData).then((res)=>{
      setIsLoader(false)
      if(res.status === "success"){
        fnameref.current.value = ""
        emailref.current.value = ""
        phonenoref.current.value = ""
        messageref.current.value = "";
        setValue("");
        preventScroll()
        
        setContactUsResponce(lan == "en" ? res.data :res?.data_sv);
      }
      else{
        preventScroll()
        setContactUsResponce(lan == "en" ? res.data :res?.data_sv)
      }
    }).catch((err)=>{
      preventScroll()
      setIsLoader(false)
      setContactUsResponce(err.data)
    })
  }

  const contactUsCall = (e) => {
    e.preventDefault();
    let fnameVal = fnameref?.current?.value
    let emailVal = emailref?.current?.value
    let phonenoVal = phonenoref?.current?.value;
    let messageVal = messageref?.current?.value;

    if (fnameVal.trim() === "") {
      setFnameError("Full name should not be empty")
    }
    else {
      setFnameError(null)
    }

    if (emailVal?.trim() === "") {
      setEmailError("Email should not be empty")
    }
    else if (!emailRegex.test(emailVal)) {
      setEmailError("Please enter a valid Email")
    }
    else {
      setEmailError(null)
    }

    if (phonenoVal.trim() === "") {
      setPhoneError("Phone number should not be empty")
    }else if(phonenoVal.length <7 || phonenoVal.length >11){
      setPhoneError("* Max 11 and min 7 digits allowed");
    }
    else {
      setPhoneError(null)
    }

    if (messageVal.trim() === "") {
      setMessageError("Message should not be empty")
    }
    else {
      setMessageError(null)
    }

  }

  useEffect(() => {

    if (fnameError == null && emailError == null && phoneError == null && messageError == null) {
      contactUsApiCall();
    }
  }, [fnameError,emailError,phoneError,messageError])

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden"
  }
  const handleClosePopup = () =>{
    const body = document.querySelector("body");
    body.style.overflow = "auto"
    setContactUsResponce("");
    fnameref.current.value = ""
    emailref.current.value = ""
    phonenoref.current.value = ""
    messageref.current.value = ""
    setValue("");

    setFnameError("");
    setEmailError("");
    setPhoneError("");
    setMessageError("");
    // window.location.reload()
  }

  return (
    <div className="contactPage">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-12 px-0 banner-img"
            style={{
              backgroundImage: `url(${contactUsData?.section_1_image})`,
            }}
          >
            <div className="container">
              <div className="row ">
                <div className="pagename px-0">
                  <h1>{contactUsData?.section_1_heading}</h1>
                  <Link to="/">{contactUsData?.section_1_button_text}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-section">
        <div className="container">
          <div className="row">
            <h2 className="mb-5 section2Heading">{contactUsData?.section_2_heading} </h2>

            <div className="col-md-6 col-sm-12 mx-auto mb-3">
              <div className="bg-white address-section">
                <div className="">
                  {/* <GoogleMap /> */}
                  <div className="mapouter"><div className="gmap_canvas">
                    <iframe width="600" height="500" id="gmap_canvas" 
                    src={`https://maps.google.com/maps?q=${latitude}, ${lagitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                    frameborder="0" scrolling="no" 
                    marginheight="0" 
                    marginwidth="0"></iframe>
                    </div></div>
                </div>

                <div className="address-details">
                  <div className="">
                    <div className="icons">
                      <img src={IcLoc} height="20px" />
                      <a href={`http://maps.google.com/?ll=${latitude}, ${lagitude}`}>{contactUsData?.section_2_address}</a>
                    </div>
                  </div>
                  {/* section_2_contact */}

                  <div className="d-flex mt-3">
                    <div className="icons">
                      <img src={IcCall} height="20px" />
                      <a href="tel:+ 1 (905) 331 0888">{contactUsData?.section_2_contact}</a>
                    </div>

                    <div className="icons ps-3">
                      <img src={IcEmail} height="22px" />
                      <a href="mailto:info@eddiwebsite.com">
                      {contactUsData?.section_2_email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12 mx-auto">
              <div className="row">
                <div className="col-md-12 col-12">
                <div className="input-main">
                  <div className="form-group position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("FullNameAbout", lan)}
                      ref={fnameref}
                      onChange={()=>setFnameError("")}
                    />
                  </div>
                  {fnameError && <p className="errorText">{fnameError}</p>}
                </div>
                  {/* <InputText type="text" placeholder={t("FirstName", lan)} /> */}

                  <div className="input-main">
                    <div className="form-group position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("email", lan)}
                        ref={emailref}
                        onChange={()=>setEmailError("")}
                      />
                    </div>
                    {emailError && <p className="errorText">{emailError}</p>}
                  </div>
                  {/* <InputText type="text" placeholder={t("email", lan)} /> */}

                  <div className="selectbox-main">
                    <PhoneInput
                      placeholder={t("phonnumber", lan)}
                      value={value}
                      defaultCountry="SE"
                      onChange={(e)=>{setValue(e);setPhoneError("")}}
                      flags={false}
                      ref={phonenoref}
                    />
                    {phoneError && <p className="errorText">{phoneError}</p>}
                  </div>
                  {/* <CountryCodeSelect /> */}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 col-12 contact-textarea">
                <div className="textArea-main">
                    <div className="form-group position-relative">
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder={t("Message", lan)}
                        rows="3"
                        onChange={()=>setMessageError("")}
                        ref={messageref}
                      >
                      </textarea>
                    </div>
                      {messageError && <p className="errorText">{messageError}</p>}
                  </div>
                  {/* <TextArea type="text" placeholder={t("Message", lan)} /> */}
                </div>
              </div>
              <div className="text-start">
                <button className="btn btn-green border-0 contact-submit-btn" onClick={contactUsCall}>
                    {t("submit", lan)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="abt-form-section">
        <div className="container">
          <div className="row"></div>
        </div>
      </div> */}
      <Footer />

      {contactUsResponce !== "" &&
      <Popup show={contactUsResponce !== "" ? true : false} header="Status" handleClose={handleClosePopup}>
        <div className="popupinfo">
          <p>{contactUsResponce}</p>
        </div>
        <div>
          <button
          onClick={handleClosePopup}
          className="btn btn-green text-uppercase w-100 mt-2">
            {t("Okbutton", lan)}
            </button>
        </div>
      </Popup>
      }
          {isLoader ? <Loader /> : ""}
    </div>

  );
};

export default Contactus;
