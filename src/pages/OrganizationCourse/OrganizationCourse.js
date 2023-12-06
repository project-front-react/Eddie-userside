import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./OrganizationCourse.scss";
import { Link } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import SpaceIc from "../../assets/images/space.svg";
import HeartIc from "../../assets/images/heart.svg";
import IcMyCourse from "../../assets/images/IcMyCourse.svg";
import AllCourse from "../../assets/images/Vector.svg";
import ClearFilter from "../../assets/images/filter.svg";
import Icgraduate from "../../assets/images/user-graduate.svg";
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
  isEddiSuggestion,
  searchCourseText,
  searchOrgCourseText,
} from "../../redux/actions";
import { getSubCatListById } from "../../services/eddiServices";
import Loader from "../../components/Loader/Loader";
import FilteredCourse from "../../components/FilteredCourse/FilteredCourse";

const OrganizationCourse = (props) => {
  const search = useLocation().search;
  // const cat = new URLSearchParams(search).get("cat");
  const state = useSelector((state) => state?.Eddi);

  let lan = state?.language;
  const history = useHistory();
  const cat = history.location.state?.cat || ""
  const dispatch = useDispatch();
  const emailId = localStorage.getItem("logedInEmail");
  const [allCategory, setAllCategory] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState(state?.orgCourses);
  const [searchResult, setsearchResult] = useState(state?.orgCourses);
  const [searchText, setsearchText] = useState(state?.SearchOrgCourseText);
  const [paginationCourses, setPaginationCourses] = useState();
  const [selectedSubcategory, setSelectedSubcategory] = useState();
  const [allSubcategory, setAllSubcategory] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [paginationStartIndex, setPaginationStartIndex] = useState(1);
  const [allOrganization, setAllOrganization] = useState([]);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Newest");
  const [selectedCategory, setSelectedCategory] = useState(
    cat !== "" && cat != "null" ? cat : ""
  );
  const [selectedCourseLevel, setSelectedCourseLevel] = useState("");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("");
  const [selectedOrgFilter, setSelectedOrgFilter] = useState("");
  useMemo(() => {
    if (localStorage.getItem("logedInUser") != "true") {
      history.push("/login");
    }
  }, []);

  //   useEffect(() => {
  //     let organization = [];
  //     state?.orgCourses?.map((org) => {
  //       const users = org?.target_users?.split(",");
  //       const userFiltered = users?.filter((uss) => uss == emailId);
  //       //if organization name already in array i will skip it
  //       if (userFiltered?.length > 0) {
  //         organization.push(org?.supplier_organization?.organizational_name);
  //       }
  //     });
  //     const uniqueArray = Array.from(new Set(organization));
  //     setAllOrganization(uniqueArray);
  //   }, [state?.AllCourses]);

  useEffect(() => {
    let categories = [];
    state?.AllCategories?.map((cat) => {
      categories?.push(cat?.category_name);
    });
    setAllCategory(categories);
  }, [state?.AllCategories]);
  //Searched Data

  const searchFilter = () => {
    var searchData = [];
    console.log("state?.orgCourses", state?.orgCourses);
    state?.orgCourses?.filter(
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
      )
      .map((crs) => {
        searchData.push(crs);
      });
    setsearchResult(searchData);
    console.log("searchData", searchData);
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

    if (state?.SearchOrgCourseText != "") {
      state?.orgCourses?.map((course) => {
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
      searchData = state?.orgCourses;
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
        if (selectedCourseLevel === t(course?.course_level?.level_name, lan)) {
          filteredbyCourse.push(course);
        }
      });
    } else {
      filteredbyCourse = filteredbySubCategory;
    }

    // console.log(filteredbyCourse);

    if (selectedPriceFilter != "") {
      filteredbyCourse?.map((course) => {
        if (selectedPriceFilter == t(course?.fee_type?.fee_type_name, lan)) {
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

    if (selectedTimeFilter === t("Newest", lan)) {
      filteredbyTime = filteredOrg?.sort(courseComparisonbyNewestDate);
    } else {
      filteredbyTime = filteredOrg?.sort(courseComparisonbyOldestDate);
    }

    setFilteredCourses(filteredbyTime);
  };

  useEffect(() => {
    //   history.push({
    //     pathname: "/view-all-courses",
    //     search: `?cat=${selectedCategory}`,
    //   });
    filterCourses();
    setPaginationStartIndex(1);
  }, [
    state?.SearchOrgCourseText,
    state?.IsEddiSuggestion,
    selectedCategory,
    selectedCourseLevel,
    selectedTimeFilter,
    selectedPriceFilter,
    selectedOrgFilter,
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
    filteredCourses?.map((data, i) => {
      if (i >= actualIndex && i <= actualIndex + 12) {
        paginationData.push(data);
      }
    });
    setPaginationCourses(paginationData);
  };

  useEffect(() => {
    pagination();
  }, [paginationStartIndex, filteredCourses, selectedTimeFilter]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const ClearFilterHandler = () => {
    setSelectedTimeFilter("Newest");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCourseLevel("");
    setSelectedPriceFilter("");
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
                <h2 className="mb-4">{t("OrganizationCourse", lan)}</h2>
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
                            dispatch(searchOrgCourseText(searchText));
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
                            dispatch(searchOrgCourseText(searchText));
                          }}
                        />
                      </span>
                    </div>

                    <div className="quick-buttons">
                      <div className="quickButton">
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

                      <div className="quickButton">
                        <Link className="" to="/view-all-courses?cat=">
                          <span className="bx-icon">
                            <img src={AllCourse} />
                          </span>
                          <span>{t("AllCourse", lan)}</span>
                        </Link>
                      </div>

                      {/* <div className="quickButton">
                        <Link
                          className=""
                          onClick={() => {
                            dispatch(
                              isEddiSuggestion(!state?.IsEddiSuggestion)
                            );
                          }}
                        >
                          <span className="bx-icon">
                            <img
                              src={Icgraduate}
                              style={
                                state?.IsEddiSuggestion
                                  ? { filter: "brightness(0.5)" }
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
                      </div> */}
                    </div>
                  </div>
                  <div className="col-lg-3 col-12 dis-img">
                    <img src={DisImg} className="w-100" />
                  </div>
                </div>
              </div>

              <div className="cate-filter">
                <div className="row">
                  <div className="col-lg-12 col-md-12 d-flex flex-wrap">
                    <div className="col-lg-3 col-md-5 col-12 me-2">
                      <FilterSelect
                        value={[t("Newest", lan), t("Oldest", lan)]}
                        placeholder=""
                        selected={selectedTimeFilter}
                        filterIcon={ICfilter}
                        onChange={(e) => {
                          setSelectedTimeFilter(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3 col-md-5 col-12 me-2">
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

                    <div className="col-lg-3 col-md-5 col-12 me-2">
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

                    <div className="col-lg-3 col-md-5 col-12 me-2">
                      <FilterSelect
                        value={[
                          t("Beginner", lan),
                          t("Intermediate", lan),
                          t("Advance", lan),
                        ]}
                        isWithicon
                        placeholder={t("Difficultylevel", lan)}
                        selected={selectedCourseLevel}
                        onChange={(e) => {
                          setSelectedCourseLevel(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-3 col-md-5 col-12 me-2">
                      <FilterSelect
                        value={[t("Paid", lan), t("Free", lan)]}
                        placeholder={t("FilterBy", lan)}
                        isWithicon
                        selected={selectedPriceFilter}
                        onChange={(e) => {
                          setSelectedPriceFilter(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3 col-md-5 col-12 me-2">
                      <div className="reset-filter-text">
                        {/* <a>Reset Filter</a> */}
                        <img width="25px" src={ClearFilter} />
                        <Link
                          className="brd-link"
                          onClick={() => {
                            ClearFilterHandler();
                          }}
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
                        : `${t("OrganizationCategory", lan)}`}{" "}
                    </span>
                  </h4>
                  <div className="course-founded">
                    {filteredCourses?.length} {t("CoursesFound", lan)}
                  </div>
                </div>
                {paginationCourses?.length > 0 ? (
                  <>
                    <FilteredCourse data={paginationCourses?.slice(0, 12)} />
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

export default OrganizationCourse;
