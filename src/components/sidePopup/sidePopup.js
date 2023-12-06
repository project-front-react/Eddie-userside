import React from 'react'
import "./sidePopup.scss"
import "../../common/styles/globalStyles.scss"
import { BsXSquareFill } from "react-icons/bs";

function SidePopup(props) {
  return (
      props.show &&
    <div className='sidePopup'>
        <div className='transparantSection'>
        </div>
        <div className='popupSection'>
            <div className='popupHeader'>
                <p>{props.header}</p>
                <BsXSquareFill className='textPrimaryColor cursorPointer' onClick={props.handleClose}/>
            </div>
            <div className='popupContent'>
                {props.children}
            </div>
        </div>
    </div>
  )
}

export default SidePopup