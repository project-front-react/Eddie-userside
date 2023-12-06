const initialState = {
  UserDetail: "",
  BlogDetail: "",
  AllCategories: [],
  AllCourses: [],
  AllCoursesSubCategories: [],
  orgCourses: [],
  SelectedCourse: "",
  SelectedEvent: [],
  IsEddiSuggestion: false,
  SearchCourseText: "",
  SearchOrgCourseText: "",
  AllEvent: [],
  personalData: {},
  getVatCharges: 0,
  videoCompleted: "",
  language: "sw",
  clearData: "",
  tncData: null,
  footerData:"",
};
const CountReduser = (state = initialState, action) => {
  switch (action.type) {
    case "clearData":
      return { ...initialState, language: action.payload };

    case "addblogDetail":
      return {
        ...state,
        BlogDetail: action.payload,
      };

    case "adduserDetail":
      return {
        ...state,
        UserDetail: action.payload,
      };

    case "getAllCategories":
      return {
        ...state,
        AllCategories: action.payload,
      };

    case "getAllCourses":
      return {
        ...state,
        AllCourses: action.payload,
      };

    case "getAllCoursesSubCategories":
      return {
        ...state,
        AllCoursesSubCategories: action.payload,
      };
    case "orgCourses":
      return {
        ...state,
        orgCourses: action.payload,
      };
    case "getAllEvents":
      return {
        ...state,
        AllEvent: action.payload,
      };
    case "getSelectedCourse":
      return {
        ...state,
        SelectedCourse: action.payload,
      };
    case "isEddiSuggestion":
      return {
        ...state,
        IsEddiSuggestion: action.payload,
      };
    case "searchCourseText":
      return {
        ...state,
        SearchCourseText: action.payload,
      };

    case "searchOrgCourseText":
      return {
        ...state,
        SearchOrgCourseText: action.payload,
      };
    case "getSelectedEvent":
      return {
        ...state,
        SelectedEvent: action.payload,
      };

    case "getPersonalProfileData":
      return {
        ...state,
        personalData: action.payload,
      };
    case "getVatCharges":
      return {
        ...state,
        getVatCharges: action.payload,
      };

    case "videoCompleted":
      return {
        ...state,
        videoCompleted: action.payload,
      };
    case "language":
      return {
        ...state,
        language: action.payload,
      };
    case "tncData":
      return {
        ...state,
        tncData: action.payload,
      };

    case "footerData":
      return {
        ...state,
        footerData: action.payload,
      };

    default:
      return state;
  }
};

export default CountReduser;
