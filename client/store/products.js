import axios from 'axios'

const SET_ALL_PRODUCTS = 'SET_ALL_PRODUCTS'
const GET_SOME_PRODUCTS = 'GET_SOME_PRODUCTS'

export const setProducts = products => ({
  type: SET_ALL_PRODUCTS,
  products
})

export const getSomeProducts = products => ({
  type: GET_SOME_PRODUCTS,
  products
})

export const fetchProducts = () => {
  return async dispatch => {
    try {
      const res = await axios.get('/api/products')
      dispatch(setProducts(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchSomeProducts = category => {
  return async dispatch => {
    try {
      console.log('category in thunk', category)
      const res = await axios.get(`/api/products/${category}`)
      if (!res) throw new Error("Can't find that category, please go back")
      dispatch(getSomeProducts(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

export default function productsReducer(state = [], action) {
  switch (action.type) {
    case SET_ALL_PRODUCTS:
      return action.products
    case GET_SOME_PRODUCTS:
      return action.products
    default:
      return state
  }
}
