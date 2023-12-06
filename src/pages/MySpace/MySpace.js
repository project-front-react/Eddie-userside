import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import placeholder from "../../assets/images/placeholder.svg";
import "./MySpace.scss";
import CourseImg from "../../assets/images/CourseListImg.png";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import Sidebar from "../../components/sidebar/Sidebar";
import Popup from "../../components/popup/popup";
import RelatedCourseLinks from "../../components/RelatedCourseLinks/RelatedCourseLinks";
import { useHistory } from "react-router-dom";
import FilterSelectMenu from "../../components/FilterSelectMenu/FilterSelectMenu";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed
// import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";

import {
  getAllEnrolledCourse,
  getEnrolledCourse,
  getEnrolledEvent,
  getGraphType,
  getSessions,
} from "../../services/eddiServices";
import api from "../../api";
import { getSelectedCourse } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../../components/NoData/NoData";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import DonutChart from "../../components//DonutChart/DonutChart";
import Loader from "../../components/Loader/Loader";
import { formatDate, showShorttext } from "../../services/constant";

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

const MySpace = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const dateRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const [allCourseData, setAllCourseData] = useState();
  const [graphType, setGraphType] = useState("Weekly");
  const [paginationStartIndex, setPaginationStartIndex] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [paginationStartIndexSelected, setPaginationStartIndexSelected] =
    useState(1);
  const [paginationSelected, setPaginationSelected] = useState([]);
  const [rateNowPopup, setrateNowPopup] = useState(false);
  const [filterChange, setFilterChange] = useState("Courses");
  const [enrolledCourses, setEnrolledCourses] = useState();
  const [sessionAllData, setSessionAllData] = useState([]);
  const [viewStatus, setViewStatus] = useState("All");
  const [enrolledEvents, setEnrolledEvents] = useState();
  const [selectedDateData, setSelectedDateData] = useState();
  const [relatedCourse, setRelatedCourse] = useState();
  const [graphDataCourse, setGraphDataCourse] = useState();
  const [relatedEvent, setRelatedEvent] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [calenderEvent, setCalenderEvent] = useState([]);

  useEffect(() => {
    getEnrolledCourseApi();
    getEnrolledEventApi();
  }, []);

  useEffect(() => {
    setPaginationStartIndex(1);
    return;
  }, [filterChange]);

  useEffect(() => {
    getGraphType()
      .then((result) => {
        if (result?.status == "success") {
          setGraphDataCourse(result);
        }
      })
      .catch((e) => console.log(e));
    return;
  }, [graphType]);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const getSessionApi = async () => {
      setIsLoader(true);
      try {
        const res = await getSessions();
        if (isMounted && res.status === "success") {
          const newRes = [...res?.data, ...res?.org_sessions];
          setSessionAllData(newRes);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setIsLoader(false);
        }
      }
    };

    getSessionApi();

    // Cleanup function
    return () => {
      isMounted = false; // Set the flag to false when component is unmounted
    };
  }, []);

  const getEnrolledCourseApi = () => {
    setIsLoader(true);
    getAllEnrolledCourse(viewStatus)
      .then((result) => {
        if (result?.status == "success") {
          setIsLoader(false);
          setEnrolledCourses(result.data);
          const corporateRelated =
            result.related_corporate_course.map((mm) => {
              mm["is_corporate"] = true;
              return mm;
            }) || [];
          const globalRelated = result.related_course || [];
          setRelatedCourse([...globalRelated, ...corporateRelated]);
        } else {
          setIsLoader(false);
        }
      })
      .catch((e) => console.log("ersv", e));
  };

  const getEnrolledEventApi = () => {
    getEnrolledEvent()
      .then((result) => {
        if (result?.status == "success") {
          setEnrolledEvents(result?.data);
          setRelatedEvent([
            ...result?.related_events,
            ...result?.related_corporate_events,
          ]);
        }
      })
      .catch((e) => console.log("errrr", e));
  };

  const handleClosePopup = () => {
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setrateNowPopup(false);
  };

  //for reccurence event dates
  function formatedDates(types, days) {
    if (types == "Week Days [ MON - FRI ]") {
      return ["mo", "tu", "we", "th", "fr"];
    } else if (types == "All Days") {
      return ["mo", "tu", "we", "th", "fr", "sa", "su"];
    } else if (types == "Weekend [ SAT - SUN ]") {
      return ["sa", "su"];
    } else if (types == "Custom") {
      var cusdays = days;
      cusdays = cusdays?.split(",");
      cusdays = cusdays?.map((d) => {
        return d?.toLowerCase()?.slice(0, 2);
      });
      return cusdays;
    } else {
      return;
    }
  }

  const getAllDayValue = () => {
    let data = [];

    if (filterChange == "Courses") {
      sessionAllData?.map((item, i) => {
        if (item) {
          const startDate = formatDate(item?.start_date);
          const endDate = formatDate(item?.end_date);
          let newdateObj = {
            id: item.id || i,
            borderColor: "white",
            backgroundColor: "green",
            // display: "background",
            title:
              item?.session_name?.length > 10
                ? item?.session_name?.slice(0, 10) + "..."
                : item?.session_name,
            data: item,
            rrule: {
              freq: "weekly",
              dtstart: startDate,
              byweekday:
                formatedDates(item?.choose_days, item?.customDays) || [],
              until: endDate,
            },
          };
          data.push(newdateObj);
        }
      });
    } else {
      enrolledEvents?.map((item) => {
        if (item?.start_date) {
          let dateObj = {
            title: "✔️",
            allDay: true,
            start: new Date(item?.start_date).toLocaleDateString("EN-CA"),
            borderColor: "white",
            backgroundColor: "pink",
            display: "background",
          };
          data.push(dateObj);
        }
      });
    }
    setCalenderEvent(data);
  };

  useMemo(() => {
    getAllDayValue();
  }, [sessionAllData, filterChange]);

  const selectedDate = (e) => {
    setPaginationStartIndexSelected(1);
    let data = [];
    if (filterChange == "Courses") {
      enrolledCourses?.map((item) => {
        if (
          item?.course_uuid ==
          e?.event?._def?.extendedProps?.data?.batch?.course?.uuid
        ) {
          item["meeting_link"] = e?.event?._def?.extendedProps?.data?.url;
          data.push(item);
        }
      });
    } else {
      enrolledEvents?.map((item) => {
        if (
          e?.date &&
          new Date(e?.date).toLocaleDateString() ==
            new Date(item?.start_date).toLocaleDateString()
        ) {
          data.push(item);
        }
      });
    }
    setSelectedDateData(data);
  };

  useEffect(() => {
    paginationFilterSelected();
    return;
  }, [paginationStartIndexSelected, selectedDateData]);

  const paginationPrev = () => {
    setPaginationStartIndexSelected(paginationStartIndexSelected - 1);
  };
  const paginationNext = () => {
    setPaginationStartIndexSelected(paginationStartIndexSelected + 1);
  };

  const paginationFilterSelected = () => {
    const paginationData = [];

    const actualIndex = paginationStartIndexSelected - 1;
    selectedDateData?.map((data, i) => {
      if (i >= actualIndex && i <= actualIndex) {
        paginationData.push(data);
      }
    });
    setPaginationSelected(paginationData);
  };

  const paginationFilter = () => {
    const paginationData = [];

    const actualIndex = paginationStartIndex - 1;
    if (filterChange == "Courses") {
      enrolledCourses?.map((data, i) => {
        if (i >= actualIndex && i <= actualIndex + 2) {
          paginationData.push(data);
        }
      });
    } else {
      enrolledEvents?.map((data, i) => {
        if (i >= actualIndex && i <= actualIndex + 2) {
          paginationData.push(data);
        }
      });
    }
    setPagination(paginationData);
  };

  useEffect(() => {
    paginationFilter();
    return;
  }, [paginationStartIndex, enrolledCourses, filterChange]);

  const paginationPrevUser = () => {
    setPaginationStartIndex(paginationStartIndex - 3);
  };
  const paginationNextUser = () => {
    setPaginationStartIndex(paginationStartIndex + 3);
  };

  return (
    <div className="MySpace">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container">
            <div className="brdcumb-block d-flex justify-content-between align-items-end mb-4">
              <div className="bredcum">
                <Link to={"/user-dashboard"} className="brd-link">
                  {" "}
                  {t("Dashboard", lan)} |{" "}
                </Link>

                <span className="brd-link text-green">
                  {t("MySpace", lan)}{" "}
                </span>
              </div>
              <FilterSelectMenu
                value={["Courses", "Events"]}
                placeholder=""
                isWithicon
                onChange={(e) => {
                  setFilterChange(e?.target?.value);
                  setSelectedDateData();
                }}
              />
            </div>

            <div className="row">
              <div className="col-lg-6 col-12">
                <div className="list-block-main minHigthFix">
                  <div className="section-title">
                    <h3>
                      {t("All", lan)} {t(`${filterChange}`, lan).toLowerCase()}
                    </h3>
                    {/* <div className="co-md-4">
                      <FilterSelectMenu
                        value={["All", "Ongoing", "Completed"]}
                        placeholder=""
                        isWithicon
                      />
                    </div> */}
                  </div>
                  {/* course  */}
                  <div hidden={filterChange == "Courses" ? false : true}>
                    {pagination?.length > 0 ? (
                      pagination?.map((MyCourseList, index) => {
                        return (
                          <div
                            className={
                              MyCourseList?.payment_approval == "Pending"
                                ? "course-list-block disable-block"
                                : "course-list-block "
                            }
                            key={index}
                          >
                            <div className="course-thumbnail">
                              <img
                                src={
                                  MyCourseList?.course_image
                                    ? `${MyCourseList?.course_image}`
                                    : placeholder
                                }
                                className="course-thumbnail-img"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = ErrorImage;
                                }}
                              />
                              {/* <span className="course-favourite">
                            <img src={IcHeart} />
                          </span> */}
                            </div>
                            <div className="list-content">
                              <div className="list-content-block">
                                <div>
                                  <h3
                                    className="cursor-pointer text-break"
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
                                    {showShorttext(
                                      MyCourseList?.course || "",
                                      50
                                    )}
                                  </h3>
                                  <h6
                                    style={{
                                      color: `rgba(00, 26, 32, 1)`,
                                    }}
                                  >
                                    {t(MyCourseList?.course_category, lan) ||
                                      "-"}

                                    <p
                                      className="unset-list"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          MyCourseList?.additional_information?.slice(
                                            0,
                                            50
                                          ),
                                      }}
                                    ></p>
                                  </h6>
                                </div>
                              </div>
                              <div className="btn-status-area justify-content-end">
                                {/* <div>
                                    <Link
                                      to={`/course-overview/${MyCourseList?.course_uuid}`}
                                      className="course-status link-green"
                                    >
                                      {t("ViewMaterial", lan)}
                                    </Link>
                                  </div> */}

                                <div>
                                  {/* {MyCourseList?.type_of_course
                                   !== "Online" && ( */}
                                  <Link
                                    to={`/view-course-details?is_corporate=${
                                      MyCourseList?.course_type == "Corporate"
                                    }`}
                                    onClick={() =>
                                      dispatch(
                                        getSelectedCourse(
                                          MyCourseList?.course_uuid
                                        )
                                      )
                                    }
                                    className="btn btn-green mt-3"
                                  >
                                    {t("VIEW", lan)}
                                  </Link>
                                  {/* )} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div>
                          <NoData />
                        </div>
                      </>
                    )}
                  </div>

                  {/* event  */}
                  <div hidden={filterChange !== "Courses" ? false : true}>
                    {pagination?.length > 0 ? (
                      pagination?.map((MyCourseList, index) => {
                        // console.log("console data", MyCourseList?.uuid);
                        return (
                          <div
                            className={
                              MyCourseList?.payment_approval == "Pending"
                                ? "course-list-block disable-block"
                                : "course-list-block "
                            }
                            key={index}
                          >
                            <div className="course-thumbnail">
                              <img
                                src={
                                  MyCourseList?.image
                                    ? `${MyCourseList?.image}`
                                    : placeholder
                                }
                                className="course-thumbnail-img"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = ErrorImage;
                                }}
                              />
                              {/* <span className="course-favourite">
                            <img src={IcHeart} />
                          </span> */}
                            </div>
                            {console.log("MyCourseList", MyCourseList)}
                            <div className="list-content">
                              <div className="list-content-block">
                                <div>
                                  <h3
                                    className="cursor-pointer text-break"
                                    onClick={() =>
                                      history.push(
                                        `/user-dashboard/event-details/${
                                          MyCourseList?.event_id
                                        }?is_corporate=${
                                          MyCourseList?.event_type_is ===
                                          "Corporate"
                                            ? "1"
                                            : "0"
                                        }`
                                      )
                                    }
                                  >
                                    {showShorttext(
                                      MyCourseList?.event_name || "",
                                      50
                                    )}
                                  </h3>
                                  <h6>
                                    {t(MyCourseList?.event_category, lan) ||
                                      "-"}

                                    <p>
                                      {MyCourseList?.event_description?.length >
                                      50
                                        ? MyCourseList?.event_description?.slice(
                                            0,
                                            50
                                          ) + "..."
                                        : MyCourseList?.event_description}
                                    </p>
                                  </h6>
                                </div>
                              </div>
                              <div className="btn-status-area justify-content-end">
                                {/* <div>
                              <div
                                className="course-status"
                                style={{
                                  color: `${course[0]?.courseStatusColorCode}`,
                                }}
                              >
                                {course[0]?.courseStatus}
                              </div>
                              <Link
                                onClick={() => setrateNowPopup(true)}
                                className="course-status link-green"
                              >
                                {MyCourseList?.status?.value}
                              </Link>
                            </div> */}
                                <div>
                                  {MyCourseList.event_type !== "Online" && (
                                    <Link
                                      to={`/user-dashboard/event-details/${
                                        MyCourseList?.event_id
                                      }?is_corporate=${
                                        MyCourseList?.event_type_is ===
                                        "Corporate"
                                          ? "1"
                                          : "0"
                                      }`}
                                      className="btn btn-green mt-3"
                                    >
                                      {t("VIEW", lan)}
                                    </Link>
                                  )}

                                  {/*====> we are doing google meet direct so we don't need right now  */}

                                  {/* {MyCourseList?.event_type === "Online" && (
                                    <a
                                      href={MyCourseList?.meeting_link}
                                      target="_blank"
                                      className="btn btn-green mt-3"
                                    >
                                      {t("JOINNOW", lan)}
                                    </a>
                                  )} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        <NoData />
                      </div>
                    )}
                  </div>
                  {/* //pagination start  */}
                  <div
                    hidden={
                      filterChange == "Courses"
                        ? enrolledCourses?.length > 3
                          ? false
                          : true
                        : enrolledEvents?.length > 3
                        ? false
                        : true
                    }
                    className="table-pagination text-end"
                  >
                    <CustomPagination
                      startIndex={paginationStartIndex}
                      endIndex={
                        filterChange == "Courses"
                          ? paginationStartIndex + 2 > enrolledCourses?.length
                            ? enrolledCourses?.length
                            : paginationStartIndex + 2
                          : paginationStartIndex + 2 > enrolledEvents?.length
                          ? enrolledEvents?.length
                          : paginationStartIndex + 2
                      }
                      totalData={
                        filterChange == "Courses"
                          ? enrolledCourses?.length
                          : enrolledEvents?.length
                      }
                      onPrev={paginationPrevUser}
                      onNext={paginationNextUser}
                    />
                  </div>
                </div>

                {filterChange == "Courses" && (
                  <div className="graph-block">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4>{t("MyProgress", lan)}</h4>
                      {/* <div>
                        <FilterSelectMenu
                          value={["Weekly", "Monthly", "Yearly"]}
                          placeholder=""
                          isWithicon
                          onChange={(e) => setGraphType(e?.target?.value)}
                        />
                      </div> */}
                    </div>
                    {(graphDataCourse?.is_ongoing_count ||
                      graphDataCourse?.is_completed_count) !== 0 ? (
                      <DonutChart state={graphDataCourse} />
                    ) : (
                      <NoData />
                    )}
                  </div>
                )}
              </div>
              <div className="col-lg-6 col-12">
                <div className="main-calender-block">
                  <div className="section-title">
                    <h3>{t("UpcomingSchedules", lan)}</h3>
                    <h2 className="mt-2"></h2>
                    <div className="calender-block">
                      <FullCalendar
                        height={300}
                        navLinks={false}
                        aspectRatio={1.0}
                        fixedWeekCount={false}
                        headerToolbar={{
                          left: "prev,next",
                          center: "title",
                          right: "timeGridDay,dayGridMonth,timeGridWeek",
                        }}
                        views={{
                          dayGridMonth: {
                            // name of view

                            titleFormat: {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          },
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={false}
                        selectMirror={true}
                        dayMaxEvents={true}
                        nowIndicator={true}
                        dateClick={selectedDate}
                        eventClick={(e) => selectedDate(e)}
                        // eventMouseEnter ={(e)=>console.log("emouceen",e)}
                        plugins={[
                          dayGridPlugin,
                          rrulePlugin,
                          interactionPlugin,
                        ]}
                        weekends={true}
                        events={calenderEvent}
                        // events={events}
                      />
                    </div>
                    <div>
                      <div className="list-block-main px-0">
                        {paginationSelected?.length > 0 ? (
                          paginationSelected
                            ?.slice(0, 2)
                            ?.map((MyCourseList, index) => {
                              return (
                                <div
                                  className={
                                    MyCourseList?.payment_approval == "Pending"
                                      ? "course-list-block disable-block"
                                      : "course-list-block "
                                  }
                                  key={index}
                                >
                                  <div className="course-thumbnail">
                                    <img
                                      src={
                                        filterChange == "Courses"
                                          ? MyCourseList?.course_image
                                            ? `${MyCourseList?.course_image}`
                                            : placeholder
                                          : MyCourseList?.image
                                          ? `${MyCourseList?.image}`
                                          : placeholder
                                      }
                                      className="course-thumbnail-img"
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = ErrorImage;
                                      }}
                                    />
                                    {/* <span className="course-favourite">
                                  <img src={IcHeart} />
                                </span> */}
                                  </div>
                                  <div className="list-content">
                                    <div className="list-content-block">
                                      <div>
                                        <div
                                          onClick={() =>
                                            filterChange == "Courses" &&
                                            history.push(
                                              `/view-course-details?is_corporate=${
                                                MyCourseList?.course_type ==
                                                "Corporate"
                                              }`
                                            )
                                          }
                                        >
                                          <h3
                                            style={{ cursor: "pointer" }}
                                            className="text-break"
                                            onClick={() =>
                                              filterChange == "Courses"
                                                ? dispatch(
                                                    getSelectedCourse(
                                                      MyCourseList?.course_uuid
                                                    )
                                                  )
                                                : ""
                                            }
                                          >
                                            {showShorttext(
                                              filterChange == "Courses"
                                                ? MyCourseList?.course || ""
                                                : MyCourseList?.event_name ||
                                                    "",
                                              50
                                            )}
                                          </h3>
                                        </div>
                                        <h6
                                        // style={{
                                        //   color: `#003AD2`,
                                        // }}
                                        >
                                          {filterChange == "Courses"
                                            ? t(
                                                MyCourseList?.course_category,
                                                lan
                                              ) || "-"
                                            : t(
                                                MyCourseList?.event_category,
                                                lan
                                              )}

                                          <>
                                            {filterChange == "Courses" && (
                                              <p
                                                className="unset-list"
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    MyCourseList?.additional_information?.slice(
                                                      0,
                                                      50
                                                    ),
                                                }}
                                              ></p>
                                            )}
                                          </>

                                          <>
                                            {filterChange !== "Courses" && (
                                              <p>
                                                {MyCourseList?.event_description?.slice(
                                                  0,
                                                  50
                                                )}
                                              </p>
                                            )}
                                          </>
                                          {/* )} */}
                                        </h6>
                                      </div>
                                    </div>
                                    <div className="btn-status-area">
                                      <div>
                                        <div
                                          className="course-status"
                                          style={{
                                            color: `#009B19`,
                                          }}
                                        >
                                          {MyCourseList?.status ||
                                            MyCourseList?.status?.value ||
                                            ""}
                                        </div>
                                        {/* <Link
                                      onClick={() => setrateNowPopup(true)}
                                      className="course-status link-green"
                                    >
                                      {MyCourseList?.status?.value}
                                    </Link> */}
                                        <p className="mb-0">
                                          {new Date(MyCourseList?.start_date)
                                            .toDateString()
                                            .slice(4, 30)}
                                        </p>
                                      </div>
                                      <div>
                                        {(filterChange == "Courses" &&
                                          MyCourseList?.type_of_course !==
                                            "Online") ||
                                        (MyCourseList?.event_type !==
                                          "Online" &&
                                          filterChange !== "Courses") ? (
                                          <Link
                                            onClick={() =>
                                              filterChange == "Courses"
                                                ? dispatch(
                                                    getSelectedCourse(
                                                      MyCourseList?.course_uuid
                                                    )
                                                  )
                                                : ""
                                            }
                                            to={
                                              filterChange == "Courses"
                                                ? `/view-course-details?is_corporate=${
                                                    MyCourseList?.course_type ==
                                                    "Corporate"
                                                  }`
                                                : `/user-dashboard/event-details/${
                                                    MyCourseList?.event_id
                                                  }?is_corporate=${
                                                    MyCourseList?.event_type_is ===
                                                    "Corporate"
                                                      ? "1"
                                                      : "0"
                                                  }`
                                            }
                                            className="btn btn-green mt-3"
                                          >
                                            {t("VIEW", lan)}
                                          </Link>
                                        ) : (
                                          ""
                                        )}
                                        {(filterChange == "Courses" &&
                                          MyCourseList?.meeting_link) ||
                                        MyCourseList?.event_type == "Online" ? (
                                          <a
                                            onClick={() =>
                                              window.open(
                                                MyCourseList?.meeting_link
                                              )
                                            }
                                            className="btn btn-green mt-3"
                                          >
                                            {t("JOINNOW", lan)}
                                          </a>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <div className="image-small">
                            <span>{t("NoData", lan)}</span>
                          </div>
                        )}
                        {/* //pagination start  */}

                        {/* <div
                          className="text-end"
                          style={{
                            display: selectedDateData?.length >  0 ? "block" : "none",
                          }}
                        >
                          <Link className="link-green">
                            {t("ViewAll", lan)}
                          </Link>
                        </div> */}
                      </div>
                      {selectedDateData?.length > 1 && (
                        <div className="table-pagination text-end">
                          <CustomPagination
                            startIndex={paginationStartIndexSelected}
                            endIndex={
                              paginationStartIndexSelected >
                              selectedDateData?.length
                                ? selectedDateData?.length
                                : paginationStartIndexSelected
                            }
                            totalData={selectedDateData?.length}
                            onPrev={paginationPrev}
                            onNext={paginationNext}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="related-course-block">
                  <RelatedCourseLinks
                    data={
                      filterChange == "Courses"
                        ? relatedCourse?.slice(0, 8)
                        : relatedEvent?.slice(0, 10)
                    }
                    type={filterChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>
      {rateNowPopup && (
        <Popup
          show={rateNowPopup}
          header="Status"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <p>{rateNowPopup}</p>

            {/* custom design will be here  */}
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
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default MySpace;
