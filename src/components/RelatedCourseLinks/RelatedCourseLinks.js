import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import "./RelatedCourseLinks.scss";

import { getTranslatedText as t } from "../../translater/index";

import { useDispatch, useSelector } from "react-redux";
import { getSelectedCourse } from "../../redux/actions";

function RelatedCourseLinks(props) {
  const dispatch = useDispatch()
  const state = useSelector(state => state?.Eddi)
  let lan = state?.language;
  return (
    <div className="related-course ">
      <h3>
        {t('Related', lan)} {" "}
        {t(`${props?.type}`, lan).toLowerCase()}
      </h3>
      <ul>
        {props?.data?.length > 0 ?
          props?.data?.map((RelatedCourse, index) => {
            return (
              <Fragment>
                {
                  props?.type == "Courses" ?
                    <li>
                      <Link to={`/view-course-details?is_corporate=${props?.isCorporate}`} onClick={() => dispatch(getSelectedCourse(RelatedCourse?.uuid))}>{RelatedCourse?.course_name}</Link>
                    </li>
                    :
                    <li>
                      <Link to={`/user-dashboard/event-details/${RelatedCourse?.uuid}`}>{RelatedCourse?.event_name}</Link>
                    </li>
                }
              </Fragment>
            );
          })
          : 
            <span>{t('No_RESULT_FOUND', lan)}</span>

        
          // RelatedCourse.map((RelatedCourse, index) => {
          //   return (
          //     <li>
          //     <Link>{RelatedCourse.RelatedCourseLink}</Link>
          //     </li>
          //     );
          //   })
        }
      </ul>
    </div>
  );
}

export default RelatedCourseLinks;
