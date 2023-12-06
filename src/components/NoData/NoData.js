import React from "react";
import "./NoData.scss";
import IcNodata from "../../assets/images/IcNodata.svg";
import { getTranslatedText as t } from "../../translater/index";
import { useSelector } from "react-redux";

function NoData() {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  return (
    <div className="text-center d-flex flex-column no-data">
      <img src={IcNodata} width="200px" className="mx-auto no-data-img" />
      <span>{t("NoData", lan)}</span>
    </div>
  );
}

export default NoData;
