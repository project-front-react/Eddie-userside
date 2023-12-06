import React, { useState } from "react";
import "./InstructorPanel.scss";
import IcReadmore from "../../assets/images/ic_readmore.svg";
import IcReadless from "../../assets/images/ic_readless.svg";
import { getTranslatedText as t } from "../../translater/index";
import MailImg from "../../assets/images/instructur_mail.svg";
import { useSelector } from "react-redux";
function InstructorPanel(props) {
  const [isReadMore, setIsReadMore] = useState(true);
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <>
      {!props.isNotWithData ? (
        <div
          className="InstructorPanel-main"
          // onClick={() =>
          //   window.location.replace(`${props?.to ? props?.to : "#"}`)
          // }
        >
          <div className="instructor-row">
            {/* image of border color it will be dynamic color */}
            <div
              style={{
                border: props?.imageWithBorder ? "3px solid #3E8181" : 0,
              }}
              className="instructor-image"
            >
              <img src={props.InstructorImage} />
            </div>
            <div className="instructor-info">
              <div className="">
                <h3>{props.InstructorName}</h3>
                {props.InstructorEmail && (
                  <h6 className="f-12 email">
                    <img src={MailImg} /> {props.InstructorEmail}
                  </h6>
                )}
                <span>{props.InstructorPostedDate}</span>
                <span>{props.InstructorFrom}</span>
              </div>
              <div className="instructor-rate-block">
                <span className="course-given-number">{props.CourseGiven}</span>
                <span className="course-rate">{props.ratings}</span>
              </div>
            </div>
          </div>
          <div className="instructor-about">
            <p>{props.InstructorAbout}</p>
            {props?.InstructorBio?.length < 150 ? (
              <p
                className="unset-list"
                dangerouslySetInnerHTML={{
                  __html: props.InstructorBio,
                }}
              ></p>
            ) : (
              <>
                <p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: isReadMore
                        ? props?.InstructorBio?.slice(0, 150)
                        : props?.InstructorBio,
                    }}
                    className="unset-list"
                  ></p>
                  <div
                    hidden={props?.InstructorBio?.length > 150 ? false : true}
                  >
                    <span
                      onClick={toggleReadMore}
                      className="cursor-pointer mt-3"
                    >
                      <img
                        hidden={
                          props?.InstructorBio?.length > 150 ? false : true
                        }
                        height={18}
                        style={{ marginTop: "-4px" }}
                        src={isReadMore ? IcReadmore : IcReadless}
                        className="me-2"
                      />
                      {isReadMore
                        ? `${t("readmore", lan)}`
                        : `${t("readless", lan)}`}
                    </span>
                  </div>
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="InstructorPanel-main type2">
          <div className="instructor-row">
            {/* image of border color it will be dynamic color */}
            <div className="instructor-image">
              <img src={props.InstructorImage} />
            </div>
            <div className="instructor-info">
              <div className="">
                <h3>{props.InstructorName}</h3>
                <span>{props.InstructorPostedDate}</span>
              </div>
              <div className="instructor-rate-block">
                <span className="course-rate">{props.ratings}</span>
              </div>
            </div>
          </div>
          <div className="instructor-about">
            <p>{props.InstructorAbout}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default InstructorPanel;
