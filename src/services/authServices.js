import axios from "axios";
import API from "../api";


const axiosInstance = axios.create({
  baseURL: `${API.backendApi}/`,
});

 function createRequestFunc(methods,url, body) {
    let config = {
      method: methods,
      url,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data:body,
    };
    return axiosInstance(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response.data;
      });
}


export const signupApi = async(body) =>{
  return await createRequestFunc("post",`signup/`,body);
}

export const loginApi = async(body) =>{
  return await createRequestFunc("post",`login/`,body);
}

export const forgotPassApi = async(body) =>{
  return await createRequestFunc("post",`forgot/`,body);
}

export const resetPassApi = async(uuid,body) =>{
  return await createRequestFunc("post",`resetpassword/${uuid}/`,body);
}

export const emailVarificationApi = async(id) =>{
  return await createRequestFunc("get",`verify-user/${id}/`);
}
