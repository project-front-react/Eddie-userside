import React from "react";
import "./popup.scss";
import { BsXSquareFill } from "react-icons/bs";
import IcEddiProfile from "../../assets/images/times-circle.svg";

function Popup(props) {
  return (
    props.show && (
      <div className="popup">
        <div className="popupBackground">
          <div className="popupSection">
            <img
              src={IcEddiProfile}
              className="crossIcon"
              onClick={props.handleClose}
            />
            <div className="popupheading">
              <h2 className={props.headerClass}>{props.header}</h2>
            </div>
            <div className="popupcontent">{props.children}</div>
          </div>
        </div>
      </div>
    )
  );
}

export default Popup;
