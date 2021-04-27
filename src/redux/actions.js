import { CREATE_USER, LOGIN, LOGOUT, ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, UPDATE_USER} from './actionTypes'

const createUser = (user) => {
  return {
    type: CREATE_USER,
    user
  }
}

const loginUser = (user) => {
  return {
    type: LOGIN,
    user
  }
}

const logoutUser = () => {
  return {
    type: LOGOUT
  }
}

const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    user
  }
}


const addToCart = (item) => {
  return {
    type: ADD_TO_CART,
    item
  }
}

const deleteFromCart = (id) => {
  return {
    type: REMOVE_FROM_CART,
    id
  }
}

const clearCart = () => {
  return {
    type: CLEAR_CART,
  }
}

export {createUser, loginUser, logoutUser, addToCart, deleteFromCart, clearCart, updateUser }