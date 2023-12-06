import { combineReducers } from "redux";
import UserReduser from "./userReduser";
import TabReducer from "./profileReducer";

const rootReduser = combineReducers({Eddi:UserReduser,Profile:TabReducer});

export default rootReduser;