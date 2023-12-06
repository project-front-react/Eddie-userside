import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./EditProfile.scss";
import IcCamera from "../../assets/images/IcCamera.svg";
import { Link } from "react-router-dom";

import { getTranslatedText as t } from "../../translater/index";
import PhoneInput from "react-phone-number-input";
import Sidebar from "../../components/sidebar/Sidebar";
import { useHistory } from "react-router-dom";
import InputText from "../../components/inputText/inputText";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import {
  getUserProfileApi,
  putUserProfileApi,
} from "../../services/eddiServices";
import { getPersonalProfileData } from "../../redux/actions";
import Popup from "../../components/popup/popup";
import placeholder from "../../assets/images/placeholder.svg";
import { encrypt } from "../../utils/encrypt";

const EditProfile = (props) => {
  const state = useSelector((state) => state?.Eddi);
  const history = useHistory();
  const isCorporate = state?.UserDetail?.is_corporate
  const dispatch = useDispatch();
  const [rateNowPopup, setrateNowPopup] = useState(false);
  const [loderBtn, setLoderBtn] = useState(false);
  let lan = state?.language;
  const [editPopup, setEditPopup] = useState({ value: false, data: "" });

  const [error, setError] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  // const [value, setValue] = useState(
  //   state?.personalData?.phone_number
  //     ? state?.personalData?.phone_number?.charAt(0) == "+" ? state?.personalData?.phone_number : `+ ${state?.personalData?.phone_number}`
  //     : ""
  // );

  const [editData, setEditData] = useState({});
  const [phValue, setValue] = useState(state?.personalData?.phone_number);
  const [keyCode, setKeyCode] = useState();
  const [passwordType, setPasswordType] = useState("password");
  const [cpasswordType, setCpasswordType] = useState("password");

  useMemo(() => {
    
  
    setEditData({
      first_name: state?.personalData?.first_name || "",
      last_name: state?.personalData?.last_name || "",
      user_location: state?.personalData?.location || "",
      phone_number: state?.personalData?.phone_number || "",
      email_id: state?.personalData?.email_id || "",
      password: "",
      confirm_password: "",
      profile_image: state?.personalData?.profile_image || "",
      is_swedishdefault:
        state?.personalData?.usersignup?.is_swedishdefault !== ""
          ? state?.personalData?.usersignup?.is_swedishdefault
          : true,
    })
  }, [state?.personalData])
  

  const handleClosePopup = () => {
    //  window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setrateNowPopup(false);
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };
  function loadFile(event) {
    const src = URL.createObjectURL(event.target.files[0]);

    setEditData({
      ...editData,
      profile_image: event?.target?.files[0],
      upload_image: src,
    });
  }
  
  const onPassChange = (e) => {
    if (keyCode !== 32) {
      setEditData({
        ...editData,
        password: e?.target?.value,
      });
      setError({ ...error, password: "" });
    }
  };

  const validate = () => {
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g;
    if (!editData?.email_id) {
      setError({
        email: "* Email is Required",
      });
      return false;
    } else if (
      editData?.email_id?.trim() === "" ||
      emailRegex?.test(editData?.email_id) === false
    ) {
      setError({ ...error, email: "*Enter valid email " });
      return false;
    } else if (
      editData?.password &&
      passRegex.test(editData.password) === false
    ) {
      setError({
        ...error,
        password:
          "Your password must be at least 8 characters long, contain at least one number, contain at least one special character and have a mixture of uppercase and lowercase letters.",
        });
      return false;
    } else if (editData?.password  && (!editData?.confirm_password || editData?.password !== editData?.confirm_password)) {
      setError({
        ...error,
        confirm_password: "*Confirm password is not match ",
      });
      return false;
    } else {
      return true;
    }
  };

  const getUserData = () => {
    getUserProfileApi()
      .then((result) => {
        if (result?.status == "success") {
          dispatch(getPersonalProfileData(result?.data));
        }
      })
      .catch((e) => console.log(e));
    };

    useEffect(() => {
      getUserData()
      window.scrollTo(0, 0);
    }, []);

  const handleClosePopupStatus = () => {
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setEditPopup({ value: false, data: "" });
  };

  const onSubmit = () => {
    let val = validate();
    if (val === true) {
      setLoderBtn(true);
      let formData = new FormData();

      formData.append("first_name", editData?.first_name || "");
      formData.append("last_name", editData?.last_name || "");
      formData.append("user_location", editData?.user_location || "");
      formData.append("phone_number", phValue || "");
      formData.append("profile_image", editData?.profile_image);
      formData.append("password",  editData?.password  ? encrypt(editData?.password):'');
      formData.append("is_swedishdefault", editData?.is_swedishdefault);

      putUserProfileApi(formData)
        .then((result) => {
          setLoderBtn(false);
          if (result?.status === "success") {
            getUserData();
            preventScroll();

            setEditPopup({
              value: true,
              data: lan == "en" ? result?.data : result?.data_sv,
            });
          } else {
            preventScroll();
            setEditPopup({
              value: true,
              data: lan == "en" ? result?.data : result?.data_sv,
            });
          }
        })
        .catch((e) => {
          console.log(e);
          setLoderBtn(false);
        });
    }
  };

  const showPassword = (show) => {
    show ? setPasswordType("text") : setPasswordType("password");
  };
  const showCPassword = (show) => {
    show ? setCpasswordType("text") : setCpasswordType("password");
  };
  return (
    <div className="MyProfile">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container">
            <div className="row">
              <div className="brdcumb-block">
                <div>
                <Link to={isCorporate ?
                '/corporate-user-dashboard':'/user-dashboard'  
                }  className="brd-link"> {t("Dashboard", lan)} </Link>|
                                  <span className="brd-link text-green">
                    {" "}
                    {t("EditProfile", lan)}
                  </span>
                </div>
                <Link
                  onClick={() => {
                    history.goBack();
                  }}
                  className="brd-link"
                >
                  {t("Back", lan)}
                </Link>
              </div>
            </div>
            <div className="row edit-form mt-5">
              <div className="row edit-form">
                <div className="col-lg-3 col-md-3 col-12 ">
                  <div className="supplier-main">
                    <div className="supplier-photo">
                      <label htmlFor="file-input">
                        <img
                          id="output"
                          src={
                            editData?.upload_image
                              ? editData?.upload_image
                              : editData?.profile_image
                              ? `${editData?.profile_image}`
                              : placeholder
                          }
                        />
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={loadFile}
                      />
                    </div>
                    <div className="image-upload">
                      <label htmlFor="file-input">
                        <img src={IcCamera} />
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={loadFile}
                      />
                      {/* <input type="file" accept="image/*" onChange={loadFile} /> */}

                      {/* <input id="file-input" type="file" /> */}
                    </div>
                    <h4 className="text-center">{t("UploadImage", lan)}</h4>
                  </div>
                </div>
                <div className="col-lg-9 col-md-9 col-12 profile-form-details">
                  <div>
                    <InputText
                      placeholder={t("FirstName", lan)}
                      labelName={t("FirstName", lan)}
                      value={editData?.first_name || ""}
                      onChange={(e) => {
                        setEditData({
                          ...editData,
                          first_name: e?.target?.value,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <InputText
                      placeholder={t("LastName", lan)}
                      labelName={t("LastName", lan)}
                      value={editData?.last_name || ""}
                      onChange={(e) => {
                        setEditData({
                          ...editData,
                          last_name: e?.target?.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <InputText
                      placeholder={t("Location", lan)}
                      labelName={t("Location", lan)}
                      value={editData?.user_location || ""}
                      onChange={(e) => {
                        setEditData({
                          ...editData,
                          user_location: e?.target?.value,
                        });
                      }}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className="selectbox-main">
                        <label>{t("phonnumber", lan)}</label>
                        <PhoneInput
                          placeholder={t("phonnumber", lan)}
                          // defaultValue={ editData?.phone_number == 0 ? '' :`${editData?.phone_number}`}
                          value={phValue}
                          defaultCountry="SE"
                          onChange={setValue}
                          flags={false}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <InputText
                        placeholder={t("EmailAddress", lan)}
                        labelName={t("EmailAddress", lan)}
                        value={editData?.email_id || ""}
                        isDisabled={true}
                        onChange={(e) => {
                          setEditData({
                            ...editData,
                            email_id: e?.target?.value,
                          });
                          setError({ ...error, email: "" });
                        }}
                      />
                      {error?.email && (
                        <p className="errorText mb-0">{error?.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <InputText
                        placeholder={t("changesPassword", lan)}
                        labelName={t("changesPassword", lan)}
                        type="Password"
                        value={editData?.password || ""}
                        onKeyDown={(e) => setKeyCode(e.keyCode)}
                        onChange={(e) => {
                          onPassChange(e);
                        }}
                      />
                      {error?.password && (
                        <p className="errorText mb-0">{error?.password}</p>
                      )}
                    </div>
                    <div className="col-md-6 col-12">
                      <InputText
                        placeholder={t("ConfirmPassword", lan)}
                        labelName={t("ConfirmPassword", lan)}
                        type="Password"
                        value={editData?.confirm_password || ""}
                        onKeyDown={(e) => setKeyCode(e.keyCode)}
                        onChange={(e) => {
                          if (keyCode !== 32) {
                            setEditData({
                              ...editData,
                              confirm_password: e?.target?.value,
                            });
                            setError({ ...error, confirm_password: "" });
                          }
                        }}
                      />

                      {error?.confirm_password && (
                        <p className="errorText mb-0">
                          {error?.confirm_password}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="form-check ms-1 my-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                      onClick={(e) =>
                        setEditData({
                          ...editData,
                          is_swedishdefault: !e?.target?.checked,
                        })
                      }
                      checked={!editData?.is_swedishdefault}
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                      {t("AgreeToReceiveNotificationInSwedish", lan)}
                    </label>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={onSubmit}
                      disabled={loderBtn}
                      className="btn btn-green"
                    >
                      {loderBtn ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        t("SaveProfile", lan)
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>

      <Popup
        show={editPopup?.value}
        header="Status"
        handleClose={handleClosePopupStatus}
        className="MB-3"
      >
        <div className="popupinfo">
          <p>{editPopup?.data}</p>

          <Link
            to={
              editPopup?.data?.toLowerCase() ==
              "Profile Updated Successfully".toLowerCase()
                ? "/my-profile"
                : ""
            }
            onClick={() => {
              handleClosePopupStatus();
            }}
            className="btn btn-green text-uppercase w-100 mt-2  col-md-6 col-sm-6 col-xs-12"
          >
            {t("Okbutton", lan)}
          </Link>
        </div>
      </Popup>
    </div>
  );
};

export default EditProfile;
