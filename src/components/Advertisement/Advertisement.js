import React, { useState, useEffect, Fragment } from "react";
import "./Advertisement.scss";
import { getTranslatedText as t } from "../../translater/index";
import Slider from "react-slick";
import API from "../../api";
import {
  getRecuritmentAdsApi,
  increaseRecruitmentAdcountApi,
} from "../../services/eddiServices";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import { useSelector } from "react-redux";

var settings = {
  dots: false,
  infinite: true,
  speed: 1500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  rtl: true,
};

function Advertisement(props) {
  const state = useSelector(state=>state?.Eddi)
  let lan = state?.language;
  const [filterdAds, setFilteredAds] = useState();
  const recuritmentAdsApiCall = async () => {
    getRecuritmentAdsApi()
      .then((res) => {
        if (res?.status == "success") {
          let activeAds = [];
          res?.data?.map((dat) => {
            if (dat?.is_approved?.value == "Approved") {
              if (dat?.status?.value == "Active") {
                activeAds.push(dat);
              }
            }
          });
          setFilteredAds(activeAds);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const increaseRecruitmentAdcountCall = async (uuid) => {
    increaseRecruitmentAdcountApi(uuid)
      .then((res) => {
        if (res?.status == "success") {
          console.log("success Increase");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    recuritmentAdsApiCall();
  }, []);

  return (
    <Fragment>
                  { filterdAds && <h4>{props?.title}</h4>}
    <Slider {...settings}>
      {filterdAds?.map((sliderContent, index) => {
        return (
          <div key={index}>
            <div
              className="add-block"
              style={{
                backgroundImage: `url(${sliderContent?.recruitmentAd_File}), url(${ErrorImage}) `,
              }}
            >
              <div className="add-content">
                <div>
                  <h2>{sliderContent.recruitmentAd_title}</h2>
                  <p>{sliderContent.recruitmentAd_description}</p>
                </div>
                <div className="add-btn-block">
                  <a
                    className="btn btn-white-border"
                    href={sliderContent?.recruitmentAd_banner_video_link}
                    target="_blank"
                    onClick={() => {
                      increaseRecruitmentAdcountCall(sliderContent?.uuid);
                    }}
                  >
                    {t("GETSTARTED", lan)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
    </Fragment>
  );
}

export default Advertisement;
