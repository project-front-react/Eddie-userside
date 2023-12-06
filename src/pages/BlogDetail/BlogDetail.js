import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./BlogDetail.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";

import NewsArticlebx from "../../components/newsArticlebx/NewsArticlebx";
import { getBlogDetailApi } from "../../services/cmsServices";
import { useSelector } from "react-redux";
import API from "../../api";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
const BlogDetail = () => {
  const history = useHistory();
  const state = useSelector((state) => state?.Eddi);
  let lan=state?.language;
  const [blogData, setBlogData] = useState();
  const [relatedBlogsData, setRelatedBlogsData] = useState();
  const params = useParams()
  const blogDetailCall = () => {
    console.log("state?.BlogDetail",params);
    getBlogDetailApi(params?.id ? params?.id : state?.BlogDetail).then((res) => {
      if (res.status === "success") {
        setBlogData(res.data);
        setRelatedBlogsData(res.related_blog);
        console.log(res.data);
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    blogDetailCall();
  }, [state]);

  // useEffect(() => {
  //   const btn = document.getElementById("bodyscrolltotop");

  //   btn.addEventListener("click", () =>
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     })
  //   );
  // }, []);
  return (
    <HelmetProvider>
      {/* <Helmet>
          <meta charSet="utf-8" />
          <title>{blogData?.meta_title}</title>
          <meta name={blogData?.meta_keyword} content={blogData?.meta_description} />
        </Helmet> */}
    <div className="BlogDetail">
      <Header />
      <div className="container">
        <div className="row">
          <div
            className="col-md-12 px-0 banner-img"
            style={{
              backgroundImage: `url(${blogData?.blog_image})`,
            }}
          ></div>
        </div>
      </div>

      <div className="howitwork">
        <div className="container">
          <div className="row">
            <div className="col-12 px-lg-0 section-title">
              <div className="w-100">
                <h1 className="blog-title">{blogData?.blog_title}</h1>
                <div className="blog-author">
                  {blogData?.written_by && <span>{blogData?.written_by}</span>}
                  <span>
                    {weekday[new Date(blogData?.created_date_time).getDay()]}{" "}
                    {
                      monthNames[
                        new Date(blogData?.created_date_time).getMonth()
                      ]
                    }{" "}
                    {new Date(blogData?.created_date_time).getDate()}
                  </span>
                </div>
              </div>
              <Link onClick={() => {
                    history.goBack();
                  }}>{t("Back", lan)}</Link>
            </div>
            <div className="col-md-8 col-sm-12 col-12 px-lg-0 pt-5">
              <p className="unset-list"
                dangerouslySetInnerHTML={{
                  __html: blogData?.blog_description,
                }}
              >
              </p>
            </div>
            <div className="col-md-8 col-sm-12 col-12 px-lg-0 pt-4">
              <NewsArticlebx
                name={relatedBlogsData?.length > 0 && "Related Blogs"}
                data={relatedBlogsData}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </HelmetProvider>
  );
};

export default BlogDetail;
