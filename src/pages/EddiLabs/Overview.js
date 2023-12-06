import React, { Fragment, useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./EddiLabs.scss";
import placeholder from "../../assets/images/placeholder.svg";
import ComingSoon from "../../assets/images/comingsoon.svg";
import ComingSoonWithoutText from "../../assets/images/ComingSoonWithoutText.svg";
import IcTime from "../../assets/images/IcTime.svg";
import { getTranslatedText as t } from "../../translater/index";
import InstructorPanel from "../../components/InstructorPanel/InstructorPanel";
import { useSelector } from "react-redux";
import {
  getAllModuleApi,
  getCourseDetailApi,
  getCourseDetailById,
} from "../../services/eddiServices";
import Sidebar from "../../components/sidebar/Sidebar";
import VideoBlock from "../../components/video/VideoBlock";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import NoDataContent from "../../components/NoDataContent/NoDataContent";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import NoData from "../../components/NoData/NoData";
import { checkUrlExtension } from "../../services/constant";

const Overview = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const history = useHistory();
  const params = useParams();
  const [courseData, setCourseData] = useState();
  const [isReadMore, setIsReadMore] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [material, setMaterial] = useState([]);
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState();

  function getModuleAverages(data) {
    const moduleAverages = [];

    for (const key in data) {
      if (key.endsWith("_avg") && data.hasOwnProperty(key)) {
        const average = data[key].average;
        const obj = {
          name: data[key][`name_${lan}`],
          uuid: data[key].module_id,
          description: data[key][`description_${lan}`],
          module_status: data[key].module_status,
          average: average,
          redirect_name: data[key][`name_en`],
        };
        moduleAverages.push(obj);
      }
    }

    return moduleAverages;
  }

  const courseDetailCall = () => {
    const id = params?.id;
    if (id != "SS102") {
      setIsLoader(true);
      getCourseDetailById(id).then((res) => {
        setIsLoader(false);
        if (res.status === "success" && res.data.length > 0) {
          setCourseData(res.data[0]);
          // const videoname = res.data[0].course_preview_video?.split('/')
          // setVideoName(videoname[videoname.length-1])
          return setVideoUrl(res.data[0].course_preview_video);
        }
      });
    }
  };

  const getMaterial = async () => {
    const id = params?.id;
    if (id != "SS102") {
      setIsLoader(true);
      getAllModuleApi(id)
        .then((result) => {
          setIsLoader(false);
          if (result?.status == "success") {
            const moduleAverages = getModuleAverages(result.data);
            setMaterial(moduleAverages);
          }
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    courseDetailCall();
    getMaterial();
  }, []);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  if (isLoader) {
    return <Loader />;
  }

  return (
    <div className="EddiLabsMain">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container">
            <div className="row">
              <div className="brdcumb-block">
                <h3>{courseData?.course || ""}</h3>
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
              <div className=" col-12">
                <div className="course-details-main">
                  <div className="course-banner">
                    {checkUrlExtension(videoUrl) === "image" ? (
                      <img
                        className="banner-box-big2 img-fluid"
                        alt="bg-img-overview"
                        src={videoUrl}
                      />
                    ) : (
                      <VideoBlock
                        url={{ url: videoUrl }}
                        normalVideo={true}
                        courseType={courseData?.course_type}
                      />
                    )}
                  </div>
                  <div className="my-4 about-main-block">
                    {videoName && (
                      <h3 className="my-1 text-break">{videoName || ""}</h3>
                    )}
                    {/* <h6 className="time">
                        <span className="pe-2 f-12">
                          <img src={IcTime} width="14px" />
                        </span>
                        <span className="f-12">{`Duration: 2h 30min`}</span>
                      </h6> */}
                    <div className="unset-list">
                      <p
                        className="desc  my-2"
                        dangerouslySetInnerHTML={{
                          __html: isReadMore
                            ? courseData?.additional_information?.slice(0, 350)
                            : courseData?.additional_information || "<p></p>",
                        }}
                      ></p>
                    </div>
                    {courseData?.additional_information?.length > 350 ? (
                      <p
                        onClick={toggleReadMore}
                        className="cursor-pointer mt-3 read-more-less"
                      >
                        {isReadMore
                          ? `${t("readmore", lan)}`
                          : `${t("readless", lan)}`}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="course-content">
                    <h3>{t("CourseContentStatus", lan)}</h3>
                    <div
                      class="accordion mx-lg-5 mx-sm-2 mx-0"
                      id="accordionExample"
                    >
                      {material.length > 0 ? (
                        material.map((module, i) => {
                          return (
                            <Fragment key={i}>
                              <div class="accordion-item my-4">
                                <h2
                                  class="accordion-header"
                                  id={"headingOne-" + i}
                                >
                                  {/* add collaps class to manage  */}
                                  <div
                                    class="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapseOne-${i}`}
                                    aria-expanded="true"
                                    aria-controls={`collapseOne-${i}`}
                                  >
                                    <div className="accordition-start">
                                      <h4 className="me-5 main-text">
                                        {module?.name || ""}{" "}
                                      </h4>
                                      <div class="progress rounded my-1">
                                        <div
                                          class="progress-bar text-end"
                                          style={{
                                            width: module?.average
                                              ? module?.average + "%"
                                              : "0%",
                                            backgroundColor: "#3E8181",
                                          }}
                                          role="progressbar"
                                          aria-valuenow={
                                            module?.average || "0%"
                                          }
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        >
                                          {module?.average
                                            ? module?.average + "%"
                                            : ""}
                                        </div>
                                      </div>
                                    </div>
                                    <span
                                      className="align-self-start ms-2 f-14"
                                      style={{
                                        color:
                                          module?.module_status == "Ongoing"
                                            ? "#DBBA0D"
                                            : module?.module_status ==
                                              "Completed"
                                            ? "#3E8181"
                                            : "#5C59E7",
                                      }}
                                    >
                                      {module?.module_status === "Pending"
                                        ? t("NotStarted", lan)
                                        : t(module?.module_status || "", lan) ||
                                          ""}
                                    </span>
                                  </div>
                                </h2>
                                {/* if we add class show to below div it will uncolaps  */}
                                <div
                                  id={`collapseOne-${i}`}
                                  class="accordion-collapse collapse"
                                  aria-labelledby={"headingOne-" + i}
                                  data-bs-parent="#accordionExample"
                                >
                                  <div class="accordion-body row">
                                    <div className="col-lg-8 col-sm-7 col-xs-12">
                                      <p className="f-14 text-break">
                                        {module.description || "-"}{" "}
                                      </p>
                                    </div>
                                    <div className="col-lg-4 col-sm-5 col-xs-12 align-self-center text-end">
                                      <Link
                                        to={`/watch-course/${params?.id}/${module?.uuid}?module_name=${module?.redirect_name}`}
                                        className="start-button"
                                        onClick={()=>{localStorage.setItem("module_name",module.redirect_name)}}
                                      >
                                        {t("StartNow", lan)}
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          );
                        })
                      ) : (
                        <div className="center coming-div">
                          <img
                            className="w-100"
                            src={ComingSoonWithoutText}
                            alt="coming-soon"
                          />
                          <h2>{t("ComingSoon", lan)}</h2>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="about-course">
                    <h1 className="mt-lg-3 mb-lg-4">
                      {t("ContactInstructor", lan)}
                    </h1>
                    <div>
                      <InstructorPanel
                        InstructorImage={
                          courseData?.supplier_image
                            ? `${courseData?.supplier_image}`
                            : placeholder
                        }
                        to="#/instructor-profile"
                        InstructorName={
                          courseData?.author_name || courseData?.supplier
                        }
                        imageWithBorder={false}
                        InstructorFrom={`From ${
                          courseData?.supplier_organization_name || "-"
                        }`}
                        InstructorEmail={courseData?.instructor_email || null}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>
    </div>
  );
};

export default Overview;
