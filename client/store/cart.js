import axios from 'axios'
import history from '../history'

const SET_CART = 'SET_CART'
const ADD_TO_CART = 'ADD_TO_CART'
const CHECKOUT = 'CHECKOUT'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const UPDATE_PRICE = 'UPDATE_PRICE'

export const setCart = (cart, price) => ({
  type: SET_CART,
  cart,
  price
})

export const addToCart = product => ({
  type: ADD_TO_CART,
  product
})

export const removeFromCart = product => ({
  type: REMOVE_FROM_CART,
  product
})

export const checkout = () => ({
  type: CHECKOUT
})

export const updatePrice = price => ({
  type: UPDATE_PRICE,
  price
})

export const addProductToCart = (productId, userId = 0) => {
  return async dispatch => {
    try {
      const foundProduct = await axios.get(`/api/products/${productId}`)
      if (userId !== 0) {
        const cart = await axios.get(`/api/users/${userId}/cart`)
        if (!cart.data[0]) {
          await axios.post(`/api/users/${userId}/cart`)
          dispatch(setCart([], 0))
        }
        await axios.put(`/api/users/${userId}/cart`, foundProduct.data)

        dispatch(addToCart(foundProduct.data))
      } else {
        dispatch(addToCart(foundProduct.data))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const removeProduct = (productId, userId = 0) => {
  return async dispatch => {
    try {
      const foundProduct = await axios.get(`/api/products/${productId}`)
      if (userId !== 0) {
        const cart = await axios.get(`/api/users/${userId}/cart`)
        await axios.put(`/api/users/${userId}/cart-remove`, foundProduct.data)
        dispatch(removeFromCart(foundProduct.data))
      } else {
        dispatch(removeFromCart(foundProduct.data))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchCart = (userId = 0) => {
  return async dispatch => {
    try {
      if (userId !== 0) {
        const res = await axios.get(`/api/users/${userId}/cart`)
        if (res.data[0] && res.data[0].id) {
          console.log(res.data[0])
          dispatch(setCart(res.data[0].products, res.data[0].totalPrice))
        } else {
          dispatch(setCart([], 0))
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const resetCart = () => {
  return dispatch => {
    try {
      dispatch(setCart([], 0))
    } catch (error) {
      console.log(error)
    }
  }
}

export const checkoutThunk = (userId = 0, cartId = 0) => {
  return async dispatch => {
    try {
      if (userId !== 0) {
        await axios.put(`/api/users/${userId}/checkout`)
      }
      dispatch(checkout())
      history.push('/checkout')
    } catch (error) {
      console.log(error)
    }
  }
}
// const initialState = {cart: [], product = {}}
const initialState = {cart: [], price: 0}

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART: {
      if (action.cart) {
        return {...state, cart: action.cart, price: action.price}
      } else return state
    }
    case ADD_TO_CART: {
      const newPrice = state.price + action.product.price
      if (state.cart.includes(action.product))
        return {...state, price: newPrice}
      else
        return {
          ...state,
          cart: [...state.cart, action.product],
          price: newPrice
        }
    }
    case REMOVE_FROM_CART: {
      const newPrice = state.price - action.product.price
      return {
        ...state,
        cart: state.cart.filter(product => product.id !== action.product.id),
        price: newPrice
      }
      // return state.filter(product => product.id !== action.product.id);
    }
    case CHECKOUT: {
      return initialState
    }
    case UPDATE_PRICE: {
      const newPrice = state.price + action.price
      return {...state, price: newPrice}
    }
    default:
      return state
  }
}

//class methods/hooks
// Cart.afterUpdate(async (cartInstance) => {
//   //if there is at least 1 item in the items array
//   if (cartInstance.items[0]) {
//     //use 'reduce' array method to calculate the total price of items in our items array
//     return cartInstance.items.reduce((acc, cur) => {
//       return acc + cur.price
//     }, 0.00)
//   } else {
//     return 0.00
//   }
// })
