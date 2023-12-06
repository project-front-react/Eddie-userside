import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./EddiLabs.scss";
import blogImg from "../../assets/images/blogImg.jpg";
import IcReadmore from "../../assets/images/ic_readmore.svg";
import IcReadless from "../../assets/images/ic_readless.svg";
import ICDownload from "../../assets/images/ICDownload.svg";
import IcTime from "../../assets/images/IcTime.svg";
import IcPlay from "../../assets/images/IcPlay.svg";
import ICpdf from "../../assets/images/ICpdf.svg";

import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";

import Popup from "../../components/popup/popup";
import InstructorPanel from "../../components/InstructorPanel/InstructorPanel";
import { useSelector } from "react-redux";
import {
  getCourseDetailApi,
  getMaterialCourse,
} from "../../services/eddiServices";
import { useHistory } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import InputText from "../../components/inputText/inputText";
import VideoBlock from "../../components/video/VideoBlock";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import NoDataContent from "../../components/NoDataContent/NoDataContent";

const EddiLabs = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const history = useHistory();
  const params = useParams();
  const [courseData, setCourseData] = useState();
  const [relatedCourseData, setRelatedCourseData] = useState([]);
  const [zoomPopup, setzoomPopup] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [material, setMaterial] = useState("");
  const [videoData, setVideoData] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const [videoIndex, setVideoIndex] = useState(0);
  const [materialStatus, setMaterialStatus] = useState();
  const [videoHover, setVideoHover] = useState("");
  const courseDetailCall = () => {
    const id = params?.id;
    if (id != "SS102") {
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
    }
  };

  function download(url) {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const onDownloadClick = (doc) => {
    download(`${doc?.document_file}`);
  };

  const getMaterial = async () => {
    const id = params?.id;
    if (id != "SS102") {
      setIsLoader(true);
      getMaterialCourse(id)
        .then((result) => {
          setIsLoader(false);
          let newVideos = result?.data?.video_files;
          if (result?.status == "success" && result?.data?.uuid) {
            newVideos?.forEach((video) => {
              result?.material_status?.forEach((item) => {
                if (video?.uuid == item?.video_id) {
                  return (video["isCompleted"] = item?.is_complete);
                }
              });
            });
            setVideoData(newVideos);
            // console.log("result.data", result.data)
            // if (result.data.length > 0) {
            //   setMaterial(result.data)
            // }
            setMaterial(result.data);

            setMaterialStatus(result?.material_status);
            let filtered = result?.material_status?.filter(
              (item) => item?.video_id == result?.data?.video_files[0]?.uuid
            );
            setVideoUrl({
              uuid: result?.data?.video_files[0]?.uuid,
              url: result?.data?.video_files[0]?.video_file,
              video_name: result?.data?.video_files[0]?.video_name,
              id: result?.data?.video_files[0]?.id,
              duration: filtered ? filtered[0]?.duration : 0,
              isCompleted: filtered ? filtered[0]?.is_complete : "",
            });
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const onClickVideo = (video) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let filtered = materialStatus.filter(
      (item) => item?.video_id == video.uuid
    );

    setVideoUrl({
      uuid: video?.uuid,
      url: video?.video_file,
      video_name: video?.video_name,
      id: video?.id,
      duration: filtered[0]?.duration,
      isCompleted: filtered[0]?.is_complete,
    });
  };

  useEffect(() => {
    courseDetailCall();
    // getMaterial();
  }, []);
  useEffect(() => {
    getMaterial();
    console.log("called");
    setVideoIndex(videoIndex + 1);
  }, [state?.videoCompleted]);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const handleClosePopup = () => {
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setzoomPopup(false);
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="EddiLabsMain">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          {isLoader ? (
            <Loader />
          ) : material ? (
            <div className="container">
              <div className="row">
                <div className="row">
                  <div className="brdcumb-block">
                    <div>
                      <Link to={"/user-dashboard"} className="brd-link">
                        {t("Dashboard", lan)}{" "}
                      </Link>
                      |
                      <span className="brd-link text-green">
                        {t("EddiLabs", lan)}{" "}
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
              </div>

              <div className="row mt-4">
                <div className="col-lg-8 col-12">
                  <div className="course-details-main">
                    <div className="course-banner">
                      {/* <img
                      src={
                        courseData?.course_image
                          ? `${API.backendApi}${courseData?.course_image}`
                          : blogImg
                      }
                      className="w-100 banner-box-big2"
                    /> */}
                      <VideoBlock url={videoUrl} />
                    </div>
                    <div className="mt-2">
                      <h3>{videoUrl?.video_name || ""}</h3>
                    </div>
                    <div className="about-course">
                      <h1>{courseData?.course_name || "-"}</h1>

                      {courseData?.additional_information?.length < 150 ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: courseData?.additional_information,
                          }}
                          className="unset-list"
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

                      <h1 className="mt-lg-5 mb-lg-4">
                        {t("AboutInstructor", lan)}
                      </h1>

                      <div>
                        <InstructorPanel
                          InstructorImage={
                            courseData?.supplier_organization?.organization_logo
                              ? `${courseData?.supplier_organization?.organization_logo}`
                              : blogImg
                          }
                          to="#/instructor-profile"
                          InstructorName={
                            courseData?.author_name
                              ? ` ${courseData?.author_name}`
                              : `${courseData?.supplier?.first_name} ${courseData?.supplier?.last_name}`
                          }
                          InstructorFrom={
                            !courseData?.author_name
                              ? `From ${
                                  courseData?.supplier_organization
                                    ?.organizational_name || "-"
                                }`
                              : ""
                          }
                          InstructorBio={
                            courseData?.author_name
                              ? courseData?.author_bio
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-12 materials-block">
                  <h3>{t("CourseMaterial", lan)}</h3>
                  {/* <p>{t("JoinyourZoomClass", lan)}</p> */}
                  <div className="material-list">
                    <ul className="max_height shaddow">
                      {videoData
                        ? videoData?.map((video, index) => {
                            return (
                              <>
                                <li className="cursor-pointer" key={index}>
                                  <div
                                    onClick={(e) => {
                                      onClickVideo(video);
                                      setVideoIndex(index);
                                    }}
                                    className="material-block"
                                  >
                                    <span className="list-icons">
                                      <img src={IcPlay} />
                                      <video
                                        className="video_thumbnail"
                                        src={`${video?.video_file}#t=5`}
                                        // src="http://www.w3schools.com/html/mov_bbb.mp4#t=5"
                                      ></video>
                                    </span>
                                    <span className="title-block">
                                      <h4>{video?.video_name?.slice(0, 20)}</h4>
                                      <h6 className="time">
                                        <span className="pe-2">
                                          <img src={IcTime} width="14px" />
                                        </span>
                                        <span>{`Duration: ${
                                          video?.actual_duration || "-"
                                        }`}</span>
                                      </h6>
                                    </span>
                                    <div className="course-status  ">
                                      {video?.isCompleted
                                        ? "Completed"
                                        : "Ongoing"}
                                    </div>
                                  </div>
                                </li>
                              </>
                            );
                          })
                        : "No Data"}
                    </ul>
                    <ul className="max_height">
                      {material?.document_files
                        ? material?.document_files?.map((doc, index) => {
                            return (
                              <>
                                <li key={index} className="incomplete">
                                  <div className="material-block">
                                    <span className="list-icons">
                                      <img src={ICpdf} />
                                    </span>
                                    <span className="title-block">
                                      <h4>
                                        {doc?.file_name
                                          ?.split("/")
                                          .pop()
                                          .slice(0, 25)}
                                      </h4>
                                      {/* video?.video_file?.split("/").pop() */}
                                    </span>
                                    <div className="course-status completed"></div>
                                  </div>
                                  <div className="">
                                    <Link onClick={() => onDownloadClick(doc)}>
                                      <img src={ICDownload} />
                                    </Link>
                                  </div>
                                </li>
                              </>
                            );
                          })
                        : "No Data"}
                    </ul>

                    {/* {courseData?.course_type?.type_name == "Online" &&  <div>
                    <h1>{t("JoinZoomMeeting", lan)}</h1>
                    <Link
                      className="btn btn-green"
                      onClick={() => window.open(courseData?.meeting_link)}
                    >
                      {t("JOINNOW", lan)}
                    </Link>
                  </div>} */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NoDataContent />
          )}
        </div>

        <Footer isSmallFooter />
      </div>
      {zoomPopup && (
        <Popup
          show={zoomPopup}
          header="Zoom Meeting Details"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <div className="zoom-form">
              <InputText
                placeholder={t("EnterZoomID", lan)}
                labelName={t("ZoomId", lan)}
              />

              <InputText
                placeholder={t("EnterPasscode", lan)}
                labelName={t("Passcode", lan)}
              />
            </div>

            {/* custom design will be here  */}
          </div>
          <div>
            <button
              onClick={handleClosePopup}
              className="btn btn-green text-uppercase w-100 mt-2"
            >
              {t("JOINNOW", lan)}
            </button>
          </div>
        </Popup>
      )}
      {/* {isLoader ? <Loader /> : ""} */}
    </div>
  );
};

export default EddiLabs;
