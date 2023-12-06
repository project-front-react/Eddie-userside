import React, { useEffect, useRef, useState } from "react";
import "../ProfileMain.scss";
import { useDispatch, useSelector } from "react-redux";
import { loder, personalInfo, tabPageNo } from "../../../redux/actions";
import PhoneInput from "react-phone-number-input";
import { getTranslatedText as t } from "../../../translater/index";
import Loader from "../../../components/Loader/Loader";

export const PersonalInformation = () => {
  const stateProfile = useSelector((state) => state?.Profile);
  const state = useSelector((state) => state?.Eddi);
  const isCorporate = state?.UserDetail?.is_corporate

  let lan = state?.language;
  const dispatch = useDispatch();

  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [dobError, setDobError] = useState("");
  const [value, setValue] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [stepClick, setStepCkick] = useState();
  // const [personalNoError, setPersonalNoError] = useState("");
  // const [mobileNoError, setMobileNoError] = useState("");

  const fnameref = useRef();
  const lnameref = useRef();
  const emailref = useRef();
  const selectGenderRef = useRef();
  const dobRef = useRef();
  const PersonalNoref = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    setValue(stateProfile?.personalData?.mobileNumber);
  }, [stateProfile?.personalData?.mobileNumber]);

  useEffect(() => {
    if (
      fnameError == null &&
      lnameError == null &&
      emailError == null &&
      genderError == null &&
      dobError == null &&
      phoneError == null
    ) {
      console.log("call",fnameError, lnameError, emailError, genderError, phoneError);
      submitInfo("btncall");
    }
  }, [fnameError, lnameError, emailError, genderError, phoneError]);

  const submitInfo = (call) => {
    let fnameVal = fnameref?.current?.value;
    let lnameVal = lnameref?.current?.value;
    let emailVal = emailref?.current?.value;
    let genderVal = selectGenderRef?.current?.value;
    let dobVal = dobRef?.current?.value;
    let personalVal = PersonalNoref?.current?.value;

    const PersonalObj = {
      fname: fnameVal,
      lname: lnameVal,
      email: emailVal,
      gender: genderVal,
      dob: dobVal,
      personalNumber: personalVal,
      mobileNumber: value || phoneRef?.current?.value,
    };

    dispatch(personalInfo(PersonalObj));
    if (stepClick == "next") {
      dispatch(tabPageNo(2));
    } else if (stepClick == "skip") {
      dispatch(tabPageNo(4));
    }
  };
  
  const checkValid = async (stateProfile) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let fnameVal = fnameref?.current?.value;
    let lnameVal = lnameref?.current?.value;
    let emailVal = emailref?.current?.value;
    let genderVal = selectGenderRef?.current?.value;
    let dobVal = dobRef?.current?.value;

    if (fnameVal?.trim() == "") {
      setFnameError("* Please Enter First Name ");
      return false
    }
    else if (lnameVal?.trim() == "") {
      setLnameError("* Please Enter Last Name ");
      return false
    }
    // else if (!stateProfile?.personalData?.mobileNumber || stateProfile?.personalData?.mobileNumber?.trim() =="") {
    //   setPhoneError("* Please Enter Phone Number");
    //   console.log("stateProfile?.personalData?.mobileNumber",stateProfile?.personalData?.mobileNumber);
    //   return false
    // }
    else if (emailVal?.trim() == "") {
      setEmailError("* Please Enter Email ");
      return false
    }
    //  else if (!emailRegex.test(emailVal)) {
    //   setEmailError("* Please Enter Valid Email ");
    //   return false
    // } 
    else  if (genderVal?.trim() == "Choose Gender") {
      setGenderError("* Please Select Gender ");
      return false
    }
    else if (dobVal?.trim() == "") {
      setDobError("* Please Enter DOB");
      return false
    }
    else{
      setDobError()
      setPhoneError()
      setEmailError()
      setGenderError()
      setLnameError()
      setFnameError()
      return true
    }

  };

  useEffect(() => {
    var tab2 = document.getElementById("tab-2");
    var tab3 = document.getElementById("tab-3");
    var tab4 = document.getElementById("tab-4");

    tab2.addEventListener("click", async (e) => {
      const valid = await checkValid(stateProfile)
      if (valid) {
        dispatch(tabPageNo(2));
      }
    });
    tab3.addEventListener("click", async (e) => {
      const valid = await checkValid(stateProfile)
      if (valid) {
        dispatch(tabPageNo(3));
      }
    });
    tab4.addEventListener("click", async (e) => {
      const valid = await checkValid(stateProfile)
      if (valid) {
        dispatch(tabPageNo(4));
      }
    });

    return () => {};
  }, []);

  const onNextSkipClick = (e) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let fnameVal = fnameref?.current?.value;
    let lnameVal = lnameref?.current?.value;
    let emailVal = emailref?.current?.value;
    let genderVal = selectGenderRef?.current?.value;
    let dobVal = dobRef?.current?.value;
    let personalVal = PersonalNoref?.current?.value;

    if (
      fnameVal === "" &&
      lnameVal === "" &&
      !value &&
      emailVal === "" &&
      genderVal === "Choose Gender" &&
      dobVal === ""
    ) {
      setFnameError("* Please Enter First Name ");
      setLnameError("* Please Enter Last Name ");
      setEmailError("* Please Enter Email ");
      setGenderError("* Please Select Gender ");
      setDobError("* Please Enter DOB");
      setPhoneError("* Please Enter Phone Number");
    }
    if (fnameVal?.trim() == "") {
      setFnameError("* Please Enter First Name ");
    } else {
      setFnameError(null);
    }
    if (lnameVal?.trim() == "") {
      setLnameError("* Please Enter Last Name ");
    } else {
      setLnameError(null);
    }
    if (!value) {
      setPhoneError("* Please Enter Phone Number");
    }else if(value.length <7 || value.length > 13){
      setPhoneError("* Max 11 and min 7 digits allowed");
    }
    else{
      setPhoneError(null)
    }

    if (emailVal?.trim() == "") {
      setEmailError("* Please Enter Email ");
    } 
    // else if (!emailRegex.test(emailVal)) {
    //   setEmailError("* Please Enter Valid Email ");
    // }
     else {
      setEmailError(null);
    }
    if (genderVal?.trim() == "Choose Gender") {
      setGenderError("* Please Select Gender ");
    } else {
      setGenderError(null);
    }
    if (dobVal?.trim() == "") {
      setDobError("* Please Enter DOB");
    } else {
      setDobError(null);
    }

    // dispatch(tabPageNo(2));
  };

  return (
    <>
      <div className="all-tab px-lg-5 px-md-2 px-sm-2 px-1">
        <div className="row m-0 px-lg-5 px-md-4 px-sm-2 px-1 mt-2">
          <div className="mt-3 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">
              {t("FirstName", lan)}
              <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterFirstName", lan)}
                ref={fnameref}
                onChange={(e) => {
                  dispatch(
                    personalInfo({
                      ...stateProfile?.personalData,
                      fname: e?.target?.value,
                    })
                  );
                }}
                // onInput={(e)=>{console.log("e",!/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(e?.target?.value)); return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(e?.target?.value)}}
                defaultValue={
                  stateProfile?.personalData?.fname
                    ? stateProfile?.personalData?.fname
                    : state?.UserDetail?.data?.first_name
                }
              />
            </div>
            {fnameError && <p className="errorText mb-0">{fnameError}</p>}
          </div>

          <div className="mt-3 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">
              {t("LastName", lan)}
              <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterLastName", lan)}
                ref={lnameref}
                onChange={(e) => {
                  dispatch(
                    personalInfo({
                      ...stateProfile?.personalData,
                      lname: e?.target?.value,
                    })
                  );
                }}
                defaultValue={
                  stateProfile?.personalData?.lname
                    ? stateProfile?.personalData?.lname
                    : state?.UserDetail?.data?.last_name
                }
              />
            </div>
            {lnameError && <p className="errorText mb-0">{lnameError}</p>}
          </div>

          <div className="mt-3 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">
              {t("EmailAddress", lan)} <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <input
                type="email"
                className="form-control input-profile px-2 py-3"
                placeholder="Enter Email Address"
                ref={emailref}
                disabled
                defaultValue={localStorage.getItem("logedInEmail")}
              />
            </div>
            {emailError && <p className="errorText mb-0">{emailError}</p>}
          </div>

          <div className="mt-3 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">
              {t("Gender", lan)} <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <select
                className="form-control input-profile select-profile px-2 py-3"
                ref={selectGenderRef}
                placeholder={t("ChooseGender", lan)}
                onChange={(e) => {
                  dispatch(
                    personalInfo({
                      ...stateProfile?.personalData,
                      gender: e?.target?.value,
                    })
                  );
                }}
                // defaultValue={stateProfile.personalData?.gender}
              >
                <option disabled>
                  {t("Choose", lan)} {t("Gender", lan)}
                </option>
                <option
                  selected={
                    stateProfile?.personalData?.gender?.toLowerCase() === "male"
                      ? true
                      : false
                  }
                >
                  {t("Male", lan)}
                </option>
                <option
                  selected={
                    stateProfile.personalData?.gender?.toLowerCase() ===
                    "female"
                      ? true
                      : false
                  }
                >
                  {t("Female", lan)}
                </option>
                <option
                  selected={
                    stateProfile.personalData?.gender?.toLowerCase() === "other"
                      ? true
                      : false
                  }
                >
                  {t("Other", lan)}
                </option>
              </select>
            </div>
            {genderError && <p className="errorText mb-0">{genderError}</p>}
          </div>

          <div className="mt-3 col-md-6 col-sm-12 date-box">
            <p className="p-head mb-1">
              {t("ChooseDob", lan)} <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <input
                type="date"
                data-format="dd/MM/yyyy "
                max={new Date().toISOString().split("T")[0]}
                className="form-control input-profile px-2 "
                ref={dobRef}
                onChange={(e) => {
                  dispatch(
                    personalInfo({
                      ...stateProfile?.personalData,
                      dob: e?.target?.value,
                    })
                  );
                }}
                defaultValue={stateProfile?.personalData?.dob}
              />
            </div>
            {dobError && <p className="errorText mb-0">{dobError}</p>}
          </div>

          {/* <div className="mt-3 col-md-4 col-sm-12">
            <p className="p-head mb-1">{t("PersonalNumber", lan)}</p>
            <div className="mb-2">
              <input
                type="text"
                maxLength={4}
                className="form-control input-profile px-2 py-3"
                placeholder={t("Enterdigit", lan)}
                ref={PersonalNoref}
                defaultValue={stateProfile.personalData?.personalNumber}
              />
            </div>
          </div> */}

          <div className="mt-3 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">
              {t("phonnumber", lan)} <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <div className="selectbox-main">
                <PhoneInput
                  placeholder={t("phonnumber", lan)}
                  value={value}
                  className="PhoneInputInput"
                  defaultCountry="SE"
                  onChange={(e) => {
                    dispatch(
                      personalInfo({
                        ...stateProfile?.personalData,
                        mobileNumber: e,
                      })
                    );
                    setValue(e);
                    setPhoneError("");
                  }}
                  flags={false}
                  ref={phoneRef}
                />
              </div>
              {/* <CountryCodeSelect ref={phoneRef} /> */}
            </div>
            {phoneError && <p className="errorText mb-0">{phoneError}</p>}
          </div>
        </div>

        <div className="mt-2 px-lg-5 text-end mb-2 main-btn">
  {!isCorporate &&        <button
            onClick={(e) => {
              onNextSkipClick(e);
              setStepCkick("skip");
            }}
            id="skip3"
            className="btn btn-skip me-3 mb-3"
          >
            {t("Skip", lan)}
          </button>}

          <button
            onClick={(e) => {
              onNextSkipClick(e);
              setStepCkick("next");
            }}
            className="btn last-submit-btn me-2 mb-3"
            id="next-1"
          >
            {t("Next", lan)}
          </button>
        </div>
        {/* {isLoader ? <Loader /> : ""} */}
      </div>
    </>
  );
};

export default PersonalInformation;
