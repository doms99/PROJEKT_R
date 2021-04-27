import {
    LOGOUT
} from "../actionTypes";

const initialState = {};

const logoutReducer = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case LOGOUT: {
            console.log('LOGOUT')
            return {
                user: undefined
            };
        }
        default: {
            return state;
        }
    }
};

export default logoutReducer;