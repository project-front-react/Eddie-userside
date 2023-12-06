import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import IcCal from "../../assets/images/IcCalendar.svg";
import { getVatCharges } from "../../redux/actions";
import "./EventDetails.scss";
import blogImg from "../../assets/images/blogImg.jpg";
import IcReadmore from "../../assets/images/ic_readmore.svg";
import IcReadless from "../../assets/images/ic_readless.svg";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import IcLearner from "../../assets/images/IcLearner.svg";
import IcAmt from "../../assets/images/IcAmt.svg";
import IcTime from "../../assets/images/IcTime.svg";

import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import success from "../../assets/images/ic-success.png";
import fail from "../../assets/images/ic-fail.svg";
import placeholder from "../../assets/images/placeholder.svg";
import Popup from "../../components/popup/popup";
import InstructorPanel from "../../components/InstructorPanel/InstructorPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseDetailApi,
  getEventById,
  eventPaymentApi,
  eventPaymentStatusApi,
  getCorporateEventById,
} from "../../services/eddiServices";
import API from "../../api";
import { useHistory,useLocation } from "react-router-dom";

import { getSelectedEvent } from "../../redux/actions";
import Loader from "../../components/Loader/Loader";
import { encrypt } from "../../utils/encrypt";
import NoData from "../../components/NoData/NoData";
import { showShorttext } from "../../services/constant";

