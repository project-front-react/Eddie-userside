import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/analytics";
import { massageRecived } from "../App";
import icon from "../assets/logo/logo.svg";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const platform=localStorage.getItem("Platform")
// console.log("platform",platform)

let platform;
if (window.location.href.includes("testyourapp") || window.location.href.includes("localhost:")) {
  platform = 'DEV' // need to change to DEV
}else{
  platform = 'PROD'
}

const firebaseConfig = {
  apiKey: process.env?.[`REACT_APP_${platform}_FIREBASE_apiKey`],
  authDomain: process.env?.[`REACT_APP_${platform}_FIREBASE_authDomain`],
  projectId: process.env?.[`REACT_APP_${platform}_FIREBASE_projectId`],
  storageBucket: process.env?.[`REACT_APP_${platform}_FIREBASE_storageBucket`],
  messagingSenderId: process.env?.[`REACT_APP_${platform}_FIREBASE_messagingSenderId`],
  appId: process.env?.[`REACT_APP_${platform}_FIREBASE_appId`],
};

firebase.initializeApp(firebaseConfig);
export const firebaseAnalytics = firebase.analytics();
let messaging = null;
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
  console.log("firebase service");
} else {
  console.log("not supported");
}
// const { REACT_APP_FIREBASE_VAPIKEY } = process.env;
// const publicKey = REACT_APP_FIREBASE_VAPIKEY;
const REACT_APP_FIREBASE_VAPIKEY = process.env[`REACT_APP_${platform}_FIREBASE_VAPIKEY`];
const publicKey = REACT_APP_FIREBASE_VAPIKEY;
export const fetchToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    await requestPermission();
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    return currentToken;
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

function isIOS() {
  const browserInfo = navigator.userAgent.toLowerCase();

  if (
    browserInfo.match("iphone") ||
    browserInfo.match("ipad") ||
    browserInfo.match("macintosh")
  ) {
    console.log("first if");
    return true;
  }
  if (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
      "macintosh",
    ].includes(navigator.platform)
  ) {
    console.log("second if");
    return true;
  }
  return false;
}
export function requestPermission() {
  // return Notification?.requestPermission();
  if (isIOS()) {
    return;
  } else {
    return Notification?.requestPermission();
  }
}
export const showNotification = (payload) => {
  console.log("get", payload);
  const notification = new Notification(payload?.notification?.title, {
    body: payload?.notification?.body,
    icon: icon,
  });
  notification.onclick = (e) => {
    if(platform=="DEV"){
      window.location.href = "https://eddi-frontend.testyourapp.online/";
    }
    else{
      window.location.href = "https://www.eddi.nu";
    }
  };
  console.log(notification);
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (firebase.messaging.isSupported()) {
      messaging.onMessage(async (payload) => {
        console.log("ongoing msg", payload);
        if (Notification?.permission == "granted") {
          showNotification(payload);
        } else if (Notification?.permission !== "denied") {
          await requestPermission();
          if (Notification?.permission == "granted") {
            showNotification(payload);
          }
        }
        massageRecived(payload);
        return resolve(payload);
      });
    } else {
      return;
    }
  });
