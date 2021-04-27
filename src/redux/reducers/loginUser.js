import { LOGIN } from "../actionTypes";

const initialState = {};

const loginReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case LOGIN: {
      console.log('LOGIN')
      return {
        ...state, 
        user: action.user
      };
    }
    default: {
      return state;
    }
  }
};

export default loginReducer;