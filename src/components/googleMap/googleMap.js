import React, { useState, useEffect, Component } from "react";
import { Link } from "react-router-dom";
import "./googleMap.scss";
import Logo from "../../assets/logo/logo.svg";
import { getTranslatedText as t } from "../../translater/index";
import GoogleMapReact from "google-map-react";

// function googleMap(props) {
//   const [value, setValue] = useState();
//   return (
//     <div className="selectbox-main">
//       <PhoneInput
//         placeholder={t("phonnumber", "en")}
//         value={value}
//         defaultCountry="SE"
//         onChange={setValue}
//         flags={false}
//       />
//     </div>
//   );
// }

// export default googleMap;

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class googleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.3465133,
      lng: 18.0948041,
    },
    zoom: 11,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div className="mapBlock">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBHy0f9dzwGpcBBGuSO_XF2PY2kELnxp20" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={59.3465133} lng={18.0948041} text="My Marker" />
        </GoogleMapReact>
      </div>
    );
  }
}

export default googleMap;
