import "./ResetPassword.scss";
import "../../../common/styles/globalStyles.scss";
import SliderForm from "../../../components/slider/SliderForm";

import HideIc from "../../../assets/images/ic-Hide.svg";
import Eye from "../../../assets/images/eye.svg";

import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../../translater/index";
import { useEffect, useRef, useState } from "react";
import Popup from "../../../components/popup/popup";
import { useLocation } from "react-router-dom";
import { resetPassApi } from "../../../services/authServices";
import { useHistory } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { encrypt } from "../../../utils/encrypt";

const ResetPassword = () => {
  const history = useHistory();
  const search = useLocation().search;
  const email = new URLSearchParams(search).get("email");
  const uuid = new URLSearchParams(search).get("uuid");
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const passwordref = useRef();
  const cpasswordref = useRef();

  const [resetPawwordResponce, setResetPawwordResponce] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");
  const [loderBtn, setLoderBtn] = useState(false);

  const [passwordType, setPasswordType] = useState("password");
  const [cpasswordType, setCpasswordType] = useState("password");
  const [passError, setPassError] = useState("");
  const [keyCode, setKeyCode] = useState();
  const [passWord, setpassWord] = useState("");
  const [cpass, setCpass] = useState("");
  const onPassChange = (e) => {
    if (keyCode !== 32) {
      setpassWord(e.target.value);
    }
  };

  const resetPassApiCall = () => {
    var bodyFormData = new FormData();

    
    const encryptedPassword=encrypt(passWord)
    const encryptedEmail=encrypt(email)

    bodyFormData.append("email_id", encryptedEmail);
    bodyFormData.append("password", encryptedPassword);
    // bodyFormData.append('user_type', "Us er");
    setLoderBtn(true);
    resetPassApi(uuid, bodyFormData)
      .then((res) => {
        setLoderBtn(false);
        if (res?.status === "success") {
          setResetPawwordResponce(lan == "en" ? res.data : res?.data_sv);
          preventScroll();
          // history.push("/login")
        } else {
          setResetPawwordResponce(lan == "en" ? res.data : res?.data_sv);
          preventScroll();
        }
      })
      .catch((err) => {
        console.log(err.data);
        preventScroll();
        setLoderBtn(false);
        setResetPawwordResponce(err.data);
      });
  };

  const resetPasswordCall = (e) => {
    e.preventDefault();
    const passRegex = /^(?=.*\d)(?=.*[!@_#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g;
    let passwordVal = passWord;
    let cPasswordVal = cpass;

    if (passwordVal.trim() === "") {
      setPasswordError("Password should not be empty");
    } else {
      setPasswordError(null);
    }
    if (passwordVal && passRegex.test(passwordVal) === false) {
      setPassError(
        "Your password must be at least 8 characters long, contain at least one number, contain at least one special character and have a mixture of uppercase and lowercase letters."
      );
    } else {
      setPassError(null);
    }
    if (cPasswordVal !== passwordVal) {
      setCPasswordError("Password does not match");
    } else {
      setCPasswordError(null);
    }
  };

  useEffect(() => {
    if (passwordError == null && cPasswordError == null && passError === null) {
      resetPassApiCall();
    }
  }, [passwordError, cPasswordError, passError]);

  const handleClosePopup = () => {
    if (
      resetPawwordResponce == "Password changed successfully" ||
      resetPawwordResponce == "Lösenordet är nu ändrat"
    ) {
      history.push("/login");
      setCpass("");
      setpassWord("");
    }
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setResetPawwordResponce("");

    setPasswordError("");
    setCPasswordError("");
    // window.location.reload()
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };

  const showPassword = (show) => {
    show ? setPasswordType("text") : setPasswordType("password");
  };
  const showCPassword = (show) => {
    show ? setCpasswordType("text") : setCpasswordType("password");
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
        <form className="main-form-block">
          <h4>{t("ResetPassword", lan)}</h4>

          <div className="form-group position-relative">
            <label htmlFor="exampleInputEmail1">
              {t("PasswordPlaceholder", lan)}
            </label>
            <input
              type={passwordType}
              className="form-control fill-icon"
              aria-describedby="emailHelp"
              placeholder={t("PasswordPlaceholder", lan)}
              value={passWord}
              onKeyDown={(e) => setKeyCode(e.keyCode)}
              onChange={(e) => {
                onPassChange(e);
              }}
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
          {passError && <p className="errorText mb-0">{passError}</p>}

          <div className="form-group position-relative">
            <label htmlFor="exampleInputEmail1">{t("ConfirmPassword", lan)}</label>
            <input
              type={cpasswordType}
              className="form-control fill-icon"
              aria-describedby="emailHelp"
              placeholder={t("ConfirmPassword", lan)}
              value={cpass}
              onKeyDown={(e) => setKeyCode(e.keyCode)}
              onChange={(e) => {
                if (keyCode !== 32) {
                  setCpass(e.target.value);
                }
              }}
            />
            <span className="filled-icon">
              {cpasswordType === "password" ? (
                <img
                  src={Eye}
                  onClick={() => {
                    showCPassword(true);
                  }}
                />
              ) : (
                <img
                  src={HideIc}
                  onClick={() => {
                    showCPassword(false);
                  }}
                />
              )}
            </span>
          </div>
          {cPasswordError && <p className="errorText">{cPasswordError}</p>}

          <button
            type="submit"
            className="btn btn-green  text-uppercase w-100 mt-4"
            onClick={resetPasswordCall}
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

      {resetPawwordResponce !== "" && (
        <Popup
          show={resetPawwordResponce !== "" ? true : false}
          header="Status"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <p>{resetPawwordResponce}</p>
          </div>
          <div>
            <button
              onClick={handleClosePopup}
              className="btn btn-green text-uppercase w-100 mt-2"
            >
              {t("Okbutton", lan)}
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ResetPassword;
