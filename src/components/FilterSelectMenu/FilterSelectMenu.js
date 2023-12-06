import React from "react";
import "./FilterSelectMenu.scss";
import { getTranslatedText as t } from "../../translater/index";
import { useSelector } from "react-redux";

function FilterSelectMenu(props) {
  const state = useSelector(state=>state?.Eddi)
  let lan=state?.language;
  return (
    <>
      {!props.isWithicon ? (
        <div className="FilterSelectMenu">
          <span className="filter-icon">
            <img src={props.filterIcon} />
          </span>
          <select
            placeholder={props.placeholder}
            className="form-control selectmenu"
            onChange={props.onChange}
          >
            {props?.placeholder != "" && <option value="">{props?.placeholder}</option>}

            {props?.value?.map((opt,i)=>{
              return(
                <option key={i} selected={props?.selected ? props?.selected == opt ? true : false : false } value={opt}> {t(opt, lan)}</option>
              )
            })}
          </select>
        </div>
      ) : (
        <div className="FilterSelectMenu">
          <select
            placeholder={props.placeholder}
            className="form-control selectmenuWihtouticon"
            onChange={props.onChange}
          >
            {props?.placeholder != "" && <option value="">{props?.placeholder}</option>}

            {props?.value?.map((opt,i)=>{
              return(
                <option key={i} selected={props?.selected ? props?.selected == opt ? true : false : false } value={opt}>{t(opt, lan)}</option>
              )
            })}
          </select>
        </div>
      )}
    </>
  );
}

export default FilterSelectMenu;
