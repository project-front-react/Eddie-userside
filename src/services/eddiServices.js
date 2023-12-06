import axios from "axios";
import API from "../api";

const axiosInstance = axios.create({
  baseURL: `${API.backendApi}/`,
});

function CreateRequestFunc(methods, url, body, header) {
  let config = {
    method: methods,
    url,
    headers: header
      ? header
      : {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("Authorization"),
        },
    data: body,
  };
  return axiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response.status == 401) {
        // localStorage.clear();
        // window.location.replace("/login");
        if (error.response.data.is_authenticated == "False") {
          localStorage.clear();
          window.location.replace("/login");
        }
      } else {
        return error.response.data;
      }
    });
}

export const getCategoryApi = async () => {
  return await CreateRequestFunc("get", "get-category-details/");
};
export const getCategoryIdApi = async (uuid) => {
  return await CreateRequestFunc("get", `get-category-details/${uuid}`);
};
export const getCoursesApi = async () => {
  return await CreateRequestFunc("get", "get-course-details/");
};
export const getCourseDetailApi = async (uuid) => {
  return await CreateRequestFunc("get", `get-course-details/${uuid}/`);
};

//User Profile APIS
export const postUserProfileApi = async (body) => {
  return await CreateRequestFunc("post", `add-user-profile/`, body);
};
export const getUserProfileApi = async () => {
  return await CreateRequestFunc("get", `add-user-profile/`);
};

export const getStripePublicKeyApi = async () => {
  return await CreateRequestFunc("get", `get-key-data/`, "", {
    "Content-Type": "multipart/form-data",
  });
};

export const putUserProfileApi = async (body) => {
  return await CreateRequestFunc("put", `add-user-profile/`, body);
};

//fav unfavorite course api
export const updateFavoriteCourseApi = async (body) => {
  return await CreateRequestFunc("post", `favourite-course-details/`, body);
};
export const favoriteCourses = async () => {
  return await CreateRequestFunc("get", `favourite-course-details/`);
};

//get event by id
export const getEventById = async (uuid,organisation) => {
  return await CreateRequestFunc("get",`event/${uuid}/?is_organization=${organisation||false}`,{},{
      Authorization: localStorage.getItem("Authorization"),
    });
};

//get corporate event by id
export const getCorporateEventById = async (uuid) => {
  return await CreateRequestFunc("get",`get-org-event/${uuid}/`,{},{
      Authorization: localStorage.getItem("Authorization"),
    });
};

// add click when advertisemnet click

export const addAdvertisementClick = async (uuid) => {
  return await CreateRequestFunc("put", `increase-Adcount/${uuid}/`);
};

export const getEnrolledCourse = async (body) => {
  return await CreateRequestFunc("post", `get-courseenrolldetail/`, body);
};

export const getEnrolledEvent = async () => {
  return await CreateRequestFunc("get", `get-event-enrollments/`);
};

export const getApprovedSubCategory = async () => {
  return await CreateRequestFunc("get", `get-sub-category-details/`);
};

//Recruitment Advertisment

export const getRecuritmentAdsApi = async () => {
  return await CreateRequestFunc("get", `recruitmentAd/`);
};

export const increaseRecruitmentAdcountApi = async (uuid) => {
  return await CreateRequestFunc("put", `increase-recruitmentAdcount/${uuid}/`);
};

export const getMaterialCourse = async (uuid) => {
  return await CreateRequestFunc("get", `course-material-upload/${uuid}/`);
};

//Eddi labs apis
export const postVideoDuration = async (body) => {
  return await CreateRequestFunc("post", `course-material-status/`, body);
};

//course rating apis

export const addRating = async (uuid, body) => {
  return await CreateRequestFunc("post", `course-rating/${uuid}/`, body);
};

export const getRating = async (uuid) => {
  return await CreateRequestFunc("get", `course-rating/${uuid}/`);
};

export const getGraphType = async () => {
  return await CreateRequestFunc("get", `my-progressgraph/`);
};

