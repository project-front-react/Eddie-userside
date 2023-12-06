import React, { useState, useEffect } from "react";
import "./CountryCodeSelect.scss";
import { getTranslatedText as t } from "../../translater/index";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useSelector } from "react-redux";

function CountryCodeSelect(props) {
  const [value, setValue] = useState();
  const state = useSelector(state=>state?.Eddi)
  let lan = state?.language;
  return (
    <div className="selectbox-main">
      <label>{props.labelName}</label>
      <PhoneInput
        placeholder={t("phonnumber", lan)}
        value={value}
        // defaultCountry="SE"
        onChange={setValue}
        flags={false}
        ref={props.ref}
      />
    </div>
  );
}

export default CountryCodeSelect;
