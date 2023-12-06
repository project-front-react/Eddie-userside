import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TextArea.scss";
import Logo from "../../assets/logo/logo.svg";
import { getTranslatedText as t } from "../../translater/index";

function TextArea(props) {
  return (
    <div className="textArea-main">
      <div className="form-group position-relative">
        <textarea
          type={props.type}
          className="form-control"
          placeholder={props.placeholder}
          rows="3"
          ref={props.ref}
        >
          Message
        </textarea>
      </div>
    </div>
  );
}

export default TextArea;
