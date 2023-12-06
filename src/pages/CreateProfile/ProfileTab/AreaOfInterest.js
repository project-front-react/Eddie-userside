import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Popup from "../../../components/popup/popup";
import {
  educationInfo,
  personalInfo,
  professionalInfo,
  tabPageNo,
} from "../../../redux/actions";
import {
  getApprovedSubCategory,
  postUserProfileApi,
  putUserProfileApi,
} from "../../../services/eddiServices";
import { getTranslatedText as t } from "../../../translater/index";
import Select from "react-select";
import Loader from "../../../components/Loader/Loader";
import { encrypt } from "../../../utils/encrypt";
import { toast } from "react-toastify";

const AreaOfInterest = () => {
  const stateProfile = useSelector((state) => state?.Profile);
  const state = useSelector((state) => state?.Eddi);
  const isCorporate = state?.UserDetail?.is_corporate;
  const [loderBtn, setLoderBtn] = useState(false);
  let lan = state?.language;
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedCat, setSelectedCat] = useState();
  const [isLoder, setIsLoder] = useState(false);
  const [interestedArea, setInterestedArea] = useState(
    stateProfile?.areaOfInterestData?.interestedArea
  );
  const [isAds, setIsAds] = useState(
    stateProfile?.areaOfInterestData?.isAds ? true : false
  );
  const [category, setcategory] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [categoryError, setcategoryError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [subCategoryData, setSubCategoryData] = useState();
  const [finalSubCategorySelected, setFinalSubCategorySelected] = useState([
    "",
  ]);

  useEffect(() => {
    var tab1 = document.getElementById("tab-1");
    var tab2 = document.getElementById("tab-2");
    var tab3 = document.getElementById("tab-3");
    tab1.addEventListener("click", async (e) => {
      dispatch(tabPageNo(1));
    });
    tab2.addEventListener("click", async (e) => {
      dispatch(tabPageNo(2));
    });
    tab3.addEventListener("click", async (e) => {
      dispatch(tabPageNo(3));
    });
    return () => {};
  }, []);

  const options = [];
  subCategoryData?.length > 0 &&
    subCategoryData?.map((item, i) => {
      if (
        item?.category_name?.category_name?.toLowerCase() ==
        selectedCat?.toLowerCase()
      ) {
        options?.push({
          value: item?.subcategory_name,
          label: item?.subcategory_name,
          category: item?.category_name?.category_name,
        });
      }
    });

  useEffect(() => {
    setIsLoder(true);
    getApprovedSubCategory()
      .then((result) => {
        setIsLoder(false);
        if (result?.status == "success") {
          setSubCategoryData(result?.data);
        }
      })
      .catch((e) => {
        console.log(e, "err");
        setIsLoder(false);
      });
  }, []);

  const defaultSelected = [];

  stateProfile?.areaOfInterestData?.selectedSubCat?.length > 0 &&
    stateProfile?.areaOfInterestData?.selectedSubCat?.map((item) => {
      item?.subcategory?.map((sub) => {
        defaultSelected?.push({
          value: sub,
          label: sub,
          category: item?.category,
        });
      });
    });

  useEffect(() => {
    // onCategoryClick();
    setIsAds(
      stateProfile?.areaOfInterestData?.isAds
        ? stateProfile?.areaOfInterestData?.isAds
        : false
    );
    setFinalSubCategorySelected(
      stateProfile?.areaOfInterestData?.selectedSubCat
    );
    setInterestedArea(stateProfile?.areaOfInterestData?.interestedArea);
    state?.AllCategories?.map((cat, i) => {
      if (
        stateProfile?.areaOfInterestData?.selectedCat?.filter(
          (selected) =>
            selected == cat?.category_name || selected == cat?.category_name_sw
        )[0]
      ) {
        category[i] = !category[i];
        setcategory(category);
        let ele = document.getElementById(`btn-${i}`);
        let selectEle = document.getElementById(`select-${i}`);

        const ClassName = ele?.className;
        if (ClassName == "btn btn-area-inactive") {
          ele?.classList?.remove("btn-area-inactive");
          ele?.classList?.add("btn-area-active");
          selectEle?.classList?.remove("display-none");
          selectEle?.classList?.add("display-block");
        } else {
          ele?.classList?.remove("btn-area-active");
          ele?.classList?.add("btn-area-inactive");
          selectEle?.classList?.remove("display-block");
          selectEle?.classList?.add("display-none");
        }
      }
    });
  }, [stateProfile]);

  const onCategoryClick = (e, i, categories) => {
    if (e?.target?.id == `btn-${i}`) {
      const ClassName = e?.target?.className;
      let selectEle = document.getElementById(`select-${i}`);
      category[i] = !category[i];
      setcategory(category);
      state?.AllCategories?.map((cat, ind) => {
        if (i == ind) {
        }
      });
      if (ClassName == "btn btn-area-inactive") {
        e.target.className = "btn btn-area-active";
        selectEle?.classList?.remove("display-none");
        selectEle?.classList?.add("display-block");
      } else {
        e.target.className = "btn btn-area-inactive";
        selectEle?.classList?.remove("display-block");
        selectEle?.classList?.add("display-none");
      }
    }
  };

  const onSelectSubCategory = (e, cat) => {
    var main = finalSubCategorySelected ? [...finalSubCategorySelected] : [];
    var temp = [];
    e.map((val) => {
      temp.push(val?.value);
      return val.value;
    });
    var data = {
      category: cat,
      subcategory: temp,
    };

    if (main?.length > 0) {
      // main?.push(data)
      main?.map((da, index) => {
        if (da?.category == cat) {
          main[index] = data;
        } else {
          main?.push(data);
        }
      });
    } else {
      main?.push(data);
    }
    return setFinalSubCategorySelected(main);
  };

  const onSubmitClick = async () => {
    const selectedCats = [];
    state?.AllCategories?.map((cat, i) => {
      if (category[i] == true) {
        selectedCats.push(cat?.category_name);
      }
    });

    if (selectedCats?.length <= 0) {
      setcategoryError("*Please Select Atleast One Category");
    } else {
      setcategoryError("");

      var result = [];
      await finalSubCategorySelected?.forEach(function (item) {
        if (result.indexOf(item) < 0) {
          result.push(item);
        }
      });

      let finalArr = [];
      selectedCats.forEach((ele) => {
        let obj = result.find((o) => o.category === ele);
        console.log("obj", obj);
        if (obj) {
          finalArr.push(obj);
        } else {
          finalArr.push({ category: ele, subcategory: [] });
        }
      });

      var bodyFormData = new FormData();
      bodyFormData.append("email_id", localStorage.getItem("logedInEmail"));
      bodyFormData.append("first_name", stateProfile.personalData?.fname);
      bodyFormData.append("last_name", stateProfile.personalData?.lname);
      bodyFormData.append("gender", stateProfile.personalData?.gender);
      bodyFormData.append("dob", stateProfile.personalData?.dob);
      stateProfile.personalData?.personalNumber &&
        bodyFormData.append(
          "personal_number",
          stateProfile.personalData?.personalNumber
        );
      bodyFormData.append(
        "phone_number",
        stateProfile.personalData?.mobileNumber
      );

      stateProfile.educationData?.heightEdu &&
        bodyFormData.append(
          "highest_education",
          stateProfile.educationData?.heightEdu
        );
      stateProfile.educationData?.uniName &&
        bodyFormData.append(
          "university_name",
          stateProfile.educationData?.uniName
        );
      // stateProfile.educationData?.degree &&
      //   bodyFormData.append(
      //     "highest_degree",
      //     stateProfile.educationData?.degree
      //   );
      stateProfile.educationData?.interestArea &&
        bodyFormData.append(
          "educational_area",
          stateProfile.educationData?.interestArea
        );
      stateProfile.educationData?.otherEducation &&
        bodyFormData.append(
          "other_education",
          stateProfile.educationData?.otherEducation
        );
      stateProfile.educationData?.certificates &&
        bodyFormData.append(
          "diplomas_certificates",
          stateProfile.educationData?.certificates
        );

      stateProfile.professionalData?.currentRole &&
        bodyFormData.append(
          "current_professional_role",
          stateProfile.professionalData?.currentRole
        );
      stateProfile.professionalData?.otherRole &&
        bodyFormData.append(
          "additional_role",
          stateProfile.professionalData?.otherRole
        );
      stateProfile.professionalData?.curricularWant &&
        bodyFormData.append(
          "extra_curricular",
          stateProfile.professionalData?.curricularWant
        );
      stateProfile.professionalData?.curricularHave &&
        bodyFormData.append(
          "extra_curricular_competence",
          stateProfile.professionalData?.curricularHave
        );
      stateProfile.professionalData?.responsibility &&
        bodyFormData.append(
          "core_responsibilities",
          stateProfile.professionalData?.responsibility
        );
      stateProfile.professionalData?.levelRole &&
        bodyFormData.append(
          "level_of_role",
          stateProfile.professionalData?.levelRole
        );
      stateProfile.professionalData?.futureRole &&
        bodyFormData.append(
          "future_professional_role",
          stateProfile.professionalData?.futureRole
        );
      isCorporate &&
        bodyFormData.append(
          "corporate_code",
          stateProfile.professionalData?.corporateCode || ""
        );
      isCorporate && bodyFormData.append("is_approved_id", 2);

      bodyFormData.append("course_category", selectedCats);
      bodyFormData.append("user_interests", JSON.stringify(finalArr));
      bodyFormData.append(
        "area_of_interest",
        interestedArea ? interestedArea?.split(",") : ""
      );
      bodyFormData.append("agree_ads_terms", isAds);

      if (window?.location?.href?.includes("edit-eddi-profile")) {
        setLoderBtn(true);
        putUserProfileApi(bodyFormData)
          .then((res) => {
            setLoderBtn(false);
            if (res?.status === "success") {
              history.push(
                isCorporate ? "/corporate-user-dashboard" : "/user-dashboard"
              );
              setProfileError(lan == "en" ? res.data : res?.data_sv);
              preventScroll();
            } else {
              setProfileError(lan == "en" ? res.data : res?.data_sv);
              preventScroll();
            }
          })
          .catch((err) => {
            setLoderBtn(false);
            setProfileError(err.data);
          });
      } else {
        setLoderBtn(true);
        postUserProfileApi(bodyFormData)
          .then((res) => {
            setLoderBtn(false);
            if (res?.status === "success") {
              if (
                state?.UserDetail?.is_first_time_login === true &&
                isCorporate
              ) {
                setProfileError(lan == "en" ? res.data : res?.data_sv);
                return setTimeout(() => {
                  history.push("/login");
                }, 2000);
              }
              history.push("/user-dashboard");
              setProfileError(lan == "en" ? res.data : res?.data_sv);
              preventScroll();
            } else {
              setProfileError(lan == "en" ? res.data : res?.data_sv);
              preventScroll();
            }
          })
          .catch((err) => {
            setLoderBtn(false);
            console.log(err.data);
            setProfileError(err.data);
          });
      }
    }
  };

  const handleClosePopup = () => {
    if (
      profileError === " Profile Created successfully" ||
      profileError === "Profile Updated Successfully"
    ) {
      history.push("/user-dashboard");
      dispatch(personalInfo());
      dispatch(educationInfo());
      dispatch(professionalInfo());
      dispatch(tabPageNo(1));
    }
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setProfileError("");
  };

  const preventScroll = () => {
    // const body = document.querySelector("body");
    // body.style.overflow = "hidden";
  };

  return (
    <>
      {/*     <div className='all-tab px-lg-5 px-md-4 px-sm-2 px-1'>

        <div className='row m-0 px-lg-5 px-md-4 px-sm-2 px-1 mt-2'> */}
      <div className="all-tab px-lg-5 px-md-2 px-sm-2 px-1">
        <div className="row area-main m-0 mt-5">
          {state?.AllCategories?.map((cat, i) => {
            return (
              <div
                className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3"
                key={i}
              >
                <button
                  id={`btn-${i}`}
                  onClick={(e) => onCategoryClick(e, i, cat?.category_name)}
                  className={"btn btn-area-inactive"}
                >
                  {t(`${cat?.category_name}`, lan)}
                </button>
                {/* <div
                  onClick={() => {
                    setSelectedCat(cat?.category_name);
                  }}
                  style={{ backgroundColor: "red" }}
                > */}
                <Select
                  // onChange={setSelectedOption}
                  onFocus={() => {
                    setSelectedCat(cat?.category_name);
                  }}
                  id={`select-${i}`}
                  closeMenuOnSelect={false}
                  options={options}
                  defaultValue={defaultSelected?.filter(
                    (fill) => fill?.category == cat?.category_name
                  )}
                  hideSelectedOptions={true}
                  isMulti
                  onChange={(e) => {
                    onSelectSubCategory(e, cat?.category_name);
                  }}
                  allowSelectAll={true}
                  placeholder={t("ChooseSubCategory", lan)}
                  className="multiselectCategory mt-3 display-none"
                />
              </div>
              // </div>
            );
          })}

          {categoryError != "" && (
            <p className="p-head mb-1 errorText">{categoryError}</p>
          )}

          {/* <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
            <button
              id="btn-1"
              onClick={onCategoryClick}
              className={
                 "btn btn-area-inactive" 
              }
            >
              Course Category 1
            </button>
          </div>

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
            <button
              id="btn-2"
              onClick={onCategoryClick}
              className={
                 "btn btn-area-inactive"
              }
            >      
              Course Category 1
            </button>
          </div>

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
            <button
              id="btn-3"
              onClick={onCategoryClick}
              className={
                "btn btn-area-inactive"
              }            
              >
              Course Category 1
            </button>
          </div>

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
            <button
              id="btn-4"
              onClick={onCategoryClick}
              className={
               "btn btn-area-inactive"
              }            
              >
              Course Category 1
            </button>
          </div>

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
            <button
              id="btn-5"
              onClick={onCategoryClick}
              className={
                 "btn btn-area-inactive"
              }            
              >
              Course Category 1
            </button>
          </div>

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
            <button
              id="btn-6"
              onClick={onCategoryClick}
              className={
                 "btn btn-area-inactive"
              }            
              >
              Course Category 1
            </button>
          </div>

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
            <button
              id="btn-7"
              onClick={onCategoryClick}
              className={
                 "btn btn-area-inactive"
              }            
              >
              Course Category 1
            </button>
          </div>

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
            <button
              id="btn-8"
              onClick={onCategoryClick}
              className={
                 "btn btn-area-inactive"
              }            >
              Course Category 1
            </button>
          </div> */}

          <div className=" col-md-12 col-sm-12 mb-4">
            <div className="d-flex flex-row">
              <p className="p-head mb-1">
                {t("Additionalareasinterest", lan)}{" "}
                {t("AdditionalareasinterestSeparatedByComma", lan)}
              </p>
            </div>
            <div>
              <input
                type="text"
                value={interestedArea}
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterAdditionalAreasInterest", lan)}
                onChange={(e) => setInterestedArea(e?.target?.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <input
              className="form-check-input me-2 cursor-pointer"
              type="checkbox"
              id="reciveAd"
              defaultChecked={isAds}
              onClick={(e) => setIsAds(!isAds)}
            />
            <label htmlFor="reciveAd" className="p-head mb-1 cursor-pointer">
              {t("Agreetoreceive", lan)}
            </label>
          </div>
        </div>

        <div className="mt-2 px-lg-5 px-md-5 px-sm-5 px-2 text-end mb-2">
          <button
            disabled={loderBtn}
            onClick={onSubmitClick}
            className="btn btn-next me-2 mb-3"
          >
            {loderBtn ? (
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              t("submit", lan)
            )}
          </button>
        </div>
      </div>
      {profileError !== "" && (
        <Popup
          show={profileError !== "" ? true : false}
          header="Status"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <p>{profileError}</p>
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
      {isLoder ? <Loader /> : ""}
    </>
  );
};

export default AreaOfInterest;
