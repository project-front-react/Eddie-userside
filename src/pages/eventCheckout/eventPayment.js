import React, { useState, useEffect, } from "react";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { eventPaymentApi, eventPaymentStatusApi, } from "../../services/eddiServices";
import success from "../../assets/images/ic-success.png"
import fail from "../../assets/images/ic-fail.svg"
import { useSelector } from "react-redux";
import Popup from "../../components/popup/popup";
import { useParams,useLocation } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import { useHistory } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { encrypt } from "../../utils/encrypt";



const EventPayment = (props) => {
  const search = useLocation().search;
  const isCorporate = (new URLSearchParams(search)?.get("is_corporate"));
    const [message, setMessage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [isFail, setIsFail] = useState(true);
    const [paymentErrorModal, setPaymentErrorModal] = useState("");
    const [paymentError , setPaymentError] = useState();
    const [cardBrand , setCardBrand] = useState()
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(localStorage.getItem('logedInEmail'));
    const stripe = useStripe();
    const elements = useElements();
    const state = useSelector((state)=>state?.Eddi);
    let lan=state?.language;
    const history = useHistory()
    let name = useParams()


    
    var filtered = state?.SelectedEvent;
    const price = filtered?.event_price <= 0 ? 0 : filtered?.event_price;
    const charges = (Number(price) * Number(state?.getVatCharges)) / 100;
    const total = Number(price) + Number(charges);
    // Handle real-time validation errors from the card Element.
    const handleChange = (event) => {
      if (event.error) {
        setError(event.error.message);
      } else {
        setError(null);
      }
    };

    const handleClosePopup = async() => {
        // window.location.reload();
        const body = document.querySelector("body");
        body.style.overflow = "auto"
        let status = isFail ? "Fail" :"Success";
        const price_event =filtered?.original_price || price;
        console.log("price_event",price_event, typeof price_event);
        let formData = new FormData()
        formData.append('status',status)
        formData.append("email_id", encrypt(email));
        formData.append("card_brand", cardBrand);
        formData.append("price",  encrypt(total.toString()));
        formData.append("event_name", encrypt(filtered?.event_name));
    formData.append("event_id", filtered?.uuid);
        formData.append("payment_mode", ("eddi"));
        // filtered[0]?.course_price
        setIsLoader(true)
        eventPaymentStatusApi(formData,isCorporate == '1').then((result)=>{
          console.log(">>>",result);
          setIsLoader(false)
        }).catch((e)=>{console.log(e); setIsLoader(false) })

          setMessage()
          setIsLoading(false)
          setPaymentErrorModal("");
          if(status == "Success") return history.push('/my-space')

      }
  
    // Handle form submission.
    const handleSubmit = async (event) => {
      event.preventDefault();
      const card = elements.getElement(CardElement);
      // setMessage()
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: card,
      });
  
      if (error) {
        setError(error?.response?.data);
      } else {
          console.log("paymentMethod",paymentMethod);
          setCardBrand(paymentMethod?.card?.brand)
        setIsLoading(true);
        const result = await stripe.createToken(card);
        var formData = new FormData();
        formData.append("email_id", encrypt(email));
        formData.append("card_brand", paymentMethod?.card?.brand);
        formData.append("payment_method_id", encrypt(paymentMethod.id));
        formData.append("token", result.token.id);
        formData.append("price", encrypt(total?.toString()));
        formData.append("event_name", encrypt(filtered?.event_name));

        // return
        setMessage("payment started...");
        eventPaymentApi(formData)
          .then((response) => {
            console.log("response",response.data);
            if(response?.data == "You already Enrolled"){
              console.log("here");
              setIsFail(true)
              return setPaymentErrorModal(t("OppsAlreadyEnrolled", lan))
            }
              
            setMessage("payment proccessing...");
  
            const clientSecret = response?.data?.payment_intent?.client_secret;
  
             const {paymentIntent , error} =  stripe.confirmCardPayment(
                      clientSecret ,{
                          payment_method:{
                              card:elements.getElement(CardElement)
                          }
                      }
                  ).then((res) =>{

                      if(res?.paymentIntent){
                        if(res?.paymentIntent?.status == "succeeded"){
                          setMessage("Congratulations ! ")
                          setIsFail(false)
                          setPaymentErrorModal(t("Congratulations", lan))
                        }else{
                          setIsFail(true)
                          setPaymentErrorModal(t("Failed", lan))

                        }
                        console.log("res calling",res?.paymentIntent)

                      }else if(res?.error?.code == "payment_intent_authentication_failure" ){
                        setPaymentErrorModal(t("AuthFailed", lan))
                        setIsFail(true)
                      }
                    //   else if(res?.error?.code == "payment_intent_unexpected_state"){
                    //     setPaymentErrorModal("Failed..")
                    //   }
                      else{
                      }

                  }).catch((error)=> {
                      console.log("error",error);
                    setPaymentErrorModal(t("Failed", lan))
                    setIsFail(true)
                      setMessage()})
  
  
            stripe
              .retrievePaymentIntent(clientSecret)
              .then(({ paymentIntent }) => {
                setIsLoading(false);
                switch (paymentIntent.status) {
                  case "succeeded":
                    setMessage("Payment succeeded!");
                    setPaymentErrorModal(t("Congratulations", lan))
                    setIsFail(false)
                    break;
                  case "processing":
                    setMessage("Your payment is processing.");
                    setIsFail(true)
                    setPaymentErrorModal(t("UnderProcess", lan))
                    break;
                  case "requires_payment_method":
                    setMessage(
                      "Failed!."
                    );
                    setIsFail(true)
                    setPaymentErrorModal(t("Failed", lan))
                    break;
                    case "requires_action":
                      setIsFail(true)
                      setMessage("Authuntication requires!")
                      // setPaymentErrorModal("Failed!")

                      break;
                  default:
                    setMessage("Something went wrong.");
                    setIsFail(true)
                    setPaymentErrorModal(t("Failed", lan))

                    break;
                }
              });
          })
          .catch((error) => {
            setIsFail(true)
               setMessage("Failed...")
               setPaymentErrorModal(t("Failed", lan))
               setIsLoading(false)
            console.log(error);
          });
      }
    };
    return (
        <>
      <form
        onSubmit={handleSubmit}
        className="stripe-form w-100  rounded"
      >

        <div className="form-row">
          <label htmlFor="card-element">{t("PayNow", lan)}</label>
  
          <CardElement
            id="card-element"
            className="form-control border-0 px-2 py-3 f-16"
            onChange={handleChange}
          />
          <div className="card-errors" role="alert">
            {error}
          </div>
        </div>
        <div className="text-center mt-3">
          <button
            hidden={isLoading}
            type="submit"
            className="btn btn-green "
          >
            {t("PayNow", lan)}
          </button>
          <button
            hidden={!isLoading}
            className="btn btn-green mt-3"
            type="button"
            disabled
          >
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
        </div>
  
        {message && <div className="text-center" id="payment-message">{message}</div>}

      </form>

      {paymentErrorModal !== "" &&
        <Popup show={paymentErrorModal !== "" ? true : false}  handleClose={handleClosePopup}>
          <div className="popup-header">
            <img className="img-responsive img-fluid img-status" src={isFail ? fail : success}></img>

          </div>
          <div className="popupinfo">

            <h2 className="my-3">{paymentErrorModal}</h2>
            {
              isFail ? 
              <p></p>
              :
              <p>{t("SuccessEnrolledEvent", lan)}</p>

            }
          </div>
          <div>
            <button
              onClick={handleClosePopup}
              className="btn btn-green text-uppercase w-100 mt-2">
              {t("Okbutton", lan)}
            </button>
          </div>
        </Popup>

      }
      {isLoader ? <Loader /> : ""}
      </>
    );
  };
  
export default EventPayment;  