//payment -intent api

export const createPayment = async (body) => {
  return await CreateRequestFunc("POST", `save-stripe-info/`, body, {
    "Content-Type": "multipart/form-data",
  });
};

// send status to backendApi

export const sendStatusApi = async (body) => {
  return await CreateRequestFunc("POST", `user-payment-detail/`, body);
};

//get event api

export const getAllEvent = async () => {
  return await CreateRequestFunc("get", `event/`);
};

export const getAllCorporateEvent = async () => {
  return await CreateRequestFunc("get", `get-org-event/`);
};

// free event api
export const eventPaymentApi = async (body) => {
  return await CreateRequestFunc("POST", `save-stripe-infoevent/`, body);
};

// event-payment-detail/
export const eventPaymentStatusApi = async (body,corporate) => {
  return await CreateRequestFunc("POST", `event-payment-detail/?is_organization=${corporate || false}`, body);
};
//for notification

export const getNotification = async () => {
  return await CreateRequestFunc(
    "get",
    `notifications/`,
    {},
    {
      Authorization: localStorage.getItem("Authorization"),
    }
  );
};

export const clearNoti = async (body) => {
  return await CreateRequestFunc("put", `notifications/`, body, {
    Authorization: localStorage.getItem("Authorization"),
  });
};

export const sendInvoice = async (body) => {
  return await CreateRequestFunc("post", `paybyinvoice/`, body, {
    Authorization: localStorage.getItem("Authorization"),
  });
};

//get session detail for my space calender

export const getSessions = async () => {
  return await CreateRequestFunc(
    "get",
    `get-user-session/`,
    {},
    {
      Authorization: localStorage.getItem("Authorization"),
    }
  );
};

//get subcategories list by id
export const getSubCatListById = async (id) => {
  return await CreateRequestFunc(
    "get",
    `get-sub-category-list/${id}/`,
    {},
    {
      Authorization: localStorage.getItem("Authorization"),
    }
  );
};

export const getSubCatForCourseList = async () => {
  return await CreateRequestFunc("get", "get-sub-category-details/");
};



export const getCorporateDashboard = async() =>{
  return await CreateRequestFunc("get",`get-corporate-details/`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}

export const getCorporateCategories = async() =>{
  return await CreateRequestFunc("get",`get-corporate-category/`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}

export const getCorporateCourse = async() =>{
  return await CreateRequestFunc("get",`corporate-course-for-users/`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}

export const getCorporateCourseDetail = async(uuid) =>{
  return await CreateRequestFunc("get",`get-corporate-course/${uuid}/`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}

//get enroled course
export const getAllEnrolledCourse = async(filter,type) =>{
  return await CreateRequestFunc("get",`user-enrolled-course/?filter=${filter}&course_type=${type||'All'}`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}
//get all corporate module 
export const getAllModuleApi = async(uuid) =>{
  return await CreateRequestFunc("get",`get-average-course-progress/?course_id=${uuid}`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}
//get all COMMON COURSE DETAIL module (corporate and normal)
export const getCourseDetailById = async(uuid) =>{
  return await CreateRequestFunc("get",`user-course-details/${uuid}/`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}

//get all module content (corporate and normal)
export const getCorporateModuleContentById = async(uuid) =>{
  return await CreateRequestFunc("get",`add-corporate-module-resource/?module_uuid=${uuid}`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}

//update course video duration
export const updateCorporateVideoDuration = async(uuid,data) =>{
  return await CreateRequestFunc("put",`update-module-progress/${uuid}/`,data,{
    "Authorization": localStorage.getItem("Authorization"),
  });
}


export const getNews = async(is_corporate) =>{
  return await CreateRequestFunc("get",`get-news/?is_corporate=${is_corporate??false}`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}

export const getNewsById = async(uuid) =>{
  return await CreateRequestFunc("get",`get-news-details/${uuid}/`,{},{
    "Authorization": localStorage.getItem("Authorization"),
  });
}
