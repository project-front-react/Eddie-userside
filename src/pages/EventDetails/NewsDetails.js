import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./EventDetails.scss";
import blogImg from "../../assets/images/blogImg.jpg";
import IcReadmore from "../../assets/images/ic_readmore.svg";
import IcReadless from "../../assets/images/ic_readless.svg";
import ErrorImage from "../../assets/images/ErrorImage.svg";

import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";

import placeholder from "../../assets/images/placeholder.svg";
import InstructorPanel from "../../components/InstructorPanel/InstructorPanel";
import { useDispatch, useSelector } from "react-redux";
import {

  getEventById, getNewsById,
} from "../../services/eddiServices";
import { useHistory,useLocation } from "react-router-dom";

import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import { showShorttext } from "../../services/constant";

const NewsDetails = (props) => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const dispatch = useDispatch();
  const history = useHistory();
  const search = useLocation().search;
  const isCorporate = (new URLSearchParams(search)?.get("is_corporate"));
  const [newsData, setNewsData] = useState();
  const [isReadMore, setIsReadMore] = useState(true);
  const [isLoader, setIsLoader] = useState(false);


  const uuid = props?.match?.params?.id;

  const newsDetailCall = () => {
    setIsLoader(true);
      getNewsById(uuid)
      .then((result) => {
        setIsLoader(false);
        if (result?.status == "success") {
          
          setNewsData(result?.data);

        }
      })
      .catch((e) => console.log("something went wrong!"))
      .finally(()=>setIsLoader(false));
 
  };

  useEffect(() => {
    newsDetailCall();
  }, []);



  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  if(isLoader){
    return <Loader />
  }
  return (
    <div className="EventDetails">
      <Header />
      <div className="main-content ms-0 pt-lg-4 pt-3">
        <div className="container">
          <div className="row ">
            <div className="brdcumb-block justify-content-end">
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

         {newsData ? <div className="row mt-4">
            <div className="col-lg-6 col-12">
              <div className="course-details-main">
                <div className="course-banner">
                  <img
                    src={
                      newsData?.news_image
                        || blogImg
                    }
                    className="w-100 banner-box-big2"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = ErrorImage;
                    }}
                  />
                </div>

              </div>
            </div>

            <div className="col-lg-6 col-12">
              <div className="course-information d-none d-lg-flex">
                <div className="d-flex w-100 justify-content-between flex-column">
                <h1
                      className="text-break"
                        style={{
                          color:  "#007ea8",
                        }}
                      >
                        {/* {newsData?.course_name} */}
                        {newsData[`news_title_${lan}`]||''}
                      </h1>
                      <p className="unset-list"
                        dangerouslySetInnerHTML={{
                          __html: newsData[`news_short_description_${lan}`] || "-",
                        }}
                      ></p>
                </div>
              </div>
            </div>
            <div className="col-12">
            <div className="about-course">
                  <div className="course-information mt-3 d-flex d-lg-none">
                    <div className="d-flex w-100 justify-content-between flex-column">
                      <h1
                      className="text-break"
                        style={{
                          color:  "#007ea8",
                        }}
                      >
                        {/* {newsData?.course_name} */}
                        {newsData[`news_title_${lan}`]||''}
                      </h1>
                      <p className="unset-list"
                        dangerouslySetInnerHTML={{
                          __html: newsData[`news_short_description_${lan}`] || "-",
                        }}
                      ></p>
                    </div>
                  </div>

                      <div className="about-news">

                  <h1 className="main-head">{ newsData[`news_detailed_title_en`] || t("aboutThisNews", lan)}</h1>

                  <p dangerouslySetInnerHTML={{
                    __html:isReadMore
                    ?showShorttext( newsData[`news_detailed_description_${lan}`],350)
                    : newsData[`news_detailed_description_${lan}`]
                  }} className="text">

                  </p>
                  <div
                      hidden={
                        newsData[`news_detailed_description_${lan}`]?.length > 150
                          ? false
                          : true
                      }
                    >
                      <span
                        onClick={toggleReadMore}
                        className="read-or-hide d-table link-readmore mt-3 cursor-pointer"
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
                    </div>


                    <h1 className="mt-lg-5 mb-lg-4 main-head">
                    {t("PublishedBy", lan)}
                  </h1>

                  <div>
                    <InstructorPanel
                      InstructorImage={placeholder}
                      InstructorName={
                        newsData?.news_author?.first_name|| "-"
                      }
                    />
                  </div>

                      </div>

                
                </div>
            </div>
          </div>:<NoData />}
        </div>

        <Footer isSmallFooter />
      </div>

    </div>
  );
};

export default NewsDetails;
