import { ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART } from "../../actionTypes";

const initialState = {

    items: [],
    nrOfItems: 0
};

const cartReducer = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case ADD_TO_CART: {

            if (state.items == undefined) {
                state.items = [];
                state.nrOfItems = 0


            }
            let found = false;
            state.items.forEach(item => {
                if (item.offerid == action.item.offerid) {
                    found = true;
                    item.amount++
                }
            })
            if (!found) {
                state.items = [...state.items, { ...action.item, amount: 1 }]
            }
            state.nrOfItems = state.nrOfItems + 1
            return {

                ...state,


            };
        }
        case REMOVE_FROM_CART: {

            if (state.items == undefined) {
                return {

                    ...state,
    
    
                };


            }
            let amount = 0;
            state.items.forEach(item => {
                if (item.medid == action.id) {

                    amount = item.amount
                }
            })

            state.items = state.items.filter(item => {
                
                    return (item.medid != action.id)

                
            })
            state.nrOfItems -= amount;
            

            return {

                ...state,


            };
        }
        case CLEAR_CART: {

            if (state.items == undefined) {
                return {

                    ...state,
    
    
                };


            }
            let amount = 0;
            

            state.items = []
            state.nrOfItems = amount;
            

            return {

                ...state,


            };
        }
        default: {
            return state;
        }
    }
};

export default cartReducer;