import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import IcCal from "../../assets/images/IcCalendar.svg";
import "./MyCourse.scss";
import CourseImg from "../../assets/images/CourseListImg.png";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import IntImage from "../../assets/images/IntImage.png";
import IcStar from "../../assets/images/star.svg";
import IcStarYellow from "../../assets/images/star-yellow.svg";
import noUser from "../../assets/images/noUser.svg";
import placeholder from "../../assets/images/placeholder.svg";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import Sidebar from "../../components/sidebar/Sidebar";
import Advertisement from "../../components/Advertisement/Advertisement";
import Popup from "../../components/popup/popup";
import RelatedCourseLinks from "../../components/RelatedCourseLinks/RelatedCourseLinks";
import { useHistory } from "react-router-dom";
import {
  addRating,
  getAllEnrolledCourse,
  getEnrolledCourse,
  getRating,
} from "../../services/eddiServices";
import api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedCourse } from "../../redux/actions";
import NoData from "../../components/NoData/NoData";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import Loader from "../../components/Loader/Loader";
import { askForPermissioToReceiveNotifications } from "../../services/firebaseService";
import FilterSelectMenu from "../../components/FilterSelectMenu/FilterSelectMenu";

const MyCourse = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const [rateNowPopup, setrateNowPopup] = useState({ value: false, data: "" });
  const [enrolledCourses, setEnrolledCourses] = useState();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [viewStatus, setViewStatus] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isChecked, setIsChecked] = useState({ value: false, id: "" });
  const [paginationStartIndex, setPaginationStartIndex] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [relatedData, setRelatedData] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbacktext] = useState();
  const [thankYou, setThankYou] = useState(false);

  const [editAble, setEditAble] = useState();

  useEffect(async () => {
    getEnrolledCourseApi();
    window?.scrollTo(0, 0);
  }, [viewStatus]);

  const getEnrolledCourseApi = () => {
    setIsLoader(true);

    getAllEnrolledCourse(viewStatus)
      .then((result) => {
        if (result?.status === "success") {
          setIsLoader(false);

          setEnrolledCourses(result.data);
          const corporateRelated =
            result.related_corporate_course.map((mm) => {
              mm["is_corporate"] = true;
              return mm;
            }) || [];
          const globalRelated = result.related_course || [];
          setRelatedData([...globalRelated, ...corporateRelated]);
        } else {
          setIsLoader(false);
        }
      })
      .catch((e) => console.log(e));
  };

  const getRatingApi = (courseData) => {
    preventScroll();
    getRating(courseData?.course_uuid)
      .then((res) => {
        setrateNowPopup({ value: true, data: courseData });
        if (res?.status == "success") {
          setRating(Number(res?.data?.star));
          setFeedbacktext(res?.data?.comment);
          if (res?.data?.star === 0) {
            setEditAble(true);
          } else {
            setEditAble(false);
          }
        }
      })
      .catch((e) => console.log(e));
  };

  const onSubmitFeedback = () => {
    let formData = new FormData();
    formData.append("star", rating);
    formData.append("comment", feedbackText || "");
    addRating(rateNowPopup.data?.course_uuid, formData)
      .then((res) => {
        if (res?.status == "success") {
          handleClosePopup();
          setThankYou(true);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleClosePopup = () => {
    // window.location.reload();
    setThankYou(false);
    preventScroll();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setrateNowPopup({ value: false, data: "" });
    setRating(0);
    setFeedbacktext("");
    setEditAble(true);
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };

  const paginationUser = () => {
    const paginationData = [];

    const actualIndex = paginationStartIndex - 1;
    filteredCourses?.map((data, i) => {
      if (i >= actualIndex && i <= actualIndex + 4) {
        paginationData.push(data);
      }
    });
    setPagination(paginationData);
  };

  useEffect(() => {
    paginationUser();
  }, [paginationStartIndex, filteredCourses]);

  const paginationPrevUser = () => {
    setPaginationStartIndex(paginationStartIndex - 5);
  };
  const paginationNextUser = () => {
    setPaginationStartIndex(paginationStartIndex + 5);
  };
  const filterCourse = () => {
    // setFilteredCourses
    let filtered = [];
    if (typeFilter === "Global") {
      filtered = enrolledCourses.filter(
        (item) => item?.course_type === "Global"
      );
    } else if (typeFilter === "MyOrgCourse") {
      filtered = enrolledCourses.filter(
        (item) => item?.course_type === "Corporate"
      );
    } else {
      filtered = enrolledCourses;
    }
    setFilteredCourses(filtered);
  };

  useMemo(() => {
    filterCourse();
  }, [enrolledCourses, typeFilter]);

  return (
    <div className="MyCourse">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container fixHeight">
            <div className="row">
              <div className="brdcumb-block">
                <div>
                  <Link to={"/user-dashboard"} className="brd-link">
                    {t("Dashboard", lan)} |{" "}
                  </Link>
                  <span className="brd-link text-green">
                    {" "}
                    {t("MyCourses", lan)}{" "}
                  </span>
                </div>
                {/* <Link
                  onClick={() => {
                    history.goBack();
                  }}
                  className="brd-link"
                >
                  {t("Back", lan)}
                </Link> */}
              </div>
            </div>
            <div className="row my-course-fill">
              <div className="col-lg-8 col-12 d-flex justify-content-between align-items-center">
                <h2 className="mb-4 mt-3">{t("MyCourses", lan)}</h2>

                <FilterSelectMenu
                  value={["All", "Global", "MyOrgCourse"]}
                  placeholder=""
                  isWithicon
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="position-relative">
              <div className="row position-relative">
                <div className="col-lg-8 col-12">
                  <div className="filter-block">
                    <div className="radio-toolbar">
                      <input
                        type="radio"
                        id="radio1"
                        name="radios"
                        value="All"
                        onClick={(e) => setViewStatus(e?.target?.value)}
                      />
                      <label
                        style={{
                          color:
                            viewStatus?.toLowerCase() == "all" ? "#3e8181" : "",
                        }}
                        htmlFor="radio1"
                      >
                        {t("All", lan)}
                      </label>
                      <input
                        type="radio"
                        id="radio2"
                        name="radios"
                        value="Ongoing"
                        onClick={(e) => setViewStatus(e?.target?.value)}
                      />
                      <label htmlFor="radio2">{t("Ongoing", lan)}</label>
                      <input
                        type="radio"
                        id="radio3"
                        name="radios"
                        value="Completed"
                        onClick={(e) => setViewStatus(e?.target?.value)}
                      />
                      <label htmlFor="radio3">{t("Completed", lan)}</label>
                    </div>
                    <div className="filter-result">
                      {filteredCourses?.length || 0} {t("CourseFound", lan)}
                    </div>
                  </div>

                  {pagination?.length > 0 ? (
                    pagination?.map((MyCourseList, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className={
                              MyCourseList?.payment_approval == "Approved"
                                ? "course-list-block"
                                : "course-list-block disable-block"
                            }
                          >
                            <div className="course-thumbnail">
                              <img
                                src={
                                  MyCourseList?.course_image
                                    ? `${MyCourseList?.course_image}`
                                    : CourseImg
                                }
                                className="course-thumbnail-img"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = ErrorImage;
                                }}
                              />
                            </div>
                            <div className="list-content">
                              <div className="list-content-block">
                                <div>
                                  <h3
                                    className="cursor-pointer"
                                    onClick={() => {
                                      dispatch(
                                        getSelectedCourse(
                                          MyCourseList?.course_uuid
                                        )
                                      );
                                      history.push(
                                        `/view-course-details?is_corporate=${
                                          MyCourseList?.course_type ==
                                          "Corporate"
                                        }`
                                      );
                                    }}
                                  >
                                    {MyCourseList?.course || "-"}
                                  </h3>
                                  <h6
                                    style={{
                                      color: `${"rgba(72, 26, 32, 1)"}`,
                                    }}
                                  >
                                    {t(MyCourseList?.course_category, lan) ||
                                      "-"}
                                  </h6>
                                </div>
                                <div className="d-flex  flex-column">
                                  <div className="d-flex ">
                                    <p className="errorText mb-1">
                                      {MyCourseList?.payment_approval ==
                                      "Pending"
                                        ? t("PaymentConfirmationPending", lan)
                                        : ""}
                                    </p>
                                  </div>
                                  <div>
                                    <img src={IcCal} className="me-1" />
                                    <span className="list-date">
                                      {t("Startsfrom", lan)}{" "}
                                      {MyCourseList?.start_date || "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="btn-status-area">
                                <div>
                                  <div
                                    className="course-status"
                                    style={{
                                      color: `${
                                        MyCourseList?.course_status ===
                                        "Pending"
                                          ? "#5C59E7"
                                          : MyCourseList?.course_status ===
                                            "Ongoing"
                                          ? "#DBBA0D"
                                          : "#009B19"
                                      }`,
                                    }}
                                  >
                                    {t(MyCourseList?.course_status || "", lan)}
                                  </div>
                                  {MyCourseList.course_type !== "Corporate" && (
                                    <Link
                                      onClick={() => {
                                        getRatingApi(MyCourseList);
                                      }}
                                      className="course-status link-green"
                                    >
                                      {t("RateNow", lan)}
                                    </Link>
                                  )}
                                </div>
                                <div>
                                  <Link
                                    to={`/course-overview/${MyCourseList?.course_uuid}`}
                                    className="btn btn-green mt-3"
                                  >
                                    {t("ViewMaterial", lan)}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <div>
                      <NoData />
                    </div>
                  )}
                  <div
                    hidden={filteredCourses?.length > 5 ? false : true}
                    className="table-pagination text-end"
                  >
                    <CustomPagination
                      startIndex={paginationStartIndex}
                      endIndex={
                        paginationStartIndex + 4 > filteredCourses?.length
                          ? filteredCourses?.length
                          : paginationStartIndex + 4
                      }
                      totalData={filteredCourses?.length}
                      onPrev={paginationPrevUser}
                      onNext={paginationNextUser}
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-12 add-section">
                  <Advertisement
                    title={t("RecrutmentTitle", lan)}
                    addContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                  {/* <div className="mt-2 view-all-ads ">
                    <a>View more</a>
                  </div> */}
                  <div>
                    <RelatedCourseLinks
                      data={relatedData?.slice(0, 8)}
                      type={"Courses"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>
      {thankYou && (
        <div className="thankYou">
          <Popup show={thankYou} header="" handleClose={handleClosePopup}>
            <div className="popupinfo">
              <div className="w-100 text-center">
                <h3>{t("ThanksRating", lan)}</h3>
              </div>
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
        </div>
      )}

      {rateNowPopup.value && (
        <Popup
          show={rateNowPopup.value}
          header="Provide Your Feedback"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <div className="inst-image">
              <img
                src={
                  rateNowPopup.data?.course_image
                    ? `${rateNowPopup.data?.course_image}`
                    : placeholder
                }
              />
            </div>
            <div className="d-flex flex-column w-100 flex-grow">
              <h3 className="text-start">{`  ${rateNowPopup.data?.course}`}</h3>
              <p className="text-start">{`${
                t(rateNowPopup.data?.course_category, lan) || "-"
              }`}</p>
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button
                      type="button"
                      disabled={rateNowPopup.data?.star ? true : false}
                      key={index}
                      className={index <= rating ? "on" : "off"}
                      onClick={editAble === false ? "" : () => setRating(index)}
                    >
                      <span className="star">
                        <img src={index <= rating ? IcStarYellow : IcStar} />
                      </span>
                    </button>
                  );
                })}
              </div>{" "}
            </div>
          </div>

          <textarea
            className="textAr"
            placeholder="Write your comment here"
            defaultValue={feedbackText}
            onChange={(e) => setFeedbacktext(e?.target?.value)}
          ></textarea>
          <div className="w-100 ">
            <button
              disabled={rating <= 0 ? true : false}
              onClick={onSubmitFeedback}
              className="btn btn-green text-uppercase w-100 mt-2"
            >
              {t("SUBMIT", lan)}
            </button>
          </div>
        </Popup>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default MyCourse;
