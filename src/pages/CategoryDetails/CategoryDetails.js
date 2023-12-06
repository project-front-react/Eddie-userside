import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import BusinessBanner from "../../assets/images/business-banner.jpg";
import "./CategoryDetails.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import NewestCourse from "../../components/newestCourse/NewestCourse";
import Popup from "../../components/popup/popup";
import {
  getCategoryIdApi,
} from "../../services/eddiServices";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader/Loader";

const CategoryDetails = () => {
  const stateEddi = useSelector((state) => state?.Eddi);
  let lan = stateEddi?.language;
  const [categoryDetail, setCategoryDetail] = useState();
  const [relatedCourse, setRelatedCourse] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const dispatch = useDispatch();
  const params = useParams()

  useEffect(() => {
    window.scrollTo(0,0)
    coursesCall();
  }, [params]);
  const coursesCall = async () => {
    setIsLoader(true)
    await getCategoryIdApi(params?.id)
      .then((res) => {
        setIsLoader(false)
        if (res.status == "success") {
          const catDetails = res.data;
          if(lan === 'sw'){
            catDetails.category_name = catDetails?.category_name_sw||"";
            catDetails.category_overview = catDetails?.category_overview_sw||"";
            catDetails.enrollment_process_description = catDetails?.enrollment_process_description_sw||"";
            catDetails.enrollment_process_sw = catDetails?.enrollment_process_sw_sw||"";
            catDetails.key_highlights = catDetails?.key_highlights_sw||"";
            catDetails.key_highlights_description = catDetails?.key_highlights_description_sw||"";
            catDetails.step_1_description = catDetails?.step_1_description_sw||"";
            catDetails.step_1_text = catDetails?.step_1_text_sw||"";
            catDetails.step_2_description = catDetails?.step_2_description_sw||"";
            catDetails.step_2_text = catDetails?.step_2_text_sw||"";
            catDetails.step_3_description = catDetails?.step_3_description_sw||"";
            catDetails.step_3_text = catDetails?.step_3_text_sw||"";

          }
          console.log("details",catDetails);
          setCategoryDetail(res?.data)
          setRelatedCourse(res?.course)
        } 
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Header />
      <div className="CategoryDetails">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-md-12 px-0 banner-img"
              style={{
                backgroundImage:categoryDetail?.category_image  ? `url(${categoryDetail?.category_image}) `: `url(${BusinessBanner})` ,
              }}
            >
              <div className="container">
                <div className="row ">
                  <div className="pagename px-0">
                    <h1>{t(categoryDetail?.category_name,lan) || "-"}</h1>
                    {/* <Link to="/home">{t("BackToHome",lan)}</Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="catoverview">
          <div className="container">
            <h2>{categoryDetail?.category_overview || t("CategoryOverview",lan)} </h2>
            <h4>{categoryDetail?.key_highlights || t("KeyHighlights",lan)}</h4>
            <div className="unset-list"  dangerouslySetInnerHTML={{
                          __html: categoryDetail?.key_highlights_description ,
                        }}>
            </div>
            {/* <ul>
              <li>
                Experience a 1-Week Immersion Programme at the University Campus
                (Optional).
              </li>
              <li>Learn with Students from 15+ countries across the world.</li>
              <li>Pedagogy on Hands-on project based Learning.</li>
              <li>Advance your career with 360 degree Career Support.</li>
              <li>
                World Education Service recognized. Lets you move one step
                closer.
              </li>
              <li>Network with peers at Offline BaseCamps.</li>
              <li>Get 1:1 Mentorship from Industry Mentors.</li>
            </ul> */}
          </div>
        </div>

        {relatedCourse?.length>0 && <div className="become-suppliers">
          <div className="container">
            <div className="row align-items-center">
              <NewestCourse
                name={`${t(categoryDetail?.category_name,lan)} ${t("courses",lan)}`}
                data={relatedCourse} // This API need to create for Specific categary course. it should be without token/login
                link={relatedCourse?.length>4 ?t("VIEWALL", "en"):''}
                withCategory={true}
              />
            </div>
          </div>
        </div>}

        <div className="catoverview mb-5">
          <div className="container">
            <h2>{categoryDetail?.enrollment_process || t("EnrollmentProcess",lan)}</h2>
            <h5 className="unset-list" dangerouslySetInnerHTML={{
              __html:categoryDetail?.enrollment_process_description || ""
            }}>
            </h5>
            <div className="ProcessSteps row">
              <div className="col-lg-4 col-12">
                <div className="steps-details">
                  <h4>{categoryDetail?.step_1_text || t("Step1CreateAccount",lan)}</h4>
                  <p className="unset-list" dangerouslySetInnerHTML={{
                    __html:categoryDetail?.step_1_description || t("Step1CreateAccountDescrption",lan)
                  }}>
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <div className="steps-details">
                  <h4>{categoryDetail?.step_2_text || t("Step2CreateAccount",lan)}</h4>
                  <p className="unset-list" dangerouslySetInnerHTML={{
                    __html:categoryDetail?.step_2_description || t("Step2CreateAccountDescrption",lan)
                  }}>
                    
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <div className="steps-details">
                  <h4>{categoryDetail?.step_3_text || t("Step3CreateAccount",lan)}</h4>
                  <p className="unset-list" dangerouslySetInnerHTML={{
                    __html:categoryDetail?.step_3_description || t("Step2CreateAccountDescrption",lan)
                  }}> 
                    
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
        {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default CategoryDetails;
