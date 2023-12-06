export const logout = (data) => {
  return {
    type: "logout",
    payload: data,
  };
};
export const clearData = (data) => {
  return {
    type: "clearData",
    payload: data,
  };
};

export const blogDetail = (data) => {
  return {
    type: "addblogDetail",
    payload: data,
  };
};

// Profile Actions

export const userDetail = (data) => {
  return {
    type: "adduserDetail",
    payload: data,
  };
};

export const tabPageNo = (data) => {
  return {
    type: "tabNo",
    payload: data,
  };
};
export const loder = (data) => {
  return {
    type: "loder",
    payload: data,
  };
};
export const personalInfo = (data) => {
  return {
    type: "personalInfo",
    payload: data,
  };
};

export const educationInfo = (data) => {
  return {
    type: "educationInfo",
    payload: data,
  };
};

export const professionalInfo = (data) => {
  return {
    type: "professionalInfo",
    payload: data,
  };
};

export const areaOfInterestInfo = (data) => {
  return {
    type: "areaOfInterestInfo",
    payload: data,
  };
};

// Category, Course Action

export const getAllCategories = (data) => {
  return {
    type: "getAllCategories",
    payload: data,
  };
};

export const getAllCourses = (data) => {
  return {
    type: "getAllCourses",
    payload: data,
  };
};

export const getAllCourseSubCategories = (data) => {
  return {
    type: "getAllCoursesSubCategories",
    payload: data,
  };
};

export const orgCourses = (data) => {
  return {
    type: "orgCourses",
    payload: data,
  };
};
export const getAllEvents = (data) => {
  return {
    type: "getAllEvents",
    payload: data,
  };
};

export const getSelectedCourse = (data) => {
  return {
    type: "getSelectedCourse",
    payload: data,
  };
};
export const getSelectedEvent = (data) => {
  return {
    type: "getSelectedEvent",
    payload: data,
  };
};

export const isEddiSuggestion = (data) => {
  return {
    type: "isEddiSuggestion",
    payload: data,
  };
};

export const searchCourseText = (data) => {
  return {
    type: "searchCourseText",
    payload: data,
  };
};
export const searchOrgCourseText = (data) => {
  return {
    type: "searchOrgCourseText",
    payload: data,
  };
};

export const getPersonalProfileData = (data) => {
  return {
    type: "getPersonalProfileData",
    payload: data,
  };
};

export const getVatCharges = (data) => {
  return {
    type: "getVatCharges",
    payload: data,
  };
};

export const videoCompleted = (data) => {
  return {
    type: "videoCompleted",
    payload: data,
  };
};

export const language = (data) => {
  return {
    type: "language",
    payload: data,
  };
};
export const tncData = (data) => {
  return {
    type: "tncData",
    payload: data,
  };
};
export const footerData = (data) => {
  return {
    type: "footerData",
    payload: data,
  };
};