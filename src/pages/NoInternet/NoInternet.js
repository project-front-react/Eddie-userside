import React from 'react'
import NoNetwork from "../../assets/images/NoNetwork.svg";
import "./NoInternet.scss"
const NoInternet = () => {
  return (
    <div className="PageNoNet">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center page404-blcok">
            <div>
              <img src={NoNetwork} />
            </div>
            <p className="text-center mt-2">
              No Internet Connection.{" "}
            </p>

            <button onClick={()=>window.location.reload()} className="btn btn-green ">
              RETRY
            </button>
          </div>
        </div>
      </div>

    </div>  )
}

export default NoInternet