import axios from "axios"
import API from "../api";



function CreateRequestFunc(methods, url, body, headers) {

  let lan = localStorage.getItem('lan') || 'sw';
  var axiosInstance = axios.create({
    baseURL: `${API.backendApi}/${lan == "sw" ? lan + "/" : ""}`,
  });
  let config = {
    method: methods,
    url,
    headers: headers,
    data: body,
  };
  return axiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export const getAboutUsApi = async () => {
  return await CreateRequestFunc("get", `get-aboutus-page-data/`);
}

export const getHomePageApi = async () => {
  return await CreateRequestFunc("get", `get-home-page-data/`);
}

export const getHeaderFooterApi = async () => {
  return await CreateRequestFunc("get", `get-header-footer-data/`);
}

export const getBlogDetailApi = async (uuid) => {
  return await CreateRequestFunc("get", `get-blog-details/${uuid}`);
}

export const getAllBlogApi = async () => {
  return await CreateRequestFunc("get", `get-blog-details/`);
}

export const getContactUsDataApi = async () => {
  return await CreateRequestFunc("get", `get-contactus-page-data/`);
}

export const contactUsApi = async (body) => {
  return await CreateRequestFunc("post", `contactus-form/`, body);
}


export const gets3Media = async (body) => {
  return await CreateRequestFunc("get", `get-presigned-url/?name=${body}`);
}

export const getTnCApi = async () => {
  return await CreateRequestFunc("get", `get-terms-page-data/`);
}

export const getPrivacyPolicyApi = async () => {
  return await CreateRequestFunc("get", `get-privacy-page-data/`);
}

export const getTestimonial = async () => {
  return await CreateRequestFunc("get", `testimonial/`);
}

export const getCreateProfileText = async () => {
  return await CreateRequestFunc("get", `userprofile-cms/`);
}

export const dashboardCmsApi = async () => {
  return await CreateRequestFunc("get", `whats-on-eddi/`, {}, { "Authorization": localStorage.getItem("Authorization") });
}

export const getEddiLabsData = async () => {
  return await CreateRequestFunc("get", `get-eddilabs-page-data/`);
}
