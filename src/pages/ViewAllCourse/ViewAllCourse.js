import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./ViewAllCourse.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import SpaceIc from "../../assets/images/space.svg";
import HeartIc from "../../assets/images/heart.svg";
import IcMyCourse from "../../assets/images/IcMyCourse.svg";
import MyOrganization from "../../assets/images/university-svgrepo-com 1.svg";
import Icgraduate from "../../assets/images/user-graduate.svg";
import ClearFilter from "../../assets/images/filter.svg";
import DisImg from "../../assets/images/DisImg.png";
import IcSearch from "../../assets/images/IcSearch.svg";
import ICfilter from "../../assets/images/filtericon.svg";
import Sidebar from "../../components/sidebar/Sidebar";
import NewestCourse from "../../components/newestCourse/NewestCourse";
import FilterSelect from "../../components/FilterSelectMenu/FilterSelectMenu";
import InputText from "../../components/inputText/inputText";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  getAllCourses,
  isEddiSuggestion,
  orgCourses,
  searchCourseText,
} from "../../redux/actions";
import { getCoursesApi, getSubCatListById } from "../../services/eddiServices";
import Loader from "../../components/Loader/Loader";
import FilteredCourse from "../../components/FilteredCourse/FilteredCourse";

const ViewAllCourse = (props) => {
  const search = useLocation().search;
  const category_name = new URLSearchParams(search).get("category_name");
  const subcategory_name = new URLSearchParams(search).get("subcategory_name");
  const state = useSelector((state) => state?.Eddi);

  let lan = state?.language;
  const history = useHistory();
  const dispatch = useDispatch();
  const emailId = localStorage.getItem("logedInEmail");
  const [allCategory, setAllCategory] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState(state?.AllCourses);
  const [searchResult, setsearchResult] = useState(state?.AllCourses);
  const [searchText, setsearchText] = useState(state?.SearchCourseText);
  const [paginationCourses, setPaginationCourses] = useState();
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory_name??'');
  const [allSubcategory, setAllSubcategory] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [paginationStartIndex, setPaginationStartIndex] = useState(1);
  const [allOrganization, setAllOrganization] = useState([]);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category_name??'');
  const [selectedCourseLevel, setSelectedCourseLevel] = useState("");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("");
  const [selectedOrgFilter, setSelectedOrgFilter] = useState("");

  useMemo(() => {
    if (localStorage.getItem("logedInUser") != "true") {
      history.push("/login");
    }
  }, []);
