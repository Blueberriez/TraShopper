'use strict'

const db = require('../server/db')
const {User, Product, Order} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  //10 users in users array, animals/simpsons at email.com/net with password 123
  const users = await Promise.all([
    User.create({email: 'admin@email.com', password: '123', isAdmin: true}),
    User.create({email: 'dog@email.com', password: '123'}),
    User.create({email: 'cat@email.com', password: '123'}),
    User.create({email: 'bear@email.com', password: '123'}),
    User.create({email: 'pig@email.net', password: '123'}),
    User.create({email: 'bart@email.net', password: '123'}),
    User.create({email: 'lisa@email.net', password: '123'}),
    User.create({email: 'homer@email.net', password: '123'}),
    User.create({email: 'marge@email.net', password: '123'}),
    User.create({email: 'maggie@email.net', password: '123'})
  ])

  //25 items in products array, first 10 are 'trash', then 5 'car', 5 'island' and 5 'town'
  const products = await Promise.all([
    //10 trash products
    Product.create({
      category: 'trash',
      name: 'sponge',
      description: 'an old sponge',
      price: 99.99
    }),
    Product.create({
      category: 'trash',
      name: 'beercan',
      description: 'old crusty beer',
      price: 170.0
    }),
    Product.create({
      category: 'trash',
      name: 'used lollipops',
      description: 'a beautiful collection of slightly used lollipops',
      price: 89.5
    }),
    Product.create({
      category: 'trash',
      name: 'oatmeal',
      description: 'a bowl of rotting oatmeal',
      price: 50.1
    }),
    Product.create({
      category: 'trash',
      name: 'lightbulb',
      description: 'a burnt out lightbulb',
      price: 45.75
    }),
    Product.create({
      category: 'trash',
      name: 'coffee grounds',
      description: 'use coffee grounds',
      price: 59.99
    }),
    Product.create({
      category: 'trash',
      name: 'paintbrush',
      description: 'old crusty paintbrush',
      price: 250.0
    }),
    Product.create({
      category: 'trash',
      name: 'calendar',
      description: '2008 calendar (slightly crusty)',
      price: 70.7
    }),
    Product.create({
      category: 'trash',
      name: 'broken cup',
      description: 'classy cup with a hole in the bottom',
      price: 33.0
    }),
    Product.create({
      category: 'trash',
      name: 'empty box',
      description: 'empty cardboard box (mildly crusty)',
      price: 80.0
    }),
    //5 car products
    Product.create({
      category: 'car',
      name: 'ferrari',
      description: 'a fancy car',
      price: 300000.0
    }),
    Product.create({
      category: 'car',
      name: 'dolorean2',
      description: 'a car from the future',
      price: 500000.0
    }),
    Product.create({
      category: 'car',
      name: '96 subaru',
      description: 'a classic car',
      price: 1000000.0
    }),
    Product.create({
      category: 'car',
      name: 'lamborgini',
      description: 'a race car',
      price: 500000.0
    }),
    Product.create({
      category: 'car',
      name: 'model t',
      description: 'an old car',
      price: 500000.0
    }),
    //5 island products
    Product.create({
      category: 'island',
      name: 'Yurdurshorin',
      description: 'a small island',
      price: 5000000.0
    }),
    Product.create({
      category: 'island',
      name: 'Forturin',
      description: 'a small island',
      price: 7000000.0
    }),
    Product.create({
      category: 'island',
      name: 'Torgur',
      description: 'a small island',
      price: 400000.0
    }),
    Product.create({
      category: 'island',
      name: 'Bornst',
      description: 'a small island',
      price: 55000000.0
    }),
    Product.create({
      category: 'island',
      name: 'Coragorsha',
      description: 'a big island',
      price: 10000000.0
    })
    //
  ])

  //Creating 2 cart for now
  const orders = await Promise.all([
    Order.create({inProgress: false}),
    Order.create()
  ])
  //using the 'magic' addProducts method created by the many to many relationship
  await orders[0].addProducts([
    products[0],
    products[1],
    products[2],
    products[8]
  ])
  //using the 'magic' setUser method created by the one to one relationship between Cart and User
  await orders[0].setUser(users[0])
  orders[0].totalPrice =
    products[0].price +
    products[1].price +
    products[2].price +
    products[8].price
  await orders[0].save()
  //if this works like I think it should, now our user 'admin@email.com' will have one cart with 5 items in it

  //second order/cart
  // await orders[1].addProducts([products[3],[products[12], [products[1]])
  const order = await orders[1].addProduct(products[1])
  await orders[1].addProduct(products[3])
  await orders[1].setUser(users[1])
  console.log(order)
  order[0].quantity = 5
  await order[0].save()

  console.log(products[1])
  orders[1].totalPrice =
    products[1].price * order[0].quantity + products[3].price
  await orders[1].save()
  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
