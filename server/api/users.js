const router = require('express').Router()
const {User, Order, Product} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/orders', async (req, res, next) => {
  try {
    const getOrders = await Order.findAll({
      where: {
        userId: req.params.userId
      },
      include: {
        model: Product
      }
    })
    res.json(getOrders)
  } catch (error) {
    next(error)
  }
})
router.post('/:userId/cart', async (req, res, next) => {
  try {
    const newCart = await Order.create()
    const user = await User.findByPk(req.params.userId)
    newCart.setUser(user)
    res.json(newCart)
  } catch (error) {
    next(error)
  }
})

router.put('/:userId/cart', async (req, res, next) => {
  try {
    console.log('----->', req.params.userId)
    const getCart = await Order.findOne({
      where: {
        userId: req.params.userId,
        inProgress: true
      },
      include: {
        model: Product
      }
    })

    const foundProduct = await Product.findByPk(req.body.id)
    const add = await getCart.addProduct(foundProduct)
    if (add === undefined) {
      getCart.products.forEach(async (product, i) => {
        if (product.id === foundProduct.id) {
          console.log('FOUND A MATCH')
          product.itemsInOrder.quantity = product.itemsInOrder.quantity + 1
          await getCart.products[i].itemsInOrder.save()
        }
      })
    }
    getCart.totalPrice = getCart.totalPrice + foundProduct.price
    await getCart.save()
    const newCart = await Order.findOne({
      where: {
        userId: req.params.userId,
        inProgress: true
      },
      include: {
        model: Product
      }
    })
    res.json(newCart)
  } catch (error) {
    next(error)
  }
})

// remove product from cart
router.put('/:userId/cart-remove/', async (req, res, next) => {
  try {
    const getCart = await Order.findOne({
      where: {
        userId: req.params.userId,
        inProgress: true
      },
      include: {
        model: Product
      }
    })
    const foundProduct = await Product.findByPk(req.body.id)
    const removed = await getCart.removeProduct(foundProduct)
    console.log('REMOVED:', removed)
    getCart.totalPrice = getCart.totalPrice - foundProduct.price
    getCart.save()
    res.json(getCart)
  } catch (error) {
    next(error)
  }
})

//find orders in progress
router.get('/:userId/cart', async (req, res, next) => {
  try {
    const getCart = await Order.findAll({
      where: {
        userId: req.params.userId,
        inProgress: true
      },
      include: {
        model: Product
      }
    })
    res.json(getCart)
  } catch (error) {
    next(error)
  }
})

router.put('/:userId/checkout', async (req, res, next) => {
  try {
    const order = await Order.findAll({
      where: {
        userId: req.params.userId,
        inProgress: true
      },
      include: {
        model: Product
      }
    })
    order[0].inProgress = false

    await order[0].save()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})
