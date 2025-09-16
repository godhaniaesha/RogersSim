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
// router.post("/create-checkout-session", async (req, res) => {
//   const { amount, planId, phone } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: { name: `Plan ${planId}` },
//             unit_amount: amount,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${req.headers.origin}/success`,
//       cancel_url: `${req.headers.origin}/cancel`,
//       metadata: { planId, phone },
//     });
//     res.json({ sessionId: session.id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// Create PaymentIntent for CardElement flow
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Amount must be in paise (smallest currency unit for INR)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // e.g. ₹500 → 50000
      currency: "inr",
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("PaymentIntent error:", err);
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
