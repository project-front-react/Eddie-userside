import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CTAbanner.scss";
import Slider from "react-slick";
import { getTranslatedText as t } from "../../translater/index";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import Api from "../../api";
import { addAdvertisementClick } from "../../services/eddiServices";
import { useSelector } from "react-redux";


function CTAbanner(props) {
  var settings = {
    dots:props?.dots || false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
  };

  const state = useSelector(state=>state?.Eddi)
  let lan=state?.language;
  // useEffect(() => {
  //   getAllEvent().then((result) => {
  //     if (result?.status == "success") {
  //       let countResult = [];
  //       result?.data.map((data, i) => {
  //         if (data?.event_publish_on !== "User Dashboard") {
  //           countResult.push(data);
  //         }
  //       });
  //       setAllEventList(countResult);
  //     }
  //   });
  // }, []);

  const onAdvertisementClick = (e, data) => {
    if(props.isCorporate) {
            return window.open(data?.checkout_link);
          } ;
    addAdvertisementClick(data?.uuid)
      .then((result) => {
        if (result?.status == "success") {
          console.log("checkout",data?.checkout_link)
          window.location.href = data?.checkout_link;
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Slider {...settings}>
      {props?.data?.map((data, index) => {
        return (
          <div key={index}>
            <div
              className="cta-section"
              style={{
                backgroundImage:
                  data?.event_image && data?.event_image != ""
                    ? `url(${data?.event_image})`
                    : `url(${ErrorImage})`,
              }}
            >
              <div className="container">
                <div className="row align-items-center justify-content-between cta-content">
                  <div className="col-md-6 col-md-6 col-12">
                    <h2 className="event-name text-white text-break">{data?.event_name || "-"}</h2>
                    <h6>
                      {
                        data?.event_choose_type == "Event" && t("StartOnward",lan)+": "
                      }
                      {data?.event_choose_type == "Event" && (
                        <a>{new Date(data?.start_date).toDateString()}</a>
                      )}
                    </h6>
                  </div>
                  <div className="col-auto my-3">
                    {data?.event_choose_type !== "Event" ? (
                      <a
                        className="btn-white-border"
                        onClick={(e) => {
                          onAdvertisementClick(e, data)}}
                      >
                        {t("ReadMoreAdvertisementButton", lan)}
                      </a>
                    ) : (
                      <Link
                        className="btn-white-border"
                        to={`/user-dashboard/event-details/${data?.uuid}?is_corporate=${props?.isCorporate ? '1' :'0'}`}
                      >
                        {t("ReadMoreAdvertisementButton", lan)}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
}

export default CTAbanner;
