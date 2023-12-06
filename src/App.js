import logo from "./logo.svg";
import "./App.css";
import Routing from "./routing";
import NoInternet from "./pages/NoInternet/NoInternet";
import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onMessageListener, requestPermission } from "./services/firebaseService"
import { useSelector } from "react-redux";

export const massageRecived = (payload) => {
  toast.info(payload.notification.body)
}

function App() {
  let internet = navigator.onLine;
  const state = useSelector((state) => state?.Eddi)

  useEffect(() => {
    requestPermission()
    // need to change to DEV

    if (window.location.href.includes("testyourapp") || window.location.href.includes("localhost")) {
      localStorage.setItem("Platform","DEV");
    }
    else if (window.location.href.includes("nu")) {
      localStorage.setItem("Platform","PROD");
    }
    //  if (window.location.href.includes("testyourapp") || window.location.href.includes("localhost:")) {
    //   // return "https://eddi-backend.testyourapp.online"
    //   localStorage.setItem("Platform","PROD"); 
    //   console.log("production")
    // }
  }, [])


  onMessageListener()
    .then((payload) => {
      // toast.info(payload.notification.body)
    })
    .catch((err) => console.log("failed: ", err));


  return (
    <div className="App">
      {internet ?
        <Routing /> :
        <NoInternet />
      }
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </div>
  );
}

export default App;
