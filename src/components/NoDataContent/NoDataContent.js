import React, { useEffect, useMemo, useState } from "react";
import "./NoDataContent.scss";
import IcNodata from "../../assets/images/IcNodata.svg";
import { getTranslatedText as t } from "../../translater/index";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getEddiLabsData } from "../../services/cmsServices";

import Loader from "../../components/Loader/Loader";

function NoDataContent() {
  const history = useHistory();
  const [eddiLabData, setEddiLabData] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;

  const eddiLabsData = () => {
    setIsLoader(true);
    getEddiLabsData()
      .then((res) => {
        if (res.status === "success") {
          setEddiLabData(res.data);
          setIsLoader(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
      });
  };

  useMemo(() => {
    if(!eddiLabData){

      eddiLabsData();
    }
  }, []);

  return (
    <div className="text-center d-flex flex-column no-data-content">
      {isLoader ? <Loader /> : ""}
      <div className="no-data-title mb-3">
        <h1>{eddiLabData?.title}</h1>
      </div>
      <div className="no-data-text text-center">
        {/* <p>{eddiLabData?.description}
                </p> */}
        <p className="unset-list"
          dangerouslySetInnerHTML={{
            __html: eddiLabData?.description,
          }}
        ></p> 
      </div>
      <div className="btn">
        <button
          className="btn-green"
          onClick={() => {
            history.push(`/${eddiLabData?.button_link}`);
          }}
        >
          {eddiLabData?.button_text}
        </button>
      </div>
    </div>
  );
}

export default NoDataContent;
