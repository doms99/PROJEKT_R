import { CREATE_USER } from "../actionTypes";

const initialState = {};

const createUserReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case CREATE_USER: {
      console.log('CREATE_USER')
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

export default createUserReducer;