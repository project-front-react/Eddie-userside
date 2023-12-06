import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import IcCal from "../../assets/images/IcCalendar.svg";
import success from "../../assets/images/ic-success.png";
import fail from "../../assets/images/ic-fail.svg";
import placeholder from "../../assets/images/placeholder.svg";
import noUser from "../../assets/images/noUser.png";
import Starrating from "../../assets/images/Starrating.svg";
import "./ViewCourseDetails.scss";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import IcReadmore from "../../assets/images/ic_readmore.svg";
import IcReadless from "../../assets/images/ic_readless.svg";
import IcHerat from "../../assets/images/IcHerat.svg";
import IcHeratFill from "../../assets/images/IcHeratFill.svg";
import Loader from "../../components/Loader/Loader";
import IcLearner from "../../assets/images/IcLearner.svg";
import IcLevel from "../../assets/images/IcLevel.svg";
import IcAmt from "../../assets/images/IcAmt.svg";
import IcTime from "../../assets/images/IcTime.svg";
import { Link, useParams } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import Popup from "../../components/popup/popup";
import InstructorPanel from "../../components/InstructorPanel/InstructorPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseDetailApi,
  updateFavoriteCourseApi,
  sendStatusApi,
  getCorporateCourseDetail,
} from "../../services/eddiServices";
import API from "../../api";
import { useHistory } from "react-router-dom";
import RelatedCourseLinks from "../../components/RelatedCourseLinks/RelatedCourseLinks";
import { getVatCharges } from "../../redux/actions";
import { encrypt } from "../../utils/encrypt";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import NoData from "../../components/NoData/NoData";

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ViewCourseDetails = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const history = useHistory();
  const search = useLocation().search;
  const isCorporate = new URLSearchParams(search).get("is_corporate");
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState();

  const [relatedCourseData, setRelatedCourseData] = useState([]);
  const [confirmPopup, setconfirmPopup] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [coursePayment, setCoursePayment] = useState({
    value: false,
    data: "",
  });
  const [paymentModePopup, setPaymentModePopup] = useState(false);
  const [freePaymentResponse, setFreePaymentResponse] = useState("");
  const [isFail, setIsFail] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("logedInEmail"));
  const [LearnersCount, setLearnersCount] = useState(0);
  const [loderBtn, setLoderBtn] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [allData, setAllData] = useState();
  const params = useParams();
  const original = parseInt(courseData?.course_price);
  const vat = parseInt(state?.getVatCharges);
  const totalVat = (original * vat) / 100;
  const totalPrice = original + totalVat;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const courseDetailCall = () => {
    setIsLoader(true);
    const idd = params?.id ? params?.id : state?.SelectedCourse;
    if (isCorporate == "true") {
      getCorporateCourseDetail(idd)
        .then((res) => {
          setIsLoader(false);
          if (res.status === "success") {
            setIsChecked(res.is_favourite || false);
            setCourseData(res.data);
            setAllData(res);
            dispatch(getVatCharges(res?.VAT_charges));
            setLearnersCount(res?.learners_count);
            setIsEnrolled(res?.enrolled);

            setRelatedCourseData(res.related_courses);
          }
        })
        .catch((e) => {
          setIsLoader(false);
          console.log(e);
        })
        .finally(() => setIsLoader(false));
    } else {
      getCourseDetailApi(idd)
        .then((res) => {
          setIsLoader(false);
          if (res.status === "success") {
            setIsChecked(res.is_favoutite || false);
            setCourseData(res.data);
            setAllData(res);
            dispatch(getVatCharges(res?.VAT_charges));
            setLearnersCount(res?.learners_count);
            setIsEnrolled(res?.is_enrolled);
            var relatedCourses = [];
            state?.AllCourses?.filter(
              (related) =>
                related?.course_category?.category_name ==
                  res?.data?.course_category?.category_name &&
                related?.uuid != res?.data?.uuid
            ).map((datas, i) => {
              if (i < 8) {
                relatedCourses.push(datas);
              } else {
                return;
              }
            });
            setRelatedCourseData(relatedCourses);
          }
        })
        .catch((e) => {
          setIsLoader(false);
          console.log(e);
        })
        .finally(() => setIsLoader(false));
    }
  };

  useEffect(() => {
    courseDetailCall();
  }, [params?.id, state?.SelectedCourse]);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const handleClosePopup = () => {
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setconfirmPopup(false);
    setCoursePayment({ value: false, data: "" });
    setPaymentModePopup(false);
  };

  const handleOnChange = () => {
    setIsChecked(!isChecked);

    const formData = new FormData();
    if (isCorporate == "true") {
      formData.append("org_course", encrypt(courseData?.uuid));
    } else {
      formData.append("global_course", encrypt(courseData?.uuid));
    }
    formData.append("is_favourite", !isChecked);
    updateFavoriteCourseApi(formData)
      .then((result) => {})
      .catch((e) => console.log(e));
  };
  function openDynamicURL(url) {
    // Check if the URL starts with 'http://' or 'https://'
    if (!/^https?:\/\//i.test(url)) {
      // If not, assume it starts with 'http://'
      url = "http://" + url;
    }

    // Open the URL in a new tab/window
    const win = window.open();
    win.opener = null;
    win.location.href = url;
  }

  const onExternalEnroll = () => {
    openDynamicURL(courseData?.course_checkout_link);
    let formData = new FormData();
    formData.append("course_name", encrypt(courseData?.course_name));
    formData.append("email_id", encrypt(email));
    formData.append("payment_mode", encrypt("external"));
    formData.append("course_id", courseData?.uuid);
    formData.append("price", encrypt(totalPrice?.toString()));
    isCorporate == "true" && formData.append("course_type", "Corporate");
    setLoderBtn(true);
    sendStatusApi(formData)
      .then((result) => {
        setLoderBtn(false);
        handleClosePopup();
        if (result?.status == "success") {
          // window.open(courseData?.course_checkout_link);
          handleClosePopup();
          courseDetailCall();
          history.push("/my-course");
        }
      })
      .catch((e) => {
        console.log("something went wrong!");
        setLoderBtn(false);
      });
  };

  const onFreeEnroll = () => {
    handleClosePopup();
    setIsLoader(true);
    let formData = new FormData();

    if (isCorporate == "true") {
      formData.append("course_type", "Corporate");
      formData.append("corporate_course_uuid", encrypt(courseData?.uuid));
      formData.append("email_id", encrypt(email));
    } else if (
      courseData?.course_checkout_link &&
      courseData?.fee_type?.fee_type_name === "Free"
    ) {
      formData.append("course_name", encrypt(courseData?.course_name));
      formData.append("email_id", encrypt(email));
      formData.append("payment_mode", encrypt("external"));
      formData.append("course_id", courseData?.uuid);
      console.log(">>>>", "external", courseData?.course_checkout_link);
    } else {
      formData.append("course_name", encrypt(courseData?.course_name));
      formData.append("email_id", encrypt(email));
      formData.append("payment_mode", encrypt("eddi"));
      formData.append("course_id", courseData?.uuid);
      console.log("free");
    }

    sendStatusApi(formData)
      .then((result) => {
        setIsLoader(false);
        handleClosePopup();
        if (result?.status == "success") {
          setFreePaymentResponse(lan == "en" ? result?.data : result?.data_sv);
          setPaymentModePopup(true);
          courseDetailCall();
          setTimeout(() => {
            history.push("/my-course");
          }, 2000);
        } else {
          setPaymentModePopup(true);
          setIsFail(true);
          setFreePaymentResponse(lan == "en" ? result?.data : result?.data_sv);
        }
      })
      .catch((e) => {
        setFreePaymentResponse("something went wrong!");
        setIsLoader(false);
      });
  };
  const handleCheckout = () => {
    handleClosePopup();
    setCoursePayment({ ...coursePayment, value: false });
    if (coursePayment.data == "external") {
      setPaymentModePopup(true);
    } else if (coursePayment.data == "free") {
      // setPaymentModePopup(true)

      onFreeEnroll();
    } else {
      onPaidEnroll();
    }
    // setPaymentModePopup()
  };

  const onPaidEnroll = () => {
    history.push({
      pathname: `/check-out/${courseData?.uuid}?is_corporate=${isCorporate}`,
      state: courseData,
    });

    handleClosePopup();
  };

  return (
    <div className="ViewCourseDetails">
      <Header />
      <div className="main-content ms-0 pt-lg-5 pt-4">
        <div className="container">
          <div className="row ">
            <div className="brdcumb-block">
              <div>
                <Link className="brd-link"></Link>
                <span className="brd-link text-green"> </span>
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

          {courseData ? (
            <div className="row mt-4">
              <div className="col-lg-6 col-12">
                <div className="course-details-main">
                  <div className="course-banner">
                    <img
                      src={
                        courseData?.course_image != null
                          ? `${courseData?.course_image}`
                          : ErrorImage
                      }
                      className="w-100 banner-box-big2"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = ErrorImage;
                      }}
                    />
                  </div>
                  <div className="about-course">
                    <div className="course-information d-flex d-lg-none">
                      <div className="d-flex w-100 justify-content-between">
                        <h1
                          style={{ color: courseData?.course_category?.color }}
                        >
                          {courseData?.course_name}
                        </h1>

                        <span className="course-favorite">
                          <img src={isChecked ? IcHeratFill : IcHerat} />
                          <input
                            type="checkbox"
                            id="topping"
                            name="topping"
                            value="Paneer"
                            checked={isChecked}
                            onChange={handleOnChange}
                          />
                        </span>
                      </div>
                      <p
                        className="unset-list"
                        dangerouslySetInnerHTML={{
                          __html:
                            courseData?.additional_information?.length > 350
                              ? `${courseData?.additional_information?.slice(
                                  0,
                                  350
                                )}...`
                              : courseData?.additional_information,
                        }}
                      ></p>

                      <div className="hstag">
                        {courseData?.sub_area == "null"
                          ? "-"
                          : courseData?.sub_area}
                      </div>
                      <div className="category-type-block">
                        <div
                          className="business-category"
                          style={{
                            borderColor: courseData?.course_category?.color,
                            color: courseData?.course_category?.color,
                          }}
                        >
                          {courseData?.course_category?.category_name
                            ? t(courseData?.course_category?.category_name, lan)
                            : courseData?.course_category[`category_${lan}`] ||
                              ""}
                        </div>
                        <div className="lect-status">
                          {courseData?.course_type?.type_name}
                          {/* Online */}
                        </div>
                      </div>
                      {courseData?.course_type?.type_name !== "Online" ? (
                        <div className="location">
                          <span>{t("Location", lan)}: </span>
                          {(courseData?.organization_location &&
                            " " + courseData?.organization_location) ||
                            "-"}
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between w-100">
                          {/* <span onClick={()=>window.open(courseData?.meeting_link)} className="cursor-pointer text-dark"> {t("MeetingLink", lan)} : <a>Click here.. </a></span>
                    <a> {t("Passcode", lan)} : {` ${courseData?.meeting_passcode}`}</a> */}
                        </div>
                      )}

                      <div className="w-100 mt-5">
                        <InstructorPanel
                          isNotWithData
                          InstructorImage={
                            courseData?.supplier_organization?.organization_logo
                              ? `${courseData?.supplier_organization?.organization_logo}`
                              : noUser
                          }
                          InstructorName={
                            courseData?.supplier?.first_name
                              ? `${t("By", lan)} ${
                                  courseData?.supplier?.first_name || ""
                                } ${courseData?.supplier?.last_name || ""}`
                              : "-"
                          }
                          // CourseGiven="47 Courses"
                          InstructorPostedDate={`Posted on ${new Date(
                            courseData?.created_date_time
                          )
                            .toDateString()
                            .slice(4)}`}
                          ratings={
                            allData?.final_rating && (
                              <div>
                                <img
                                  height={18}
                                  src={Starrating}
                                  style={{ marginTop: "-4px" }}
                                  className="me-1"
                                />
                                {allData?.final_rating
                                  ? allData?.final_rating
                                  : "0"}
                              </div>
                            )
                          }
                        />
                      </div>
                      <div hidden={isEnrolled} className="w-100 mt-4">
                        {courseData &&
                        courseData?.fee_type?.fee_type_name == "Paid" &&
                        (courseData?.course_checkout_link == "" ||
                          courseData?.course_checkout_link == null ||
                          courseData?.course_checkout_link == undefined) ? (
                          <Link
                            // onClick={() => setconfirmPopup(true)}
                            onClick={() =>
                              setCoursePayment({ value: true, data: "paid" })
                            }
                            className="btn btn-green w-100"
                          >
                            {t("ENROLLNOW", lan)}
                          </Link>
                        ) : courseData?.course_checkout_link ? (
                          <Link
                            onClick={() =>
                              setCoursePayment({
                                value: true,
                                data: "external",
                              })
                            }
                            className="btn btn-green w-100"
                          >
                            {t("ENROLLNOW", lan)}
                          </Link>
                        ) : (
                          courseData &&
                          courseData?.fee_type?.fee_type_name == "Free" && (
                            <Link
                              onClick={() =>
                                setCoursePayment({ value: true, data: "free" })
                              }
                              className="btn btn-green w-100"
                            >
                              {t("ENROLLNOW", lan)}
                            </Link>
                          )
                        )}
                      </div>
                      <div hidden={!isEnrolled} className="w-100 mt-4">
                        <button className="btn btn-green w-100" disabled>
                          {t("AlreadyEnrolled", lan)}
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <h1 className="col-12">{t("aboutThisCourse", lan)}</h1>
                      {/* {isEnrolled && (
                      <Link
                        to={`/eddi-labs/${courseData?.uuid}`}
                        className="col-6 materialText cursor-pointer"
                      >
                        {t("View Course Material", lan)}
                      </Link>
                    )} */}
                    </div>

                    {courseData?.additional_information?.length < 150 ? (
                      <p
                        className="unset-list"
                        dangerouslySetInnerHTML={{
                          __html: courseData?.additional_information,
                        }}
                      ></p>
                    ) : (
                      <>
                        <p>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: isReadMore
                                ? courseData?.additional_information?.slice(
                                    0,
                                    150
                                  )
                                : courseData?.additional_information,
                            }}
                            className="unset-list"
                          ></p>
                          <div
                            hidden={
                              courseData?.additional_information?.length > 150
                                ? false
                                : true
                            }
                          >
                            <span
                              onClick={toggleReadMore}
                              className="cursor-pointer mt-3"
                            >
                              <img
                                hidden={
                                  courseData?.additional_information?.length >
                                  150
                                    ? false
                                    : true
                                }
                                height={18}
                                style={{ marginTop: "-4px" }}
                                src={isReadMore ? IcReadmore : IcReadless}
                                className="me-2"
                              />
                              {isReadMore
                                ? `${t("readmore", lan)}`
                                : `${t("readless", lan)}`}
                            </span>
                          </div>
                        </p>
                      </>
                    )}

                    {/* {isEnrolled ? (
                    <Link
                      to={`/eddi-labs/${courseData?.uuid}`}
                      className="btn btn-green w-100"
                    >
                      {t("ViewMaterial", lan)}
                    </Link>
                  ) : (
                    ""
                  )} */}
                    {/* 
                  <h1 className="mt-lg-5">{t("Whatyouwilllearn", lan)}</h1>
                  <ul>
                    <li>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </li>
                    <li>Senectus posuere elemen tum nulla tristique. </li>
                    <li>
                      Lorem a nullam ut pellentesque viverra mauris amet,
                      placerat.
                    </li>
                    <li>
                      Ante quis est bibendum sagittis iaculis aliquet
                      scelerisque diam.
                    </li>
                    <li>
                      Pretium morbi ac, eget nec, a, egestasligula malesuada
                      diam
                    </li>
                  </ul> */}

                    <h1 className="mt-lg-5 mb-lg-4 mt-2">
                      {t("AboutInstructor", lan)}
                    </h1>

                    <div>
                      <InstructorPanel
                        InstructorImage={
                          courseData?.supplier_organization?.organization_logo
                            ? `${courseData?.supplier_organization?.organization_logo}`
                            : noUser
                        }
                        InstructorName={
                          courseData?.author_name
                            ? `${t("By", lan)} ${courseData?.author_name || ""}`
                            : `${t("By", lan)} ${
                                courseData?.supplier?.first_name || ""
                              } ${courseData?.supplier?.last_name || ""}`
                        }
                        InstructorPostedDate={`From ${
                          allData?.Supplier_Organization_Profile
                            ?.organizational_name ||
                          courseData?.supplier_organization
                            ?.organizational_name ||
                          ""
                        }`}
                        // InstructorEmail={courseData?.supplier_organization?.organization_email ||
                        //   allData?.Supplier_Organization_Profile?.organizational_name ||''
                        // }
                        InstructorEmail={
                          courseData?.instructor_email
                            ? courseData?.instructor_email
                            : ""
                        }
                        // CourseGiven="47 Courses"
                        InstructorBio={
                          courseData?.author_bio ? courseData?.author_bio : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-12">
                <div className="course-information d-none d-lg-flex">
                  <div className="d-flex w-100 justify-content-between">
                    <h1 style={{ color: courseData?.course_category?.color }}>
                      {courseData?.course_name}
                      {/* Learning Business and Finance basics with Marketing
                    Analytics */}
                    </h1>

                    <span className="course-favorite">
                      <img src={isChecked ? IcHeratFill : IcHerat} />
                      <input
                        type="checkbox"
                        id="topping"
                        name="topping"
                        value="Paneer"
                        checked={isChecked}
                        onChange={handleOnChange}
                      />
                    </span>
                  </div>
                  <p
                    className="unset-list"
                    dangerouslySetInnerHTML={{
                      __html:
                        courseData?.additional_information?.length > 350
                          ? `${courseData?.additional_information?.slice(
                              0,
                              350
                            )}...`
                          : courseData?.additional_information,
                    }}
                  ></p>

                  <div className="hstag">
                    {courseData?.sub_area == "null" ? "" : courseData?.sub_area}
                    {/* #sub-area, #sub-area */}
                  </div>
                  <div className="category-type-block">
                    <div
                      className="business-category"
                      style={{
                        borderColor: courseData?.course_category?.color,
                        color: courseData?.course_category?.color,
                      }}
                    >
                      {courseData?.course_category[`category_${lan}`]
                        ? courseData?.course_category[`category_${lan}`]
                        : t(courseData?.course_category?.category_name, lan) ||
                          ""}
                      {/* Business and Finance */}
                    </div>
                    <div className="lect-status">
                      {t(courseData?.course_type?.type_name, lan)}
                      {/* Online */}
                    </div>
                  </div>
                  {courseData?.organization_location &&
                  courseData?.course_type?.type_name !== "Online" ? (
                    <div className="mt-3">
                      <span>{t("Location", lan)}: </span>
                      {" " + courseData?.organization_location || "-"}
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between w-100">
                      {/* <span onClick={()=>window.open(courseData?.meeting_link)} className="cursor-pointer text-dark"> {t("MeetingLink", lan)} : <a>Click here.. </a></span>
                    <a> {t("Passcode", lan)} : {` ${courseData?.meeting_passcode}`}</a> */}
                    </div>
                  )}

                  <div className="w-100 mt-5">
                    <InstructorPanel
                      isNotWithData
                      InstructorImage={
                        courseData?.supplier_organization?.organization_logo
                          ? `${courseData?.supplier_organization?.organization_logo}`
                          : noUser
                      }
                      InstructorName={
                        courseData?.author_name
                          ? `${t("By", lan)} ${courseData?.author_name || ""}`
                          : `${t("By", lan)} ${
                              courseData?.supplier?.first_name || ""
                            } ${courseData?.supplier?.last_name || ""}`
                      }
                      // CourseGiven="47 Courses"
                      InstructorBio={
                        courseData?.author_bio ? courseData?.author_bio : ""
                      }
                      // CourseGiven="47 Courses"
                      InstructorPostedDate={`Posted on ${new Date(
                        courseData?.created_date_time
                      )
                        .toDateString()
                        .slice(4)}`}
                      ratings={
                        allData?.final_rating && (
                          <div>
                            <img
                              height={18}
                              src={Starrating}
                              style={{ marginTop: "-4px" }}
                              className="me-1"
                            />
                            {allData?.final_rating
                              ? allData?.final_rating
                              : "0"}
                          </div>
                        )
                      }
                    />
                  </div>
                  <div hidden={isEnrolled} className="w-100 mt-4">
                    {courseData &&
                    courseData?.fee_type?.fee_type_name == "Paid" &&
                    (courseData?.course_checkout_link == "" ||
                      courseData?.course_checkout_link == null ||
                      courseData?.course_checkout_link == undefined) ? (
                      <Link
                        // onClick={() => setconfirmPopup(true)}
                        onClick={() =>
                          setCoursePayment({ value: true, data: "paid" })
                        }
                        className="btn btn-green w-100"
                      >
                        {t("ENROLLNOW", lan)}
                      </Link>
                    ) : courseData?.course_checkout_link ? (
                      <Link
                        onClick={() =>
                          setCoursePayment({ value: true, data: "external" })
                        }
                        className="btn btn-green w-100"
                      >
                        {t("ENROLLNOW", lan)}
                      </Link>
                    ) : (
                      courseData &&
                      courseData?.fee_type?.fee_type_name == "Free" && (
                        <Link
                          onClick={() =>
                            setCoursePayment({ value: true, data: "free" })
                          }
                          className="btn btn-green w-100"
                        >
                          {t("ENROLLNOW", lan)}
                        </Link>
                      )
                    )}
                  </div>
                  <div hidden={!isEnrolled} className="w-100 mt-4">
                    <button className="btn btn-green w-100" disabled>
                      {t("AlreadyEnrolled", lan)}
                    </button>
                  </div>
                </div>
                <div className="course-amount-time">
                  <ul>
                    <li>
                      <span className="item-icon">
                        <img src={IcLearner} />
                      </span>
                      <div className="item-detail">
                        {LearnersCount} {t("Learners", lan)}
                      </div>
                    </li>
                    <li hidden={!courseData?.course_starting_date}>
                      <span className="item-icon">
                        <img src={IcCal} />
                      </span>
                      <div className="item-detail">
                        {t("StartsFrom", lan)}{" "}
                        {new Date(courseData?.course_starting_date).getDate()}{" "}
                        {t(
                          `${
                            monthNames[
                              new Date(
                                courseData?.course_starting_date
                              ).getMonth()
                            ]
                          }`,
                          lan
                        )}
                      </div>
                    </li>
                    <li>
                      <span className="item-icon">
                        <img src={IcLevel} />
                      </span>
                      <div className="item-detail">
                        {t(`${courseData?.course_level?.level_name}`, lan)}
                        {/* Beginner */}
                      </div>
                    </li>
                    <li>
                      <span className="item-icon">
                        <img src={IcTime} />
                      </span>
                      <div className="item-detail">
                        {courseData?.course_length}{" "}
                        {t(
                          courseData?.course_length_type === "hour"
                            ? "Hours"
                            : "Days",
                          lan
                        )}
                        {/* 3-4 Weeks */}
                      </div>
                    </li>
                    <li>
                      <span className="item-icon">
                        <img src={IcAmt} />
                      </span>
                      <div className="item-detail">
                        {courseData?.course_price <= 0
                          ? t("FreeData", lan)
                          : // : courseData?.supplier?.is_corporate
                            // ? t("FreeData", lan)
                            `${totalPrice} SEK `}
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="advertisement-blcok">
                  <RelatedCourseLinks
                    data={relatedCourseData?.slice(0, 8)}
                    type={"Courses"}
                    isCorporate={isCorporate == "true"}
                  />
                </div>
              </div>
            </div>
          ) : (
            <NoData />
          )}
        </div>

        <Footer isSmallFooter />
      </div>
      {/* // payment popup
       */}
      {paymentModePopup && (
        <Popup
          show={paymentModePopup}
          header={courseData?.course_name}
          handleClose={handleClosePopup}
        >
          {coursePayment?.data == "external" ? (
            <>
              <div className="popupinfo">
                <p>{t("ExternalCourseDetails", lan)}</p>
              </div>
            </>
          ) : (
            <>
              <div className="popup-header">
                <img
                  className="img-responsive img-fluid img-status"
                  src={isFail ? fail : success}
                ></img>
              </div>
              <div className="popupinfo">
                {isFail ? (
                  <p>{freePaymentResponse}</p>
                ) : (
                  <p>{t("SuccessEnroll", lan)}</p>
                )}
              </div>
            </>
          )}
          <div className="w-100">
            <button
              disabled={loderBtn}
              onClick={() => {
                coursePayment?.data == "external"
                  ? onExternalEnroll()
                  : coursePayment?.data == "free"
                  ? handleClosePopup()
                  : handleClosePopup();
              }}
              className="btn btn-green text-uppercase w-100 mt-2"
            >
              {loderBtn ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                t("CONTINUE", lan)
              )}
            </button>
          </div>
        </Popup>
      )}

      {/* //all payment main popup */}
      {coursePayment.value ? (
        <Popup
          show={coursePayment.value}
          header={t("OrderConfirmation", lan)}
          handleClose={() => setCoursePayment({ value: false, data: "" })}
        >
          <div className="popupinfo">
            <div className="row m-0">
              <div className="course-thumbnail me-1 col-sm-4 col-xs-12 px-0">
                <img
                  src={
                    courseData?.course_image
                      ? `${courseData?.course_image}`
                      : placeholder
                  }
                  className="course-thumbnail-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = ErrorImage;
                  }}
                />
              </div>

              <div className="col-sm-6 col-xs-12">
                <span className="f-18 mb-2 text-img">
                  {courseData?.course_name || "-"}
                </span>
                <div className="category-type-block">
                  <div className="business-category mt-2">
                    {courseData?.course_category?.category_name
                      ? t(courseData?.course_category?.category_name, lan)
                      : courseData?.course_category[`category_${lan}`] || ""}
                  </div>
                </div>
              </div>
              <div className="col">
                <p className="f-18 fw-bold text-md-end text-center course-number">
                  {" "}
                  {courseData?.course_price <= 0
                    ? t("FreeData", lan)
                    : `${totalPrice} SEK`}
                </p>
                <div className="vat-charge-text">
                  {courseData?.course_price != "" &&
                    courseData?.course_price != null && (
                      <p> {"*" + t("IncludeVATCharges", lan)}</p>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-100">
            <button
              onClick={handleCheckout}
              className="btn btn-green text-uppercase w-100 mt-3"
            >
              {t("CONTINUE", lan)}
            </button>
          </div>
        </Popup>
      ) : (
        ""
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default ViewCourseDetails;
