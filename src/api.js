let platform;
// const backendUrl = process.env[`REACT_APP_${platform}_BACKEND_URL`];
if (window.location.href.includes("testyourapp") || window.location.href.includes("localhost")) {
    localStorage.setItem("Platform","DEV");
    platform="DEV"
    // console.log("plat",localStorage.getItem("Platform"))
  }
  else if (window.location.href.includes("nu")) {
    localStorage.setItem("Platform","PROD");
    platform="PROD"
  }
  const backendUrl = process.env[`REACT_APP_${platform}_BACKEND_URL`];
//   console.log("backendurl",backendUrl)
//   console.log("process env",process.env)

//   console.log("dev",process.env[`REACT_APP_DEV_BACKEND_URL`]);
//   console.log("prod",process.env[`REACT_APP_PROD_BACKEND_URL`]);

export default {
    // backendApi: " https://5186-103-249-234-228.in.ngrok.io"
    backendApi: backendUrl
}
