const router = require('express').Router()
const {User, Order, Product} = require('../db/models')
module.exports = router

//admin can see all users
router.get('/:userId/allusers', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const allusers = await User.findAll({
        attributes: ['username', 'id', 'email', 'isAdmin']
      })
      res.json(allusers)
    } else {
      res.send('Nothing to see here!').status(404)
    }
  } catch (err) {
    next(err)
  }
})

//admin/logged in user can view single user profile
router.get('/:userId', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      const user = await User.findOne({
        // explicitly select only the id and email fields - even though
        // users' passwords are encrypted, it won't help if we just
        // send everything to anyone who asks!
        where: {id: req.params.userId},
        attributes: ['id', 'email', 'isAdmin']
      })
      res.json(user)
    } else {
      throw new Error("Couldn't find that please try again")
    }
  } catch (err) {
    next(err)
  }
})

//admin/logged in user can delete user
router.delete(':userId', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      const user = await User.findOne({
        where: {id: req.params.id}
      })
      user.destroy()
      res.send('User Successfully Deleted').status(202)
    } else {
      throw new Error('Error deleting user')
    }
  } catch (err) {
    next(err)
  }
})

//admin/logged in users can update user info
router.put(':userId', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      const user = await User.findOne({
        where: {id: req.params.id}
      })
      user.update({
        username: req.body.username,
        email: req.body.email,
        imageUrl: req.body.imageUrl
      })
    }
  } catch (err) {
    next(err)
  }
})

//Below is cart/order/checkout stuff

router.get('/:userId/orders', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      const getOrders = await Order.findAll({
        where: {
          userId: req.params.userId
        },
        include: {
          model: Product
        }
      })
      res.json(getOrders)
    } else {
      throw new Error("Whoops! Couldn't find that!")
    }
  } catch (error) {
    next(error)
  }
})

router.post('/:userId/cart', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId) {
      const newCart = await Order.create()
      const user = await User.findByPk(req.params.userId)
      newCart.setUser(user)
      res.json(newCart)
    } else {
      throw new Error('Creating new order failed')
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:userId/cart', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId) {
      let getCart = await Order.findOne({
        where: {
          userId: req.params.userId,
          inProgress: true
        },
        include: {
          model: Product
        }
      })

      if (getCart === null) {
        const user = await User.findByPk(req.params.userId)
        getCart = await Order.create()
        await getCart.setUser(user)
      }

      const foundProduct = await Product.findByPk(req.body.productId)
      const order = await getCart.addProduct(foundProduct)

      getCart.totalPrice = getCart.totalPrice + foundProduct.price
      await getCart.save()

      if (order === undefined) {
        getCart.products.forEach(async product => {
          if (product.id === foundProduct.id) {
            product.itemsInOrder.quantity = product.itemsInOrder.quantity + 1
            await product.itemsInOrder.save()
            res.json(product).status(204)
            return null
          }
        })
      } else {
        const newCart = await Order.findOne({
          where: {
            userId: req.params.userId,
            inProgress: true
          },
          include: {
            model: Product
          }
        })

        newCart.products.forEach(product => {
          if (product.id === foundProduct.id) {
            res.json(product).status(204)
            return null
          }
        })
        console.log('bad thing happen')
      }
    } else {
      throw new Error('Error Adding to Cart')
    }
  } catch (error) {
    next(error)
  }
})

// remove product from cart
router.put('/:userId/cart-remove/', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId) {
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
      await getCart.removeProduct(foundProduct)
      getCart.totalPrice = getCart.totalPrice - foundProduct.price
      getCart.save()
      res.json(getCart)
    } else {
      throw new Error('Error Removing from Cart')
    }
  } catch (error) {
    next(error)
  }
})

//find orders in progress
router.get('/:userId/cart', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      const getCart = await Order.findOne({
        where: {
          userId: req.params.userId,
          inProgress: true
        },
        include: {
          model: Product
        }
      })
      res.json(getCart)
    } else {
      throw new Error('Error finding cart please try again')
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:userId/checkout', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId) {
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
    } else {
      throw new Error('Error completing transaction, please try again!')
    }
  } catch (error) {
    next(error)
  }
})
