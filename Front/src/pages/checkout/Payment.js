import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCheckoutById } from "../../store/slices/checkOutSlice";
import { createOrder } from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { saveStripePayment } from "../../store/slices/paymentSlice";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const paymentDetails = location.state || {};
  const orderId = paymentDetails.orderId || localStorage.getItem("checkoutId");

  // Get checkout details from Redux
  const { currentCheckout, loading } = useSelector((state) => state.checkout);
  // console.log("currentCheckout", currentCheckout.checkout);

  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Fetch checkout/order details by id
  useEffect(() => {
    if (orderId) {
      dispatch(fetchCheckoutById(orderId));
    }
  }, [dispatch, orderId]);

  // Use total from fetched checkout
  const amount = currentCheckout?.total || 0;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError("");

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    try {
      // 1️⃣ Create PaymentIntent on server
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/payments/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkoutId: orderId,
          amount: amount,
        }),
      });

      const data = await res.json();
      console.log("👉 PaymentIntent response:", data);

      if (!data.clientSecret) {
        toast.error(data.error || "Failed to create payment intent");
        setProcessing(false);
        return;
      }

      const { clientSecret } = data;

      // 2️⃣ Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardName,
            email: "customer@example.com", // ideally from logged-in user
          },
        },
      });

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");

        // Save in backend
        await dispatch(
          saveStripePayment({
            userId: currentCheckout?.user || "USER_ID", // from Redux auth
            orderId,
            checkoutId: orderId,
            paymentIntent,
          })
        );

        // Order create logic
        const orderPayload = {
          checkout: orderId,
          shippingAddress: paymentDetails.address?.id || currentCheckout?.shippingAddress?._id,
          paymentId: paymentIntent.id,
          amount: amount,
          status: "paid",
        };
        console.log(orderPayload, " Order Payload");

        const result = await dispatch(createOrder(orderPayload));

        await dispatch(clearCart());
        if (createOrder.fulfilled.match(result)) {
          toast.success("Order created successfully!");
        } else {
          toast.error(result.payload || "Failed to create order");
        }

        navigate("/");
      }
    } catch (err) {
      setPaymentError(err.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Payment Details</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePaymentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Card Details</Form.Label>
                  <div className="p-2 border rounded">
                    <CardElement options={{ hidePostalCode: true }} />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </Form.Group>

                {paymentError && (
                  <p className="text-danger small">{paymentError}</p>
                )}

                <div className="d-grid">
                  <Button type="submit" disabled={processing || !stripe || loading}>
                    {processing
                      ? "Processing..."
                      : `Pay ₹${amount}`}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
