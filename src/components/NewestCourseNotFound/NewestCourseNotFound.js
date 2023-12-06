import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getTranslatedText as t } from "../../translater/index";
import "./NewestCourseNotFound.scss";

function NewestCourseNotFound(props) {
  const history = useHistory();
  const state = useSelector(state=>state?.Eddi)
  let lan = state?.language;
  return (
    <>
      <div className="No-data-main">
        <div>
          <h1>{t("NewCourseProfile",lan)}</h1>
        </div>
        <div className="No-coursse-text mt-5 mb-5">
          <p className="text-content">{t("Nocoursefoundbasedonyourprofile",lan)}</p>
          <div className="course-btn">
            <button
              className="btn btn-green view-all-btn"
              onClick={() => history.push("/view-all-courses?cat=")}
            >
              {t("ViewAllCourses",lan)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewestCourseNotFound;
