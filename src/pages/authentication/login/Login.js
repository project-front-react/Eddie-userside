import "./Login.scss";
import "../../../common/styles/globalStyles.scss";
import "./Login.scss";
import SliderForm from "../../../components/slider/SliderForm";
import FacebookIc from "../../../assets/images/ic-facebook.svg";
import TwitterIc from "../../../assets/images/ic-twitter.svg";
import GoogleIc from "../../../assets/images/ic-google.svg";
import languageIcon from "../../../assets/images/language.svg";
import CryptoJS from "crypto-js";
import MailIc from "../../../assets/images/ic-mail.svg";
import HideIc from "../../../assets/images/ic-Hide.svg";
import Eye from "../../../assets/images/eye.svg";
import { getTranslatedText as t } from "../../../translater/index";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { loginApi } from "../../../services/authServices";
import Popup from "../../../components/popup/popup";
import { useDispatch, useSelector } from "react-redux";
import { language, userDetail } from "../../../redux/actions";
import { fetchToken } from "../../../services/firebaseService";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import { encrypt } from "../../../utils/encrypt";

// var gapi = window.gapi;
// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const platform = localStorage.getItem("Platform");
const CLIENT_ID = process.env[`REACT_APP_${platform}_CLIENT_ID`];
const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const emailref = useRef();
  const passwordref = useRef();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const [loginError, setLoginError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [loderBtn, setLoderBtn] = useState(false);

  // const socialLoginCall = (data, type) => {
  //   var bodyFormData = new FormData();
  //   bodyFormData.append("email_id", data?.email || "");
  //   bodyFormData.append("first_name", data?.first_name || "");
  //   bodyFormData.append("last_name", data?.last_name || "");
  //   bodyFormData.append("is_login_from", type);
  //   if (type == "facebook")
  //     return bodyFormData.append("access_token", data?.access_token);

  //   loginApi(bodyFormData)
  //     .then((res) => {
  //       if (res?.status === "success") {
  //         if (res.user_type === "User") {
  //           setLoginError("");
  //           localStorage.setItem("logedInUser", true);
  //           localStorage.setItem("logedInEmail", data?.email);
  //           localStorage.setItem("Authorization", res.Authorization);
  //           dispatch(userDetail(res));
  //           if (res.user_profile == false) {
  //             history.push("/create-profile");
  //           } else {
  //             history.push("/user-dashboard");
  //           }
  //         } else {
  //           setLoginError("Unauthorised User");
  //         }
  //       } else {
  //         setLoginError(res.data);
  //         preventScroll();
  //         console.log("error", res);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("err1", err.data);
  //       setLoginError(err.data);
  //     });
  // };

  const socialLoginCall = (data, type) => {
    var bodyFormData = new FormData();
    console.log(">>>data",data);
    const encryptedEmail=encrypt(data?.email)

    bodyFormData.append("email_id", encryptedEmail || "");
    bodyFormData.append("first_name", data?.first_name || "");
    bodyFormData.append("last_name", data?.last_name || "");
    bodyFormData.append("is_login_from", type);
     bodyFormData.append("access_token", data?.access_token);

    loginApi(bodyFormData)
      .then((res) => {
        if (res?.status === "success") {
          if (res.user_type === "User") {
            setLoginError("");
            localStorage.setItem("logedInUser", true);
            localStorage.setItem("logedInEmail", res?.data?.email);
            localStorage.setItem("Authorization", res.Authorization);
            dispatch(userDetail(res));
            if (res.user_profile == false) {
              history.push("/create-profile");
            } else {
              history.push("/user-dashboard");
            }
          } else {
            setLoginError("Unauthorised User");
          }
        } else {
          setLoginError(res.data);
          preventScroll();
          console.log("error", res);
        }
      })
      .catch((err) => {
        console.log("err1", err.data);
        setLoginError(err.data);
      });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      socialLoginCall(tokenResponse, "google");
    },
  });
  // const login = () => {
  //   try {
  //     gapi.load("client:auth2", async () => {
  //       window.gapi.client.init({
  //         clientId: CLIENT_ID,
  //         scope: "email",
  //         plugin_name: "fcmDemo",
  //       });

  //       return gapi.auth2
  //         .getAuthInstance()
  //         .signIn()
  //         .then(async (data) => {
  //           console.log("data",data.qv)
  //           // let abc = data[2]
  //           // console.log("qqqqq",Object.values(abc));
  //           const userObj = {
  //             name: platform=="PROD"?data?.qv?.BZ:data?.gv?.zf,
  //             first_name:platform=="PROD"?data?.qv?.zf: data?.gv?.gZ,
  //             last_name:platform=="PROD"?data?.qv?.RX: data?.gv?.tX,
  //             email: platform=="PROD"?data?.qv?.dw:data?.gv?.Tv,
  //           };
  //           console.log("userobject",userObj)
  //           socialLoginCall(userObj, "google");
  //         })
  //         .catch(({ error }) => {
  //           setLoginError(error);
  //         });
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const responseGoogle = (response) => {
  //   socialLoginCall(response, "google");
  // };
  const loginApiCall = async () => {
    let emailVal = emailref.current.value;
    let passwordVal = passwordref.current.value;
    setLoderBtn(true);
    const deviceToken = await fetchToken();
    var ciphertext = CryptoJS.AES.encrypt(
      emailVal,
      process.env[`REACT_APP_${platform}_ENCRYPT_SECRET_KEY`]
    ).toString();
    console.log("ccc", ciphertext);
    var bytes = CryptoJS.AES.decrypt(
      ciphertext,
      process.env[`REACT_APP_${platform}_ENCRYPT_SECRET_KEY`]
    );
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    const encryptedPassword=encrypt(passwordVal)
    const encryptedEmail=encrypt(emailVal)

    console.log("decrepted", decryptedData);
    var bodyFormData = new FormData();
    bodyFormData.append("email_id", encryptedEmail);
    bodyFormData.append("password", encryptedPassword);
    bodyFormData.append("is_login_from", "normal");
    bodyFormData.append("user_type", "User");
    deviceToken && bodyFormData.append("device_token", deviceToken);
    loginApi(bodyFormData)
      .then((res) => {
        setLoderBtn(false);
        if (res?.status === "success") {
          if (res.user_type === "User") {
            setLoginError("");
            localStorage.setItem("logedInUser", true);
            localStorage.setItem("logedInEmail", emailVal);
            localStorage.setItem("Authorization", res.Authorization);
            localStorage.setItem("lan", res?.is_swedishdefault ? 'sw':'en');
            dispatch(userDetail(res));
            dispatch(language(res?.is_swedishdefault?'sw':'en'))
            if (res.user_profile == false) {
              history.push("/create-profile");
            } else {
              history.push(res.is_corporate ? "/corporate-user-dashboard": "/user-dashboard");
            }
          } else {
            setLoginError(lan == "en" ? res.data : res?.data_sv);
          }
        } else {
          setLoginError(lan == "en" ? res.data : res?.data_sv);
          preventScroll();
          console.log("error", res);
        }
      })
      .catch((err) => {
        setLoderBtn(false);
        console.log("err1", err.data);
        setLoginError(err.data);
      });
  };

  const loginCall = (e) => {
    e.preventDefault();
    let emailVal = emailref.current.value;
    let passwordVal = passwordref.current.value;

    if (emailVal?.trim() === "") {
      setEmailError("Email should not be empty");
    } else if (!emailRegex.test(emailVal)) {
      setEmailError("Please enter a valid Email");
    } else {
      setEmailError(null);
    }

    if (passwordVal.trim() === "") {
      setPasswordError("Password should not be empty");
    } else {
      setPasswordError(null);
    }
  };

  useEffect(() => {
    if (emailError == null && passwordError == null) {
      loginApiCall();
    }
  }, [emailError, passwordError]);

  const handleClosePopup = () => {
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setLoginError("");
    // emailref.current.value = ""
    // passwordref.current.value = ""
    setEmailError("");
    setPasswordError("");
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };

  const showPassword = (show) => {
    show ? setPasswordType("text") : setPasswordType("password");
  };
  const onLanChange = (e) => {
    dispatch(language(e));
    localStorage.setItem("lan", e);
    window.location.reload();
  };

  return (
    <div className="login-main">
      <div className="login-slider">
        <SliderForm
          imgClick={() => {
            history.push("/home");
          }}
        />
      </div>

      <div className="login-form">
        <div className="langauge-d-sec">
          <div className="langauge-dd ">
            <p className="align-self-center mb-0">{t("ChooseLan", lan)}</p>
            {/* <select
                  value={lan}
                  onChange={(e) => {
                    onLanChange(e);
                  }}
                >
                  <option value="en">EN</option>
                  <option value={"sw"}>SW</option>
                </select> */}
            <div className="dropdown">
              <img className="dropdown-toggle" src={languageIcon}></img>

              <ul>
                <li>
                  <span
                    className="dropdown-item mb-0"
                    id="en"
                    onClick={(e) => {
                      onLanChange(e?.target?.id);
                    }}
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

        <form className="main-form-block">
          <h4>{t("Login", lan)}</h4>
          <div className="form-group position-relative">
            <label htmlFor="exampleInputEmail1">{t("Email", lan)}</label>
            <input
              type="email"
              className="form-control fill-icon"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder={t("emailPlaceholder", lan)}
              ref={emailref}
            />
            <span className="filled-icon">
              <img src={MailIc} />
            </span>
          </div>
          {emailError && <p className="errorText">{emailError}</p>}

          <div className="form-group position-relative">
            <label htmlFor="exampleInputPassword1">
              {t("PasswordPlaceholder", lan)}
            </label>
            <input
              type={passwordType}
              className="form-control fill-icon"
              id="exampleInputPassword1"
              placeholder={t("PasswordPlaceholder", lan)}
              ref={passwordref}
            />
            <span className="filled-icon">
              {passwordType === "password" ? (
                <img
                  src={Eye}
                  onClick={() => {
                    showPassword(true);
                  }}
                />
              ) : (
                <img
                  src={HideIc}
                  onClick={() => {
                    showPassword(false);
                  }}
                />
              )}
            </span>
          </div>
          {passwordError && <p className="errorText">{passwordError}</p>}
          <div className="form-group text-end w-100">
            <Link className="link-green" to="/forgotpassword">
              {t("ForgotPassword", lan)}
            </Link>
          </div>
          {/* <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Check me out
            </label>
          </div> */}
          <button
            type="submit"
            className="btn btn-green  w-100 mt-2"
            disabled={loderBtn}
            onClick={loginCall}
          >
            {loderBtn ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              t("Login", lan)
            )}
          </button>

          <div className="form-group text-center w-100 font18">
            <span className="me-2">{t("DontHaveAnAccount", lan)}</span>
            <Link className="link-green" to="/create-account">
              {t("SignUp", lan)}
            </Link>
          </div>

          <div className="text-start-login w-100 mt-2">
            {/* <h5>{t("SocialMediaTitle", lan)}</h5> */}

            <div className="social-login">
              <div className="cursor-pointer">
                {/* <img src={GoogleIc} /> */}
                <GoogleButton
                  type="light" // can be light or dark
                  onClick={() => login()}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="bottom-line">
          <Link to="/terms-and-conditions" className="link-green">
            {t("terms", lan)} |{" "}
          </Link>
          <Link to="/privacy-policy" className="link-green">
            {t("privacy", lan)}
          </Link>
        </div>
      </div>

      {loginError !== "" && (
        <Popup
          show={loginError !== "" ? true : false}
          header="Status"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <p>{loginError}</p>
          </div>
          <div>
            <button
              onClick={handleClosePopup}
              className="btn btn-green  w-100 mt-2"
            >
              {t("Okbutton", lan)}
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default Login;
