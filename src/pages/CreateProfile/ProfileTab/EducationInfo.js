import React, { useEffect, useRef, useState } from "react";
import "../ProfileMain.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  educationInfo,
  loder,
  personalInfo,
  tabPageNo,
} from "../../../redux/actions";
import { getTranslatedText as t } from "../../../translater/index";
import Loader from "../../../components/Loader/Loader";

const EducationInfo = () => {
  const stateProfile = useSelector((state) => state?.Profile);
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.Eddi);
  const isCorporate = state?.UserDetail?.is_corporate;

  let lan = state?.language;
  const [heightEduError, setHeightEduError] = useState("");
  const [unameError, setUnameError] = useState("");
  // const [degreeError, setDegreeError] = useState("");
  const [eduData, setEduData] = useState({});
  const [stepClick, setStepCkick] = useState();
  // const [isLoader, setIsLoader] = useState(false);
  const heightEdu = useRef();
  const uniName = useRef();
  // const degree = useRef();
  const interestArea = useRef();
  const otherEducation = useRef();
  const certificates = useRef();

  const onNextSkipClick = (e) => {
    let heightEdu1 = heightEdu?.current?.value;
    let uniName1 = uniName?.current?.value;
    // let degree1 = degree?.current?.value;
    let interestArea1 = interestArea?.current?.value;
    let otherEducation1 = otherEducation?.current?.value;
    let certificates1 = certificates?.current?.value;

    if (uniName1?.trim() == "") {
      setUnameError("* University Name is Required ");
    } else {
      setUnameError(null);
    }
    if (heightEdu1 == "Choose Education") {
      setHeightEduError("*Highest  Education is Required ");
    } else {
      setHeightEduError(null);
    }
    // if (degree1 == "Choose Degree") {
    //   setDegreeError("* Degree is Required ");
    // } else {
    //   setDegreeError(null);
    // }

    // if (
    //   (eduData?.heightEdu == undefined &&
    //   eduData?.uniName == undefined &&
    //   eduData?.degree == undefined)
    // ) {
    //   setHeightEduError("* Education is Required");
    //   setUnameError("* University name is Required");
    //   setDegreeError("* Degree is Required");
    // } else if (
    //   eduData?.heightEdu == undefined ||
    //   eduData?.heightEdu == "Choose"
    // ) {
    //   setHeightEduError("* Education is Required");
    // } else if (eduData?.degree == undefined || eduData?.degree == "Choose") {
    //   setDegreeError("* Degree is Required");
    // } else if (
    //   eduData?.uniName == undefined ||
    //   eduData?.uniName?.trim() == ""
    // ) {
    //   setUnameError("* University name is Required");
    // } else {
    //   dispatch(educationInfo(eduData));
    //   dispatch(tabPageNo(3));
    //   console.log("here");
    // }
  };
  const checkValid = () => {
    let heightEdu1 = heightEdu?.current?.value;
    let uniName1 = uniName?.current?.value;

    if (uniName1?.trim() == "") {
      setUnameError("* University Name is Required ");
      return false;
    } else if (heightEdu1 == "Choose Education" || !heightEdu1) {
      setHeightEduError("*Highest  Education is Required ");
      return false;
    } else {
      setUnameError();
      setHeightEduError();
      return true;
    }
  };

  useEffect(() => {
    var tab1 = document.getElementById("tab-1");
    var tab3 = document.getElementById("tab-3");
    var tab4 = document.getElementById("tab-4");
    tab1.addEventListener("click", async (e) => {
      const valid = await checkValid();
      if (valid) {
        dispatch(tabPageNo(1));
      }
    });
    tab3.addEventListener("click", async (e) => {
      const valid = await checkValid();
      if (valid) {
        dispatch(tabPageNo(3));
      }
    });
    tab4.addEventListener("click", async (e) => {
      const valid = await checkValid();
      if (valid) {
        dispatch(tabPageNo(4));
      }
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (heightEduError == null && unameError == null) {
      submitInfo();
    }
  }, [heightEduError, unameError]);

  const submitInfo = () => {
    let heightEdu1 = heightEdu?.current?.value;
    let uniName1 = uniName?.current?.value;
    // let degree1 = degree?.current?.value;
    let interestArea1 = interestArea?.current?.value;
    let otherEducation1 = otherEducation?.current?.value;
    let certificates1 = certificates?.current?.value;

    const eduData = {
      heightEdu: heightEdu1,
      uniName: uniName1,
      // degree: degree1,
      interestArea: interestArea1,
      otherEducation: otherEducation1,
      certificates: certificates1,
    };
    dispatch(educationInfo(eduData));
    if (stepClick == "next") {
      dispatch(tabPageNo(3));
    } else if (stepClick == "skip") {
      dispatch(tabPageNo(4));
    }
  };

  // const onDataChange = (e) => {
  //   console.log("e", e.target.value);
  //   if (e?.target?.id == "edu") {
  //     setEduData((prev) => {
  //       prev["heightEdu"] = e.target.value;
  //       return prev;
  //     });
  //     setHeightEduError();
  //   } else if (e?.target?.id == "uname") {
  //     setEduData((prev) => {
  //       prev["uniName"] = e.target.value;
  //       return prev;
  //     });
  //     setUnameError();
  //   } else if (e?.target?.id == "degree") {
  //     setEduData((prev) => {
  //       prev["degree"] = e.target.value;
  //       return prev;
  //     });
  //     setDegreeError();
  //   } else if (e?.target?.id == "area") {
  //     setEduData((prev) => {
  //       prev["interestArea"] = e.target.value;
  //       return prev;
  //     });
  //     setDegreeError();
  //   } else if (e?.target?.id == "otherEdu") {
  //     setEduData((prev) => {
  //       prev["otherEducation"] = e.target.value;
  //       return prev;
  //     });
  //   } else if (e?.target?.id == "certificate") {
  //     setEduData((prev) => {
  //       prev["certificates"] = e.target.value;
  //       return prev;
  //     });
  //   }
  // };
  const highesEdu = [
    t("Elementaryschool", lan),
    t("Grammarschool", lan),
    t("ProfessionalOccupationaltraining", lan),
    t("Bachelor", lan),
    t("Master", lan),
    t("Phd", lan),
  ];
  return (
    <>
      <div className="all-tab px-lg-5 px-md-2 px-sm-2 px-1">
        <div className="row m-0 px-lg-5 px-md-4 px-sm-2 px-1 mt-2">
          <div className="mt-3 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">
              {t("HighestEducation", lan)}
              <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <select
                className="form-control input-profile select-profile px-2 py-3"
                placeholder={t("Choose", lan)}
                defaultValue={stateProfile.educationData?.heightEdu || ""}
                onChange={(e) => {
                  dispatch(
                    educationInfo({
                      ...stateProfile.educationData,
                      heightEdu: e?.target?.value,
                    })
                  );
                }}
                ref={heightEdu}
                id="edu"
              >
                <option value={""}>
                  {t("Choose", lan)} {t("Education", lan)}
                </option>
                {highesEdu?.map((val, index) => {
                  return (
                    <option key={index} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
            </div>
            {heightEduError && (
              <p className="errorText mb-0">{heightEduError}</p>
            )}
          </div>

          <div className="mt-3 col-md-6 col-sm-12">
            <p className="p-head mb-1">
              {t("UniversityName", lan)}
              <span className="text-danger">*</span>
            </p>
            <div className="mb-2">
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterUniversityName", lan)}
                onChange={(e) => {
                  dispatch(
                    educationInfo({
                      ...stateProfile.educationData,
                      uniName: e?.target?.value,
                    })
                  );
                }}
                ref={uniName}
                id="uname"
                defaultValue={stateProfile.educationData?.uniName}
              />
            </div>
            {unameError && <p className="errorText mb-0">{unameError}</p>}
          </div>

          {/* <div className="mt-3 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">
              Highest Degree <span className="text-danger">*</span>
            </p>
            <div className="mb-3">
              <select
                className="form-control input-profile select-profile px-2 py-3"
                placeholder="Choose Degree"
                // onChange={onDataChange}
                ref={degree}
                id="degree"
              >
                <option>Choose Degree</option>
                <option
                  selected={
                    stateProfile.educationData?.degree?.toLowerCase() == "engineering"
                      ? true
                      : false
                  }
                >
                  Engineering
                </option>
                <option
                  selected={
                    stateProfile.educationData?.degree?.toLowerCase() == "accountant"
                      ? true
                      : false
                  }
                >
                  Accountant
                </option>
              </select>
            </div>
            {degreeError && <p className="errorText mb-0">{degreeError}</p>}
          </div> */}

          <div className="mt-3 col-lg-4 col-md-6 col-sm-12 ">
            <p className="p-head mb-1">{t("EducationArea", lan)}</p>
            <div className="mb-2">
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterEducationArea", lan)}
                onChange={(e) => {
                  dispatch(
                    educationInfo({
                      ...stateProfile.educationData,
                      interestArea: e?.target?.value,
                    })
                  );
                }}
                ref={interestArea}
                id="area"
                defaultValue={stateProfile.educationData?.interestArea}
              />
            </div>
          </div>

          <div className="mt-3 col-lg-4 col-md-6 col-sm-12 mb-3">
            <p className="p-head mb-1">{t("RelevantEducation", lan)}</p>
            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterEducationAreas", lan)}
                onChange={(e) => {
                  dispatch(
                    educationInfo({
                      ...stateProfile.educationData,
                      otherEducation: e?.target?.value,
                    })
                  );
                }}
                ref={otherEducation}
                id="otherEdu"
                defaultValue={stateProfile.educationData?.otherEducation}
              />
            </div>
          </div>

          <div className="mt-3 col-lg-4 col-md-12 col-sm-12 mb-3">
            <p className="p-head mb-1">{t("DiplomasandCertificates", lan)}</p>
            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterDiplomasandCertificates", lan)}
                onChange={(e) => {
                  dispatch(
                    educationInfo({
                      ...stateProfile.educationData,
                      certificates: e?.target?.value,
                    })
                  );
                }}
                ref={certificates}
                id="certificate"
                defaultValue={stateProfile.educationData?.certificates}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 px-lg-5 text-end mb-2 main-btn">
          {!isCorporate && (
            <button
              onClick={(e) => {
                onNextSkipClick(e);
                setStepCkick("skip");
              }}
              id="skip2"
              className="btn btn-skip me-3 mb-3"
            >
              {t("Skip", lan)}
            </button>
          )}

          <button
            onClick={(e) => {
              onNextSkipClick(e);
              setStepCkick("next");
            }}
            className="btn btn-next me-2 mb-3"
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

export default EducationInfo;
