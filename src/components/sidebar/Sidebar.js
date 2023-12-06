import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import IcDashboard from "../../assets/images/IcDashboard.svg";
import IcSpace from "../../assets/images/IcSpace.svg";
import IcMyCourse from "../../assets/images/IcMyCourse.svg";
import IcEddiLabs from "../../assets/images/IcEddiLabs.svg";
import icFavorite from "../../assets/images/icFavorite.svg";
import { getTranslatedText as t } from "../../translater/index";
import "./Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { tabPageNo } from "../../redux/actions";
import MyOrganization from "../../assets/images/university-svgrepo-com 1.svg";

function Sidebar() {
  const dispatch = useDispatch();
  let state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const isCorporate = state?.UserDetail?.is_corporate;
  return (
    <div className="Sidebar-main">
      <ul className="list-unstyled">
        <li>
          <Link
            to={"/user-dashboard"}
            className={
              window.location.href.includes("/user-dashboard") ? "active" : null
            }
          >
            <span className="link-icon">
              <img src={IcDashboard} />
            </span>
            {t("Dashboard", lan)}
          </Link>
        </li>
        {isCorporate && (
          <li>
            <Link
              className={
                window.location.href.includes("/corporate-user-dashboard")
                  ? "active"
                  : null
              }
              to={{
                pathname: "/corporate-user-dashboard",
              }}
            >
              <span className="link-icon">
                <img src={MyOrganization} />
              </span>
              {t("MyOrganization", lan)}
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/my-space"
            className={
              window.location.href.includes("/my-space") ? "active" : null
            }
          >
            <span className="link-icon">
              <img src={IcSpace} />
            </span>
            {t("MySpace", lan)}
          </Link>
        </li>
        <li>
          <Link
            to="/my-course"
            className={
              window.location.href.includes("/my-course") ? "active" : null
            }
          >
            <span className="link-icon">
              <img src={IcMyCourse} />
            </span>
            {t("MyCourses", lan)}
          </Link>
        </li>
        {/* <li>
          <Link
            to="/eddi-labs/SS102"
            className={
              window.location.href.includes("/eddi-labs") ? "active" : null
            }
          >
            <span className="link-icon">
              <img src={IcEddiLabs} />
            </span>
            {t("EddiLabs", lan)}
          </Link>
        </li> */}

        <li>
          <Link
            to="/my-favorite"
            // onClick={()=>{dispatch(tabPageNo(2))}}
            className={
              window.location.href.includes("/my-favorite") ? "active" : null
            }
          >
            <span className="link-icon">
              <img src={icFavorite} />
            </span>
            {t("MyFavorites", lan)}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