console.log("selectedCategory",selectedCategory);
  const coursesCall = async () => {
    getCoursesApi()
      .then((res) => {
        // setIsLoader(false)
        if (res.status == "success") {
          const profileBased = res?.data?.map((cc) => {
            cc["suggestive"] = true;
            return cc;
          });
          let combineData = [...profileBased, ...res?.all_data];

          dispatch(getAllCourses(combineData));
          // setFilteredCourses(combineData)
          dispatch(orgCourses(res?.org_data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



  
  useEffect(() => {
    let organization = [];
    state?.orgCourses?.map((org) => {
      const users = org?.target_users?.split(",");
      const userFiltered = users?.filter((uss) => uss == emailId);
      //if organization name already in array i will skip it
      if (userFiltered?.length > 0) {
        organization.push(org?.supplier_organization?.organizational_name);
      }
    });

    const uniqueArray = Array.from(new Set(organization));
    setAllOrganization(uniqueArray);
  }, [state?.AllCourses]);
  useEffect(() => {
    let categories = [];
    state?.AllCategories?.map((cat) => {
      categories?.push(cat?.category_name);
    });
    setAllCategory(categories);
  }, [state?.AllCategories]);
  //Searched Data

  const searchFilter = () => {
    var searchData = 
    state?.AllCourses.filter(
      (course) =>
        course?.course_name
          ?.toLowerCase()
          .includes(searchText?.toLowerCase()) ||
        course?.course_category?.category_name
          ?.toLowerCase()
          ?.includes(searchText?.toLowerCase()) ||
        course?.course_subcategory?.subcategory_name
          ?.toLowerCase()
          ?.includes(searchText?.toLowerCase()) ||
        course?.sub_area?.toLowerCase().includes(searchText?.toLowerCase()) ||
        course?.additional_information
          ?.replaceAll(/<(.|\n)*?>/g, "")
          .toLowerCase()
          .includes(searchText?.toLowerCase())
    );
    setsearchResult(searchData);
  };

  useEffect(() => {
    let filtered = state?.AllCategories?.filter(
      (cat) => cat?.category_name === selectedCategory
    );
    // console.log("state",filtered);
    if (filtered?.length > 0) {
      const uuid = filtered[0]?.uuid;
      setIsLoader(true);
      getSubCatListById(uuid)
        .then((result) => {
          setIsLoader(false);
          if (result?.status == "success") {
            const subCat = [];
            result.data.map((sub) => {
              subCat.push(sub?.subcategory_name);
            });
            setAllSubcategory(subCat);
          }
        })
        .catch((e) => {
          console.log(e);
          setIsLoader(false);
        });
    } else {
      setAllSubcategory();
    }
  }, [selectedCategory]);

  useEffect(() => {
    searchFilter();
  }, [searchText]);

  function courseComparisonbyNewestDate(a, b) {
    const date1 = new Date(a?.created_date_time);
    const date2 = new Date(b?.created_date_time);

    return date2 - date1;
  }
  function courseComparisonbyOldestDate(a, b) {
    const date1 = new Date(a?.created_date_time);
    const date2 = new Date(b?.created_date_time);
    return date1 - date2;
  }

  //Filter Data
  const filterCourses = () => {
    let searchData = [];
    let eddiSuggestedCourses = [];
    let filteredbyCategory = [];
    let filteredbySubCategory = [];
    let filteredbyCourse = [];
    let filteredbyTime = [];
    let filteredbyPrice = [];
    let filteredOrg = [];

    if (searchText != "") {
      state?.AllCourses?.map((course) => {
        if (
          course?.course_name
            ?.toLowerCase()
            .includes(searchText?.toLowerCase()) ||
          course?.course_category?.category_name
            ?.toLowerCase()
            ?.includes(searchText?.toLowerCase()) ||
          course?.course_subcategory?.subcategory_name
            ?.toLowerCase()
            ?.includes(searchText?.toLowerCase()) ||
          course?.sub_area?.toLowerCase().includes(searchText?.toLowerCase()) ||
          course?.additional_information
            ?.replaceAll(/<(.|\n)*?>/g, "")
            .toLowerCase()
            .includes(searchText?.toLowerCase())
        ) {
          searchData.push(course);
        }
      });
    } else {
      // searchData = state?.AllCourses;
      let suggestiveCourse = [];
      if (state?.AllCourses?.length > 0) {
        state?.AllCourses?.map((item) => {
          if (item?.suggestive === true) {
            suggestiveCourse.push(item);
          }
        });
        state?.AllCourses?.map((item) => {
          if (!item?.suggestive) {
            suggestiveCourse.push(item);
          }
        });
        searchData = [...suggestiveCourse];
      }
    }

    if (state?.IsEddiSuggestion == true) {
      searchData?.map((course) => {
        if (course?.suggestive === true) {
          eddiSuggestedCourses.push(course);
        }
      });
    } else {
      eddiSuggestedCourses = searchData;
    }
    // filtere by category

    if (selectedCategory != "") {
      eddiSuggestedCourses?.map((course) => {
        if (selectedCategory == course?.course_category?.category_name) {
          filteredbyCategory.push(course);
        }
      });
    } else {
      filteredbyCategory = eddiSuggestedCourses;
    }


    //filter by sub category
    if (selectedSubcategory != "" && selectedSubcategory) {
      filteredbyCategory?.map((course) => {
        if (
          selectedSubcategory == course?.course_subcategory?.subcategory_name
        ) {
          filteredbySubCategory.push(course);
        }
      });
    } else {
      filteredbySubCategory = filteredbyCategory;
    }

    // console.log(filteredbyCategory);
    if (selectedCourseLevel != "") {
      filteredbySubCategory?.map((course) => {
        if (selectedCourseLevel === course?.course_level?.level_name) {
          filteredbyCourse.push(course);
        }
      });
    } else {
      filteredbyCourse = filteredbySubCategory;
    }

    // console.log(filteredbyCourse);

    if (selectedPriceFilter != "") {
      filteredbyCourse?.map((course) => {
        if (selectedPriceFilter == course?.fee_type?.fee_type_name) {
          filteredbyPrice.push(course);
        }
      });
    } else {
      filteredbyPrice = filteredbyCourse;
    }

    //org filter
    if (selectedOrgFilter != "") {
      state?.orgCourses?.map((org) => {
        if (
          org?.supplier_organization?.organizational_name == selectedOrgFilter
        ) {
          filteredOrg?.push(org);
        }
      });
    } else {
      filteredOrg = filteredbyPrice;
    }
    if (selectedTimeFilter && selectedTimeFilter != "") {
      if (selectedTimeFilter === "Newest") {
        filteredbyTime = filteredOrg?.sort(courseComparisonbyNewestDate);
      } else {
        filteredbyTime = filteredOrg?.sort(courseComparisonbyOldestDate);
      }
    } else {
      filteredbyTime = filteredOrg;
    }
    setFilteredCourses(filteredbyTime);
  };
  useMemo(()=>{

    filterCourses()
  },[state?.AllCourses])

  useEffect(() => {
    // history.push({
    //   pathname: "/view-all-courses",
    //   state: {
    //     cat: selectedCategory,
    //   },
    //   //  `?cat=${selectedCategory}`,
    // });
    filterCourses();
    setPaginationStartIndex(1);
  }, [
    searchText,
    state?.IsEddiSuggestion,
    selectedCategory,
    selectedCourseLevel,
    selectedTimeFilter,
    selectedPriceFilter,
    selectedSubcategory,
  ]);

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
console.log("pagifilter",filteredCourses);
    filteredCourses?.map((data, i) => {
      if (i >= actualIndex && i <= actualIndex + 12) {
        paginationData.push(data);
      }
    });
    setPaginationCourses(paginationData);
  };

  const filterSuggestiveCourse = () => {
    let suggestiveCourse = [];
    if (filteredCourses?.length > 0) {
      filteredCourses?.map((item) => {
        if (item?.suggestive === true) {
          suggestiveCourse.push(item);
        }
      });

      filteredCourses?.map((item) => {
        if (!item?.suggestive) {
          suggestiveCourse.push(item);
        }
      });
      setFilteredCourses(suggestiveCourse);
    }
  };
  useEffect(() => {
    pagination();
  }, [paginationStartIndex, filteredCourses, selectedTimeFilter]);

  useEffect(() => {
    // window.scrollTo(0, 0);
    coursesCall();
  }, []);

  const ClearFilterHandler = () => {
    setSelectedTimeFilter("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCourseLevel("");
    setSelectedPriceFilter("");
    dispatch(searchCourseText(""));
    setsearchText("");
  };
  return (
    <div className="ViewAllCourse">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-main-content">
          <div className="right-content">
            <div className="container ">
              <div className="row">
                <h2 className="mb-4">
                  {t("Welcome", lan)}
                  {state?.personalData?.first_name?.charAt(0)?.toUpperCase()}
                  {state?.personalData?.first_name?.slice(1)}
                </h2>
              </div>

              <div className="discover-section">
                <div className="row">
                  <div className="col-lg-9 col-12">
                    <h2>
                      {t("DiscoverCourses", lan)}{" "}
                      <span>{t("PopularArea", lan)} </span>
                    </h2>
                    <h5>{t("SelectCourse", lan)}</h5>
                  </div>
                  <div className="">
                    <div className="search-block">
                      <InputText
                        placeholder={t("searchby", lan)}
                        value={searchText}
                        list="CourseName"
                        onChange={(e) => {
                          setsearchText(e.target.value);
                        }}
                        onKeyDown={(event) => {
                          if (event.keyCode === 13) {
                            dispatch(searchCourseText(searchText));
                            setSelectedTimeFilter("");
                            setSelectedCategory("");
                            setSelectedSubcategory("");
                            setSelectedCourseLevel("");
                            setSelectedPriceFilter("");
                            dispatch(isEddiSuggestion(false));
                          }
                        }}
                      />

                      {/* <input list="CourseName" onChange={(e)=>{setsearchText(e.target.value)}}  
                    onKeyDown={(event)=>{
                      if (event.keyCode === 13) {
                        dispatch(searchCourseText(searchText))
                      }}}/> */}
                      {searchResult && (
                        <datalist id="CourseName">
                          {searchResult?.map((course, index) => {
                            return (
                              index < 8 && (
                                <option
                                  key={index}
                                  value={course?.course_name}
                                />
                              )
                            );
                          })}
                        </datalist>
                      )}
                      <span>
                        <img
                          src={IcSearch}
                          onClick={() => {
                            dispatch(searchCourseText(searchText));
                          }}
                        />
                      </span>
                    </div>

                    <div className="quick-buttons">
                      <div className="right-data">
                        <div className="quickButton mb-1">
                          <Link className="" to="/my-space">
                            <span className="bx-icon">
                              <img src={SpaceIc} />
                            </span>
                            <span>{t("MySpace", lan)}</span>
                          </Link>
                        </div>

                        <div className="quickButton">
                          <Link className="" to="/my-favorite">
                            <span className="bx-icon">
                              <img src={HeartIc} />
                            </span>
                            <span>{t("Favorite", lan)}</span>
                          </Link>
                        </div>
                      </div>
                      <div className="left-data">
                        <div className="quickButton mb-1">
                          <Link
                            className=""
                            onClick={() => {
                              dispatch(
                                isEddiSuggestion(!state?.IsEddiSuggestion)
                              );
                              dispatch(searchCourseText(""));
                              setSelectedTimeFilter("");
                              setSelectedCategory("");
                              setSelectedSubcategory("");
                              setSelectedCourseLevel("");
                              setSelectedPriceFilter("");
                              setsearchText("");
                            }}
                          >
                            <span className="bx-icon">
                              <img
                                src={Icgraduate}
                                style={
                                  state?.IsEddiSuggestion
                                    ? { filter: "brightness(0.8)" }
                                    : { filter: "unset" }
                                }
                              />
                            </span>
                            <span
                              style={
                                state?.IsEddiSuggestion
                                  ? { textDecoration: "underline" }
                                  : { textDecoration: "unset" }
                              }
                            >
                              {t("EddiSuggestion", lan)}
                            </span>
                          </Link>
                        </div>

                        {state?.UserDetail?.is_corporate && (
                          <div className="quickButton">
                            <Link
                              to={
                                "/corporate-user-dashboard/categorized-course?id="
                              }
                            >
                              <span className="bx-icon">
                                <img src={MyOrganization} />
                              </span>
                              <span>{t("MyOrganization", lan)}</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-12 dis-img">
                    <img src={DisImg} className="w-100" />
                  </div>
                </div>
              </div>

              <div className="cate-filter">
                <div className="row">
                  <div className="col-lg-12 col-md-12 d-flex flex-wrap gap-lg-2">
                    <div className="col-lg-3 col-md-5 col-12 ">
                      <FilterSelect
                        value={["Newest", "Oldest", ]}
                        placeholder=""
                        selected={selectedTimeFilter}
                        filterIcon={ICfilter}
                        onChange={(e) => {
                          setSelectedTimeFilter(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3 col-md-5 col-12 ">
                      <FilterSelect
                        value={allCategory}
                        isWithicon
                        placeholder={t("CourseCategory", lan)}
                        selected={selectedCategory}
                        onChange={(e) => {
                          setSelectedSubcategory();
                          setSelectedCategory(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-3 col-md-5 col-12 ">
                      <FilterSelect
                        value={allSubcategory}
                        isWithicon
                        placeholder={t("CourseSubcategory", lan)}
                        selected={selectedSubcategory}
                        onChange={(e) => {
                          setSelectedSubcategory(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-3 col-md-5 col-12 ">
                      <FilterSelect
                        value={[
                          "Beginner",
                          "Intermediate",
                          "Advance",
                        ]}
                        isWithicon
                        placeholder={t("Difficultylevel", lan)}
                        selected={selectedCourseLevel}
                        onChange={(e) => {
                          setSelectedCourseLevel(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-3 col-md-5 col-12 ">
                      <FilterSelect
                        value={["Paid","Free"]}
                        placeholder={t("FilterBy", lan)}
                        isWithicon
                        selected={selectedPriceFilter}
                        onChange={(e) => {
                          setSelectedPriceFilter(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-3 col-md-5 col-12 ">
                      <div className="reset-filter-text">
                        {/* <a>Reset Filter</a> */}
                        <img width="25px" src={ClearFilter} />
                        <Link
                          onClick={() => {
                            ClearFilterHandler();
                          }}
                          className="brd-link"
                        >
                          {t("ClearFilters", lan)}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shwing-course">
                <div className="section-title">
                  <h4>
                    {t("ShowingCourses", lan)}{" "}
                    <span>
                      {selectedCategory != ""
                        ? `${selectedCategory} category`
                        : `${t("AllCategory", lan)}`}{" "}
                    </span>
                  </h4>
                  <div className="course-founded">
                    {filteredCourses?.length} {t("CoursesFound", lan)}
                  </div>
                </div>
                {paginationCourses?.length > 0 ? (
                  <>
                    <FilteredCourse isCorporate={false} data={paginationCourses?.slice(0, 12)} />
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

export default ViewAllCourse;
