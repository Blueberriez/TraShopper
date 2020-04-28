import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchProducts, fetchSomeProducts} from '../store/products'
import EditProduct from './EditProduct'
// Import Store Thunks

export class AllProducts extends React.Component {
  constructor() {
    super()
    this.displayEditForm = this.displayEditForm.bind(this)
    this.state = {
      displayEdit: false
    }
  }
  componentDidMount() {
    // if (this.props.category) {
    console.log('props in compdidmount', this.props)
    this.props.getSomeProducts(this.props.category)
    // } else {
    //   this.props.getProducts()
    // }
  }
  displayEditForm() {
    let currentBool = this.state.displayEdit
    this.setState({displayEdit: !currentBool})
  }
  render() {
    let editForm = null
    const isAdmin = this.props
    if (this.state.displayEdit) {
      editForm = <EditProduct />
    }
    return (
      <div>
        <section className="boxes">
          {this.props.products.length > 0 ? (
            this.props.products.map(product => (
              <div key={product.name} className="box-wrapper">
                <Link to={`/products/${product.id}`}>{product.name}</Link>
                <img src={product.imageUrl} />
              </div>
            ))
          ) : (
            <p>No Products to Display</p>
          )}
        </section>
        {isAdmin && (
          <button type="button" onClick={() => this.displayEditForm()}>
            Add New Product
          </button>
        )}
        {editForm}
      </div>
    )
  }
}

const mapState = state => {
  return {
    category: null,
    products: state.products,
    isAdmin: state.user.isAdmin,
    displayEdit: false
  }
}

const mapDispatch = dispatch => {
  return {
    getProducts: function() {
      dispatch(fetchProducts())
    },
    getSomeProducts: function(category) {
      dispatch(fetchSomeProducts(category))
    }
  }
}

export default connect(mapState, mapDispatch)(AllProducts)
