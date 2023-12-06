import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Header.scss";
import Logo from "../../assets/logo/logo.svg";
import languageIcon from "../../assets/images/language.svg";
import IcNotification from "../../assets/images/ic-notification.svg";
import FilterSelectMenu from "../FilterSelectMenu/FilterSelectMenu";
import { getTranslatedText as t } from "../../translater/index";
import { useDispatch, useSelector } from "react-redux";
import {
  clearData,
  footerData,
  getPersonalProfileData,
  language,
  logout,
  tabPageNo,
  userDetail,
} from "../../redux/actions";
import MegaMenu from "../MegaMenu/MegaMenu";
import placeholder from "../../assets/images/placeholder.svg";
import noUser from "../../assets/images/noUser.svg";
import io from "socket.io-client";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearNoti, getNotification } from "../../services/eddiServices";
import { getHeaderFooterApi } from "../../services/cmsServices";

function Header(props) {
  // const backendSocket = io.connect("wss://testyourapp.online:5001/", {
  //   transports: ["websocket"],
  //   upgrade: false,
  // });
  const state = useSelector((state) => state?.Eddi?.UserDetail);
  const stateData = useSelector((state) => state?.Eddi);
  let lan = stateData?.language || 'sw';
  const dispatch = useDispatch();
  const email = localStorage.getItem("logedInEmail");

  const [lanValue, setLanValue] = useState(stateData?.language);
  const [notificationData, setNotificationData] = useState([]);
  const [newNoti, setNewNoti] = useState(0);
  const [toggleClass, setToggleClass] = useState(false);
  const [headerData, setHeaderData] = useState();


  const notificationApi = () => {
    getNotification()
      .then((result) => {
        if (result.status == "success") {
          setNotificationData(result?.data);
        }
      })
      .catch((e) => console.log(e));
  };

  const headerFooterCall = () => {
    getHeaderFooterApi()
      .then((res) => {
        if (res.status == "success") {
          setHeaderData(res.data)
          dispatch(footerData(res.data))
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    // backendSocket.on("JSONreceived", (data) => {
    //   let newArray = notificationData;
    //   let filtered = data?.message?.receiver.filter((fill) => fill == email);
    //   console.log("filtered", filtered);
    //   if (filtered?.length > 0) {
    //     console.log("JSON received =>", data.message);
    //     newArray?.unshift(data.message);
    //     toast.success("New Notification Recived", {
    //       icon: ({ theme, type }) => <img src={IcNotification} />,
    //     });
    //     setNewNoti(newNoti + 1);
    //     setNotificationData(newArray);
    //   }
    // });
    headerFooterCall();
    if (localStorage.getItem("logedInUser") == "true") return notificationApi();
  }, []);
  useEffect(() => {
    if (lan) {
      localStorage.setItem("lan", lan)
    }
  }, [lan])
  const clearAllNoti = () => {
    let formData = new FormData();
    formData.append("is_clear", true);
    clearNoti(formData).then((result) => {
      setNewNoti();
      setNotificationData([]);
      toast.success(result.data);
    });
  };
  const onLanChange = (val) => {
    dispatch(language(val));
    setLanValue(val);
    localStorage.setItem("lan", val);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const onLogout = () => {
    // localStorage.clear();
    localStorage.removeItem("logedInUser");
    localStorage.removeItem("logedInEmail");
    localStorage.removeItem("Authorization");
    // localStorage.removeItem("logedInEmail");

    dispatch(logout());
    dispatch(clearData(lan));
  };

  let mobilemenustatus = false;
  function mobilemenu() {
    let Element = document.getElementById("navbarSupportedContent");
    if (!mobilemenustatus) {
      if(Element)  Element.style.display = "block";
     
      mobilemenustatus = true;
    } else {
      if(Element)  Element.style.display = "none";

      mobilemenustatus = false;
    }
  }
  function closeMenu() {
    let Element = document.getElementById("navbarSupportedContent");
    Element.style.display = "none";
    mobilemenustatus = false;
  }
  return (
    <div className="header-main">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link
            className="navbar-brand"
            to={
              props?.disableProfile
                ? null
                : localStorage.getItem("logedInUser")
                  ? "/user-dashboard"
                  : "/"
            }
          >
            <img src={headerData?.eddi_logo_header} className="mobile-logo" />
          </Link>
          {props?.disableProfile || props?.hidePartial ? (
            <p></p>
          ) : (
            <button
              className="navbar-toggler"
              type="button"
              onClick={mobilemenu}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          )}

          {props?.disableProfile || props?.hidePartial ? (
            <p></p>
          ) : (
            <div
              className="collapse navbar-collapse mob-menu"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className={
                      window.location.href.includes("/home")
                        ? "nav-link text-active"
                        : "nav-link"
                    }
                    to="/home"
                  >
                    {console.log("headerData?.button_1_text",headerData?.button_1_text)}
                    {headerData?.button_1_text}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      window.location.href.includes("/about-eddi")
                        ? "nav-link text-active"
                        : "nav-link"
                    }
                    to="/about-eddi"
                  >
                    {headerData?.button_2_text}
                  </Link>
                </li>
                <li className="nav-item dropdown dd-arrow">
                  <div
                    className="nav-link  cursor-pointer"
                    onClick={() => setToggleClass(!toggleClass)}
                  >
                    {headerData?.button_3_text}
                  </div>
                  {toggleClass ? (
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <MegaMenu />
                    </div>
                  ) : (
                    ""
                  )}
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      window.location.href.includes("/contact-us")
                        ? "nav-link text-active"
                        : "nav-link"
                    }
                    to="/contact-us"
                  >
                    {headerData?.button_4_text}
                  </Link>
                </li>
              </ul>
              <div className="langauge-dd d-lg-none">
                <p className="choose-lan">{t("ChooseLan", lan)}</p>
                <select
                  value={lanValue}
                  onChange={(e) => {
                    onLanChange(e?.target?.value);
                  }}
                >
                  <option value="en">EN</option>
                  <option value={"sw"}>SW</option>
                </select>
              </div>
            </div>
          )}
          <div className="d-flex">
            {localStorage.getItem("logedInUser") != "true" ? (
              <Link to="/login" className="btn btn-grn">
                {headerData?.login_button_text}
              </Link>
            ) : (
              <div
                className={
                  window.location.href.includes("/edit-eddi-profile")
                    ? "user-information forUserProfile"
                    : "user-information"
                }
              >
                {/* <div className="noti-bell">
                  <img src={IcNotification} />
                  <span className="notiDot"></span>
                </div> */}
                {/* <div className="d-flex align-items-center">
                  <span>John Doe</span>
                  <span className="user-img nav-item dropdown">
                    <img src={ProfileImage} className="w-100" />
                  </span>
                </div> */}

                {props?.disableProfile  ? (
                  <p></p>
                ) : (
                  <div className="d-flex align-items-center noti-main-block">
                    <div className="nav-item dropdown">
                      <span className="nav-item dropdown" onClick={closeMenu}>
                        <div className="noti-bell">
                          <Link className="dropdown-toggle">
                            <img src={IcNotification} />
                            {notificationData?.length > 0 && (
                              <span className="notiDot"></span>
                            )}
                          </Link>
                        </div>
                      </span>

                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        {notificationData?.length > 0 && (
                          <div>
                            <Link
                              className="dropdown-item text-end link-green"
                              onClick={() => {
                                clearAllNoti();
                              }}
                            >
                              {t("ClearAll", lan)}
                            </Link>
                          </div>
                        )}
                        {notificationData?.length > 0 ? (
                          notificationData.map((noti, ind) => {
                            return (
                              <>
                                <li key={ind}>
                                  <Link className="dropdown-item">
                                    <p>
                                      {lan == "en"
                                        ? noti?.message
                                        : noti?.message_sv}
                                    </p>
                                  </Link>
                                </li>
                              </>
                            );
                          })
                        ) : (
                          <div className="mt-5 text-center">
                            {t("NoNotification", lan)}
                          </div>
                        )}

                        {/* Clear All is button for clear all notification */}
                        {/* {notificationData?.length > 0 && (
                          <div>
                            <Link
                              className="dropdown-item text-end link-green"
                              onClick={() => {
                                clearAllNoti();
                              }}
                            >
                              {t("ClearAll", lan)}
                            </Link>
                          </div>
                        )} */}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-center user-porfile-main">
                  <span className="profil-username">
                    {stateData?.personalData?.first_name
                      ? `${stateData?.personalData?.first_name} ${stateData?.personalData?.last_name}`
                      : `${state.data?.first_name} ${state?.data?.last_name} `}
                  </span>
                  <div className="nav-item dropdown">
                    <span
                      className="user-img nav-item dropdown"
                      onClick={closeMenu}
                    >
                      <Link className="dropdown-toggle">
                        <img
                          src={
                            stateData?.personalData?.profile_image
                              ? `${stateData?.personalData?.profile_image}`
                              : noUser
                          }
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = noUser;
                          }}
                        // className="w-100 "
                        />
                      </Link>
                    </span>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <div className="dd-profile">
                        <span className="user-img nav-item dropdown">
                          <Link className="dropdown-toggle">
                            <img
                              src={
                                stateData?.personalData?.profile_image
                                  ? `${stateData?.personalData?.profile_image}`
                                  : noUser
                              }
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = noUser;
                              }}
                            // className="w-100 "
                            />
                          </Link>
                        </span>
                        <span className="profil-username ms-2">
                          <div>
                            {stateData?.personalData?.first_name
                              ? `${stateData?.personalData?.first_name} ${stateData?.personalData?.last_name}`
                              : `${state.data?.first_name} ${state?.data?.last_name} `}
                          </div>
                          {props.disableProfile && !props?.hidePartial ? null : (
                            <div className="quik-profilelink">
                              <Link to="/my-profile">{t("VIEW", lan)}</Link> |{" "}
                              <Link to="/edit-profile">
                                {t("EditProfile", lan)}
                              </Link>
                            </div>
                          )}
                        </span>
                      </div>
                      {props.disableProfile && !props?.hidePartial ? null : (
                        <li>
                          <Link className="dropdown-item" to="/user-dashboard">
                            {t("Dashboard", lan)}
                          </Link>
                        </li>
                      )}
                      {props.disableProfile && !props?.hidePartial ? null : (
                        <li>
                          <Link
                            className="dropdown-item"
                            onClick={() => {
                              dispatch(tabPageNo(1));
                            }}
                            to="/edit-eddi-profile"
                          >
                            {t("EddiProfile", lan)}
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/"
                          onClick={() => {
                            onLogout();
                          }}
                        >
                          {t("Logout", lan)}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <div className={props.hidePartial ? "langauge-dd  d-lg-flex": "langauge-dd d-none d-lg-flex"}>
   
              <div className="dropdown">
                <img
                  className=" dropdown-toggle"
                  src={languageIcon}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></img>

                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <span
                      className="dropdown-item mb-0"
                      id="en"
                      onClick={(e) => onLanChange(e?.target?.id)}
                    >
                      EN
                    </span>
                  </li>
                  <li>
                    <span
                      className="dropdown-item mb-0"
                      id="sw"
                      onClick={(e) => onLanChange(e?.target?.id)}
                    >
                      SW
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      /> */}
    </div>
  );
}

export default Header;
