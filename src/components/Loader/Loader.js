import React from 'react'
import LoaderImg from "../../assets/images/loader.svg"
import "./Loader.scss"
const Loader = () => {
  return (
    <div>
        <div className="loader-main">
          <div className='loader-icon'>
              <img src={LoaderImg} />
            </div>
        </div>
          
    </div>
  )
}

export default Loader