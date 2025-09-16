import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHistory, FaDownload, FaEye } from 'react-icons/fa';

const OrderHistory = () => {
  // Mock order history data (would come from API in real app)
  const [orders, setOrders] = useState([
    {
      id: 'ORD123456',
      date: '2023-06-15',
      product: 'Prepaid SIM Card',
      plan: 'Value Plan - ₹399',
      status: 'Delivered',
      amount: 399,
      paymentType: 'Full Payment',
      deliveryAddress: '123 Main Street, Mumbai, Maharashtra - 400001'
    },
    {
      id: 'ORD123457',
      date: '2023-07-20',
      product: 'Data Add-on',
      plan: 'Extra 2GB Data',
      status: 'Active',
      amount: 49,
      paymentType: 'Full Payment',
      deliveryAddress: 'N/A (Digital Product)'
    },
    {
      id: 'ORD123458',
      date: '2023-08-10',
      product: 'Postpaid SIM Card',
      plan: 'Premium Plan - ₹699',
      status: 'Processing',
      amount: 699,
      paymentType: 'EMI (₹350 paid, 5 x ₹70 remaining)',
      deliveryAddress: '456 Park Avenue, Delhi, Delhi - 110001'
    }
  ]);

  // State for order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Download invoice (mock function)
  const downloadInvoice = (orderId) => {
    console.log(`Downloading invoice for order ${orderId}`);
    alert(`Invoice for order ${orderId} would be downloaded here`);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Order History</h2>
            <Link to="/profile" className="btn btn-outline-primary">
              Back to Profile
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td><strong>{order.id}</strong></td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>{order.product}</td>
                          <td>{order.plan}</td>
                          <td>₹{order.amount}</td>
                          <td>
                            <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Processing' ? 'bg-warning' : 'bg-primary'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary me-2" 
                              onClick={() => viewOrderDetails(order)}
                              data-bs-toggle="modal"
                              data-bs-target="#orderDetailsModal"
                            >
                              <FaEye /> View
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary" 
                              onClick={() => downloadInvoice(order.id)}
                            >
                              <FaDownload /> Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <FaHistory className="text-muted mb-3" size={40} />
                <h5>No Orders Yet</h5>
                <p className="text-muted mb-4">You haven't placed any orders yet.</p>
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <div className="modal fade" id="orderDetailsModal" tabIndex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {selectedOrder && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="orderDetailsModalLabel">Order Details - {selectedOrder.id}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6>Order Information</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">Order ID:</td>
                            <td>{selectedOrder.id}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Date:</td>
                            <td>{new Date(selectedOrder.date).toLocaleDateString()}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Status:</td>
                            <td>
                              <span className={`badge ${selectedOrder.status === 'Delivered' ? 'bg-success' : selectedOrder.status === 'Processing' ? 'bg-warning' : 'bg-primary'}`}>
                                {selectedOrder.status}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-6">
                      <h6>Payment Information</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">Amount:</td>
                            <td>₹{selectedOrder.amount}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Payment Type:</td>
                            <td>{selectedOrder.paymentType}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Product Information</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">Product:</td>
                            <td>{selectedOrder.product}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Plan:</td>
                            <td>{selectedOrder.plan}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-6">
                      <h6>Delivery Information</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">Address:</td>
                            <td>{selectedOrder.deliveryAddress}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => downloadInvoice(selectedOrder.id)}
                  >
                    <FaDownload className="me-2" /> Download Invoice
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;