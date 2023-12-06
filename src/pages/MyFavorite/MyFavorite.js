import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import placeholderImage from "../../assets/images/placeholder.svg";
import api from "../../api";
import ErrorImage from "../../assets/images/ErrorImage.svg";

import "./MyFavorite.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
// import courseimg1 from "../../assets/images/course-list-img.png";
import {
  favoriteCourses,
  updateFavoriteCourseApi,
} from "../../services/eddiServices";
import Sidebar from "../../components/sidebar/Sidebar";
import IcHeratFill from "../../assets/images/IcHeratFill.svg";

import NoData from "../../components/NoData/NoData";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedCourse } from "../../redux/actions";
import Loader from "../../components/Loader/Loader";
import { encrypt } from "../../utils/encrypt";

const MyFavorite = () => {
  const dispatch = useDispatch()
  const state = useSelector(state=>state?.Eddi)
  let lan=state?.language;
  const [isLoader, setIsLoader] = useState(false);
  const [items, setItems] = useState([]);
  const [paginationStartIndex, setPaginationStartIndex] = useState(1);
  const [checked, setchecked] = useState(true);
  const [paginationCourses, setPaginationCourses] = useState();

  useEffect(()=>{
    favoriteCoursesApi()
    window.scrollTo(0,0)
  },[])
 
  const favoriteCoursesApi = async () => {
    setIsLoader(true);
      await favoriteCourses().then((res)=>{
        if(res.status == 'success'){
          
          setItems(res.data);
          setIsLoader(false);
        }
      }).catch ((error)=> {
        console.log(error);
      }).finally(()=>setIsLoader(false))
  };

  const paginationPrev = () => {
    setPaginationStartIndex(paginationStartIndex - 8);
  };
  const paginationNext = () => {
    setPaginationStartIndex(paginationStartIndex + 8);
  };
  useEffect(() => {
    pagination();
    setPaginationStartIndex(1);
  }, [paginationStartIndex, items]);


  const pagination = () => {
    const paginationData = [];
    const actualIndex = paginationStartIndex - 1;
    items?.map((data, i) => {
      if (i >= actualIndex && i <= actualIndex + 8) {
        paginationData.push(data);
      }
    });
    setPaginationCourses(paginationData);
  };


  const handleOnChange = async(data) => {
    setchecked(!checked);

    try{
      let formData =new FormData()
      if(data?.course_type == 'Organization'){
        formData.append("org_course", encrypt(data.uuid));
      }else{
        formData.append("global_course", encrypt(data.uuid));
      }
      formData.append("is_favourite", false);
    const res= await updateFavoriteCourseApi(formData)
    if(res.message == 'success'){
      favoriteCoursesApi()
      
    }
    }catch(err){
      console.log(err);
    }
  
  };
 

  return (
    <div className="MyCourse">
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
                  <Link to={'/user-dashboard'} className="brd-link"> {t("Dashboard", lan)} </Link>|
                  <span className="brd-link text-green"> {t("FavoriteCourse", lan)} </span>
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
            {paginationCourses?.length > 0 ? (
              <div className="row mt-3">
                <div className="col-lg-12 col-12">
                  {paginationCourses.map((MyCourseList, index) => {
                    return (
                      <div className="course-list-block" key={index}>
                        <div className="course-thumbnail">
                          <img
                            src={
                              MyCourseList?.course_image
                                ? `${MyCourseList?.course_image}`
                                : placeholderImage
                            }
                            className="course-thumbnail-img"
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src=ErrorImage;
                            }}
                          />
                        </div>
                        <div className="list-content">
                          <div className="list-content-block">
                            <div>
                              <h3>{MyCourseList.course}</h3>
                              <h6
                                // style={{
                                //   color: `${MyCourseList.course_category?.color}`,
                                // }}
                              >
                                {t(MyCourseList.category,lan) ||'-'}
                              </h6>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="inst-image">
                                <img src={MyCourseList.supplier_organization?.organization_logo?`${MyCourseList?.supplier_organization?.organization_logo}`:placeholderImage} className="me-1" />
                              </div>

                              <div className="inst-information">
                                <h6> {MyCourseList.supplier_name ||''} </h6>
                                {/* <span>
                                  From{" "}
                                  {MyCourseList.supplier_organization?.organizational_name}
                                </span> */}
                              </div>
                            </div>
                          </div>
                          <div className="btn-status-area">
                            <div>
                              <span className="course-favorite">
                                <img src={IcHeratFill} />
                                <input
                                  type="checkbox"
                                  id="topping"
                                  name="topping"
                                  value="Paneer"
                                  checked={checked}
                                  onChange={() =>
                                    handleOnChange(MyCourseList)
                                  }
                                />
                              </span>
                            </div>
                            <div>
                              <Link to={`/view-course-details?is_corporate=${MyCourseList?.course_type == 'Organization'}`} onClick={()=> dispatch(
                                      getSelectedCourse(MyCourseList?.uuid)
                                    )} className="btn btn-green mt-3">
                                {t("VIEW", lan)}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <NoData />
            )}
            <div className="mt-3 text-end">
              {<div className="row">
                {items?.length > 8 && (
                  <CustomPagination
                    startIndex={paginationStartIndex}
                    endIndex={
                      paginationStartIndex + 7 > items?.length
                        ? items?.length
                        : paginationStartIndex + 7
                    }
                    totalData={items?.length}
                    onPrev={paginationPrev}
                    onNext={paginationNext}
                  />
                )}
              </div>}
            </div>
          </div>
        </div>

        <Footer isSmallFooter />
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default MyFavorite;
