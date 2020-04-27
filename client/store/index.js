import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import userReducer from './user'
import allUsersReducer from './allUsers'
import allProductsReducer from './products'
import singleProductReducer from './singleProduct'
import cartReducer from './cart'

const reducer = combineReducers({
  user: userReducer,
  users: allUsersReducer,
  products: allProductsReducer,
  product: singleProductReducer,
  basket: cartReducer
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
