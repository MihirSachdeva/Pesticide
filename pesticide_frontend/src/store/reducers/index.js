import { combineReducers } from "redux";
import auth from "./auth";
import theme from "./theme";
import header from "./header";

export default combineReducers({
  auth,
  theme,
  header,
});
