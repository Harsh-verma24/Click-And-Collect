const mongoose = require('mongoose');
const Product = require('../model/sellerProductUploadModel');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('DB connected for seeding');

    const doc = new Product({
      userId: new mongoose.Types.ObjectId(),
      productName: 'Seeded Product',
      productCategory: 'Laptop',
      productOriginalPrice: 1500,
      productOfferPrice: 1200,
      productImage: 'https://via.placeholder.com/600x400?text=Seeded+Product'
    });

    await doc.save();
    console.log('Seeded product saved:', doc._id);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();