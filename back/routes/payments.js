const express = require('express');
const {
  processPayment,
  verifyPayment,
  calculateEmi,
  getPaymentHistory,
  getPaymentById,
  initiateRefund
} = require('../controllers/payments');

const router = express.Router();

const { protect } = require('../middleware/auth');
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

// Create a Stripe Checkout Session for simple redirect-based payments
router.post("/create-checkout-session", async (req, res) => {
  const { amount, planId, phone, userId } = req.body;
  console.log(userId,"===bbb");
  
  try {
    if (!amount || !planId || !phone) {
      return res.status(400).json({ error: "amount, planId and phone are required" });
    }

    const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `Plan ${planId}` },
            unit_amount: amount, // amount is in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/plans?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plans?canceled=true`,
      metadata: { planId: String(planId), phone: String(phone), userId: userId ? String(userId) : '' },
    });

    // Optionally create a pending Payment record now (will be updated after success)
    try {
      await Payment.create({
        user: userId || null,
        phone,
        planId,
        amount: Math.round((amount || 0) / 100), // store as rupees
        currency: 'INR',
        stripeSessionId: session.id,
        status: 'pending',
      });
    } catch (createErr) {
      // Ignore duplicate errors if retried; log others
      if (createErr.code !== 11000) {
        console.error('Pending payment create error:', createErr);
      }
    }

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Record payment after successful redirect by retrieving session from Stripe
router.post('/record-payment', async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    const amountTotalPaise = session.amount_total || 0;
    const amountRupees = Math.round(amountTotalPaise / 100);

    const statusMap = {
      paid: 'success',
      unpaid: 'pending',
      no_payment_required: 'success'
    };
    const mappedStatus = statusMap[session.payment_status] || 'pending';

    const update = {
      phone: session.metadata?.phone,
      planId: session.metadata?.planId,
      amount: amountRupees,
      currency: (session.currency || 'inr').toUpperCase(),
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId || undefined,
      status: mappedStatus,
      gatewayResponse: session, // store the session snapshot
      updatedAt: new Date(),
    };

    const payment = await Payment.findOneAndUpdate(
      { stripeSessionId: session.id },
      { $set: update },
      { new: true, upsert: true }
    );

    res.json({ success: true, payment });
  } catch (err) {
    console.error('Record payment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create PaymentIntent for CardElement flow
router.post("/create-payment-intent", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `Plan ${planId}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: { planId, phone },
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.get('/check-pay-api', (req, res) => {
  res.send('Payments API is running...');
});
// router.get('/', protect, getPaymentHistory);
// router.get('/:id', protect, getPaymentById);
// router.post('/', protect, processPayment);
// router.post('/verify', protect, verifyPayment);
// router.post('/calculate-emi', calculateEmi);
// router.post('/:id/refund', protect, initiateRefund);

module.exports = router;