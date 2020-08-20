import * as actionTypes from "./actionTypes";

export const setTheme = (theme) => {
  return {
    type: actionTypes.CHANGE_THEME,
    theme: theme
  }
}

export const changeTheme = (theme = "default") => {
  return (dispatch) => {
    dispatch(setTheme(theme));
    localStorage.setItem("theme", theme);
  };
};
