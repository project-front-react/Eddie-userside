import React from "react";
import { Link } from "react-router-dom";
import "./NewsArticlebx.scss";
import CourseImage from "../../assets/images/CourseImage.jpg";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import { getTranslatedText as t } from "../../translater/index";
import { useDispatch, useSelector } from "react-redux";
import API from "../../api";
import { blogDetail } from "../../redux/actions";

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

function NewsArticlebx(props) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const NewestArticleData = [
    {
      Image: `${CourseImage}`,
      CourseName: "Leadership in Business",
      Coursetext: "Lorem ipsum dolor sit amet, ",
      CourseLabText: "Business and Fianace",
      courseLable: "rgba(72, 26, 32, 1)",
      courseTitleColor: "rgba(72, 26, 32, 1)",
    },
    {
      Image: `${CourseImage}`,
      CourseName: "Marketing in Business Life",
      Coursetext: "Lorem ipsum dolor sit amet, ",
      CourseLabText: "Technology and Market",
    },
    {
      Image: `${CourseImage}`,
      CourseName: "Marketing in Business Life",
      Coursetext: "Lorem ipsum dolor sit amet, ",
      CourseLabText: "Marketing and Business",
    },
  ];

  return (
    <div className="course-main blog-course-main">
      <div className="section-title">
        <h1>{props.name}</h1>
        <Link className="link-green" to="/">
          {props.link}
        </Link>
      </div>
      <div className="row px-0">
        {/* {NewestArticleData.map((NewestArticleData, index) => {
          return (
            <div className="col-md-4 col-sm-6 col-12">
              <div className="course-block">
                <div className="position-relative course-box">
                  <div className="position-relative">
                    <img
                      src={NewestArticleData.Image}
                      className="w-100 banner-box"
                    />
                  </div>
                  <div className="course-details">
                    <h4>{NewestArticleData.CourseName}</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Placerat nam sitmauris.
                    </p>
                    <div className="bottom-row">
                      <div className="blg-date">15 November 2021</div>
                      <Link className="link-green">{t("readmore", lan)}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })} */}

        {props?.data?.map((NewestArticleData, index) => {
          return (
            <div className="col-md-4 col-sm-6 col-12" key={index}>
              <div className="course-block">
                <div className="position-relative course-box">
                  <div className="position-relative">
                    <img
                      src={`${NewestArticleData?.blog_image}`}
                      className="w-100 banner-box"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = ErrorImage;
                      }}
                    />
                  </div>
                  <div className="course-details">
                    <h4>{NewestArticleData?.blog_title}</h4>
                    {NewestArticleData?.blog_description && (
                      <p
                        className="course-description unset-list"
                        dangerouslySetInnerHTML={{
                          __html:
                            NewestArticleData?.blog_description?.length > 104
                              ? `${NewestArticleData?.blog_description?.slice(
                                  0,
                                  104
                                )}...`
                              : NewestArticleData?.blog_description,
                        }}
                      ></p>
                    )}
                    <div className="bottom-row">
                      <div className="blg-date">
                        {new Date(
                          NewestArticleData?.created_date_time
                        ).getDate()}{" "}
                        {
                          monthNames[
                            new Date(
                              NewestArticleData?.created_date_time
                            ).getMonth()
                          ]
                        }{" "}
                        {new Date(
                          NewestArticleData?.created_date_time
                        ).getFullYear()}
                      </div>
                      <Link
                        to={`/blog-detail/${NewestArticleData?.uuid}`}
                        onClick={() => {
                          dispatch(blogDetail(NewestArticleData?.uuid));
                        }}
                        className="link-green"
                      >
                        {t("readmore", lan)}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NewsArticlebx;
