import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MegaMenu.scss";
import catBanner from "../../assets/images/cta-banner.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedCourse } from "../../redux/actions";
import { getSubCatForCourseListById } from "../../services/eddiServices";
import { getTranslatedText as t } from "../../translater/index";

function MegaMenu(props) {
  const state = useSelector((state) => state?.Eddi);
  const dispatch = useDispatch();
  const AllCategories = state?.AllCategories;
  let lan = state?.language;

  // const AllCourses = state?.AllCourses;
  const AllCoursesSubCategories = state?.AllCoursesSubCategories;

  return (
    <div>
      <div className="main-menu-block">
        <div className="main-category-block ">
          <h4>{t("COURSECATEGORY", lan)}</h4>
          {AllCategories?.map((item, i) => {
            const filterdeSubCat = AllCoursesSubCategories?.filter(
              (course) =>
                course.category_name?.category_name ===
                item?.category_name
            )
            return (
              <ul className="list-unstyled" key={i}>
                <li className={filterdeSubCat?.length >0 ?"active-menu":" active-menu no-arrow"}>
                  <Link to={`/category-details/${item?.uuid}`}>
                    {t(item.category_name, lan)}
                  </Link>
                  {filterdeSubCat?.length > 0 && (
                    <div className="sub-category-block">
                      <h4> {t(item.category_name, lan)}</h4>
                      <ul className="list-unstyled">
                        {filterdeSubCat.map((cor, index) => (
                          <li key={index}>
                            <Link
                            className="f-14"
                              to={`/view-all-courses?category_name=${cor?.category_name?.category_name}&&subcategory_name=${cor?.subcategory_name}`}
                            >
                              {cor.subcategory_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
