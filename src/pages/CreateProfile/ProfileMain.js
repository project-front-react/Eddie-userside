import React, { useEffect, useMemo, useState } from "react";
import "./ProfileMain.scss";
import AreaOfInterest from "./ProfileTab/AreaOfInterest";
import EducationInfo from "./ProfileTab/EducationInfo";
import { PersonalInformation } from "./ProfileTab/PersonalInformation";
import ProfessionalInfo from "./ProfileTab/ProfessionalInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  areaOfInterestInfo,
  educationInfo,
  getAllCategories,
  personalInfo,
  professionalInfo,
  tabPageNo,
  userDetail,
} from "../../redux/actions";
import Header from "../../components/header/Header";
import { getCategoryApi, getUserProfileApi } from "../../services/eddiServices";
import { useHistory } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import { Link } from "react-router-dom";
import { getCreateProfileText } from "../../services/cmsServices";
import Loader from "../../components/Loader/Loader";

const ProfileMain = () => {
  const state = useSelector((state) => state?.Profile);
  const stateEddi = useSelector((state) => state?.Eddi);
  let lan = stateEddi?.language;
  let shouldLoder = state?.loder || false;
  const dispatch = useDispatch();
  const history = useHistory();
  const [textData, setTextData] = useState();

  function isJson(str) {
    try {
      const obj = JSON.parse(str);
      if (obj && typeof obj === `object`) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }
  const getProfileText = () => {
    getCreateProfileText()
      .then((result) => {
        if (result?.status == "success") {
          setTextData(result.data);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getProfileText();
    if (window?.location?.href?.includes("edit-eddi-profile")) {
      getUserProfileApi().then(async (res) => {
        // console.log(res)
        const PersonalObj = {
          fname: res?.data?.first_name,
          lname: res?.data?.last_name,
          email: res?.data?.email_id,
          gender: res?.data?.gender,
          dob: res?.data?.dob,
          personalNumber: res?.data?.personal_number,
          mobileNumber: res?.data?.phone_number,
        };
        await dispatch(personalInfo(PersonalObj));

        const eduData = {
          heightEdu: res?.data?.highest_education,
          uniName: res?.data?.university_name,
          // degree: res?.data?.highest_degree,
          interestArea: res?.data?.educational_area,
          otherEducation: res?.data?.other_education,
          certificates: res?.data?.diplomas_certificates,
        };
        await dispatch(educationInfo(eduData));

        const professionalObj = {
          currentRole: res?.data?.current_professional_role,
          otherRole: res?.data?.additional_role,
          curricularWant: res?.data?.extra_curricular,
          curricularHave: res?.data?.extra_curricular_competence,
          responsibility: res?.data?.core_responsibilities,
          levelRole: res?.data?.level_of_role,
          futureRole: res?.data?.future_professional_role,
          corporateCode: res?.data?.corporate_code || "",
        };
        await dispatch(professionalInfo(professionalObj));

        const categorySelected = {
          selectedCat: res?.data?.course_category?.split(","),
          selectedSubCat:
            isJson(res?.data?.user_interests) == true
              ? JSON.parse(res?.data?.user_interests)
              : res?.data?.user_interests,
          // selectedSubCat:res?.data?.user_interests?.length >0 ? JSON.parse(res?.data?.user_interests) : [],
          interestedArea: res?.data?.area_of_interest,
          isAds: res?.data?.agree_ads_terms,
        };
        await dispatch(areaOfInterestInfo(categorySelected));
      });
    } else {
      dispatch(tabPageNo(1));
      dispatch(educationInfo());
      dispatch(personalInfo());
      dispatch(professionalInfo());
      dispatch(areaOfInterestInfo());
    }
  }, []);

  const onTabClick = (e) => {
    // if (e?.target?.id == "tab-1") {
    //   dispatch(tabPageNo(1));
    // } else if (
    //   e?.target?.id == "tab-2" &&
    //   state?.personalData?.fname !== undefined
    // ) {
    //   dispatch(tabPageNo(2));
    // } else if (
    //   e?.target?.id == "tab-3" &&
    //   state?.educationData?.uniName !== undefined
    // ) {
    //   dispatch(tabPageNo(3));
    // } else if (
    //   e?.target?.id == "tab-4" &&
    //   state?.personalData?.fname !== undefined
    // ) {
    //   dispatch(tabPageNo(4));
    // }
  };

  const categoriesCall = () => {
    getCategoryApi()
      .then((res) => {
        if (res.status == "success") {
          let result = res.data;
          // if (lan === "sw") {
          //   result = res.data.map((item) => {
          //     item["category_name"] =
          //       item?.category_name_sw || item?.category_name || "";
          //     return item;
          //   });
          // }
          dispatch(getAllCategories(result));
          // dispatch(educationInfo())
          // dispatch(personalInfo())
          // dispatch(professionalInfo())
          // dispatch(areaOfInterestInfo())
        } else {
          // alert("error Occured")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    categoriesCall();
  }, []);

  return (
    <div className="profileMain">
      <Header disableProfile={true} />
      <div className="profile-main-page p-lg-5 p-md-4 p-sm-3 p-2 ">
        <div className=" profile-content mx-md-4 mx-sm-3 mx-2  ">
          {window?.location?.href?.includes("edit-eddi-profile") && (
            <Link
              onClick={() => {
                history?.goBack();
              }}
              className="brd-link"
            >
              {t("Back", lan)}
            </Link>
          )}
          <div className="col-lg-4 col-md-6 col-sm-8 col-12 pb-4">
            <p className="head-profile">
              {t("Welcome", lan)}{" "}
              {stateEddi?.UserDetail?.data?.first_name
                ?.charAt(0)
                ?.toUpperCase()}
              {stateEddi?.UserDetail?.data?.first_name?.slice(1)}
            </p>
            <p className="welcome-text">{t("WelcomeText", lan)}</p>
          </div>

          <div className="mt-3 main-wizard">
            <div className="wizard">
              <div className="wizard-inner mx-lg-4 mx-md-2 mx-0">
                <div className="connecting-line"></div>
                <ul className="nav nav-tabs list-unstyled" role="tablist">
                  <li role="presentation" className="disable">
                    <a
                      data-toggle="tab"
                      aria-controls="step1"
                      role="tab"
                      aria-expanded="true"
                      className="wizard-round"
                    >
                      <span
                        id="tab-1"
                        onClick={onTabClick}
                        className={
                          state?.tabPageNo == 1
                            ? "active-tab rounded-circle "
                            : "inactive-tab rounded-circle"
                        }
                      >
                        1{" "}
                      </span>{" "}
                      <i
                        className={
                          state?.tabPageNo == 1
                            ? "text-active"
                            : "text-inactive"
                        }
                      >
                        {t("PersonalInfo", lan)}
                      </i>
                    </a>
                  </li>
                  <li role="presentation" className="active">
                    <a
                      data-toggle="tab"
                      aria-controls="step2"
                      role="tab"
                      aria-expanded="false"
                      className="wizard-round"
                    >
                      <span
                        id="tab-2"
                        onClick={onTabClick}
                        className={
                          state?.tabPageNo == 2
                            ? "active-tab rounded-circle "
                            : "inactive-tab rounded-circle"
                        }
                      >
                        2
                      </span>{" "}
                      <i
                        className={
                          state?.tabPageNo == 2
                            ? "text-active"
                            : "text-inactive"
                        }
                      >
                        {t("EducationInfo", lan)}
                      </i>
                    </a>
                  </li>
                  <li role="presentation" className="disabled">
                    <a
                      data-toggle="tab"
                      aria-controls="step3"
                      className="wizard-round"
                      role="tab"
                    >
                      <span
                        id="tab-3"
                        onClick={onTabClick}
                        className={
                          state?.tabPageNo == 3
                            ? "active-tab rounded-circle "
                            : "inactive-tab rounded-circle"
                        }
                      >
                        3
                      </span>{" "}
                      <i
                        className={
                          state?.tabPageNo == 3
                            ? "text-active"
                            : "text-inactive"
                        }
                      >
                        {t("ProfessInfo", lan)}
                      </i>
                    </a>
                  </li>
                  <li role="presentation" className="disabled">
                    <a
                      data-toggle="tab"
                      aria-controls="step4"
                      className="wizard-round"
                      role="tab"
                    >
                      <span
                        id="tab-4"
                        onClick={onTabClick}
                        className={
                          state?.tabPageNo == 4
                            ? "active-tab rounded-circle "
                            : "inactive-tab rounded-circle"
                        }
                      >
                        4
                      </span>{" "}
                      <i
                        className={
                          state?.tabPageNo == 4
                            ? "text-active"
                            : "text-inactive"
                        }
                      >
                        {t("AreaOfInt", lan)}
                      </i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row m-0 mt-4">
            {state?.tabPageNo == 1 ? (
              <PersonalInformation />
            ) : state?.tabPageNo == 2 ? (
              <EducationInfo />
            ) : state?.tabPageNo == 3 ? (
              <ProfessionalInfo />
            ) : (
              <AreaOfInterest />
            )}

            {/* <ProfessionalInfo /> */}
            {/* <AreaOfInterest /> */}
          </div>
        </div>
      </div>
      {/* {shouldLoder ? <Loader /> : ""} */}
    </div>
  );
};

export default ProfileMain;
