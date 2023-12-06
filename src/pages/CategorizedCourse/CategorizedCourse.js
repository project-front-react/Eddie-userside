import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./CategorizedCourse.scss";
import { getTranslatedText as t } from "../../translater/index";

import IcSearch from "../../assets/images/IcSearch.svg";
import Sidebar from "../../components/sidebar/Sidebar";
import FilterSelect from "../../components/FilterSelectMenu/FilterSelectMenu";
import InputText from "../../components/inputText/inputText";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  getCorporateCategories,
  getCorporateCourse,
} from "../../services/eddiServices";
import Loader from "../../components/Loader/Loader";
import FilteredCourse from "../../components/FilteredCourse/FilteredCourse";

const dummyCategory = [
  {
    name: "HR",
    color: "#76918C",
  },
  {
    name: "IT",
    color: "#1A4840",
  },
  {
    name: "Finance",
    color: "#A69396",
  },
  {
    name: "Operations",
    color: "#876C6F",
  },
  {
    name: "Onboarding",
    color: "#3E8080",
  },
  {
    name: "HSE",
    color: "#481A20",
  },
];

const CategorizedCourse = (props) => {
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const state = useSelector((state) => state?.Eddi);

  let lan = state?.language;
  const history = useHistory();
  const emailId = localStorage.getItem("logedInEmail");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [AllCourses, setAllCourses] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [paginationCourses, setPaginationCourses] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [paginationStartIndex, setPaginationStartIndex] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(id);
  const getCategoryCourse = () => {
    setIsLoader(true);
    getCorporateCourse()
      .then((res) => {
        if (res?.status == "success") {
          setAllCourses(res.data);
          searchFilter();
        } else {
          console.log("res", res);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoader(false));
  };

  const categoriesCall = async () => {
    setIsLoader(true);
    await getCorporateCategories()
      .then((res) => {
        // setIsLoader(false)
        if (res.status == "success") {
          setCategoriesData(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoader(false));
  };

  //Searched Data
  const onViewClick = (cat) => {
    setSelectedCategory(cat.id);
    window.scrollTo({
      top: 1000,
      behavior: "smooth",
    });
  };

  const searchFilter = () => {
    var searchData = [];
    let filteredData = [];
    if (selectedCategory) {
      filteredData = AllCourses.filter(
        (course) => course.course_category.id == selectedCategory
      );
    } else {
      filteredData = AllCourses;
    }
    if (searchText && searchText.trim() !== "") {
      searchData = filteredData.filter(
        (course) =>
          course?.course_name
            ?.toLowerCase()
            .includes(searchText?.toLowerCase()) ||
          course?.course_category?.category_name
            ?.toLowerCase()
            ?.includes(searchText?.toLowerCase()) ||
          course?.sub_area?.toLowerCase().includes(searchText?.toLowerCase()) ||
          course?.additional_information
            ?.replaceAll(/<(.|\n)*?>/g, "")
            .toLowerCase()
            .includes(searchText?.toLowerCase())
      );
    } else {
      searchData = filteredData;
    }

    setFilteredCourses(searchData);
  };

  useEffect(() => {
    return searchFilter();
  }, [searchText, selectedCategory, AllCourses]);

  //Pagination

  const paginationPrev = () => {
    setPaginationStartIndex(paginationStartIndex - 12);
  };
  const paginationNext = () => {
    setPaginationStartIndex(paginationStartIndex + 12);
  };

  const pagination = () => {
    const paginationData = [];
    const actualIndex = paginationStartIndex - 1;

    filteredCourses?.map((data, i) => {
      if (i >= actualIndex && i <= actualIndex + 12) {
        paginationData.push(data);
      }
    });
    setPaginationCourses(paginationData);
  };

  useEffect(() => {
    pagination();
  }, [paginationStartIndex, filteredCourses]);

  useEffect(() => {
    getCategoryCourse();
    categoriesCall();
  }, []);

  return (
    <div className="ViewAllCourse">
      <Header disableProfile={true} hidePartial={true} />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-main-content">
          <div className="right-content">
            <div className="container ">
              <div className="courses-section ">
                <div className="d-flex justify-content-between mb-4 align-items-center">
                  <h2 className="text-start">{t("OurCourseCategory", lan)}</h2>
                  <span
                    className="cursor-pointer d-sm-block d-none"
                    onClick={() => {
                      history.goBack();
                    }}
                  >
                    {t("Back", lan)}
                  </span>
                </div>
                {/* <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="btn-green mb-4"
                >
                  {t("ViewAllCourses", lan)}
                </button> */}
                <div className="course-category">
                  <div className="course-category-wrap">
                    {categoriesData?.map((cat, index) => {
                      return (
                        <div className="card-wrap" key={index}>
                          <div
                            className={
                              selectedCategory == cat.id
                                ? "course-box-highligthed"
                                : selectedCategory === undefined
                                ? "course-box-highligthed"
                                : "course-box-disble"
                            }
                            style={{
                              backgroundColor: dummyCategory[index].color,
                            }}
                          >
                            <div className="course-block align-items-center">
                              <h1 className="f-30">
                                {cat[`category_${lan}`] || ""}
                              </h1>
                              <p>{cat[`category_detail_${lan}`] || ""}</p>
                              <button
                                onClick={() => onViewClick(cat)}
                                className="btn btn-view"
                              >
                                {t("OurCourses", lan)}
                              </button>{" "}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="search-section flex-sm-row flex-column">
                <div className="search-block">
                  <InputText
                    placeholder={t("searchby", lan)}
                    value={searchText}
                    list="CourseName"
                    onChange={(e) => {
                      setsearchText(e.target.value);
                    }}
                  />

                  <span>
                    <img src={IcSearch} />
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="btn-green mx-2"
                >
                  {t("ViewAllCourses", lan)}
                </button>
              </div>

              <div className="shwing-course">
                <div className="section-title flex-sm-row flex-column">
                  <h4>
                    {t("ShowingCourses", lan)}{" "}
                    <span>
                      {selectedCategory
                        ? `${
                            categoriesData.find(
                              (ff) => ff.id == selectedCategory
                            )?.category_en
                          }`
                        : `${t("AllCategory", lan)}`}{" "}
                    </span>
                  </h4>
                  <div className="course-founded">
                    {filteredCourses?.length} {t("CoursesFound", lan)}
                  </div>
                </div>
                {paginationCourses?.length > 0 ? (
                  <>
                    <FilteredCourse
                      isCorporate={true}
                      data={paginationCourses?.slice(0, 12)}
                    />
                    {/* <NewestCourse data={paginationCourses?.slice(0, 4) } arrows= {false} />
                    <NewestCourse data={paginationCourses?.slice(4, 8)} arrows= {false}/>
                    <NewestCourse data={paginationCourses?.slice(8, 12)} arrows= {false}/> */}
                  </>
                ) : (
                  <h3>{t("No_RESULT_FOUND", lan)}</h3>
                )}
                <div className="mt-3 text-end">
                  {filteredCourses?.length > 12 && (
                    <div className="row">
                      {paginationCourses?.length > 0 && (
                        <CustomPagination
                          startIndex={paginationStartIndex}
                          endIndex={
                            paginationStartIndex + 11 > filteredCourses?.length
                              ? filteredCourses?.length
                              : paginationStartIndex + 11
                          }
                          totalData={filteredCourses?.length}
                          onPrev={paginationPrev}
                          onNext={paginationNext}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isLoader ? <Loader /> : ""}
          <Footer isSmallFooter />
        </div>
      </div>
    </div>
  );
};

export default CategorizedCourse;
