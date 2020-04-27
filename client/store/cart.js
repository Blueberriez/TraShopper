import axios from 'axios'
import history from '../history'

const SET_CART = 'SET_CART'
const ADD_TO_CART = 'ADD_TO_CART'
const CHECKOUT = 'CHECKOUT'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'

export const setCart = (cart, price) => ({
  type: SET_CART,
  cart,
  price
})

export const addToCart = (product, isLoggedIn) => ({
  type: ADD_TO_CART,
  product,
  isLoggedIn
})

export const removeFromCart = product => ({
  type: REMOVE_FROM_CART,
  product
})

export const checkout = () => ({
  type: CHECKOUT
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
        dispatch(addToCart(foundProduct.data, true))
      } else {
        dispatch(addToCart(foundProduct.data, false))
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
      let newProduct = true
      state.cart.forEach(product => {
        console.log('newProd id', action.product.id)
        console.log('product id', product.id)
        if (product.id === action.product.id) newProduct = false
        console.log(newProduct)
      })
      if (newProduct) {
        console.log('adding product')
        return {
          ...state,
          cart: [...state.cart, action.product],
          price: newPrice
        }
      } else if (action.isLoggedIn) {
        console.log('updating quant')
        const newCart = state.cart.map(product => {
          if (product.id === action.product.id)
            product.itemsInOrder.quantity = product.itemsInOrder.quantity + 1
          return product
        })
        return {...state, cart: newCart, price: newPrice}
      } else {
        console.log('updating quant')
        const newCart = state.cart.map(product => {
          if (product.id === action.product.id) {
            if (!product.itemsInOrder) {
              product.itemsInOrder = {}
              product.itemsInOrder.quantity = 2
            } else
              product.itemsInOrder.quantity = product.itemsInOrder.quantity + 1
          }
          return product
        })
        return {...state, cart: newCart, price: newPrice}
      }
    }
    case REMOVE_FROM_CART: {
      let quantity
      state.cart.forEach(product => {
        if (product.id === action.product.id)
          quantity = product.itemsInOrder.quantity
      })
      const newPrice = state.price - action.product.price * quantity
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
