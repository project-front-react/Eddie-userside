import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import IcCal from "../../assets/images/IcCalendar.svg";
import "../MyCourse/MyCourse.scss";
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
  getEnrolledCourse,
  getRating,
  getRecuritmentAdsApi,
} from "../../services/eddiServices";
import api from "../../api";
import API from "../../api";

import { useDispatch, useSelector } from "react-redux";
import { getSelectedCourse } from "../../redux/actions";
import NoData from "../../components/NoData/NoData";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import Loader from "../../components/Loader/Loader";
import { askForPermissioToReceiveNotifications } from "../../services/firebaseService";

const RecruitmentListing = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const [filterdAds, setFilteredAds] = useState();

  useEffect(() => {
    recuritmentAdsApiCall();
  }, []);
  const recuritmentAdsApiCall = async () => {
    getRecuritmentAdsApi()
      .then((res) => {
        if (res?.status == "success") {
          let activeAds = [];
          res?.data?.map((dat) => {
            if (dat?.is_approved?.value == "Approved") {
              if (dat?.status?.value == "Active") {
                activeAds.push(dat);
              }
            }
          });
          setFilteredAds(activeAds);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
                {/* <div>
                                    <Link to={'/user-dashboard'} className="brd-link">{t("Dashboard", lan)}{" "}|  </Link>
                                    <span className="brd-link text-green"> {t("MyCourses", lan)} </span>
                                </div> */}
              </div>
            </div>
            <div className="row">
              <h2 className="mb-4 mt-3">{t("MyCourses", lan)}</h2>
            </div>
            <div className="position-relative">
              <div className="row position-relative">
                <div className="col-lg-8 col-12">
                  {filterdAds?.length > 0 ? (
                    filterdAds?.map((MyCourseList, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className={
                              MyCourseList?.is_approved?.value == "Approved"
                                ? "course-list-block"
                                : "course-list-block disable-block"
                            }
                          >
                            <div className="course-thumbnail">
                              <img
                                src={
                                  MyCourseList?.recruitmentAd_File
                                    ? `${MyCourseList?.recruitmentAd_File}`
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
                                  <h3 className="cursor-pointer">
                                    {MyCourseList?.recruitmentAd_title || "-"}
                                  </h3>
                                  <h6
                                    style={{
                                      color: `${"rgba(72, 26, 32, 1)"}`,
                                    }}
                                  >
                                    {MyCourseList?.recruitmentAd_description ||
                                      "-"}
                                  </h6>
                                </div>
                                <div className="d-flex  flex-column">
                                  <div className="d-flex ">
                                    <p className="errorText mb-1">
                                      {MyCourseList?.is_approved?.value ==
                                      "Pending"
                                        ? "Payment Confirmation Pending"
                                        : ""}
                                    </p>
                                  </div>
                                  <div>
                                    <img src={IcCal} className="me-1" />
                                    <span className="list-date">
                                      {"Recruitment Expiry Date "}
                                      {MyCourseList?.recruitmentAd_Expiry
                                        ? new Date(
                                            MyCourseList?.recruitmentAd_Expiry
                                          ).toDateString()
                                        : "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="btn-status-area">
                                {/* <div>
                                                                    <div
                                                                        className="course-status"
                                                                        style={{
                                                                            color: `${MyCourseList?.ongoing?.slice(0, 8).trim() === "Ongoing" ?
                                                                                "#003AD2" : '#009B19'
                                                                                }`,
                                                                        }}
                                                                    >
                                                                        {t(MyCourseList?.ongoing?.split(' ')[0], lan)}
                                                                        {console.log(MyCourseList?.ongoing)}
                                                                    </div>

                                                                </div> */}
                                <div>
                                  {/* <Link
                                                                        to={`${MyCourseList?.recruitmentAd_banner_video_link}
                                                                        `}
                                                                        className="btn btn-green mt-3"
                                                                    >
                                                                        {t("ViewCourse", lan)}
                                                                    </Link> */}
                                  <a
                                    className="btn btn-white-border"
                                    href={
                                      MyCourseList?.recruitmentAd_banner_video_link
                                    }
                                    target="_blank"
                                  >
                                    {t("ViewCourse", lan)}
                                  </a>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>

      {/* {isLoader ? <Loader /> : ""} */}
    </div>
  );
};

export default RecruitmentListing;
