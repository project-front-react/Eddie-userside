import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./EddiLabs.scss";
import blogImg from "../../assets/images/blogImg.jpg";
import IcTime from "../../assets/images/IcTime.svg";
import ICpdf from "../../assets/images/ICpdf.svg";
import IcPlay from "../../assets/images/IcPlay.svg";
import { getTranslatedText as t } from "../../translater/index";
import { useSelector } from "react-redux";
import {
  getAllModuleApi,
  updateCorporateVideoDuration,
} from "../../services/eddiServices";
import Sidebar from "../../components/sidebar/Sidebar";
import VideoBlock from "../../components/video/VideoBlock";
import { useParams, useLocation, useHistory, Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import NoDataContent from "../../components/NoDataContent/NoDataContent";
import NoData from "../../components/NoData/NoData";

const WatchCourse = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const history = useHistory();
  // const search = useLocation().search;
  // const moduleName = new URLSearchParams(search).get("module_name");
  const params = useParams();
  const [isReadMore, setIsReadMore] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [material, setMaterial] = useState("");
  const [videoUrl, setVideoUrl] = useState({
    uuid: "",
    url: "",
    file_name: "",
    id: "",
    duration: "",
    description: "",
    file_type: "",
    module_name: "",
    watched_time: 0.0,
  });
  const Module_Name = localStorage.getItem("module_name")

  function download(url) {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const onDownloadClick = async (data) => {
    download(data?.url);
    try {
      let formData = new FormData();
      formData.append("progress_status ", 100);
      formData.append("course_type ", data?.course_type);
      await updateCorporateVideoDuration(data?.uuid, formData);
    } catch (err) {}
  };

  const onClickVideo = (data) => {
    // );
    setVideoUrl({
      uuid: data?.uuid,
      url: data?.url,
      file_name: data[`title_${lan}`],
      duration: data?.total_duration || "",
      description: data[`description_${lan}`],
      file_type: data?.file_type,
      watched_time: data?.watched_time || "0.00",
      module_name: Module_Name || "-",
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getMaterial = async () => {
    const id = params?.course_id;
    if (id != "SS102") {
      setIsLoader(true);
      getAllModuleApi(id)
        .then((result) => {
          setIsLoader(false);
          const data = result.data[Module_Name];
          if (!data) return;
          setMaterial(data);

          const firstVideo = data.find((ff) => ff?.file_type == "Video");
          setVideoUrl({
            uuid: firstVideo?.uuid,
            url: firstVideo?.url,
            file_name: firstVideo[`title_${lan}`] || "",
            duration: firstVideo?.total_duration || "0",
            watched_time: firstVideo?.watched_time || "0",
            description: firstVideo[`description_${lan}`],
            file_type: firstVideo?.file_type,
            module_name: Module_Name || "-",
          });
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    // courseDetailCall();
    getMaterial();
  }, []);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
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
          ) : material.length > 0 ? (
            <div className="container">
              <div className="row">
                <div className="brdcumb-block">
                  <h3>{material[0]?.course || ""}</h3>
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
                      {videoUrl.file_type ? (
                        <VideoBlock
                          url={videoUrl}
                          getMaterial={getMaterial}
                          setMaterial={setMaterial}
                          material={material}
                        />
                      ) : (
                        <NoData />
                      )}
                    </div>
                    <div className="my-4 about-main-block">
                      <h3 className="my-1">{videoUrl?.file_name || ""}</h3>

                      <p className="desc my-2">
                        {isReadMore
                          ? videoUrl?.description?.slice(0, 350)
                          : videoUrl?.description || "-"}{" "}
                      </p>
                      {videoUrl?.description?.length > 350 ? (
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
                      <h3>{videoUrl?.module_name || ""} </h3>
                      <div className="mx-lg-5 mx-sm-2 mx-0">
                        {material?.length &&
                          material?.map((mm, i) => {
                            return (
                              <div
                                key={i}
                                class="accordion my-2"
                                id={"accordionExample-" + i}
                              >
                                <div class="accordion-item my-4">
                                  <h2
                                    class="accordion-header"
                                    id={`headingOne-${i}`}
                                  >
                                    {/* add collaps class to manage  */}
                                    <div
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={"#collapseOne-" + i}
                                      aria-expanded="true"
                                      aria-controls={"collapseOne-" + i}
                                    >
                                      <div className="ContentTitleWrap">
                                        <div className="img-div">
                                          <img
                                            src={
                                              mm?.file_type == "Video"
                                                ? IcPlay
                                                : ICpdf
                                            }
                                          />
                                        </div>
                                        <div className="accordition-start mx-4 Title">
                                          <h4 className="main-text mb-0">
                                            {mm[`title_${lan}`] || "-"}{" "}
                                          </h4>
                                          {mm?.file_type == "Video" && (
                                            <h6 className="time">
                                              <span className="pe-2 f-12">
                                                {
                                                  <img
                                                    src={IcTime}
                                                    width="14px"
                                                  />
                                                }
                                              </span>
                                              <span className="f-12 text-body">{`${t(
                                                "Duration",
                                                lan
                                              )}: ${mm?.total_duration}`}</span>
                                            </h6>
                                          )}
                                        </div>
                                      </div>
                                      {
                                        <span
                                          className="align-self-center mx-lg-4 mx-sm-2 f-14"
                                          style={{
                                            color:
                                              mm?.progress_status == "Ongoing"
                                                ? "#DBBA0D"
                                                : mm?.progress_status ==
                                                  "Completed"
                                                ? "#3E8181"
                                                : "#5C59E7",
                                          }}
                                        >
                                          {mm?.progress_status === "Pending"
                                            ? t("NotStarted", lan)
                                            : t(
                                                mm?.progress_status || "",
                                                lan
                                              ) || ""}
                                        </span>
                                      }
                                    </div>
                                  </h2>
                                  <div
                                    id={"collapseOne-" + i}
                                    class="accordion-collapse collapse"
                                    aria-labelledby={`headingOne-${i}`}
                                    data-bs-parent={"#accordionExample-" + i}
                                  >
                                    <div class="accordion-body row">
                                      <div className="col-lg-8 col-sm-7 col-xs-12">
                                        <p className="f-14 text-break">
                                          {mm[`description_${lan}`]}
                                        </p>
                                      </div>
                                      <div className="col-lg-4 col-sm-5 col-xs-12 align-self-center text-end">
                                        {mm?.file_type == "Video" ? (
                                          <button
                                            onClick={() => onClickVideo(mm)}
                                            className="start-button"
                                          >
                                            {t("Playvideo", lan)}
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => onDownloadClick(mm)}
                                            className="start-button"
                                          >
                                            {t("ViewContent", lan)}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NoData />
          )}
        </div>

        <Footer isSmallFooter />
      </div>
    </div>
  );
};

export default WatchCourse;
