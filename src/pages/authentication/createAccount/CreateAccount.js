import "./CreateAccount.scss";
import "../../../common/styles/globalStyles.scss";
import SliderForm from "../../../components/slider/SliderForm";
import "../../../common/styles/variables.scss";

import MailIc from "../../../assets/images/ic-mail.svg";
import HideIc from "../../../assets/images/ic-Hide.svg";
import languageIcon from "../../../assets/images/language.svg";
import Eye from "../../../assets/images/eye.svg";
import UserIc from "../../../assets/images/ic-User.svg";
import { getTnCApi } from "../../../services/cmsServices";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../../translater/index";
import { useHistory } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { signupApi } from "../../../services/authServices";
import Popup from "../../../components/popup/popup";
import { useDispatch, useSelector } from "react-redux";
import { language, tncData } from "../../../redux/actions";
import { fetchToken } from "../../../services/firebaseService";
import { encrypt } from "../../../utils/encrypt";

const CreateAccount = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const platform=localStorage.getItem("Platform")
  const history = useHistory();
  const fnameref = useRef();
  const lnameref = useRef();
  const emailref = useRef(null);
  const dispatch = useDispatch();
  const ancRef = useRef();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const queryParams = new URLSearchParams(history.location.search);
  const isCorporate = !!queryParams.get('token') && queryParams.get('type') =='corporate'
  const paramsEmail =  queryParams.get('email')
  const [signupResponce, setSignupResponce] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");
  const [ancError, setAncError] = useState("");
  const [loderBtn, setLoderBtn] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [cpasswordType, setCpasswordType] = useState("password");
  const [passWord, setPassWord] = useState("");
  const [checkLength, setChecklength] = useState(false);
  const [checkUpper, setCheckUpper] = useState(false);
  const [passError, setPassError] = useState("");
  const [checkChar, setCheckChar] = useState(false);
  const [checkNum, setCheckNum] = useState(false);
  const [keyCode, setKeyCode] = useState();
  const [cpass, setCpass] = useState("");
  const [agreeCheckbox, setAgreeCheckbox] = useState(false);
  const [agreeToNotificationInSw, setAgreeToNotificationInSw] = useState(true);
  const [termsPopup, setTermsPopup] = useState(false);
  const [tncAllData, setTncData] = useState(state?.tncData);
  const [disable, setDisable] = useState(true);
  const [isPasswordErr, setIsPasswordErr] = useState(true);

  useEffect(() => {
    // if (!state?.tncData?.section_2_description) {
    //   tncCall(); 
    // }
    tncCall();  
  }, [lan]);
  useEffect(()=>{
    if(paramsEmail &&paramsEmail?.trim() !== ''){
    let element = document.getElementById('email-form') 
    if(!element) return 
    element.value = paramsEmail
    }
  },[])
  const tncCall = () => {
    getTnCApi().then((res) => {
      if (res.status === "success") {
        setTncData(res.data);
        dispatch(tncData(res.data));
      }
    });
  };

  useEffect(() => {
    passwordValidation();
  }, [passWord]);

  const onPassChange = (e) => {
    if (keyCode !== 32) {
      setPassWord(e.target.value);
    }
  };

  const passwordValidation = () => {
    // Validate lowercase letters
    var characters = /[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g;
    if (passWord.match(characters)) {
      setCheckChar(true);
      setPasswordError(null);
    } else {
      setCheckChar(false);
    }
    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (passWord.match(upperCaseLetters)) {
      setCheckUpper(true);
      setPasswordError(null);
    } else {
      setCheckUpper(false);
    }
    // Validate numbers
    var numbers = /[0-9]/g;
    if (passWord.match(numbers)) {
      setCheckNum(true);
      setPasswordError(null);
    } else {
      setCheckNum(false);
    }

    // Validate length
    if (passWord.length >= 8) {
      setChecklength(true);
      setPasswordError(null);
    } else {
      setChecklength(false);
    }
  };

  const signupApiCall = async () => {
    setTermsPopup(false);
    if (
      checkChar === true &&
      checkLength === true &&
      checkNum === true &&
      checkUpper === true
    ) {
      let fnameVal = fnameref.current.value;
      let lnameVal = lnameref.current.value;
      let emailVal = emailref.current.value;
      let passwordVal = passWord;
      const deviceToken = await fetchToken();

      const encryptedPassword=encrypt(passwordVal)
      const encryptedEmail=encrypt(emailVal)

      var bodyFormData = new FormData();
      bodyFormData.append("first_name", fnameVal);
      bodyFormData.append("last_name", lnameVal);
      bodyFormData.append("email_id", encryptedEmail);
      bodyFormData.append("password", encryptedPassword);
      bodyFormData.append("user_type", "User");
      bodyFormData.append("is_swedishdefault", agreeToNotificationInSw);
      deviceToken && bodyFormData.append("device_token", deviceToken);
      isCorporate && bodyFormData.append("is_corporate", true);
      isCorporate && bodyFormData.append("supplier_uuid", queryParams.get('token'));
      isCorporate && bodyFormData.append("domain_name", queryParams.get('domain'));
      setLoderBtn(true);
      signupApi(bodyFormData)
        .then((res) => {
          setLoderBtn(false);
          setAgreeCheckbox(false);
          if (res?.status === "success") {
            setSignupResponce(t("VerifyMail", lan));
            preventScroll();
            // history.push("/login")
          } else {
            setSignupResponce(lan == "en" ? res.data : res.data_sv);
            preventScroll();
            console.log(res);
          }
        })
        .catch((err) => {
          setLoderBtn(false);
          console.log(err.data);
          preventScroll();
          setSignupResponce(err.data);
        });
    }
  };
  const onLanChange = (e) => {
    dispatch(language(e));
    localStorage.setItem("lan", e);
  };
  const onTncPopupClose = () => {
    setTermsPopup(false);
    setFnameError();
    setLnameError();
    setAgreeCheckbox(false);
    setPasswordError("");
    setEmailError();
    setAncError();
  };

  const signupCall = (e) => {
    const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g;
    e.preventDefault();
    let fnameVal = fnameref.current.value;
    let lnameVal = lnameref.current.value;
    let emailVal = emailref.current.value;
    let passwordVal = passWord;
    let cPasswordVal = cpass;
    // let AgreeTnC = ancRef.current.checked;

    if (fnameVal?.trim() === "") {
      setFnameError("First name should not be empty");
    } else if (fnameVal?.length > 25) {
      setFnameError("Max limit is 25 Character");
    } else {
      setFnameError(null);
    }

    if (lnameVal?.trim() === "") {
      setLnameError("Last name should not be empty");
    } else if (lnameVal?.length > 25) {
      setLnameError("Max limit is 25 Character");
    } else {
      setLnameError(null);
    }

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
    if (
      checkChar === true &&
      checkLength === true &&
      checkNum === true &&
      checkUpper === true
    ) {
      setPasswordError(null);
    } else {
      setPasswordError("Enter valid password");
    }

    if (
      checkChar === true &&
      checkLength === true &&
      checkNum === true &&
      checkUpper === true &&
      cPasswordVal === passwordVal
    ) {
      setIsPasswordErr(false);
    } else {
      setIsPasswordErr(true);
    }

    if (cPasswordVal !== passwordVal) {
      setCPasswordError("Password does not match");
    } else {
      setCPasswordError(null);
    }
  };

  useEffect(() => {
    if (
      fnameError === null &&
      lnameError === null &&
      emailError === null &&
      isPasswordErr === false
    ) {
      setTermsPopup(true);
    }
  }, [
    fnameError,
    lnameError,
    emailError,
    passwordError,
    isPasswordErr,
    cPasswordError,
  ]);

  const handleClosePopup = () => {
    if (
     ( signupResponce === "Please verify your account through your email") ||
      (signupResponce === "Vänligen verifiera ditt konto genom din email")
    ) {
      console.log("redirect",signupResponce);
      history.push("/login");
    }
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setSignupResponce("");
    // fnameref.current.value = ""
    // lnameref.current.value = ""
    // emailref.current.value = ""
    // passwordref.current.value = ""
    // cpasswordref.current.value = ""
    // ancRef.current.checked = false;
    setFnameError("");
    setLnameError("");
    setEmailError("");
    setPasswordError("");
    setCPasswordError("");
    setAncError("");
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
        {" "}
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
        <form className="main-form-block">
          <h4>{t("CreateAccount", lan)}</h4>
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="form-group position-relative">
                <label htmlFor="exampleInputEmail1">{t("FirstName", lan)}</label>
                <input
                  type="text"
                  className="form-control fill-icon"
                  aria-describedby="emailHelp"
                  placeholder={t("FirstName", lan)}
                  ref={fnameref}
                />
                <span className="filled-icon">
                  <img src={UserIc} />
                </span>
              </div>
              {fnameError && <p className="errorText">{fnameError}</p>}
            </div>
            <div className="col-md-6 col-12">
              <div className="form-group position-relative">
                <label htmlFor="exampleInputEmail1">{t("LastName", lan)}</label>
                <input
                  type="text"
                  className="form-control fill-icon"
                  aria-describedby="emailHelp"
                  placeholder={t("LastName", lan)}
                  ref={lnameref}
                />
                <span className="filled-icon">
                  <img src={UserIc} />
                </span>
              </div>
              {lnameError && <p className="errorText">{lnameError}</p>}
            </div>
          </div>

          <div className="form-group position-relative">
            <label>{t("email", lan)}</label>
            <input
              type="text"
              className="form-control fill-icon"
              id="email-form"
              placeholder={t("emailPlaceholder", lan)}
              ref={emailref}
            />
            <span className="filled-icon">
              <img src={MailIc} />
            </span>
          </div>
          {emailError && <p className="errorText">{emailError}</p>}

          <div className="row">
            <div className="col-md-6 col-12">
              <div className="form-group position-relative">
                <label htmlFor="exampleInputEmail1">{t("Password", lan)}</label>
                <input
                  type={passwordType}
                  className="form-control fill-icon"
                  aria-describedby="emailHelp"
                  placeholder={t("Password", lan)}
                  value={passWord}
                  onKeyDown={(e) => setKeyCode(e.keyCode)}
                  onChange={(e) => onPassChange(e)}
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
            </div>
            <div className="col-md-6 col-12">
              <div className="form-group position-relative">
                <label htmlFor="exampleInputEmail1">
                  {t("ConfirmPassword", lan)}
                </label>
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
            </div>
          </div>

          <div className="password-highlighter">
            <ul>
              <li
                style={checkUpper ? { color: "#3e8181" } : { color: "initial" }}
                className={checkUpper ? "highlighter" : ""}
              >
                {t("pwd1", lan)}
              </li>
              <li
                style={checkChar ? { color: "#3e8181" } : { color: "initial" }}
                className={checkChar ? "highlighter" : ""}
              >
                {t("pwd2", lan)}
              </li>
              <li
                style={checkNum ? { color: "#3e8181" } : { color: "initial" }}
                className={checkNum ? "highlighter" : ""}
              >
                {t("pwd3", lan)}
              </li>

              <li
                style={
                  checkLength ? { color: "#3e8181" } : { color: "initial" }
                }
                className={checkLength ? "highlighter" : ""}
              >
                {t("pwd5", lan)}
              </li>
            </ul>
          </div>
          {passError && <p className="errorText mb-0">{passError}</p>}
          <div className="form-check ms-1 my-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              onClick={(e) => setAgreeToNotificationInSw(!e?.target?.checked)}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              {t("AgreeToReceiveNotificationInSwedish", lan)}
            </label>
          </div>
          {/* <Link to="/"> */}
          <button
            type="submit"
            className="btn btn-green w-100 mt-2"
            onClick={signupCall}
            disabled={loderBtn}
            // disabled={disable}
          >
            {loderBtn ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              t("CreateAccount", lan)
            )}
          </button>
          {/* </Link> */}

          <div className="form-group text-center w-100 font18">
            <span className="me-2">{t("Alreadymember", lan)} </span>
            <Link className="link-green" to="/login">
              {t("Login", lan)}
            </Link>
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
      {termsPopup && (
        <Popup
          show={termsPopup}
          header={tncAllData?.section_1_heading}
          handleClose={() => onTncPopupClose()}
        >
          <div className="popupinfo">
            <div className="main_tnc_block">
              <div className="unset-list"
                dangerouslySetInnerHTML={{
                  __html: tncAllData?.section_2_description || "-",
                }}
              ></div>
              <div className="form-check ms-1 my-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="example-check"
                  onClick={(e) => setAgreeCheckbox(e?.target?.checked)}
                  ref={ancRef}
                />
                <label
                  className="form-check-label"
                  htmlFor="example-check"
                  style={ancError ? { color: "#f14336" } : { color: "#393939" }}
                >
                  {t("AgreeTermsUse", lan)}
                </label>
              </div>
            </div>
            <button
              onClick={() => signupApiCall()}
              disabled={agreeCheckbox ? false : true}
              className="btn btn-green text-uppercase w-100 mt-2"
            >
              {t("Accept", lan)}
            </button>
          </div>
        </Popup>
      )}

      {signupResponce !== "" && (
        <Popup
          show={signupResponce !== "" ? true : false}
          header="Status"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <p>{signupResponce}</p>
          </div>
          <div>
            <Link
           
              onClick={handleClosePopup}
              className="btn btn-green w-100 mt-2"
            >
              {t("Okbutton", lan)}
            </Link>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default CreateAccount;
