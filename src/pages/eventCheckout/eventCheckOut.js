import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useSelector } from "react-redux";

import "./eventCheckOut.scss";
import { Link, useHistory } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import placeholder from "../../assets/images/placeholder.svg";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js/pure";
import { ele } from "../../Country/country";
import API from "../../api";
import EventPayment from "./eventPayment";
import {
  eventPaymentStatusApi,
  getStripePublicKeyApi,
  getUserProfileApi,
  sendInvoice,
} from "../../services/eddiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterSelectMenu from "../../components/FilterSelectMenu/FilterSelectMenu";
import { encrypt } from "../../utils/encrypt";

// const public_key = process.env.REACT_APP_STRIPE_PUB_KEY;
// const platform=localStorage.getItem("Platform")
// const public_key = process.env[`REACT_APP_${platform}_STRIPE_PUB_KEY`];
// const stripePromise = loadStripe(public_key);
const initialVal = {
  studentName: "",
  dob: "",
  companyName: "",
  orgNumber: "",
  streetNumber: "",
  reference: "",
  zip: "",
  country: "",
  city: "",
  invoiceAddress: "",
  orgEmail: "",
};
const EventCheckOut = () => {
  const history = useHistory();

  const [payBy, setPayBy] = useState("PayStripe");
  const [invoiceData, setInvoiceData] = useState(initialVal);
  const [email, setEmail] = useState(localStorage.getItem("logedInEmail"));
  const [loderBtn, setLoderBtn] = useState(false);
  const [countryList, setCountryList] = useState();
  const [selectedFilter, setSelectedFilter] = useState("PayByOrg");
  const [public_key, setPublic_key] = useState();

  const [error, setError] = useState({
    nameError: "",
    personalNoError: "",
    orgNoError: "",
    orgNameError: "",
    orgEmailError: "",
    streetNoError: "",
    referenceError: "",
    invoiceAddressError: "",
    zipError: "",
    countryError: "",
    cityError: "",
    emailError: "",
  });
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const nameRef = useRef();

  const NameOfStudent = useRef();
  const dob = useRef();
  const OrganizationName = useRef();
  const OrganizationNumber = useRef();
  const StreetNumber = useRef();
  const Reference = useRef();
  const Zip = useRef();
  const Country = useRef();
  const City = useRef();
  const invoiceAddress = useRef();
  const emailAddress = useRef();

  var filtered = state?.SelectedEvent;
  const price = filtered?.event_price <= 0 ? 0 : filtered?.event_price;
  const charges = (Number(price) * Number(state?.getVatCharges)) / 100;
  const total = Number(price) + Number(charges);

  const handleClosePopup = () => {
    const body = document.querySelector("body");
    body.style.overflow = "auto";
  };

  useEffect(() => {
    // contactUsDataCall();
    getUserData();
    getStripePublicKey();
  }, []);

  const getStripePublicKey = () => {
    getStripePublicKeyApi()
      .then((result) => {
        if (result?.status == "success") {
         if(result?.data[0].public_key){
          setPublic_key(result?.data[0].public_key)
         }
        } else {
          console.log("error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getUserData = () => {
    getUserProfileApi().then((result) => {
      if (result?.status == "success") {
        const stuname =  result?.data?.usersignup?.first_name + ' '+ result?.data?.usersignup?.last_name ||''
        setInvoiceData({
          studentName: stuname,
          dob: new Date(result?.data?.dob).toLocaleDateString("en-CA") || "",
          companyName: "",
          orgNumber: "",
          streetNumber: "",
          reference: "",
          zip: "",
          email: result?.data?.email_id,
          country: "",
          city: "",
          invoiceAddress: "",
          orgEmail: "",
        });
      }
    });
  };

  useEffect(() => {
    const list = [];
    const con = ele();
    con?.map((country) => {
      list.push(country.name);
    });
    setCountryList(list);
  }, []);

  const validate = () => {
    const nameVal = NameOfStudent?.current?.value;
    const dobVal = dob?.current?.value;
    const orgName = OrganizationName?.current?.value;
    const orgnoVal = OrganizationNumber?.current?.value;
    const streetnum = StreetNumber?.current?.value;
    const refVal = Reference?.current?.value;
    const zip = Zip?.current?.value;
    const country = invoiceData?.country;
    const city = City?.current?.value;
    const invoiceaddress = invoiceAddress?.current?.value;
    const email = emailAddress?.current?.value;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (
      !nameVal &&
      !dobVal &&
      !orgName &&
      !streetnum &&
      !orgnoVal &&
      !refVal &&
      !email &&
      !zip &&
      !city &&
      !country &&
      !invoiceaddress
    ) {
      setError({
        nameError: "*Required",
        personalNoError: "*Required",
        // orgNoError: "*Required",
        orgNameError: "*Required",
        streetNoError: "*Required",
        referenceError: "*Required",
        invoiceAddressError: "*Required",
        zipError: "*Required",
        countryError: "*Required",
        cityError: "*Required",
      });
      return false;
    } else if (!nameVal && nameVal?.trim() == "") {
      setError({ ...error, nameError: "*Name is Required" });
      return false;
    } else if (!dobVal && dobVal?.trim() == "") {
      setError({ ...error, personalNoError: "*DOB is Required" });
      return false;
    } else if (
      selectedFilter == "PayByOrg" &&
      !orgName &&
      orgName?.trim() == ""
    ) {
      setError({ ...error, orgNameError: "*Name is Required" });
      return false;
    } else if (!streetnum && streetnum?.trim() == "") {
      setError({ ...error, streetNoError: "*Street Number is Required" });
      return false;
      // } else if (!orgnoVal && orgnoVal?.trim() == '') {
      //   setError({ ...error, orgNoError: "*Organization Number is Required" });
      //   return false;
      // } else if (!refVal && refVal?.trim() == '') {
      //   setError({ ...error, referenceError: "*Reference is Required" });
      //   return false;
    } else if (!zip && zip?.trim() == "") {
      setError({ ...error, zipError: "*Zip is Required" });
      return false;
    } else if (!city && city?.trim() == "") {
      setError({ ...error, cityError: "*City is Required" });
      return false;
    } else if (
      selectedFilter == "PayByOrg" &&
      emailRegex?.test(invoiceaddress) == false
    ) {
      setError({
        ...error,
        invoiceAddressError: "*Enter valid invoice address",
      });
      return false;
    } else if (!country && country?.trim() == "") {
      setError({ ...error, countryError: "*Country is Required" });
      return false;
    } else {
      return true;
    }
  };

  const onPayInvoice = async () => {
    const valid = await validate();
    if (valid) {
      setLoderBtn(true);
      const formData = new FormData();
      formData.append("NameOfStudent", NameOfStudent?.current?.value);
      formData.append("dob", dob?.current?.value);
      formData.append("OrganizationName", OrganizationName?.current?.value);
      formData.append("OrganizationNumber", OrganizationNumber?.current?.value);
      formData.append("StreetNumber", StreetNumber?.current?.value);
      formData.append("Reference", Reference?.current?.value);
      formData.append("Zip", Zip?.current?.value);
      formData.append("Country", invoiceData?.country || "");
      formData.append("City", City?.current?.value);
      formData.append("invoiceEmail", encrypt(invoiceAddress?.current?.value));
      formData.append("email_id", encrypt(email));
      formData.append("price",  encrypt(total.toString()));
      formData.append("event_name", encrypt(filtered?.event_name));
      formData.append("product_id",encrypt(filtered?.uuid));
      formData.append("payment_mode", encrypt("invoice"));
      formData.append("product_type", "event");
      formData.append("InvoiceMethod", selectedFilter);

      sendInvoice(formData)
        .then((result) => {
          setLoderBtn(false);
          if (result?.status == "success") {
            setTimeout(() => {
              setLoderBtn(false);
              toast.success(t("InvoiceSentSuccessfully",lan));
              history.push("/user-dashboard");
            }, 1000);
          } else {
            setLoderBtn(false);
            toast.error("please try again!");
          }
        })
        .catch((e) => {
          console.log(e);
          setLoderBtn(false);
        });
    }
  };

  return (
    <div className="CheckOut">
      <Header />
      <div className="contact-section">
        <div className="container">
          <div className="row">
            <div className="brdcumb-block">
              <h2>{t("Checkout", lan)}</h2>
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

          <div className="row m-0 mt-3 mb-4">
            <div className="col-lg-7 col-md-6 col-sm-12 col-12 ps-0">
              <div className="d-flex align-items-center pay-method-form">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    title="PayStripe"
                    defaultChecked
                    onClick={(e) => setPayBy(e?.target?.title)}
                  />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">
                    {t("PayCard", lan)}
                  </label>
                </div>

                <div className="form-check ms-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    onClick={(e) => setPayBy(e?.target?.title)}
                    title="PayCard"
                  />
                  <label className="form-check-label" htmlFor="flexRadioDefault2">
                    {t("PaybyInvoice", lan)}
                  </label>
                </div>
                {payBy !== "PayStripe" && (
                  <div className="ms-4 payment-by-drop">
                    <div className="filterbox">
                      <FilterSelectMenu
                        placeholder=""
                        value={["PayByOrg", "PayByMe"]}
                        selected={selectedFilter}
                        onChange={(e) => {
                          setSelectedFilter(e?.target?.value);
                        }}
                        isWithicon
                      />
                    </div>
                  </div>
                )}
              </div>

              {payBy === "PayStripe" ? (
                <div className="card-detail-div">
                  {/* card holder name  */}
                  <p className="p-head mb-1 mt-4">{t("NameCard", lan)}</p>
                  <div className="mb-3 full-width w-75">
                    <input
                      type="text"
                      className="form-control input-profile px-2 py-3 f-16"
                      placeholder="Enter Name on Card"
                      ref={nameRef}
                    />
                  </div>

                  <div className="stripe-detail full-width w-75">
                  {public_key && <Elements stripe={loadStripe(public_key)}>
                      <EventPayment state={nameRef?.current?.value} />
                    </Elements>}
                  </div>

                  {/* btn pay  */}
                </div>
              ) : (
                <>
                  <div className="card-detail-div">
                    {/* pay by organization  */}
                    {/* // pay by invoice has two fileld 1) pay by me 2)pay by organization  */}
                    {selectedFilter == "PayByOrg" ? (
                      <Fragment>
                        <div className="row m-0">
                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("NameOfStudent", lan)}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <input
                                type="text"
                                placeholder={t("NameOfStudent", lan)}
                                className="form-control input-profile px-2 py-3"
                                ref={NameOfStudent}
                                defaultValue={invoiceData?.studentName}
                                onChange={() => {
                                  setError({ ...error, nameError: "" });
                                }}
                              />
                              {error.nameError && (
                                <p className="errorText mb-0">
                                  {error.nameError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("ChooseDob", lan)}
                            </p>
                            <div className="mb-3 p-0 number ">
                              {/* <input
                              type="number"
                              className="form-control input-profile px-2 py-3"
                              placeholder={t("dob", lan)}
                              ref={dob}
                              defaultValue={invoiceData?.dob}
                              onChange={() => {
                                setError({ ...error, personalNoError: "" });
                              }}
                            /> */}

                              <input
                                type="date"
                                data-format="dd/MM/yyyy "
                                max={new Date().toISOString().split("T")[0]}
                                className="form-control input-profile px-2 py-3"
                                ref={dob}
                                defaultValue={invoiceData?.dob}
                                onChange={() => {
                                  setError({ ...error, personalNoError: "" });
                                }}
                              />
                              {error.personalNoError && (
                                <p className="errorText mb-0">
                                  {error.personalNoError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("OrganizationName", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3 f-16"
                                placeholder={t("EnterOrganizationName", lan)}
                                ref={OrganizationName}
                                value={invoiceData?.companyName}
                                onChange={(e) => {
                                  setInvoiceData({
                                    ...invoiceData,
                                    companyName: e.target.value,
                                  });
                                  setError({ ...error, orgNameError: "" });
                                }}
                              />
                              {error.orgNameError && (
                                <p className="errorText mb-0">
                                  {error.orgNameError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("EVoiceAddress", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <input
                                type="email"
                                className="form-control input-profile px-2 py-3 f-16"
                                placeholder={t("ChooseEVoiceAddress", lan)}
                                ref={invoiceAddress}
                                defaultValue={invoiceData?.invoiceAddress}
                                onChange={() => {
                                  setError({
                                    ...error,
                                    invoiceAddressError: "",
                                  });
                                }}
                              />
                              {error.invoiceAddressError && (
                                <p className="errorText mb-0">
                                  {error.invoiceAddressError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("OrganizationNumber", lan)}
                            </p>
                            <div className="mb-3 ps-0 number">
                              <input
                                type="number"
                                placeholder={t("EnterOrganizationNumber", lan)}
                                className="form-control input-profile px-2 py-3"
                                ref={OrganizationNumber}
                                defaultValue={invoiceData?.orgNumber}
                                onChange={() => {
                                  setError({ ...error, orgNoError: "" });
                                }}
                              />
                              {error.orgNoError && (
                                <p className="errorText mb-0">
                                  {error.orgNoError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("Street", lan) +
                                " " +
                                t("OrganizationBracket", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 p-0  ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3"
                                placeholder={t("EnterStreet", lan)}
                                ref={StreetNumber}
                                defaultValue={invoiceData?.streetNumber}
                                onChange={() => {
                                  setError({ ...error, streetNoError: "" });
                                }}
                              />
                              {error.streetNoError && (
                                <p className="errorText mb-0">
                                  {error.streetNoError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("Reference", lan)}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <input
                                type="text"
                                placeholder={t("EnterReference", lan)}
                                className="form-control input-profile px-2 py-3"
                                ref={Reference}
                                defaultValue={invoiceData?.reference}
                                onChange={() => {
                                  setError({ ...error, referenceError: "" });
                                }}
                              />
                              {error.referenceError && (
                                <p className="errorText mb-0">
                                  {error.referenceError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0 align-self-end">
                            <p className="p-head mb-1 mt-4">
                              {t("Zip", lan) +
                                " " +
                                t("OrganizationBracket", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 p-0  ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3"
                                placeholder={t("EnterZip", lan)}
                                ref={Zip}
                                defaultValue={invoiceData?.zip}
                                onChange={() => {
                                  setError({ ...error, zipError: "" });
                                }}
                              />
                              {error.zipError && (
                                <p className="errorText mb-0">
                                  {error.zipError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("Country", lan) +
                                " " +
                                t("OrganizationBracket", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <FilterSelectMenu
                                value={countryList}
                                placeholder={t("ChooseCountry", lan)}
                                isWithicon
                                name="countryVal"
                                onChange={(e) => {
                                  setInvoiceData({
                                    ...invoiceData,
                                    country: e?.target?.value,
                                  });
                                  setError({ ...error, countryError: "" });
                                }}
                              />
                              {error.countryError && (
                                <p className="errorText mb-0">
                                  {error.countryError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("City", lan) +
                                " " +
                                t("OrganizationBracket", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 p-0  ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3"
                                placeholder={t("EnterCity", lan)}
                                ref={City}
                                defaultValue={invoiceData?.city}
                                onChange={() => {
                                  setError({ ...error, cityError: "" });
                                }}
                              />
                              {error.cityError && (
                                <p className="errorText mb-0">
                                  {error.cityError}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ) : (
                      // pay by me
                      <Fragment>
                        <div className="row m-0">
                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("NameOfStudent", lan)}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <input
                                type="text"
                                placeholder={t("NameOfStudent", lan)}
                                className="form-control input-profile px-2 py-3"
                                ref={NameOfStudent}
                                defaultValue={invoiceData?.studentName}
                                onChange={() => {
                                  setError({ ...error, nameError: "" });
                                }}
                              />
                              {error.nameError && (
                                <p className="errorText mb-0">
                                  {error.nameError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("ChooseDob", lan)}
                            </p>
                            <div className="mb-3 p-0 number ">
                              <input
                                type="date"
                                data-format="dd/MM/yyyy "
                                max={new Date().toISOString().split("T")[0]}
                                className="form-control input-profile px-2 py-3"
                                ref={dob}
                                defaultValue={invoiceData?.dob}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("EmailAddress", lan)}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3 f-16"
                                placeholder={t("EnterEmailAddress", lan)}
                                ref={emailAddress}
                                disabled
                                value={invoiceData?.email}
                                onChange={() => {
                                  setError({
                                    ...error,
                                    emailError: "",
                                  });
                                }}
                              />
                              {/* if this field is disabled so error doesn't matter  */}
                              {/* {error.emailError && (
                                <p className="errorText mb-0">
                                  {error.emailError}
                                </p>
                              )} */}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("Street", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 p-0  ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3"
                                placeholder={t("EnterStreet", lan)}
                                ref={StreetNumber}
                                defaultValue={invoiceData?.streetNumber}
                                onChange={() => {
                                  setError({ ...error, streetNoError: "" });
                                }}
                              />
                              {error.streetNoError && (
                                <p className="errorText mb-0">
                                  {error.streetNoError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0 align-self-end">
                            <p className="p-head mb-1 mt-4">
                              {t("Zip", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 p-0  ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3"
                                placeholder={t("EnterZip", lan)}
                                ref={Zip}
                                defaultValue={invoiceData?.zip}
                                onChange={() => {
                                  setError({ ...error, zipError: "" });
                                }}
                              />
                              {error.zipError && (
                                <p className="errorText mb-0">
                                  {error.zipError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("Country", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 ps-0 ">
                              <FilterSelectMenu
                                value={countryList}
                                placeholder={t("ChooseCountry", lan)}
                                isWithicon
                                name="countryVal"
                                onChange={(e) => {
                                  setInvoiceData({
                                    ...invoiceData,
                                    country: e?.target?.value,
                                  });
                                  setError({ ...error, countryError: "" });
                                }}
                              />
                              {error.countryError && (
                                <p className="errorText mb-0">
                                  {error.countryError}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 ps-0">
                            <p className="p-head mb-1 mt-4">
                              {t("City", lan)}
                              {"*"}
                            </p>
                            <div className="mb-3 p-0  ">
                              <input
                                type="text"
                                className="form-control input-profile px-2 py-3"
                                placeholder={t("EnterCity", lan)}
                                ref={City}
                                defaultValue={invoiceData?.city}
                                onChange={() => {
                                  setError({ ...error, cityError: "" });
                                }}
                              />
                              {error.cityError && (
                                <p className="errorText mb-0">
                                  {error.cityError}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    )}

                    <button
                      type="submit"
                      disabled={loderBtn}
                      className="btn btn-pay text-uppercase  mt-2"
                      onClick={() => onPayInvoice()}
                    >
                      {loderBtn ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        t("PayNow", lan)
                      )}
                    </button>

                    {/* btn pay  */}
                  </div>
                </>
              )}
            </div>

            <div className="col-lg-5 col-md-6 col-sm-12 col-12">
              <label className="f-18 mb-3" htmlFor="exampleInputEmail1">
                {t("OrderSummary", lan)}
              </label>

              <div className="card border-0  m-0 px-3 py-3">
                <div className="row m-0  align-items-center">
                  <div className="course-thumbnail me-1 col-sm-6 col-xs-12 px-0">
                    <img
                      src={
                        filtered?.event_image
                          ? `${filtered?.event_image}`
                          : placeholder
                      }
                      className="course-thumbnail-img"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = ErrorImage;
                      }}
                    />
                  </div>

                  <div className="col-sm-6 col-xs-12">
                    <p className="f-18 mb-2 text-img mb-0">
                      {filtered?.event_name}
                    </p>
                    {/* <p className="f-16 text-img mb-0">
                    {t("Price", lan)} :
                      <span className="text-green ms-2">
                        {filtered?.event_price <= 0
                          ? "Free"
                          : `SEK ${filtered?.event_price}`}
                      </span>
                    </p>
                    <p className="f-16 text-img mb-0">
                    {t("VatCharges", lan)}:
                      <span className="text-green ms-2">
                        {"SEK "} {charges || 0}
                      </span>
                    </p> */}
                    <p className="f-16 text-img mb-0">
                      {t("Total", lan)} :
                      {/* {filtered?.offer_price >0 ?
                        <Fragment>
                          <span className="text-green line ms-2">
                            {"SEK"} {total || 0}
                          </span>
                          <span className="textBlack ms-2">
                            {"SEK"} {filtered?.offer_price ? Number(filtered?.offer_price)+Number(charges) : total}
                          </span>
                        </Fragment>: */}
                      <span className="text-green ms-2">
                        {total || 0} {"SEK"}
                      </span>
                      <p className="vat-charge-text">
                        {"*" + t("IncludeVATCharges", lan)}
                      </p>
                      {/* } */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer isSmallFooter />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </div>
  );
};

export default EventCheckOut;
