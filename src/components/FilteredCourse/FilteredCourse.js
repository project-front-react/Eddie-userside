import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FilteredCourse.scss";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import Slider from "react-slick";
import { getTranslatedText as t } from "../../translater/index";
import API from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedCourse,
  isEddiSuggestion,
  searchCourseText,
} from "../../redux/actions";

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

function FilteredCourse(props) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;

  const colors = [
    "#76918C",
    "#1A4840",
    "#A69396",
    "#876C6F",
    "#3E8080",
    "#481A20",
  ];
  const random = Math.floor(Math.random() * colors.length);
  var NewestArticle = {
    dots: props?.dots ? props?.dots : false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: props?.arrows ? props?.arrows : false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  const getAdditionInfo = (info) => {
    const additional = info?.slice(0, 150);

    return (
      <>
        <p
          className="unset-list"
          dangerouslySetInnerHTML={{
            __html: additional,
          }}
        ></p>
      </>
    );
  };

  return (
    <div className="course-main p-0">
      <div className="section-title">
        <h1>{props.name}</h1>
        <Link
          className="link-green"
          to={
            localStorage.getItem("logedInUser") == "true"
              ? {
                  pathname: "/view-all-courses",
                  state: {
                    cat: "",
                  },
                  //  `?cat=${selectedCategory}`,
                }
              : "/"
          }
          onClick={() => {
            dispatch(isEddiSuggestion(false));
            dispatch(searchCourseText(""));
          }}
        >
          {props.link}
        </Link>
        {props.ViewCourseResult && <span>{props.ViewCourseResult}</span>}
      </div>
      <div className="row">
        {/* <Slider {...NewestArticle}> */}
        {props?.data?.map((NewestArticleData, index) => {
          return (
            <div
              key={index}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 p-0"
            >
              <div className="course-block">
                <div className="col-12">
                  <div className="position-relative course-box mx-3">
                    <div className="position-relative">
                      {NewestArticleData?.suggestive === true && (
                        <label
                          className="crs-sug"
                          // style={{
                          //   backgroundColor: `${NewestArticleData.course_category?.color ? NewestArticleData.course_category?.color : "#000" }`,
                          // }}
                        >
                          {t("EddiSuggestion", lan)}
                        </label>
                      )}
                      {NewestArticleData?.organization_domain && (
                        <label
                          className="crs-sug"
                          style={{
                            backgroundColor: `${"#000"}`,
                          }}
                        >
                          {
                            NewestArticleData?.supplier_organization
                              ?.organizational_name
                          }
                        </label>
                      )}
                      <img
                        src={
                          NewestArticleData.course_image
                            ? `${NewestArticleData.course_image}`
                            : ErrorImage
                        }
                        className="w-100 banner-box"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = ErrorImage;
                        }}
                      />
                      <label
                        className="crs-lab"
                        style={{
                          backgroundColor: `${
                            NewestArticleData.course_category?.color
                              ? NewestArticleData.course_category?.color
                              : "#481a20"
                          }`,
                        }}
                      >
                        {NewestArticleData.course_category?.category_name
                          ? t(
                              NewestArticleData.course_category?.category_name,
                              lan
                            )
                          : NewestArticleData?.course_category[
                              `category_${lan}`
                            ] || ""}
                      </label>
                    </div>
                    <div className="course-details">
                      <h4
                        style={{
                          color: `${
                            NewestArticleData.course_category?.color ||
                            colors[random]
                          }`,
                        }}
                      >
                        {NewestArticleData.course_name}
                      </h4>
                      <h6>
                        {t("By", lan)}{" "}
                        {NewestArticleData.supplier?.first_name
                          ? `${NewestArticleData.supplier?.first_name || ""} ${
                              NewestArticleData.supplier?.last_name || ""
                            }`
                          : NewestArticleData.created_by}
                      </h6>

                      {/* <p dangerouslySetInnerHTML={{
                        __html:(NewestArticleData.additional_information.replaceAll('<br>','')).slice(0,150)
                      }}>
                
                      </p> */}
                      <div className="additional">
                        {getAdditionInfo(
                          NewestArticleData?.additional_information
                        )}
                      </div>
                      <Link
                        className="btn btn-green w-100"
                        to={
                          localStorage.getItem("logedInUser") == "true"
                            ? `/view-course-details?is_corporate=${props.isCorporate}`
                            : "/login"
                        }
                        onClick={() => {
                          localStorage.getItem("logedInUser") == "true" &&
                            dispatch(
                              getSelectedCourse(NewestArticleData?.uuid)
                            );
                        }}
                      >
                        {t("VIEW", lan)}
                      </Link>
                    </div>

                    <div className="course-box-hover">
                      <div>
                        <h1>{NewestArticleData.course_name}</h1>

                        <div className="overlay-information">
                          {t("By", lan)}:{" "}
                          {NewestArticleData.supplier?.first_name
                            ? `${
                                NewestArticleData.supplier?.first_name || ""
                              } ${NewestArticleData.supplier?.last_name || ""}`
                            : NewestArticleData.created_by}
                        </div>
                        <div
                          hidden={
                            NewestArticleData?.course_starting_date == null
                              ? true
                              : false
                          }
                          className="overlay-information"
                        >
                          {t("Startsfrom", lan)}:{" "}
                          {new Date(
                            NewestArticleData?.course_starting_date
                          ).getDate()}{" "}
                          {
                            monthNames[
                              new Date(
                                NewestArticleData?.course_starting_date
                              ).getMonth()
                            ]
                          }{" "}
                        </div>
                        <div className="overlay-information">
                          {t("CourseType", lan)}:{" "}
                          {NewestArticleData?.course_type?.type_name}
                        </div>
                      </div>
                      <div>
                        <Link
                          className="btn btn-green w-100"
                          to={
                            localStorage.getItem("logedInUser") == "true"
                              ? `/view-course-details?is_corporate=${props.isCorporate}`
                              : "/login"
                          }
                          onClick={() => {
                            localStorage.getItem("logedInUser") == "true" &&
                              dispatch(
                                getSelectedCourse(NewestArticleData?.uuid)
                              );
                          }}
                        >
                          {t("VIEW", lan)}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* </Slider> */}
      </div>
    </div>
  );
}

export default FilteredCourse;
