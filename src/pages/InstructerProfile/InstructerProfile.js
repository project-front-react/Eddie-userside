import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import IcCal from "../../assets/images/IcCalendar.svg";
import IcHeart from "../../assets/images/IcHeart.svg";

import CourseImage from "../../assets/images/CourseImage.jpg";

import "./InstructerProfile.scss";
import CourseImg from "../../assets/images/CourseListImg.png";
import blogImg from "../../assets/images/blogImg.jpg";
import IcReadmore from "../../assets/images/ic_readmore.svg";
import IcReadless from "../../assets/images/ic_readless.svg";
import Starrating from "../../assets/images/Starrating.svg";
import ICDownload from "../../assets/images/ICDownload.svg";
import IcHerat from "../../assets/images/IcHerat.svg";
import IcHeratFill from "../../assets/images/IcHeratFill.svg";

import IcLearner from "../../assets/images/IcLearner.svg";
import IcLevel from "../../assets/images/IcLevel.svg";
import IcAmt from "../../assets/images/IcAmt.svg";
import IcTime from "../../assets/images/IcTime.svg";
import IcPlay from "../../assets/images/IcPlay.svg";
import ICpdf from "../../assets/images/ICpdf.svg";

import IntImage from "../../assets/images/IntImage.png";
import IcStar from "../../assets/images/star.svg";
import IcStarYellow from "../../assets/images/star-yellow.svg";

import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
// import courseimg1 from "../../assets/images/course-list-img.png";
import courseimg2 from "../../assets/images/course2.jpg";
import Iclocation from "../../assets/images/ic_location2.svg";
import IcCall from "../../assets/images/IcCall.svg";
import IcMail from "../../assets/images/IcMail2.svg";
import IcLink from "../../assets/images/IcLink.svg";

