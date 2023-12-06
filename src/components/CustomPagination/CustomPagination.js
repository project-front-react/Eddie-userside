import React, { useState, useEffect } from "react";
import "./CustomPagination.scss";
import ArrowNext from "../../assets/images/arrow_right.svg";
import ArrowPrev from "../../assets/images/arrow_left.svg";

function CustomPagination(props) {
  return (
    <div className="CustomPagination">
      <span>{props.startIndex}-{props.endIndex} </span> of <span>{props?.totalData}</span>
      <div className="CustomPaginationButton">
        <button>
          <img src={ArrowPrev} onClick={props.startIndex == 1 ? null : props.onPrev} style={props.startIndex == 1 ? {opacity:0.5} : {opacity:1}} />
        </button>
        <button>
          <img src={ArrowNext} onClick={props.endIndex >= props?.totalData ? null :props.onNext} style={props.endIndex >= props?.totalData ? {opacity:0.5} : {opacity:1}} />
        </button>
      </div>
    </div>
  );
}

export default CustomPagination;
