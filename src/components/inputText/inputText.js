import React from "react";
import "./inputText.scss";

function inputText(props) {
  return (
    <div className="input-main">
      <label>{props.labelName}</label>
      <div className="form-group position-relative">
        <input
          type={props.type}
          className="form-control"
          placeholder={props.placeholder}
          ref={props.ref}
          value={props?.value}
          defaultValue={props?.defaultValue}
          list={props.list && props.list}
          onChange={props.onChange}
          onKeyDown={props?.onKeyDown}
          checked={props.isSelected}
          disabled={props.isDisabled}
        />
      </div>
    </div>
  );
}

export default inputText;
