import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./UserDashboard.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";

import Sidebar from "../../components/sidebar/Sidebar";
import NewestCourse from "../../components/newestCourse/NewestCourse";
import InputText from "../../components/inputText/inputText";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import IcNodata from "../../assets/images/IcNodata.svg";

import API from "../../api";
import {
  getAllEvent,
  getCorporateDashboard,
  getCorporateCategories,
  getAllCorporateEvent,
  getNews,
  getUserProfileApi,
} from "../../services/eddiServices";
import { useDispatch, useSelector } from "react-redux";

import {
  getPersonalProfileData,
  isEddiSuggestion,
  searchCourseText,
} from "../../redux/actions";
import { useHistory } from "react-router-dom";
import CTAbanner from "../../components/CTAbanner/CTAbanner";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import { dashboardCmsApi } from "../../services/cmsServices";
import NewestCourseNotFound from "../../components/NewestCourseNotFound/NewestCourseNotFound";
import AboutImg from "../../assets/images/aboutbanner.jpg";
import CompanyLogo from "../../assets/images/eddi_no_image.png";
import BackgroundLogo from "../../assets/images/corporate_ackground.svg";
import { showShorttext } from "../../services/constant";

const dummyCategory = [
  {
    name: "HR",
    color: "#76918C",
  },
  {
    name: "IT",
    color: "#1A4840",
  },
  {
    name: "Finance",
    color: "#A69396",
  },
  {
    name: "Operations",
    color: "#876C6F",
  },
  {
    name: "Onboarding",
    color: "#3E8080",
  },
  {
    name: "HSE",
    color: "#481A20",
  },
];

const CorporateUserDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const [isLoader, setIsLoader] = useState(true);

  const [eventData, setEventData] = useState([]);
  const [allEventData, setAllEventData] = useState([]);
  const [isReadMore, setIsReadMore] = useState(true);
  const [isReadMoreWhat, setIsReadMoreWhat] = useState(true);
  const [dashboardData, setDashboardData] = useState();
  const [categoriesData, setCategoriesData] = useState([]);
  const [newsEventList, setNewsEventList] = useState([]);

  function eventNewsComparisonbyNewestDate(a, b) {
    const date1 = new Date(a?.created_date_time);
    const date2 = new Date(b?.created_date_time);

    return date2 - date1;
  }

  const newsEventApiCall = async () => {
    try {
      setIsLoader(true);
      const eventRes = await getAllCorporateEvent();
      const newsRes = await getNews(true);
      setIsLoader(false);
      let combineRes = [];
      if (eventRes?.status == "success") {
        let countResult = [];
        eventRes?.data?.map((data, i) => {
          //for event only
          if (
            data?.event_choose_type == "Event" &&
            data?.event_publish_on?.toLowerCase() !== "landing page" &&
            data?.status?.value == "Active"
          ) {
            data["is_event"] = true;

            combineRes.push(data);
          }

          //for advertisement and event both
          if (
            data?.event_publish_on?.toLowerCase() !== "landing page" &&
            data?.status?.value == "Active"
          ) {
            countResult.push(data);
          }
        });
        let allEvent = [...countResult];
        setEventData(allEvent);
      }

      if (newsRes.status === "success") {
        const newsUpdated = newsRes.data.map((n) => {
          n["is_event"] = false;
          return n;
        });
        combineRes = [...combineRes, ...newsUpdated];
      }
      combineRes = combineRes.sort(eventNewsComparisonbyNewestDate);

      setNewsEventList(combineRes);
    } catch (e) {
      setIsLoader(false);
      console.log(e);
    }
  };

  const getUserData = async () => {
    setIsLoader(true);
    getUserProfileApi()
      .then((result) => {
        if (result?.status == "success") {
          dispatch(getPersonalProfileData(result?.data));
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoader(false));
  };
  const getDashboardContent = () => {
    setIsLoader(true);
    getCorporateDashboard()
      .then((res) => {
        if (res.status == "success") {
          setDashboardData(res?.data);
        }
      })
      .catch((e) => console.log(e))
      .finally((e) => setIsLoader(false));
  };

  const categoriesCall = async () => {
    setIsLoader(true);
    await getCorporateCategories()
      .then((res) => {
        // setIsLoader(false)
        if (res.status == "success") {
          setCategoriesData(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoader(false));
  };

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const toggleReadMoreWhatson = () => {
    setIsReadMoreWhat(!isReadMoreWhat);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    categoriesCall();
    getDashboardContent();
    newsEventApiCall();
    getUserData();
  }, []);
  return (
    <div className="UserDashboard">
      <Header hidePartial={true} />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container">
            <div className="row main-img-dash">
              <div className="row">
                <h2 className="mb-4">
                  {t("Welcome", lan)}{" "}
                  {state?.UserDetail?.data?.first_name
                    ?.charAt(0)
                    ?.toUpperCase()}
                  {state?.UserDetail?.data?.first_name?.slice(1)}
                </h2>
              </div>
              <div className="me-lg-3 me-0 ">
                <div className="position-relative">
                  {dashboardData?.corporate_bg_image ? (
                    <img
                      className="back-img"
                      src={`${dashboardData?.corporate_bg_image}`}
                    />
                  ) : (
                    <div className="back-img bg-white"></div>
                  )}

                  <div className="card company-logo shadow">
                    <img
                      src={`${dashboardData?.corporate_logo || CompanyLogo}`}
                    />
                  </div>
                </div>

                {dashboardData && (
                  <div className="desc-comp  px-lg-5 p-4">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: isReadMore
                          ? dashboardData[`about_company_${lan}`]?.slice(
                              0,
                              450
                            ) || ""
                          : dashboardData[`about_company_${lan}`] || "",
                      }}
                      className="mt-5 unset-list "
                    ></p>
                    {dashboardData[`about_company_${lan}`]?.length > 450 && (
                      <p className="text-end">
                        <span
                          onClick={toggleReadMore}
                          className="cursor-pointer mt-3 read-more-less"
                        >
                          {isReadMore
                            ? `${t("readmore", lan)}`
                            : `${t("readless", lan)}`}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-lg-6 col-12">
                {dashboardData && (
                  <div className="whatson  me-lg-3 me-0">
                    <h2>{t("WhatOn", lan)}</h2>

                    {dashboardData[`whats_on_${lan}`] ? (
                      <p
                        className="mt-5 unset-list"
                        dangerouslySetInnerHTML={{
                          __html: isReadMoreWhat
                            ? dashboardData[`whats_on_${lan}`]?.slice(0, 650)
                            : dashboardData[`whats_on_${lan}`],
                        }}
                      ></p>
                    ) : (
                      <NoData />
                    )}
                    {dashboardData[`whats_on_${lan}`]?.length > 650 && (
                      <p className="text-end">
                        <span
                          onClick={toggleReadMoreWhatson}
                          className="cursor-pointer mt-3 read-more-less"
                        >
                          {isReadMoreWhat
                            ? `${t("readmore", lan)}`
                            : `${t("readless", lan)}`}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="col-lg-6 col-12">
                <div className="newsArticle ms-lg-3 ms-0">
                  <h2>{t("NewsEvents", lan)}</h2>
                  <ul>
                    {newsEventList?.length > 0 ? (
                      newsEventList
                        .slice(0, 3)
                        .map((EventListData, index, size) => {
                          const title = EventListData.is_event
                            ? EventListData?.event_name
                            : EventListData[`news_title_${lan}`];
                          const desc = EventListData.is_event
                            ? EventListData?.event_description
                            : EventListData[`news_short_description_${lan}`];
                          const image = EventListData.is_event
                            ? EventListData.event_image
                            : EventListData?.news_image;
                          const date = new Date(
                            EventListData?.is_event
                              ? EventListData?.start_date
                              : EventListData?.created_date_time
                          )
                            .toDateString()
                            .slice(4);
                          return (
                            <li key={index}>
                              <div className="dashboardEvent-img">
                                <img src={image ?? ErrorImage} />
                              </div>
                              <div className="dashboardEvent-information">
                                <div>
                                  <h2 className="text-break">
                                    {showShorttext(title, 20)}
                                  </h2>
                                  <h6>
                                    {t(EventListData?.event_category, lan) ||
                                      "-"}
                                  </h6>
                                  <p
                                    className="unset-list"
                                    dangerouslySetInnerHTML={{
                                      __html: showShorttext(desc, 40) || "-",
                                    }}
                                  >
                                    {/* {showShorttext(desc, 40) || "-"} */}
                                  </p>
                                </div>
                                <div className="action-box d-flex">
                                  <div>{date}</div>
                                  <Link
                                    className="btn btn-green"
                                    to={`/user-dashboard/${
                                      EventListData?.is_event ? "event" : "news"
                                    }-details/${
                                      EventListData?.uuid
                                    }?is_corporate=1`}
                                  >
                                    {t("VIEW", lan)}
                                  </Link>
                                </div>
                              </div>
                            </li>
                          );
                        })
                    ) : (
                      <NoData />
                    )}
                  </ul>
                  {newsEventList.length > 3 && (
                    <div className="text-end">
                      <Link
                        to={"/corporate-user-dashboard/corporate-event-list"}
                        className="link-green "
                        // style={{
                        //   display: EventListData.length > 3 ? "block" : "none",
                        // }}
                      >
                        {t("VIEWALL", lan)}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* d-flex flex-sm-row flex-column justify-content-between align-items-center mb-3 */}
            <div className="courses-section ">
              <div className="course-categories">
                <h2 className="text-start ">{t("OurCourseCategory", lan)}</h2>

                {/* <button
                  onClick={() =>
                    history.push(
                      "/corporate-user-dashboard/categorized-course?id="
                    )
                  }
                  className="btn-green mx-2"
                >
                  {t("ViewAllCourses", lan)}
                </button> */}
                <Link
                  onClick={() =>
                    history.push(
                      "/corporate-user-dashboard/categorized-course?id="
                    )
                  }
                  className="view-all-course mx-2"
                >
                  {t("ViewAllCourses", lan)}
                </Link>
              </div>
              <div className="course-category">
                {categoriesData?.length > 0 ? (
                  <div className="course-category-wrap">
                    {categoriesData.map((courses, index) => {
                      return (
                        <div className="card-wrap" key={index}>
                          <div
                            className="course-box"
                            style={{
                              backgroundColor: dummyCategory[index].color,
                            }}
                          >
                            <div className="course-block align-items-center">
                              <h1 className="f-30 text-break">
                                {courses[`category_${lan}`]}
                              </h1>
                              <p>{courses[`category_detail_${lan}`]}</p>
                              <Link
                                to={`/corporate-user-dashboard/categorized-course?id=${courses.id}`}
                                className="btn btn-view"
                              >
                                {t("VIEW", lan)}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <NoData />
                )}
              </div>

              <div>
                <CTAbanner data={allEventData} isCorporate={true} />
              </div>
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default CorporateUserDashboard;
