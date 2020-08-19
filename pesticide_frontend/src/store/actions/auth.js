import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as api_links from '../../APILinks';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = token => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token
  }
}

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('id');
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

// export const checkAuthTimeout = expirationTime => {
// 	return dispatch => {
// 		setTimeout(() => {
// 			dispatch(logout());
// 		}, expirationTime * 1000)
// 	}
// }

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios.post(api_links.REST_AUTH_LOGIN, {
      username: username,
      password: password
    })
      .then(res => {
        const userId = res.data.user.id;
        const token = res.data.key;
        // const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        // localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('id', userId);
        dispatch(authSuccess(token));
        // dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err))
      });
  }
}

// export const authSignup = (username, email, password1, password2) => {
//     return dispatch => {
//         dispatch(authStart());
//         axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
//             username: username,
//             email: email,
//             password1: password1,
//             password2: password2
//         })
//         .then(res => {
//             const token = res.data.key;
//             const expirationDate = new Date(new Date().getTime + 3600 * 1000);
//             localStorage.setItem('token', token);
//             localStorage.setItem('expirationDate', expirationDate);
//             localStorage.setItem('username', username);
//             dispatch(authSuccess(token));
//             dispatch(checkAuthTimeout(3600));
//         })
//         .catch(err => {
//             dispatch(authFail(err))
//         });
//     }
// }

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (token === undefined) {
      dispatch(logout());
    } else {
      axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token
      }
      axios.get(api_links.API_ROOT + 'current_user/')
        .then(res => {
          localStorage.setItem('id', res.data[0].id);
          dispatch(authSuccess(token));
        })
        .catch(err => {
          console.log(err);
          dispatch(authFail(err));
        })
      // const expirationDate = new Date(localStorage.getItem('expirationDate'));
      // if (expirationDate <= new Date()) {
      // 	dispatch(logout());
      // } else {
      
      // dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      // }
    }
  }
}