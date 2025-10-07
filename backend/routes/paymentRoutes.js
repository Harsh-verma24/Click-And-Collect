const express = require('express');
const router = express.Router();

// Create Stripe Checkout Session (requires STRIPE_SECRET_KEY in .env)
router.post('/create-checkout-session', async (req, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(500).json({ msg: 'Stripe not configured. Set STRIPE_SECRET_KEY in your .env' });
    const stripe = require('stripe')(stripeKey);

    const { items, successUrl, cancelUrl } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided for checkout' });
    }

    // validate items
    const errors = [];
    const line_items = items.map((it, idx) => {
      const name = it.name || `item-${idx}`;
      const qty = Number(it.quantity) || 1;
      const priceNum = Number(it.price);
      if (!isFinite(priceNum)) errors.push(`item[${idx}].price is not a valid number`);
      const unit_amount = Math.round(priceNum * 100);
      if (!isFinite(unit_amount) || unit_amount <= 0) errors.push(`item[${idx}].price must be > 0`);

      return {
        price_data: {
          currency: 'usd',
          product_data: { name },
          unit_amount,
        },
        quantity: qty,
      };
    });

    if (errors.length) {
      return res.status(400).json({ error: 'Invalid items', details: errors });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl || 'http://localhost:5173/',
      cancel_url: cancelUrl || 'http://localhost:5173/',
    });

    res.json({ id: session.id, url: session.url });
  } catch (e) {
    console.error('Stripe error', e && e.stack ? e.stack : e);
    // Prefer to return the message while avoiding leaking sensitive internals
    return res.status(500).json({ error: e && e.message ? e.message : 'Internal Server Error' });
  }
});

module.exports = router;
