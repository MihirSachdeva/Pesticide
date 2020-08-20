import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  theme: localStorage.getItem("theme") || "default",
};

const changeTheme = (state, action) => {
  return updateObject(state, {
    theme: action.theme,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_THEME:
      return changeTheme(state, action);
    default:
      return state;
  }
};

export default reducer;