const EventDetails = (props) => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const dispatch = useDispatch();
  const history = useHistory();
  const search = useLocation().search;
  const isCorporate = (new URLSearchParams(search)?.get("is_corporate"));
  const [eventData, setEventData] = useState();
  const [catColor, setCatColor] = useState('#481A20');
  const [relatedeventData, setRelatedeventData] = useState([]);
  const [confirmPopup, setconfirmPopup] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [eventPayment, seteventPayment] = useState({
    value: false,
    data: null,
  });
  const [isLoader, setIsLoader] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const [loderBtn, setLoderBtn] = useState(false);
  const [freePaymentResponse, setFreePaymentResponse] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("logedInEmail"));
  const [paymentModePopup, setPaymentModePopup] = useState(false);
  const [registeredCount, setRegistredCount] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const original = parseInt(eventData?.event_price);
  const vat = parseInt(state?.getVatCharges);
  const totalVat = (original * vat) / 100;
  const totalPrice=totalVat + original
  const uuid = props?.match?.params?.id;
  console.log("isCorporate",isCorporate);

  const eventDetailApi = () => {
    setIsLoader(true);

    if(isCorporate =='1'){
      getEventById(uuid,true)
      .then((result) => {
        setIsLoader(false);
        if (result?.status == "success") {
          setEventData(result?.data);
          dispatch(getVatCharges(result?.VAT_charges));
          setRegistredCount(result?.subscriber_count);
          dispatch(getSelectedEvent(result?.data));
          setIsEnrolled(result?.is_enrolled);
        }
      })
      .catch((e) => console.log("something went wrong!"));
    }else{
    getEventById(uuid)
      .then((result) => {
        setIsLoader(false);
        if (result?.status == "success") {
          setEventData(result?.data);
          dispatch(getVatCharges(result?.VAT_charges));
          setRegistredCount(result?.subscriber_count);
          dispatch(getSelectedEvent(result?.data));
          setIsEnrolled(result?.is_enrolled);
        }
      })
      .catch((e) => console.log("something went wrong!"));
    }
  };

  useEffect(() => {
    eventDetailApi();
  }, []);

  useEffect(() => {
    state?.AllCategories?.filter(
      (data) => eventData?.event_category == data?.category_name
    )?.map((col) => {
      setCatColor(col?.color);
    });
  }, [eventData]);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const handleClosePopup = () => {
    // window.location.reload();
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setconfirmPopup(false);
    setPaymentModePopup(false);
    seteventPayment({ ...eventPayment, value: false });
  };

  const preventScroll = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  };
  const onExternalEnroll = () => {
    window.open(eventData?.checkout_link);
    let formData = new FormData();
    formData.append("event_name", encrypt(eventData?.event_name));
    formData.append("email_id", encrypt(email));
    formData.append("payment_mode", ("external"));
    formData.append("event_id", eventData?.uuid);
    formData.append("price", encrypt(totalPrice?.toString()));
    setLoderBtn(true)
    const corporate = isCorporate === '1'
    eventPaymentStatusApi(formData,corporate)
      .then((result) => {
        setLoderBtn(false);
        handleClosePopup();
        if (result?.status == "success") {
          // window.open(eventData?.checkout_link);
          handleClosePopup();
          seteventPayment({ value: false, data: null });
          eventDetailApi();
        }
      })
      .catch((e) => {
        setFreePaymentResponse("Please try again");
        setLoderBtn(false);
      });
  };

  const onFreeEnroll = () => {
    let formData = new FormData();
    formData.append("event_name", encrypt(eventData?.event_name));
    formData.append("email_id", encrypt(email));
    formData.append("event_id", eventData?.uuid);
    formData.append("payment_mode", ("eddi"));
    const corporate = isCorporate === '1'

    eventPaymentStatusApi(formData,corporate)
      .then((result) => {
        console.log("res", result);
        handleClosePopup();
        if (result?.status == "success") {
          setFreePaymentResponse(lan == "en" ? result?.data : result?.data_sv);
          setPaymentModePopup(true);
          eventDetailApi();
        } else {
          setPaymentModePopup(true);
          setIsFail(true);
          setFreePaymentResponse(lan == "en" ? result?.data : result?.data_sv);
        }
      })
      .catch((e) => setFreePaymentResponse("Please try again"));
  };

  const onPaidEnroll = () => {
    history.push(`/user-dashboard/event-checkout/${eventData?.uuid}?is_corporate=${isCorporate}`);
    seteventPayment({ value: false, data: null });
    handleClosePopup();
  };
  const handleCheckout = () => {
    // console.log("eve",eventPayment);
    handleClosePopup();
    seteventPayment({ ...eventPayment, value: false });
    if (eventPayment.data == "external") {
      setPaymentModePopup(true);
    } else if (eventPayment.data == "free") {
      // setPaymentModePopup(true)
      onFreeEnroll();
    } else {
      onPaidEnroll();
    }
    // setPaymentModePopup()
  };

  return (
    <div className="EventDetails">
      <Header />
      <div className="main-content ms-0 pt-lg-5 pt-4">
        <div className="container">
          <div className="row ">
            <div className="brdcumb-block">
              <div>
                <Link className="brd-link"></Link>
                <span className="brd-link text-green"> </span>
              </div>
              <Link
                onClick={() => {
                  history.goBack();
                }}
                className="brd-link"
              >
                {t("Back", lan)}
              </Link>
            </div>
          </div>

         {eventData ? <div className="row mt-4">
            <div className="col-lg-6 col-12">
              <div className="course-details-main">
                <div className="course-banner">
                  <img
                    src={
                      eventData?.event_image
                        ? `${eventData?.event_image}`
                        : blogImg
                    }
                    className="w-100 banner-box-big2"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = ErrorImage;
                    }}
                  />
                </div>
                <div className="about-course">
                  <div className="course-information d-flex d-lg-none">
                    <div className="d-flex w-100 justify-content-between flex-column">
                      <h1
                      className="text-break"
                        style={{
                          color: eventData?.course_category?.color || "#007ea8",
                        }}
                      >
                        {/* {eventData?.course_name} */}
                        {eventData?.event_name}
                      </h1>
                      <p className="unset-list"
                        dangerouslySetInnerHTML={{
                          __html: eventData?.event_small_description || "-",
                        }}
                      ></p>
                    </div>

                    <div className="category-type-block">
                      <div
                        className="business-category"
                        style={{ color: catColor, borderColor: catColor }}
                      >
                        {/* {eventData?.course_category?.category_name} */}
                        {t(eventData?.event_category,lan) || "-"}
                      </div>
                      <div className="lect-status">
                        {eventData?.event_type || "-"}
                      </div>
                    </div>
                    <div
                      hidden={
                        eventData?.event_type == "Physical" ? false : true
                      }
                      className="event-location"
                    >
                      <span>{t("Location", lan)}: </span>
                      {" " + eventData?.event_location || "-"}
                    </div>

                    <div hidden={isEnrolled} className="w-100 mt-4">
                      {eventData &&
                      eventData?.fees_type == "Paid" &&
                      (eventData?.checkout_link == "" ||
                        eventData?.checkout_link == null ||
                        eventData?.checkout_link == undefined) ? (
                        <Link
                          // onClick={() => setconfirmPopup(true)}
                          onClick={() =>
                            seteventPayment({ value: true, data: "paid" })
                          }
                          className="btn btn-green w-100"
                        >
                          {t("REGISTERNOW", lan)}
                        </Link>
                      ) : 
                        eventData?.checkout_link  ? (
                        <Link
                          onClick={() =>
                            seteventPayment({ value: true, data: "external" })
                          }
                          className="btn btn-green w-100"
                        >
                          {t("REGISTERNOW", lan)}
                        </Link>
                      ) : (
                        <Link
                          onClick={() =>
                            seteventPayment({ value: true, data: "free" })
                          }
                          className="btn btn-green w-100"
                        >
                          {t("REGISTERNOW", lan)}
                        </Link>
                      )}
                    </div>

                    <div hidden={!isEnrolled} className="w-100 mt-4">
                      <button className="btn btn-green w-100" disabled>
                        {t("AlreadyEnrolled",lan)}
                      </button>
                    </div>
                  </div>

                  <h1>{t("aboutThisEvent", lan)}</h1>

                  <p className="text">
                    {isReadMore
                      ? eventData?.event_description?.slice(0, 150)
                      : eventData?.event_description}
                    <div
                      hidden={
                        eventData?.event_description?.length > 150
                          ? false
                          : true
                      }
                    >
                      <span
                        onClick={toggleReadMore}
                        className="read-or-hide d-table link-readmore mt-3"
                      >
                        <img
                          height={18}
                          style={{ marginTop: "-4px" }}
                          src={isReadMore ? IcReadmore : IcReadless}
                          className="me-2"
                        />
                        {isReadMore
                          ? `${t("readmore", lan)}`
                          : `${t("readless", lan)}`}
                        {/* {isReadMore ? "currently" : "not"} */}
                      </span>
                    </div>
                  </p>

                  <h1 className="mt-lg-5 mb-lg-4">
                    {t("AboutOrganizer", lan)}
                  </h1>

                  <div>
                    <InstructorPanel
                      InstructorImage={placeholder}
                      InstructorName={
                        eventData?.admin_name ? `${eventData?.admin_name}` : "-"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-12">
              <div className="course-information d-none d-lg-flex">
                <div className="d-flex w-100 justify-content-between flex-column">
                  <h1
                    style={{
                      color: eventData?.course_category?.color || "#007ea8",
                    }}
                    className="text-break"
                  >
                    {/* {eventData?.course_name} */}
                    {eventData?.event_name}
                  </h1>
                  <p className="unset-list"
                    dangerouslySetInnerHTML={{
                      __html: eventData?.event_small_description || "-",
                    }}
                  ></p>
                </div>

                <div className="category-type-block">
                  <div
                    className="business-category"
                    style={{ color: catColor, borderColor: catColor }}
                  >
                    {/* {eventData?.course_category?.category_name} */}
                    {t(eventData?.event_category, lan) || "-"}
                  </div>
                  <div>{t(eventData?.event_type, lan) || "-"}</div>
                </div>
                <div
                  hidden={eventData?.event_type !== "Offline"}
                  className="event-location"
                >
                  <span>{t("Location", lan)}: </span>
                  {" " + eventData?.event_location || "-"}
                </div>

                <div hidden={isEnrolled} className="w-100 mt-4">
                  {eventData &&
                  eventData?.fees_type == "Paid" &&
                  (eventData?.checkout_link == "" ||
                    eventData?.checkout_link == null ||
                    eventData?.checkout_link == undefined) ? (
                    <Link
                      // onClick={() => setconfirmPopup(true)}
                      onClick={() =>
                        seteventPayment({ value: true, data: "paid" })
                      }
                      className="btn btn-green w-100"
                    >
                      {t("REGISTERNOW", lan)}
                    </Link>
                  ) : eventData?.checkout_link ? (
                    <Link
                      onClick={() =>
                        seteventPayment({ value: true, data: "external" })
                      }
                      className="btn btn-green w-100"
                    >
                      {t("REGISTERNOW", lan)}
                    </Link>
                  ) : (
                    <Link
                      onClick={() =>
                        seteventPayment({ value: true, data: "free" })
                      }
                      className="btn btn-green w-100"
                    >
                      {t("REGISTERNOW", lan)}
                    </Link>
                  )}
                </div>

                <div hidden={!isEnrolled} className="w-100 mt-4">
                  <button className="btn btn-green w-100" disabled>
                    {t("AlreadyEnrolled",lan)}
                  </button>
                </div>
              </div>
              <div className="course-amount-time">
                <ul>
                  <li>
                    <span className="item-icon">
                      <img src={IcLearner} />
                    </span>
                    <div className="item-detail">
                      {registeredCount} {t("Registered", lan)}
                    </div>
                  </li>
                  <li>
                    <span className="item-icon">
                      <img src={IcCal} />
                    </span>
                    <div className="item-detail">
                      {new Date(eventData?.start_date).toDateString()}
                   
                    </div>
                  </li>
                  {/* <li>
                    <span className="item-icon">
                      <img src={IcLevel} />
                    </span>
                    <div className="item-detail">
                      {eventData?.course_level?.level_name}
                      Beginner
                    </div>
                  </li> */}
                  <li>
                    <span className="item-icon">
                      <img src={IcTime} />
                    </span>
                    <div className="item-detail">
                      {/* {eventData?.course_length} Days */}
                      {t('Startsfrom',lan)} {eventData?.start_time?.slice(0, 5) ||
                        "-"}{" "}
                      
                    </div>
                  </li>
                  <li>
                    <span className="item-icon">
                      <img src={IcAmt} />
                    </span>
                    <div className="item-detail">
                      {eventData?.event_price <= 0
                        ? t("FreeData",lan)
                        : `${totalPrice} SEK`}
                    </div>
                  </li>
                </ul>
              </div>
              {/* <div className="advertisement-blcok">
                <RelatedCourseLinks data={relatedeventData} />

              </div> */}
            </div>
          </div>:<NoData />}
        </div>

        <Footer isSmallFooter />
      </div>

      {eventPayment.value ? (
        <Popup
          show={eventPayment.value}
          header={t("EnrollmentToEvent",lan)}
          handleClose={() => seteventPayment({ value: false })}
        >
          <div className="popupinfo">
            <div className="row m-0">
              <div className="course-thumbnail-popup col-sm-4 col-xs-12 px-0">
                <img
                  src={
                    eventData?.event_image
                      ? `${eventData?.event_image}`
                      : placeholder
                  }
                  className="course-thumbnail-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = ErrorImage;
                  }}
                />
              </div>

              <div className="course-infopopup">
                <div>
                  <div className="f-18 mb-2 text-img text-break">
                    {showShorttext(eventData?.event_name,20)  || "-"}
                  </div>
                  <div className="category-type-block">
                    <div
                      className="business-category mt-2 text-center"
                      style={{ color: catColor, borderColor: catColor }}
                    >
                      {t(eventData?.event_category, lan)|| "-"}
                      {/* Business and Finance */}
                    </div>
                  </div>
                </div>
                <div className="course-amt">
                  <p className="f-18 fw-bold">
                    {" "}
                    {eventData?.event_price <= 0
                      ? t("FreeData",lan)
                      : `${totalVat + original} SEK `}
                  </p>
                  <p className="vat-charge-text">
                    {"*" + t("IncludeVATCharges", lan)}
                  </p>
                </div>
              </div>
            </div>
            {/* custom design will be here  */}
          </div>
          <div className="w-100">
            <button
              onClick={handleCheckout}
              className="btn btn-green text-uppercase w-100 mt-3"
            >
              {t("CONTINUE", lan)}
            </button>
          </div>
        </Popup>
      ) : (
        ""
      )}

      {/* // payment popup
       */}
      {paymentModePopup && (
        <Popup
          show={paymentModePopup}
          header={eventData?.event_name}
          headerClass={'text-break'}
          handleClose={handleClosePopup}
        >
          {eventPayment?.data == "external" ? (
            <>
              <div className="popupinfo">
                <p className="f-18">{t("ExternalEventDetails", lan)}</p>

                {/* custom design will be here  */}
              </div>
            </>
          ) : eventPayment?.data == "free" ? (
            <>
              <div className="popup-header">
                <img
                  className="img-responsive img-fluid img-status"
                  src={isFail ? fail : success}
                ></img>
              </div>
              <div className="popupinfo">
                {/* <h2 className="my-3">{paymentErrorModal}</h2> */}
                {isFail ? (
                  <p>{freePaymentResponse}</p>
                ) : (
                  <p>{t("EventEnrollSuccess", lan)}</p>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="w-100">
            <button
              onClick={
                eventPayment?.data === "external"
                  ? onExternalEnroll
                  : eventPayment?.data === "free"
                  ? handleClosePopup
                  : handleClosePopup
              }
              className="btn btn-green w-100 mt-2"
            >
              {loderBtn ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : eventPayment?.data === "free" ? (
                t("Okbutton", lan)
              ) : (
                t("ContinueButton", lan)?.toUpperCase()
              )}
            </button>
          </div>
        </Popup>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default EventDetails;
