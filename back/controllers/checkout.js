const Checkout = require('../models/Checkout');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');
const Plan = require('../models/Plan');

// helper to round numbers to 2 decimals
const round2 = (num) => Number(num.toFixed(2));

/* ────────── Create new checkout/order ────────── */
exports.createCheckout = async (req, res, next) => {
  try {
    const { items, paymentMethod, emiMonths, shippingAddress } = req.body;

    // Build items array with totalPrice automatically
    const populatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      let price = 0;

      if (item.productId) {
        const product = await Product.findById(item.productId).select('price');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        price = product.price;
      } else if (item.planId) {
        const plan = await Plan.findById(item.planId).select('price');
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        price = plan.price;
      }

      const quantity = item.quantity || 1;
      const totalPrice = round2(price * quantity);
      subtotal += totalPrice;

      populatedItems.push({
        productId: item.productId,
        planId: item.planId,
        quantity,
        totalPrice
      });
    }

    subtotal = round2(subtotal);

    // Compute tax & total
    const tax = round2(subtotal * 0.12); // example GST
    const total = round2(subtotal + tax);

    // Compute EMI fields if needed
    let upfrontPayment = null;
    let remainingAmount = null;
    let emiPerMonth = null;
    if (paymentMethod === 'emi') {
      upfrontPayment = round2(total * 0.5); // 50% upfront
      remainingAmount = round2(total - upfrontPayment);
      emiPerMonth = round2(remainingAmount / emiMonths);
    }

    // Set status to 'success' if paymentMethod is 'full'
    const checkout = await Checkout.create({
      user: req.user._id,
      items: populatedItems,
      subtotal,
      tax,
      total,
      paymentMethod,
      emiMonths: paymentMethod === 'emi' ? emiMonths : undefined,
      upfrontPayment,
      remainingAmount,
      emiPerMonth,
      shippingAddress,
      emiPayments: [], // start empty
      status: paymentMethod == 'full' ? 'completed' : undefined
    });
    console.log("checkout", checkout,"========");
    

    res.status(201).json({ status: 'success', data: { checkout } });
  } catch (err) {
    next(err);
  }
};

/* ────────── Get all checkouts ────────── */
exports.getAllCheckouts = async (req, res, next) => {
  try {
    const checkouts = await Checkout.find().populate({
      path: 'shippingAddress',
      populate: { path: 'user' }
    });

    res.status(200).json({
      status: 'success',
      results: checkouts.length,
      data: { checkouts }
    });
  } catch (err) {
    next(err);
  }
};

/* ────────── Get single checkout ────────── */
exports.getCheckout = async (req, res, next) => {
  try {
    const checkout = await Checkout.findById(req.params.id).populate({
      path: 'shippingAddress',
      populate: { path: 'user' }
    });

    if (!checkout) {
      return next(new ErrorResponse('No checkout found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { checkout } });
  } catch (err) {
    next(err);
  }
};

/* ────────── Update checkout ────────── */
exports.updateCheckout = async (req, res, next) => {
  try {
    // if numbers come in body, round them
    if (req.body.subtotal) req.body.subtotal = round2(req.body.subtotal);
    if (req.body.tax) req.body.tax = round2(req.body.tax);
    if (req.body.total) req.body.total = round2(req.body.total);
    if (req.body.upfrontPayment) req.body.upfrontPayment = round2(req.body.upfrontPayment);
    if (req.body.remainingAmount) req.body.remainingAmount = round2(req.body.remainingAmount);
    if (req.body.emiPerMonth) req.body.emiPerMonth = round2(req.body.emiPerMonth);

    const checkout = await Checkout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'shippingAddress',
      populate: { path: 'user' }
    });

    if (!checkout) {
      return next(new ErrorResponse('No checkout found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { checkout } });
  } catch (err) {
    next(err);
  }
};

/* ────────── Delete checkout ────────── */
exports.deleteCheckout = async (req, res, next) => {
  try {
    const checkout = await Checkout.findByIdAndDelete(req.params.id);

    if (!checkout) {
      return next(new ErrorResponse('No checkout found with that ID', 404));
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

/* ────────── Update payment status ────────── */
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const checkout = await Checkout.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true, runValidators: true }
    ).populate({
      path: 'shippingAddress',
      populate: { path: 'user' }
    });

    if (!checkout) {
      return next(new ErrorResponse('No checkout found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { checkout } });
  } catch (err) {
    next(err);
  }
};

/* ────────── Update order status ────────── */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const checkout = await Checkout.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate({
      path: 'shippingAddress',
      populate: { path: 'user' }
    });

    if (!checkout) {
      return next(new ErrorResponse('No checkout found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { checkout } });
  } catch (err) {
    next(err);
  }
};

/* ────────── Add EMI payment (new endpoint) ────────── */
// POST /api/checkouts/:id/emi-payment
exports.addEmiPayment = async (req, res, next) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return next(new ErrorResponse('Checkout not found', 404));

    if (checkout.paymentMethod !== 'emi') {
      return next(new ErrorResponse('This checkout is not on EMI', 400));
    }

    const { amountPaid } = req.body;
    if (!amountPaid || amountPaid <= 0) {
      return next(new ErrorResponse('Amount must be > 0', 400));
    }

    // ✅ Already fully paid?
    if (checkout.remainingAmount <= 0 || checkout.paymentStatus === 'paid') {
      return next(new ErrorResponse('This EMI is already fully paid', 400));
    }

    // ✅ Already reached max months?
    if (checkout.emiPayments.length >= checkout.emiMonths) {
      return next(
        new ErrorResponse(
          `All ${checkout.emiMonths} EMI payments have already been recorded`,
          400
        )
      );
    }

    // Auto month number = current emiPayments length + 1
    const nextMonthNumber = checkout.emiPayments.length + 1;

    // ✅ Check allowed amount for this month
    const emiPerMonth = checkout.emiPerMonth; // stored at checkout creation
    const allowedAmount =
      nextMonthNumber === checkout.emiMonths
        ? checkout.remainingAmount // last month can pay whatever remains
        : emiPerMonth;

    if (amountPaid > allowedAmount) {
      return next(
        new ErrorResponse(
          `You can pay maximum ${round2(allowedAmount)} this month`,
          400
        )
      );
    }

    // Subtract paid amount from remainingAmount
    checkout.remainingAmount = round2(
      Math.max(checkout.remainingAmount - amountPaid, 0)
    );

    // Push payment record
    checkout.emiPayments.push({
      monthNumber: nextMonthNumber,
      amountPaid: round2(amountPaid),
      paidAt: new Date()
    });

    // If fully paid
    if (checkout.remainingAmount <= 0) {
      checkout.paymentStatus = 'paid';
      checkout.status = 'completed';
    }

    await checkout.save();

    res.status(200).json({
      status: 'success',
      data: { checkout }
    });
  } catch (err) {
    next(err);
  }
};
