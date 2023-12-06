import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./UserDashboard.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import SpaceIc from "../../assets/images/space.svg";
import HeartIc from "../../assets/images/heart.svg";
import Icgraduate from "../../assets/images/user-graduate.svg";
import DisImg from "../../assets/images/DisImg.png";
import IcSearch from "../../assets/images/IcSearch.svg";
import Sidebar from "../../components/sidebar/Sidebar";
import NewestCourse from "../../components/newestCourse/NewestCourse";
import InputText from "../../components/inputText/inputText";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import API from "../../api";
import {
  getCategoryApi,
  getCoursesApi,
  getUserProfileApi,
  getAllEvent,
  getSubCatForCourseListById,
  getSubCatForCourseList,
  getNews,
} from "../../services/eddiServices";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllCategories,
  getAllCourses,
  getAllCourseSubCategories,
  getPersonalProfileData,
  isEddiSuggestion,
  orgCourses,
  searchCourseText,
} from "../../redux/actions";
import { useHistory } from "react-router-dom";
import CTAbanner from "../../components/CTAbanner/CTAbanner";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import { dashboardCmsApi } from "../../services/cmsServices";
import NewestCourseNotFound from "../../components/NewestCourseNotFound/NewestCourseNotFound";
import { showShorttext } from "../../services/constant";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const [isLoader, setIsLoader] = useState(true);

  const [allEventList, setAllEventList] = useState();
  const [newsEventList, setNewsEventList] = useState([]);
  const [whatsOn, setWhatsOn] = useState();
  const [newCourses, setNewCourses] = useState();
  const [searchResult, setsearchResult] = useState(state?.AllCourses);
  const [searchText, setsearchText] = useState(state?.SearchCourseText);
  const [courseData, setCourseData] = useState(state?.AllCourses);
  const [isSuggestive, setIsSuggestive] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  function eventNewsComparisonbyNewestDate(a, b) {
    const date1 = new Date(a?.created_date_time);
    const date2 = new Date(b?.created_date_time);

    return date2 - date1;
  }

  const newsEventApiCall = async () => {
    try {
      const eventRes = await getAllEvent();
      const newsRes = await getNews(false);
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
        setAllEventList(allEvent);
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
      console.log(e);
    }
  };

  const coursesCall = async () => {
    await getCoursesApi()
      .then((res) => {
        // setIsLoader(false)
        if (res.status == "success") {
          const profileBased = res?.data?.map((cc) => {
            cc["suggestive"] = true;
            return cc;
          });
          let combineData = [...profileBased, ...res?.all_data];
          if (res?.data?.length > 0) {
            setIsSuggestive(true);
          } else {
            setIsSuggestive(false);
          }
          dispatch(getAllCourses(combineData));
          dispatch(orgCourses(res?.org_data));
          let newCourseData = [];
          combineData?.map((cou, i) => {
            if (i < 8) {
              if (cou.suggestive == true) {
                newCourseData.push(cou);
              }
            }
          });
          setNewCourses(newCourseData);
        } else {
          // alert("error Occured")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const categoriesCall = async () => {
    // setIsLoader(true)
    await getCategoryApi()
      .then((res) => {
        // setIsLoader(false)
        if (res.status == "success" && res.data) {
          const result = res.data.map((item) => {
            if (lan === "sw") {
              item.category_name = item.category_name_sw;
              item.category_overview = item.category_overview_sw;
            }
            return item;
          });
          setCategoryData(result);
          dispatch(getAllCategories(res.data));
        } else {
          // alert("error Occured")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const subCategoriesCall = () => {
    getSubCatForCourseList()
      .then((res) => {
        // setIsLoader(false)
        if (res?.status == "success") {
          dispatch(getAllCourseSubCategories(res.data));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const WhatsOnEddi = () => {
    dashboardCmsApi().then((result) => {
      if (result?.status == "success") {
        setWhatsOn(result?.data[0]);
      }
    });
  };

  const getUserData = async () => {
    setIsLoader(true);
    await getUserProfileApi()
      .then((result) => {
        setIsLoader(false);
        if (result?.status == "success") {
          dispatch(getPersonalProfileData(result?.data));
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(async () => {
    window.scrollTo(0, 0);
    await newsEventApiCall();
    await WhatsOnEddi();
    await coursesCall();
    await categoriesCall();
    await subCategoriesCall();
    await getUserData();
    dispatch(searchCourseText(""));
    dispatch(isEddiSuggestion(false));
  }, []);
  //Search Section
  const searchFilter = () => {
    var searchData = [];
    state?.AllCourses?.filter((course) =>
      course?.course_name?.toLowerCase().includes(searchText?.toLowerCase())
    ).map((crs) => {
      searchData.push(crs);
    });
    setsearchResult(searchData);
  };

  useEffect(() => {
    searchFilter();
  }, [searchText]);

  useEffect(() => {
    const handleWindowResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });
  // useEffect(() => {
  //   if (courseData?.length > 0) {
  //     courseData?.map((item) => {
  //       if (item?.suggestive === true) {
  //         setIsSuggestive(true);
  //       } else {
  //         setIsSuggestive(false);
  //       }
  //     });
  //   }
  // }, []);
  return (
    <div className="UserDashboard">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container">
            <div className="row">
              <h2 className="mb-4">
                {t("Welcome", lan)}{" "}
                {state?.personalData?.first_name?.charAt(0)?.toUpperCase()}
                {state?.personalData?.first_name?.slice(1)}
              </h2>
            </div>

            <div className="row">
              <div className="col-lg-6 col-12">
                <div className="whatson me-lg-3 me-0">
                  <h2>{t("WhatOn", lan)}</h2>
                  <p
                    className="unset-list"
                    dangerouslySetInnerHTML={{
                      __html: whatsOn?.content,
                    }}
                  ></p>
                </div>
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
                                    // dangerouslySetInnerHTML={{
                                    //   __html:
                                    //    showShorttext(desc) || "-",
                                    // }}
                                  >
                                    {showShorttext(desc, 40) || "-"}{" "}
                                  </p>
                                </div>
                                <div className="action-box d-flex">
                                  <div>{date}</div>
                                  <Link
                                    className="btn btn-green"
                                    to={`/user-dashboard/${
                                      EventListData?.is_event ? "event" : "news"
                                    }-details/${EventListData?.uuid}`}
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
                        to={"/user-dashboard/event-list"}
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

            <div className="row">
              <div className="col-lg-4 col-4 mt-md-2 mb-lg-5 mt-0">
                <div className="quickButton">
                  <Link className="" to="/my-space">
                    <span className="bx-icon">
                      <img src={SpaceIc} />
                    </span>
                    <span>{t("MySpace", lan)}</span>
                  </Link>
                </div>
              </div>

              <div className="col-lg-4 col-4 mt-md-2 mb-lg-5 mt-0">
                <div className="quickButton">
                  <Link className="" to="/my-favorite">
                    <span className="bx-icon">
                      <img src={HeartIc} />
                    </span>
                    <span>{t("Favorite", lan)}</span>
                  </Link>
                </div>
              </div>

              <div className="col-lg-4 col-4 mt-md-2 mb-lg-5 mt-0">
                <div className="quickButton">
                  <Link
                    className=""
                    to={{
                      pathname: "/view-all-courses",
                      state: {
                        cat: "",
                      },
                      //  `?cat=${selectedCategory}`,
                    }}
                    // to="/view-all-courses?cat="
                    onClick={() => {
                      dispatch(isEddiSuggestion(true));
                    }}
                  >
                    <span className="bx-icon">
                      <img src={Icgraduate} />
                    </span>
                    <span>{t("EddiSuggestion", lan)}</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="discover-section">
              <div className="row">
                <div className="col-lg-9 col-12">
                  <h2>
                    {t("DiscoverCourses", lan)}{" "}
                    <span>{t("PopularArea", lan)} </span>
                  </h2>
                  <h5>{t("SelectCourse", lan)}</h5>
                </div>
                <div className="search-block">
                  <InputText
                    type="text"
                    placeholder={t("searchby", lan)}
                    value={searchText}
                    list="CourseName"
                    onChange={(e) => {
                      setsearchText(e.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.keyCode === 13) {
                        history.push({
                          pathname: "/view-all-courses",
                          search: `?cat=`,
                        });
                        dispatch(searchCourseText(searchText));
                      }
                    }}
                  />
                  {searchResult && (
                    <datalist id="CourseName">
                      {searchResult?.map((course, index) => {
                        return (
                          index < 8 && (
                            <option key={index} value={course?.course_name} />
                          )
                        );
                      })}
                    </datalist>
                  )}
                  <span>
                    <img
                      src={IcSearch}
                      onClick={() => {
                        history.push({
                          pathname: "/view-all-courses",
                          search: `?cat=`,
                        });
                        dispatch(searchCourseText(searchText));
                      }}
                    />
                  </span>
                </div>
                <div className="col-lg-3 col-12 dis-img">
                  <img src={DisImg} className="w-100" />
                </div>
              </div>
            </div>
            <div className="mt-5 shwing-course">
              {isSuggestive === true ? (
                <NewestCourse
                  arrows={true}
                  name={t("NewCourseProfile", lan)}
                  data={newCourses?.slice(0, 6)}
                  link={t("VIEWALL", lan)}
                />
              ) : (
                <NewestCourseNotFound />
              )}
            </div>

            <div className="courses-section">
              <h2 className="text-start mb-4">{t("CourseCategories", lan)}</h2>
              <div className="row flex-nowrap flex-lg-wrap overflow-auto">
                {categoryData.length &&
                  categoryData?.map((courses, index) => {
                    return (
                      <div
                        className="col-lg-3 col-md-3 col-sm-6 col-10"
                        key={index}
                      >
                        <div
                          className="course-box"
                          style={{
                            backgroundImage: `url(${courses.category_image}), url(${ErrorImage})`,
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: `${
                                courses.color
                                  ? courses.color
                                  : "rgba(72, 26, 32)"
                              }`,
                            }}
                          ></span>
                          <div className="course-block">
                            <h1>
                              {lan == "en"
                                ? courses.category_name
                                : courses.category_name_sw}
                            </h1>
                            <Link
                              to={`/category-details/${courses?.uuid}`}
                              // to={`/view-all-courses?cat=${courses.category_name}`}
                              className="btn btn-white-border"
                            >
                              {t("readmore", lan)}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {screenWidth >= 768 && (
              <div className="">
                <CTAbanner data={allEventList} />
              </div>
            )}
          </div>
        </div>
        {screenWidth < 768 && (
          <div className="">
            <CTAbanner data={allEventList} />
          </div>
        )}

        <Footer isSmallFooter />
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default UserDashboard;
