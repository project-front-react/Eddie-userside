import "./ForgotPassword.scss";
import "../../../common/styles/globalStyles.scss";
import SliderForm from "../../../components/slider/SliderForm";
import MailIc from "../../../assets/images/ic-mail.svg";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../../translater/index";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { forgotPassApi } from "../../../services/authServices";
import Popup from "../../../components/popup/popup";
import { useSelector } from "react-redux";
import { encrypt } from "../../../utils/encrypt";

const ForgotPassword = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const history = useHistory();
  const emailref = useRef();
  const passwordref = useRef();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const [forgotPassResponce, setForgotPassResponce] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loderBtn, setLoderBtn] = useState(false);

  const forgotPassApiCall = () => {
    let emailVal = emailref.current.value;

    var bodyFormData = new FormData();

    const encryptedEmail=encrypt(emailVal)

    bodyFormData.append("email_id", encryptedEmail);
    setLoderBtn(true);
    forgotPassApi(bodyFormData)
      .then((res) => {
        setLoderBtn(false);
        if (res?.status === "success") {
          setForgotPassResponce(lan == "en" ? res.data : res?.data_sv);
          preventScroll();
          console.log(res);
        } else {
          setForgotPassResponce(lan == "en" ? res.data : res?.data_sv);
          preventScroll();

          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err.data);
        preventScroll();
        setLoderBtn(false);
        setForgotPassResponce(err.data);
      });
  };

  const forgotPassCall = (e) => {
    e.preventDefault();
    let emailVal = emailref.current.value;

    if (emailVal?.trim() === "") {
      setEmailError("Email should not be empty");
    } else if (!emailRegex.test(emailVal)) {
      setEmailError("Please enter a valid Email");
    } else {
      setEmailError(null);
    }
  };

  useEffect(() => {
    if (emailError == null) {
      forgotPassApiCall();
    }
  }, [emailError]);

  const handleClosePopup = () => {
    if (forgotPassResponce == "Email Sent Successfully") {
      history.push("/login");
    }
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setForgotPassResponce("");
    emailref.current.value = "";
    setEmailError("");
    // window.location.reload();
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };

  return (
    <div className="login-main">
      <div className="login-slider">
        {" "}
        <SliderForm
          imgClick={() => {
            history.push("/home");
          }}
        />
      </div>

      <div className="login-form">
        <form className="main-form-block">
          <h4>{t("ForgotPasswordHeader", lan)}</h4>

          <div className="form-group position-relative">
            <label htmlFor="exampleInputEmail1">{t("Email", lan)}</label>
            <input
              type="text"
              className="form-control fill-icon"
              aria-describedby="emailHelp"
              placeholder={t("Email", lan)}
              ref={emailref}
            />
            <span className="filled-icon">
              <img src={MailIc} />
            </span>
          </div>
          {emailError && <p className="errorText">{emailError}</p>}

          <button
            type="submit"
            className="btn btn-green w-100 mt-4"
            onClick={forgotPassCall}
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

      {forgotPassResponce !== "" && (
        <Popup
          show={forgotPassResponce !== "" ? true : false}
          header="Status"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <p>{forgotPassResponce}</p>
          </div>
          <div>
            <button
              onClick={handleClosePopup}
              className="btn btn-green w-100 mt-2"
            >
              {t("Okbutton", lan)}
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ForgotPassword;
