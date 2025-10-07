const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sellerLogin = require('../model/sellerLoginModel');
const userModel = require('../model/userModel');

router.get('/token', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(400).json({ msg: 'No token provided' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await sellerLogin.findById(payload.id).select('-password');
    const user = await userModel.findById(payload.id).select('-password');
    return res.json({ payload, isSeller: !!seller, isUser: !!user });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
