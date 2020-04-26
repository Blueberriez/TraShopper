import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchProducts} from '../store/products'
import EditProduct from './EditProduct'
// Import Store Thunks

export class AllProducts extends React.Component {
  componentDidMount() {
    this.props.getProducts()
  }

  render() {
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
        {this.props.isAdmin && (
          <div>
            <p>Add new Product</p>
            <EditProduct />
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    products: state.products,
    isAdmin: state.user.isAdmin
  }
}

const mapDispatch = dispatch => {
  return {
    getProducts: function() {
      dispatch(fetchProducts())
    }
  }
}

export default connect(mapState, mapDispatch)(AllProducts)
