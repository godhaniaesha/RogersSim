const express = require('express');
const {
  processPayment,
  verifyPayment,
  calculateEmi,
  getPaymentHistory,
  getPaymentById,
  initiateRefund
} = require('../controllers/payments');

const Payment = require('../models/Payment');
const Order = require('../models/Order');

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

router.post("/create-payment-intent", protect, async (req, res) => {
  try {
    const { amount, checkout } = req.body;
    const user = req.user.id;
    console.log("Creating PaymentIntent for:", { amount, checkout, user });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      payment_method_types: ["card"], // Explicitly define method
      metadata: { checkout, user },
    });

    console.log("PaymentIntent created:", paymentIntent);

    const payment = await Payment.create({
      user: user,
      checkout,
      paymentId: paymentIntent.id,
      amount,
      currency: "INR",
      method: "card",
      status: "pending",
    });

    const existingPayment = await Payment.findOne({ paymentId: paymentIntent.id });
    if (!existingPayment) {
      await Payment.create({
        user: user,
        checkout,
        paymentId: paymentIntent.id,
        amount,
        currency: "INR",
        method: "card",
        status: "pending",
      });
    }

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error("PaymentIntent error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Save successful Stripe payment in DB
router.post("/save-stripe-payment", protect, async (req, res) => {
  try {
    const { checkoutId, paymentIntent } = req.body;
    const userId = req.user.id;

    if (!paymentIntent || !paymentIntent.id) {
      return res.status(400).json({ error: "Invalid paymentIntent data" });
    }

    // ✅ Find existing payment by paymentId
    let payment = await Payment.findOne({ paymentId: paymentIntent.id });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Update fields
    payment.checkout = checkoutId; // store checkoutId
    payment.status = paymentIntent.status === "succeeded" ? "success" : "failed";
    payment.gatewayResponse = paymentIntent;

    await payment.save();

    // Update checkout payment status
    const checkout = await Checkout.findById(checkoutId);
    if (checkout) {
      checkout.paymentStatus = payment.status === "success" ? "paid" : "failed";
      checkout.paymentId = payment.paymentId;
      await checkout.save();
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    console.error("Save Stripe Payment error:", err);
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
