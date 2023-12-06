import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import NewsArticlebanner from "../../assets/images/NewsArticlebanner.jpg";

import blogImg2 from "../../assets/images/blogImg2.jpg";
import blogImg3 from "../../assets/images/blogImg3.jpg";
import ErrorImage from "../../assets/images/ErrorImage.svg";

import "./NewsArticleList.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";

import NewsArticlebx from "../../components/newsArticlebx/NewsArticlebx";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogApi } from "../../services/cmsServices";
import API from "../../api";
import { useHistory } from "react-router-dom";
import { blogDetail } from "../../redux/actions";
import News1 from "../../assets/images/News1.jpg";
import News2 from "../../assets/images/News2.jpg";

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

const NewsArticleList = () => {
  const [blogData, setBlogData] = useState();
  const [blogDataForNewsArticle, setBlogDataForNewsArticle] = useState();
  const [viewAll, setViewAll] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;

  const blogDetailCall = () => {
    getAllBlogApi(state?.BlogDetail).then((res) => {
      if (res.status === "success") {
        setBlogData(res.data);
        console.log(res.data);
      }
    });
  };

  useEffect(() => {
    let data = [];

    blogData?.map((dat, i) => {
      if (i != 0) {
        data.push(dat);
      }
    });
    let totalShow = viewAll ? data : data?.slice(0, 3);
    setBlogDataForNewsArticle(totalShow);
  }, [blogData, viewAll]);

  useEffect(() => {
    blogDetailCall();
  }, [state]);

  useEffect(() => {
    if (viewAll === true) {
      window.scrollTo({
        top: 700,
        behavior: "smooth",
      });
    }
  }, [viewAll]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="NewsArticleList">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-12 px-0 banner-img"
            style={{
              backgroundImage: `url(${News1})`,
            }}
          >
            <div className="container">
              <div className="row ">
                <div className="pagename px-0">
                  <h1>{t("NewsAndArticles", lan)}</h1>
                  {/* <Link onClick={() => {
                    history.goBack();
                  }}>Back to Home</Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="howitwork">
        <div className="container">
          <div className="col-lg-8 col-12 mx-auto">
            <div className="d-flex flex-wrap align-items-center bg-white block-content px-0">
              <div className="col-md-5 block-content-inner">
                <h2>{blogData && blogData[0]?.blog_title}</h2>
                {console.log("blogData", blogData)}
                {blogData && (
                  <p
                    className="unset-list"
                    dangerouslySetInnerHTML={{
                      __html:
                        blogData && blogData[0]?.blog_description?.length > 185
                          ? `${blogData[0]?.blog_description?.slice(0, 185)}...`
                          : blogData[0]?.blog_description,
                    }}
                  ></p>
                )}
                <div className="bottom-row">
                  <div className="blg-date">
                    {new Date(
                      blogData && blogData[0]?.created_date_time
                    ).getDate()}{" "}
                    {
                      monthNames[
                        new Date(
                          blogData && blogData[0]?.created_date_time
                        ).getMonth()
                      ]
                    }{" "}
                    {new Date(
                      blogData && blogData[0]?.created_date_time
                    ).getFullYear()}
                  </div>
                  <Link
                    to={`/blog-detail/${blogData && blogData[0]?.uuid}`}
                    onClick={() => {
                      dispatch(blogDetail(blogData[0]?.uuid));
                    }}
                    className="link-green"
                  >
                    {t("readmore", lan)}
                  </Link>
                </div>
              </div>
              <div className="col-md-6 col-12 offset-md-1 px-md-0">
                <img
                  src={
                    blogData &&
                    blogData[0]?.blog_image &&
                    `${blogData[0]?.blog_image}`
                  }
                  className="w-100 banner-box-big"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = ErrorImage;
                  }}
                />
              </div>
            </div>
            <NewsArticlebx
              data={blogDataForNewsArticle && blogDataForNewsArticle}
            />
            {/* <div className="d-flex flex-wrap align-items-center bg-white block-content px-0 mt-4">
              <div className="col-md-4 block-content-inner">
                <h2>What is Lorem Ipsum?</h2>
                <p>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution...
                </p>
                <div className="bottom-row">
                  <div className="blg-date">15 November 2021</div>
               
                </div>
              </div>
              <div className="col-md-7 col-12 offset-md-1 px-md-0">
                <img src={blogImg3} className="w-100 banner-box-big2" />
              </div>
            </div> */}

            <div className="mt-3">
              {blogData?.length >= 5 && (
                <button
                  className="btn btn-green border-0"
                  onClick={() => setViewAll(!viewAll)}
                >
                  {viewAll ? t("ViewLess", lan) : t("ViewMore", lan)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsArticleList;
