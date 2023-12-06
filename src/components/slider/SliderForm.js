import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./SliderForm.scss";
// import SliderImg from "../../assets/images/slider-img1.svg";
import SliderImg from "../../assets/images/slider-img.svg";
import Slider from "react-slick";
import { getTranslatedText as t } from "../../translater/index";
import { useSelector } from "react-redux";

function SliderForm({ imgClick }) {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const history = useHistory();
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  return (
    <div className="slider-main">
      <Slider {...settings}>
        <div>
          <div className="slider-blcok">
            <img
              src={SliderImg}
              // onClick={() => {
              //   history.push("/home");
              // }}
              onClick={imgClick}
              className="imgStyle"
            />
            <div className="title">
              <h1>{t("WelcomeIn", lan)}</h1>
              {/* <p>{t("JustClick",lan)}</p> */}
            </div>
          </div>
        </div>
        {/* <div> */}
        {/* <div className="slider-blcok">
            <img src={SliderImg} />
            <div className="title">
              <h1>Welcome Back</h1>
              <p>Just a couple of clicks and we start</p>
            </div>
          </div>
        </div>
        <div>
          <div className="slider-blcok">
            <img src={SliderImg} />
            <div className="title">
              <h1>Welcome Back</h1>
              <p>Just a couple of clicks and we start</p>
            </div>
          </div>
        </div> */}
      </Slider>
    </div>
  );
}

export default SliderForm;
