import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Slider from "react-slick";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import userImag1 from "../../assets/images/userImag1.png";
import { firebaseAnalytics } from "../../../src/services/firebaseService";
import CTAbanner from "../../components/CTAbanner/CTAbanner";
import "./Home.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import {
  getHomePageApi,
  gets3Media,
  getTestimonial,
} from "../../services/cmsServices";
import API from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { blogDetail, getAllCategories } from "../../redux/actions";
import { getCategoryApi } from "../../services/eddiServices";
import Loader from "../../components/Loader/Loader";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Laptop from "../../assets/images/laptop2.png";

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

const Home = () => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const isLoggedin = localStorage.getItem("logedInUser");
  const [isLoader, setIsLoader] = useState(false);
  const [homeData, setHomeData] = useState();
  const [testimonial, setTestimonial] = useState();
  const [eventData, setEventData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const platform = localStorage.getItem("Platform");

  useEffect(() => {
    const video = videoRef.current;

    const handleEnded = () => {
      video.currentTime = 0; // Reset the video to the beginning
      video.play(); // Play the video again
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // console.log("isLoggedin", isLoggedin);
  const homeCall = () => {
    setIsLoader(true);
    getHomePageApi()
      .then((res) => {
        if (res.status === "success") {
          setHomeData(res.data);
          let countResult = [];
          res?.event_data?.map((data, i) => {
            if (data?.status?.value == "Active") {
              countResult.push(data);
            }
          });
          setEventData(countResult);
        }
      })
      .finally(() => setIsLoader(false));
  };

  const categoriesCall = () => {
    // setIsLoader(true);
    getCategoryApi()
      .then((res) => {
        if (res.status == "success" && res.data) {
          const result = res.data.map((item) => {
            if (lan === "sw") {
              item.category_name = item.category_name_sw;
              item.category_overview = item.category_overview_sw;
            }
            return item;
          });
          setCategoryData(result);
          dispatch(getAllCategories(res.data));
        } else {
          // alert("error Occured")
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // .finally(()=>setIsLoader(false));
  };
  const tesimonialCall = () => {
    // setIsLoader(true);
    getTestimonial()
      .then((res) => {
        if (res.status == "success") {
          setTestimonial(res?.data);
        } else {
          // alert("error Occured")
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // .finally(()=>setIsLoader(false));
  };

  useEffect(async () => {
    firebaseAnalytics.logEvent(`home_visited`);
    await homeCall();
    await categoriesCall();
    await tesimonialCall();
    window.scrollTo(0, 0);
  }, []);

  var settings = {
    // dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };
  var LogoPartner = {
    dots: false,
    infinite: homeData?.section_4_logo?.length > 6 ? true : false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    // autoplay: true,
    margin: 15,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
    ],
  };

  var Testimonials = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        Testimonials: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        Testimonials: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        Testimonials: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content={
            "Eddi matchar kurser, utbildningar och events mot användares profiler på en gemensam marknadsplats. På Eddi kan företag och utbildningsaktörer skapa sin egen utbildningsmiljö genom ett användarvänligt LMS. Eddi är din vän i utbildningsdjungeln. "
          }
        />
      </Helmet>
      <div className="homePage">
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 px-0 slider-block-main">
              <Slider {...settings}>
                {homeData?.section_1_image?.map((sliderContent, index) => {
                  return (
                    <div key={index}>
                      <div
                        className={
                          sliderContent?.banner
                            ? "slider-blcok"
                            : "slider-blcok bg-gray"
                        }
                        style={{
                          backgroundImage: sliderContent?.banner
                            ? `url(${sliderContent.banner}) , url(${ErrorImage})`
                            : "none",
                        }}
                      >
                        {/* <img src={sliderContent.image} /> */}
                        <div className="title">
                          <h1>{sliderContent.image_title}</h1>
                          <p
                            className="unset-list"
                            dangerouslySetInnerHTML={{
                              __html: sliderContent?.description
                                ? sliderContent?.description
                                : "",
                            }}
                          ></p>
                          {/* {isLoggedin == null && (
														<a
															href={sliderContent?.button_link}
															className="btn btn-green mt-3"
														>
															{sliderContent?.button_text}
														</a>
													)} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        </div>

        <div className="why_eddi">
          <div className="container">
            {
              <div className="VideoSection">
                <div className="LaptopWrap">
                  <div className="LaptopImageWrap">
                    <img src={Laptop} />
                  </div>
                  <div className="VideoMain">
                    <video
                      muted
                      autoPlay
                      playsInline
                      controlsList="nodownload noplaybackrate noprogressbar"
                      ref={videoRef}
                    >
                      <source
                        src={
                          homeData?.section_1_video ||
                          "https://eddi-dev-media.s3.amazonaws.com/media/home_page_video/Eddi_lopande_video-v4_1_tu6MeHC.mp4"
                        }
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            }
            <div className="row">
              <div className="col-md-12">
                <h2>{homeData?.section_2_heading}</h2>
                <p
                  className="mx-auto col-md-8 col-12 text-center unset-list"
                  dangerouslySetInnerHTML={{
                    __html: homeData?.section_2_description,
                  }}
                ></p>
                <div className="mt-4  text-center d-flex justify-content-center">
                  <div className="btn-section-top">
                    <a
                      href={homeData?.section_2_left_button_link}
                      // className="mx-2 btn btn-green border-green-btn "
                      className="mx-2 btn btn-green mb-2"
                    >
                      {/* {t("GETTOKNOWUS", lan)} */}
                      {homeData?.section_2_left_button_text}
                    </a>
                  </div>

                  {isLoggedin == null && (
                    <a
                      href={homeData?.section_2_right_button_link}
                      // className="mx-2 btn btn-green"
                      className="mx-2 btn btn-green border-green-btn mb-2"
                    >
                      {/* {t("GETSTARTED", lan)} */}
                      {homeData?.section_2_right_button_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="courses-section">
          <div className="container">
            <h2 className="text-center mb-4">{homeData?.section_3_heading}</h2>
            <div className="row flex-nowrap flex-lg-wrap overflow-auto">
              {/* {courses.map((courses, index) => {
              return (
                <div className="col-ldg-3 col-md-3 col-sm-6 col-12">
                  <div
                    className="course-box"
                    style={{
                      backgroundImage: `url(${courses.image})`,
                    }}
                  >
                    <span
                      style={{ backgroundColor: `${courses.tintBg}` }}
                    ></span>
                    <div className="course-block">
                      <h1>{courses.coursesTitle}</h1>
                      <Link className="btn btn-white-border">
                        {t("readmore", lan)}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })} */}

              {categoryData.length > 0 &&
                categoryData?.map((courses, index) => {
                  return (
                    <div
                      className="col-lg-3 col-md-3 col-sm-6 col-10"
                      key={index}
                    >
                      <div
                        className="course-box"
                        style={{
                          backgroundImage: `url(${courses.category_image}), url(${ErrorImage})`,
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: `${
                              courses.color ? courses.color : "rgba(72, 26, 32)"
                            }`,
                          }}
                        ></span>
                        <div className="course-block">
                          <h1>{t(courses.category_name, lan)}</h1>

                          <Link
                            to={`/category-details/${courses?.uuid}`}
                            className="btn btn-white-border"
                          >
                            {t(homeData?.section_3_button_text, lan)}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="our-partners">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-12 mx-auto">
                <h2 className="text-center">{homeData?.section_4_heading}</h2>

                {/* <Slider {...LogoPartner}>
                {partnerLogo.map((partnerLogo, index) => {
                  return (
                    <div>
                      <img src={partnerLogo.image} className="w-100 mx-2" />
                    </div>
                  );
                })}
              </Slider> */}

                <Slider {...LogoPartner}>
                  {homeData?.section_4_logo?.map((data, index) => {
                    return (
                      <div key={index}>
                        <div className="mx-2">
                          <img
                            src={
                              data?.partner_logo
                                ? `${data?.partner_logo}`
                                : ErrorImage
                            }
                            className="w-100"
                          />
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          </div>
        </div>

        <div className="news-article-section">
          <div className="container">
            <div className="section-title">
              <h2 className="text-start">{homeData?.section_5_heading}</h2>
              <Link to="/news-article" className="link-green">
                {t("AllNews", lan)}
              </Link>
            </div>

            <div className="row mt-4">
              <div className="col-lg-6 col-sm-12 col-12">
                <div
                  className="blog-img"
                  style={{
                    backgroundImage: homeData?.section_5_blog
                      ? `url(${homeData?.section_5_blog[0]?.blog_image})`
                      : `url(${ErrorImage})`,
                  }}
                >
                  {/* <img src={blogImg} className="img-fluid w-100" /> */}
                </div>
                <h4>
                  {homeData?.section_5_blog &&
                    homeData?.section_5_blog[0]?.blog_title}
                </h4>
                <p
                  className="unset-list"
                  dangerouslySetInnerHTML={{
                    __html:
                      homeData?.section_5_blog &&
                      homeData?.section_5_blog[0]?.blog_description?.length >
                        290
                        ? `${homeData?.section_5_blog[0]?.blog_description?.slice(
                            0,
                            290
                          )}...`
                        : homeData?.section_5_blog[0]?.blog_description,
                  }}
                ></p>
                <div className="bottom-row">
                  <div className="blg-date ">
                    {new Date(
                      homeData?.section_5_blog &&
                        homeData?.section_5_blog[0]?.created_date_time
                    ).getDate()}{" "}
                    {
                      monthNames[
                        new Date(
                          homeData?.section_5_blog &&
                            homeData?.section_5_blog[0]?.created_date_time
                        ).getMonth()
                      ]
                    }{" "}
                    {new Date(
                      homeData?.section_5_blog &&
                        homeData?.section_5_blog[0]?.created_date_time
                    ).getFullYear()}
                  </div>
                  <Link
                    to={`/blog-detail/${
                      homeData?.section_5_blog &&
                      homeData?.section_5_blog[0]?.uuid
                    }`}
                    onClick={() => {
                      dispatch(
                        blogDetail(
                          homeData?.section_5_blog &&
                            homeData?.section_5_blog[0]?.uuid
                        )
                      );
                    }}
                    className="link-green"
                  >
                    {t("readmore", lan)}
                  </Link>
                </div>
              </div>

              <div className="col-lg-5  offset-lg-1 col-md-12  offset-md-0 col-sm-12 col-12 blog-list">
                <ul>
                  {homeData?.section_5_blog && homeData?.section_5_blog[1] && (
                    <li>
                      <div
                        className="blogList-img"
                        style={{
                          backgroundImage: `url(${homeData?.section_5_blog[1]?.blog_image}), url(${ErrorImage})`,
                        }}
                      >
                        {/* <img src={blogImg2} className="img-fluid" /> */}
                      </div>
                      <div>
                        <p
                          className="blogList-discription unset-list"
                          dangerouslySetInnerHTML={{
                            __html:
                              homeData?.section_5_blog[1]?.blog_description,
                          }}
                        ></p>
                        <div className="bottom-row">
                          <div className="blg-date">
                            {new Date(
                              homeData?.section_5_blog[1]?.created_date_time
                            ).getDate()}{" "}
                            {
                              monthNames[
                                new Date(
                                  homeData?.section_5_blog[1]?.created_date_time
                                ).getMonth()
                              ]
                            }{" "}
                            {new Date(
                              homeData?.section_5_blog[1]?.created_date_time
                            ).getFullYear()}
                          </div>
                          <Link
                            className="link-green"
                            to={`/blog-detail/${homeData?.section_5_blog[1]?.uuid}`}
                            onClick={() => {
                              dispatch(
                                blogDetail(homeData?.section_5_blog[1]?.uuid)
                              );
                            }}
                          >
                            {t("readmore", lan)}
                          </Link>
                        </div>
                      </div>
                    </li>
                  )}
                  {homeData?.section_5_blog && homeData?.section_5_blog[2] && (
                    <li>
                      <div
                        className="blogList-img"
                        style={{
                          backgroundImage: `url(${homeData?.section_5_blog[2]?.blog_image}), url(${ErrorImage})`,
                        }}
                      >
                        {/* <img src={blogImg2} className="img-fluid" /> */}
                      </div>
                      <div>
                        <p
                          className="blogList-discription unset-list"
                          dangerouslySetInnerHTML={{
                            __html:
                              homeData?.section_5_blog[2]?.blog_description,
                          }}
                        ></p>
                        <div className="bottom-row">
                          <div className="blg-date">
                            {new Date(
                              homeData?.section_5_blog[2]?.created_date_time
                            ).getDate()}{" "}
                            {
                              monthNames[
                                new Date(
                                  homeData?.section_5_blog[2]?.created_date_time
                                ).getMonth()
                              ]
                            }{" "}
                            {new Date(
                              homeData?.section_5_blog[2]?.created_date_time
                            ).getFullYear()}
                          </div>
                          <Link
                            className="link-green"
                            to={`/blog-detail/${homeData?.section_5_blog[2]?.uuid}`}
                            onClick={() => {
                              dispatch(
                                blogDetail(homeData?.section_5_blog[2]?.uuid)
                              );
                            }}
                          >
                            {t("readmore", lan)}
                          </Link>
                        </div>
                      </div>
                    </li>
                  )}
                  {homeData?.section_5_blog && homeData?.section_5_blog[3] && (
                    <li>
                      <div
                        className="blogList-img"
                        style={{
                          backgroundImage: `url(${homeData?.section_5_blog[3]?.blog_image}), url(${ErrorImage})`,
                        }}
                      >
                        {/* <img src={blogImg2} className="img-fluid" /> */}
                      </div>
                      <div>
                        <p
                          className="blogList-discription unset-list"
                          dangerouslySetInnerHTML={{
                            __html:
                              homeData?.section_5_blog[3]?.blog_description,
                          }}
                        ></p>
                        <div className="bottom-row">
                          <div className="blg-date">
                            {new Date(
                              homeData?.section_5_blog[3]?.created_date_time
                            ).getDate()}{" "}
                            {
                              monthNames[
                                new Date(
                                  homeData?.section_5_blog[3]?.created_date_time
                                ).getMonth()
                              ]
                            }{" "}
                            {new Date(
                              homeData?.section_5_blog[3]?.created_date_time
                            ).getFullYear()}
                          </div>
                          <Link
                            className="link-green"
                            to={`/blog-detail/${homeData?.section_5_blog[3]?.uuid}`}
                            onClick={() => {
                              dispatch(
                                blogDetail(homeData?.section_5_blog[3]?.uuid)
                              );
                            }}
                          >
                            {t("readmore", lan)}
                          </Link>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12 col-12 mx-auto">
                <h2 className="text-center">{homeData?.section_6_heading}</h2>
                <h6 className="text-center">
                  {homeData?.section_6_description}
                </h6>

                <Slider {...Testimonials}>
                  {testimonial?.map((testimonials, index) => {
                    return (
                      <div key={index}>
                        <p
                          className="col-md-7 col-12 mx-auto unset-list"
                          dangerouslySetInnerHTML={{
                            __html: testimonials?.review,
                          }}
                        ></p>
                        <div className="feedbackuser-block">
                          <div className="feedbackuser">
                            <img
                              src={
                                testimonials?.profile_image
                                  ? `${testimonials?.profile_image}`
                                  : userImag1
                              }
                            />
                          </div>
                          <h6>
                            {testimonials?.user_name
                              ? testimonials?.user_name
                              : "-"}
                          </h6>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          </div>
        </div>
        <div>
          <CTAbanner data={eventData} />
        </div>

        <div className="become-suppliers">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 col-12 ">
                <h2>{homeData?.section_8_heading}</h2>
                <p
                  className="unset-list"
                  dangerouslySetInnerHTML={{
                    __html: homeData?.section_8_description,
                  }}
                ></p>
                <a
                  href={homeData?.section_8_button_link}
                  className="btn btn-green"
                >
                  {/* {t("REGISTERNOW", lan)} */}
                  {homeData?.section_8_button_text}
                  {/* <Link to="/contact-us" className="btn btn-green">
                {homeData?.section_8_button_text}
              </Link> */}
                </a>
              </div>
              <div className="col-md-5 offset-md-1 col-12">
                <div className="abt-image">
                  <img
                    src={
                      homeData?.section_8_image
                        ? `${homeData?.section_8_image}`
                        : ErrorImage
                    }
                    className="w-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoader ? <Loader /> : ""}
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Home;
