const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })

const Seller = require('../model/sellerLoginModel')

async function seed() {
  const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/clickandcollect'
  if (!MONGO_URL) {
    console.error('MONGO_URL not set. Set it in .env or pass MONGO_URL env var.')
    process.exit(1)
  }

  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('DB connected for demo seller seeding')

  const demo = {
    name: 'Demo Seller',
    email: 'seller@example.com',
    password: 'sellerpassword123'
  }

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(demo.password, salt)

  const existing = await Seller.findOne({ email: demo.email })
  if (existing) {
    existing.name = demo.name
    existing.password = hashed
    await existing.save()
    console.log('Updated existing demo seller:', demo.email)
  } else {
    const doc = new Seller({ name: demo.name, email: demo.email, password: hashed })
    await doc.save()
    console.log('Created demo seller:', demo.email)
  }

  console.log('Demo seller credentials:')
  console.log('  email:', demo.email)
  console.log('  password:', demo.password)

  mongoose.disconnect()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
