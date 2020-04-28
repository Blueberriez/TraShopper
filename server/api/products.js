const router = require('express').Router()
const {User, Product} = require('../db/models')

router.get('/', async (req, res, next) => {
  try {
    const allProducts = await Product.findAll()
    res.json(allProducts)
  } catch (error) {
    next(error)
  }
})

router.get('/art', async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {category: 'trash'}
    })
    res.json(products)
  } catch (err) {
    next(err)
  }
})

router.get('/islands', async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {category: 'island'}
    })
    res.json(products)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const singleProduct = await Product.findByPk(req.params.id)
    res.json(singleProduct)
  } catch (error) {
    next(error)
  }
})

//admin routes
router.post('/', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const newProduct = await Product.create(req.body)
      res.json(newProduct).status(202)
    } else {
      throw new Error('Error accessing product')
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const product = await Product.findByPk(req.params.id)
      await product.update(req.body)
      res.sendStatus(202)
      // res.json(product)
    } else {
      throw new Error('Error accessing product')
    }
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      await Product.destroy({
        where: {
          id: req.params.id
        }
      })
      res.send('Product successfully deleted').status(204)
    } else {
      throw new Error('Error deleting product')
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
