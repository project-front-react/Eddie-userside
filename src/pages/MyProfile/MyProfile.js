import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./MyProfile.scss";
import IntImage from "../../assets/images/IntImage.png";
import IcStar from "../../assets/images/star.svg";
import IcStarYellow from "../../assets/images/star-yellow.svg";
import { Link } from "react-router-dom";

import IcLocation from "../../assets/images/icLocation.svg";
import IcPhone from "../../assets/images/IcPhone.svg";
import IcMail from "../../assets/images/IcMail.svg";
import placeholder from "../../assets/images/placeholder.svg"
import ErrorImage from "../../assets/images/ErrorImage.svg"

import { getTranslatedText as t } from "../../translater/index";

import Sidebar from "../../components/sidebar/Sidebar";
import Popup from "../../components/popup/popup";
import { useHistory } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
import {  useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { getUserProfileApi } from "../../services/eddiServices";
import { getPersonalProfileData } from "../../redux/actions";
import Loader from "../../components/Loader/Loader";

const MyProfile = () => {
  const history = useHistory();
  const dispatch =useDispatch()
  const state = useSelector((state)=>state?.Eddi)
  let lan=state?.language;
  const isCorporate = state?.UserDetail?.is_corporate
  const [rateNowPopup, setrateNowPopup] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [rating, setRating] = useState(0);
  const [userData,setUserData]=useState(state?.personalData)

  const handleClosePopup = () => {
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setrateNowPopup(false);
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };

  const getUserData = async () => {
    setIsLoader(true);
    await getUserProfileApi()
      .then((result) => {
        setIsLoader(false);
        if (result?.status == "success") {
          setUserData(result.data)
        }
      })
      .catch((e) => console.log(e)).finally(()=>setIsLoader(false));
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    getUserData()
  }, []);


  function timeAgo(input) {
    const date = (input instanceof Date) ? input : new Date(input);
    const formatter = new Intl.RelativeTimeFormat('en');
    const ranges = {
      years: 3600 * 24 * 365,
      months: 3600 * 24 * 30,
      weeks: 3600 * 24 * 7,
      days: 3600 * 24,
      hours: 3600,
      minutes: 60,
      seconds: 1
    };
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    for (let key in ranges) {
      if (ranges[key] < Math.abs(secondsElapsed)) {
        const delta = secondsElapsed / ranges[key];
        return formatter.format(Math.round(delta), key);
      }
    }
  }

  if(isLoader){
    return(
      <Loader />
    )
  }
  
  return (
    <div className="MyProfile">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container">
            <div className="row">
              <div className="brdcumb-block">
                <div>
                  <Link to={isCorporate ?
                '/corporate-user-dashboard':'/user-dashboard'  
                }  className="brd-link"> {t("Dashboard", lan)} </Link>|
                  <span className="brd-link text-green">  {t("MyProfile", lan)} </span>
                </div>
                {/* <Link
                  onClick={() => {
                    history.goBack();
                  }}
                  className="brd-link"
                >
                  {t("Back", lan)}
                </Link> */}
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-3 col-md-3 col-12">
                <div className="supplier-photo">
                  <img src={userData?.profile_image ? `${userData?.profile_image}`: placeholder} 
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src=ErrorImage;
                  }}/>
                </div>
              </div>
              <div className="col-lg-9 col-md-9 col-12 supplier-details">
                <div className="supplier-title">
                  <div>
                    <h1> {`${userData?.first_name}  ${userData?.last_name==null?userData?.last_name:""}`}</h1>
                    <h6>{t("Membersince", lan)}{timeAgo(new Date(userData?.created_date_time))}</h6>
                  </div>
                  <Link to="/edit-profile" className="btn btn-green">
                    {t("EditProfile", lan)}
                  </Link>
                </div>
                <div className="course-offered">
                  <div>
                    <h6>{t("CoursesInterestIn", lan)}</h6>
                  </div>
                  <ScrollContainer
                    hideScrollbars={true}
                    className="scroll-container"
                  >
                    <div className="cat-list">
                      <ul>
                      {
                        userData?.course_category?.split(',').map((data,index)=>{
                         
                          return(
                            <>
                        <li key={index}>{data}</li>

                            </>
                          )
                        })
                      }

                      </ul>
                    </div>
                  </ScrollContainer>
                </div>

                <div className="supplier-basic-information">
                  <ul>
                    <li>
                      <div className="infomation-row">
                        <span className="information-icon">
                          <img src={IcLocation} />
                        </span>
                        <div>
                          <h6>{t("Address", lan)}</h6>
                          <h5>
                            {userData?.location || "-" }
                          </h5>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div className="infomation-row">
                        <span className="information-icon">
                          <img src={IcPhone} />
                        </span>
                        <div>
                          <h6>{t("phonnumber", lan)}</h6>
                          {userData?.phone_number!= 0 ? <h5>{userData?.phone_number ??"-"}</h5>
                          : <h5>-</h5>
                        }
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="infomation-row">
                        <span className="information-icon">
                          <img src={IcMail} />
                        </span>
                        <div>
                          <h6>{t("EmailAddress", lan)}</h6>
                          <h5>{userData?.email_id || "-"}</h5>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>
      {rateNowPopup && (
        <Popup
          show={rateNowPopup}
          header="Provide Your Feedback"
          handleClose={handleClosePopup}
        >
          <div className="popupinfo">
            <div className="inst-image">
              <img src={IntImage} />
            </div>
            <h3>Instructor Name</h3>
            <p>From Sweden University</p>
          </div>
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= rating ? "on" : "off"}
                  onClick={() => setRating(index)}
                >
                  <span className="star">
                    <img src={index <= rating ? IcStarYellow : IcStar} />
                  </span>
                  {/* <span className="star">&#9733;</span> */}
                </button>
              );
            })}
          </div>{" "}
          <div>
            <button
              onClick={handleClosePopup}
              className="btn btn-green text-uppercase w-100 mt-2"
            >
              {t("SUBMIT", lan)}
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default MyProfile;
