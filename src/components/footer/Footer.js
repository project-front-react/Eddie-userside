import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoWhite from "../../assets/logo/logo-white.svg";
import FooterFacebookIc from "../../assets/images/ic-f.svg";
import FooterLinkedinIc from "../../assets/images/ic-l.svg";
import FooterTwitterIc from "../../assets/images/ic-t.svg";
import "./Footer.scss";
import { getTranslatedText as t } from "../../translater/index";
import { useSelector } from "react-redux";

function Footer(props) {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const footerData = state?.footerData;
  return (
    <>
      {!props.isSmallFooter ? (
        <div className="footer-main">
          <div className="container">
            <div className="col-md-12 col-12">
              <div className="row">
                <div className="col-md-5 col-12">
                  <Link className="navbar-brand" href="#">
                    {/* <img src={LogoWhite} /> */}
                    <img src={footerData?.eddi_logo_footer} />
                  </Link>
                  <p
                    className="mt-3 unset-list"
                    dangerouslySetInnerHTML={{
                      __html: footerData?.description
                        ?.replaceAll("<br>", "")
                        .slice(0, 150),
                    }}
                  ></p>
                  <div className="socialize-icons">
                    <h6>
                      {footerData?.follow_us_text}
                      {":"}
                    </h6>
                    <a target="_blank" href={footerData?.social_media_icon1_link ?? ''}>
                      <img src={footerData?.social_media_icon1} />
                    </a>
                    <a target="_blank" href={footerData?.social_media_icon2_link ??''}>
                      <img src={footerData?.social_media_icon2} />
                    </a>
                    <a target="_blank" href={footerData?.social_media_icon3_link ??''}>
                      <img src={footerData?.social_media_icon3} />
                    </a>
                  </div>
                  <p className="mt-2 mb-0">{footerData?.copyright_text}</p>
                </div>
                <div className="col-md-4 col-12 quick-links-title unset-list">
                  <h4> {footerData?.quick_link_text}</h4>
                  <ul>
                    <li>
                      <Link
                        to={footerData?.quick_link_button_link1}
                        className={
                          window.location.href.includes(footerData?.quick_link_button_link1) ? "" : ""
                        }
                      >
                        {footerData?.quick_link_button_text1}
                      </Link>
                    </li>
                    {/* <li>
                      <Link>{t("Courses", lan)} </Link>
                    </li> */}
                    <li>
                      <Link to={footerData?.quick_link_button_link2}>
                        {" "}
                        {footerData?.quick_link_button_text2}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={footerData?.quick_link_button_link3}
                        className={
                          window.location.href.includes(footerData?.quick_link_button_link3) ? "" : ""
                        }
                      >
                        {" "}
                        {footerData?.quick_link_button_text3}
                      </Link>
                    </li>
                    <li>
                      <Link to={footerData?.quick_link_button_link4}> {footerData?.quick_link_button_text4}</Link>
                    </li>
                    <li>
                      <Link to={footerData?.quick_link_button_link5}>{footerData?.quick_link_button_text5}</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="footer-blcok">
          <div className="smallFooter">{t("FooterTag", lan)} </div>
        </div>
      )}
    </>
  );
}

export default Footer;