import Popup from "../../components/popup/popup";
import InstructorPanel from "../../components/InstructorPanel/InstructorPanel";
import { useSelector } from "react-redux";
import {
  getCourseDetailApi,
  getMaterialCourse,
} from "../../services/eddiServices";
import API from "../../api";
import { useHistory } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import InputText from "../../components/inputText/inputText";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const InstructerProfile = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan=state?.language;
  const history = useHistory();
  const params = useParams();
  const [courseData, setCourseData] = useState();
  const [relatedCourseData, setRelatedCourseData] = useState([]);
  const [rateNowPopup, setrateNowPopup] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const [isReadMore2, setIsReadMore2] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [material, setMaterial] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const [rating, setRating] = useState(0);
  const courseDetailCall = () => {
    const id = state?.SelectedCourse ? state?.SelectedCourse : params?.id;
    setIsLoader(true);
    getCourseDetailApi(id).then((res) => {
      setIsLoader(false);
      if (res.status === "success") {
        setCourseData(res.data);

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
    });
  };

  function download(url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const getVideoDuration = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const media = new Audio(reader.result);
        media.onloadedmetadata = () => resolve(media.duration);
      };
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
    });

  const getMaterial = () => {
    setIsLoader(true);
    getMaterialCourse(state?.SelectedCourse)
      .then((result) => {
        setIsLoader(false);
        if (result?.status == "success") {
          setMaterial(result?.data);
          setVideoUrl({
            uuid: result?.data?.video_files[0]?.uuid,
            url: result?.data?.video_files[0]?.video_file,
          });
        }
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    courseDetailCall();
    getMaterial();
  }, []);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const toggleReadMore2 = () => {
    setIsReadMore2(!isReadMore2);
  };
  const handleClosePopup = () => {
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setrateNowPopup(false);
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };

  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sene ctus posuere elementum nulla tristique. Lorem a nullam ut pellentesque viverra mauris amet, placerat. Pretium morbi ac, eget nec, a, egestasligula malesuada diam";

  const ReviewList = [
    {
      UserImage: `${CourseImg}`,
      UserName: "John Doe",
      AvgRate: 4.5,
      ReviewDetaile:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sene ctus posuere elementum.",
    },
    {
      UserImage: `${CourseImg}`,
      UserName: "John Doe",
      AvgRate: 4.5,
      ReviewDetaile:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sene ctus posuere elementum.",
    },
    {
      UserImage: `${CourseImg}`,
      UserName: "John Doe",
      AvgRate: 4.5,
      ReviewDetaile:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sene ctus posuere elementum.",
    },
    {
      UserImage: `${CourseImg}`,
      UserName: "John Doe",
      AvgRate: 4.5,
      ReviewDetaile:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sene ctus posuere elementum.",
    },
    {
      UserImage: `${CourseImg}`,
      UserName: "John Doe",
      AvgRate: 4.5,
      ReviewDetaile:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sene ctus posuere elementum.",
    },
  ];

 

  return (
    <div className="InstructerProfile">
      <Header />
      <div className="">
        <div className="container">
          <div className="row">
            <div className="brdcumb-block">
              <div>
                {/* <Link className="brd-link"> Dashboard </Link>|
                <span className="brd-link text-green"> Eddi Labs</span> */}
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

          <div className="row mt-4">
            <div className="col-lg-12 col-12">
              <div className="course-details-main">
                <div className="course-banner">
                  <div className="inst-profile-img">
                    <img src={blogImg} />
                  </div>

                  <div className="inst-info">
                    <h1>
                      Raven Baxter{" "}
                      <span className="ratings-number">
                        <img
                          height={18}
                          src={Starrating}
                          style={{ marginTop: "-6px" }}
                          className="me-1"
                        />
                        4.5
                      </span>
                    </h1>
                    <p>From Sweden University</p>
                    <ul>
                      <li>
                        <span>
                          <img src={Iclocation} />
                        </span>
                        #425, Sunshine Circle, Mont Blanc Street, Sweden
                      </li>

                      <li>
                        <span>
                          <img src={IcCall} />
                        </span>
                        <a href="tel:+011 618596153">+011 618596153</a>
                      </li>

                      <li>
                        <span>
                          <img src={IcMail} />
                        </span>

                        <a href="mailto:university@gmail.com">
                          university@gmail.com
                        </a>
                      </li>

                      <li>
                        <span>
                          <img src={IcLink} />
                        </span>
                        <a
                          target="_blank"
                          href="https://organiztionwebsite.com"
                        >
                          https://organiztionwebsite.com
                        </a>
                      </li>
                    </ul>
                    <Link
                      className="btn btn-green"
                      onClick={() => setrateNowPopup(true)}
                    >
                      {t("RateNow", lan)}
                    </Link>
                  </div>
                </div>
                <div className="about-course px-0">
                  {/* <h1>{courseData?.course_name || "N/A"}</h1> */}
                  <h1>{t("AboutInstructor", lan)}</h1>

                  <p className="text">
                    {isReadMore
                      ? courseData?.additional_information
                          ?.slice(0, 300)
                          .concat("...")
                      : courseData?.additional_information}
                    <span
                      onClick={toggleReadMore}
                      className="read-or-hide d-table link-readmore mt-3"
                    >
                      <img
                        height={18}
                        style={{ marginTop: "-4px" }}
                        src={isReadMore ? IcReadmore : IcReadless}
                        className="me-2"
                      />
                      {isReadMore
                        ? `${t("readmore", lan)}`
                        : `${t("readless", lan)}`}
                      {/* {isReadMore ? "currently" : "not"} */}
                    </span>
                  </p>

                  {/* <h1>{courseData?.course_name || "N/A"}</h1> */}
                  <h1 className="mt-5">{t("AboutOrganization", lan)}</h1>
                  <p className="text">
                    {isReadMore2
                      ? courseData?.additional_information
                          ?.slice(0, 300)
                          .concat("...")
                      : courseData?.additional_information}
                    <span
                      onClick={toggleReadMore2}
                      className="read-or-hide d-table link-readmore mt-3"
                    >
                      <img
                        height={18}
                        style={{ marginTop: "-4px" }}
                        src={isReadMore2 ? IcReadmore : IcReadless}
                        className="me-2"
                      />
                      {isReadMore2
                        ? `${t("readmore", lan)}`
                        : `${t("readless", lan)}`}
                      {/* {isReadMore ? "currently" : "not"} */}
                    </span>
                  </p>

                  <div className="review-block">
                    <h1>{t("Reviews", lan)}</h1>
                    <ul className="list-unstyled">
                      {ReviewList.map((data) => (
                        <li>
                          <div className="reviewer-img">
                            <img src={data.UserImage} />
                          </div>
                          <div className="user-review-info">
                            <h1>
                              {data.UserName}
                              <span className="ratings-number">
                                <img
                                  height={18}
                                  src={Starrating}
                                  style={{ marginTop: "-6px" }}
                                  className="me-1"
                                />
                                {data.AvgRate}
                              </span>
                            </h1>
                            <p>{data.ReviewDetaile}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
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
          header="Provide Your Feedback"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <div className="inst-image">
              <img src={IntImage} />
            </div>
            <h3>Instructor Name</h3>
            <p>From Sweden University</p>
          </div>
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= rating ? "on" : "off"}
                  onClick={() => setRating(index)}
                >
                  <span className="star">
                    <img src={index <= rating ? IcStarYellow : IcStar} />
                  </span>
                </button>
              );
            })}
          </div>

          <textarea
            className="textAr"
            placeholder="Write your comment here"
          ></textarea>
          <div>
            <button
              onClick={handleClosePopup}
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

export default InstructerProfile;
