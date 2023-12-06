import React from "react";
import ReactDom from "./pages/ReactDom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

let platform;
if (window.location.href.includes("testyourapp")) {
  platform = 'DEV'
}else{
  platform = 'PROD'
}
const CLIENT_ID = process.env[`REACT_APP_${platform}_CLIENT_ID`];
ReactDom.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
