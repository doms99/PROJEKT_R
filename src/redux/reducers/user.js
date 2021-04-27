import {CREATE_USER, LOGIN, LOGOUT, UPDATE_USER} from "../actionTypes";

const initialState = {
  user: {logged: false}
};

const userReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case CREATE_USER:
    case LOGIN: {
      console.log(action.type)
      return {
        ...state,
        ...action.user,
        logged: true
      };
    }
    case LOGOUT: {
      console.log('LOGOUT')
      return {
        logged: false
      };
    }
    case UPDATE_USER:
      console.log('UPDATE_USER')
      return {
        ...state,
        ...action.user
      }
    default: {
      return state;
    }
  }
};

export default userReducer;