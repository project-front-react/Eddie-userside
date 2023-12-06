const initialState = {
  tabPageNo: 1,
  personalData: [],
  educationData:[],
  professionalData: [],
  areaOfInterestData: [],
  logout:'',
  loder:false,
};
const TabReducer = (state = initialState, action) => {
  switch (action.type) {
    case "logout":
      return initialState;
    case "tabNo":
      return {
        ...state,
        tabPageNo: action.payload,
      };
    case "personalInfo":
      return {
        ...state,
        personalData: action.payload,
      };
    case "educationInfo":
      return {
        ...state,
        educationData: action.payload,
      };

      case "professionalInfo":
        return {
          ...state,
          professionalData: action.payload,
        };
      case "areaOfInterestInfo":
        return {
          ...state,
          areaOfInterestData: action.payload,
        };
      case "loder":
        return {
          ...state,
          loder: action.payload,
        };
    default:
      return state;
  }
};

export default TabReducer;
