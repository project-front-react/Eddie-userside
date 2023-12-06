// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing the generated config

let firebaseConfig;
if (this.location.href.includes("testyourapp") || this.location.href.includes("localhost") ) {
  // return "https://eddi-backend.testyourapp.online"
  firebaseConfig = {
    apiKey: "AIzaSyCekCOZqgiNa8SzxiIdxCM0UGrWm1K8yII",
    authDomain: "fcmdemo-93b59.firebaseapp.com",
    projectId: "fcmdemo-93b59",
    storageBucket: "fcmdemo-93b59.appspot.com",
    messagingSenderId: "221724648466",
    appId: "1:221724648466:web:8a9ae90cb2b82d14bf64cb",
  };
}
else {
  firebaseConfig = {
    apiKey: "AIzaSyDoNHmjjspD6S_EavEp8Cc1NilFJ6ZLQPQ",
    authDomain: "eddi-80fa0.firebaseapp.com",
    projectId: "eddi-80fa0",
    storageBucket: "eddi-80fa0.appspot.com",
    messagingSenderId: "516219540739",
    appId: "1:516219540739:web:f29e342319399ea0a58536",
  }
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

const showNotification = (payload) => {
  const notification = new Notification(payload?.notification?.title, {
    body: payload?.notification?.body,
    icon: icon,
  });

  notification.onclick = (e) => {
    if (this.location.href.includes("testyourapp") || this.location.href.includes("localhost")) {
      window.location.href = "https://eddi-frontend.testyourapp.online/";
    }
    else{
      window.location.href = "https://www.eddi.nu";
    }
  };
};
// Retrieve firebase messaging
// eslint-disable-next-line no-undef
let messaging = null;
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
  console.log("firebase messaging");
} else {
  console.log("not supported");
}

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./favicon.ico",
  };
  if (Notification?.permission == "granted") {
    showNotification(payload);
  }

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
