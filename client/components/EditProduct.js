import React from 'react'
import {Link, useHistory, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {addProductThunk} from '../store/singleProduct'

export class EditProduct extends React.Component {
  constructor() {
    super()
    // this.state = {
    //   category: this.props.product.category,
    //   name: this.props.product.name,
    //   imageUrl: this.props.product.imageUrl,
    //   description: this.props.product.description,
    //   price: this.props.product.price
    // }
    this.state = {
      category: '',
      name: '',
      imageUrl: '',
      description: '',
      price: '',
      redirect: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.setState({
      category: this.props.product.category,
      name: this.props.product.name,
      imageUrl: this.props.product.imageUrl,
      description: this.props.product.description,
      price: this.props.product.price
    })
    console.log('props in compdidmount', this.props)
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log('handlechangestate', this.state)
  }
  handleSubmit = event => {
    event.preventDefault()
    // const history = useHistory()
    if (this.props.update) this.props.update(this.props.id, this.state)
    else this.props.add(this.state)
    this.setState({
      category: '',
      name: '',
      imageUrl: '',
      description: '',
      price: '',
      redirect: true
    })
    //after trying and failing with a <Redirect /> component and
    //with history, I've gotten the page to reload with the below code
    //it refreshes the page which may not be ideal, so maybe we can
    //figure out another way eventually
    window.location.href = `/products`
    // history.push('/products')
  }
  render() {
    // if (this.state.redirect) {
    //   this.setState({redirect: false});
    //   return <Redirect to="/products" />
    // }
    console.log(this.state)
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="category">Category</label>
        <input
          name="category"
          type="text"
          value={this.state.category}
          onChange={this.handleChange}
        />
        <label htmlFor="name">Product Name:</label>
        <input
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <label htmlFor="imageUrl">Image Url</label>
        <input
          name="imageUrl"
          type="text"
          value={this.state.imageUrl}
          onChange={this.handleChange}
        />
        <label htmlFor="description">Description</label>
        <input
          name="description"
          type="text"
          value={this.state.description}
          onChange={this.handleChange}
        />
        <label htmlFor="price">Price</label>
        <input
          name="price"
          type="text"
          value={this.state.price}
          onChange={this.handleChange}
        />
        <button type="submit" onClick={this.handleSubmit}>
          Submit
        </button>
      </form>
    )
  }
}
const mapDispatch = dispatch => ({
  add: function(product) {
    dispatch(addProductThunk(product))
    // dispatch(fetchProducts())
  }
})
export default connect(null, mapDispatch)(EditProduct)
