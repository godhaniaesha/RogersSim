import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaUser, FaIdCard, FaHistory, FaMapMarkerAlt, FaEdit, FaSave, FaBarcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure, fetchProfileStart, fetchProfileSuccess, fetchProfileFailure } from '../../store/slices/authSlice';
import authService from '../../services/authService';
import { fetchUserProfile, updateUserProfile } from '../../store/slices/userSlice';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [barcode, setBarcode] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardActivated, setCardActivated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user profile from Redux
  const { user, loading, error, isAuthenticated } = useSelector(state => state.auth);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(fetchUserProfile())
      .unwrap()
      .then(() => {
        toast.success('Profile loaded successfully');
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [isAuthenticated, navigate, dispatch]);


  // Mock order history
  const [orders, setOrders] = useState([
    {
      id: 'ORD123456',
      date: '2023-06-15',
      product: 'Prepaid SIM Card',
      plan: 'Value Plan - ₹399',
      status: 'Delivered',
      amount: 399
    },
    {
      id: 'ORD123457',
      date: '2023-07-20',
      product: 'Data Add-on',
      plan: 'Extra 2GB Data',
      status: 'Active',
      amount: 49
    },
    {
      id: 'ORD123458',
      date: '2023-08-10',
      product: 'Postpaid SIM Card',
      plan: 'Premium Plan - ₹699',
      status: 'Processing',
      amount: 699
    }
  ]);

  // Validation schema for personal details
  const personalDetailsSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile number is required'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
      .required('Pincode is required')
  });

  // Handle personal details update
  const handlePersonalDetailsUpdate = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateUserProfile(values)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };


  // Handle KYC document upload
  const handleDocumentUpload = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success(`${type} uploaded successfully!`);
    } catch (err) {
      toast.error(err || 'Failed to upload document');
    }
  };


  return (
    <div className="container py-5">
      <div className="row">
        {/* Profile Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="bg-light-custom rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                  <FaUser className="text-primary-custom" size={40} />
                </div>
                <h5 className="mb-0">{user.name}</h5>
                <p className="text-muted small">{user.email}</p>
              </div>

              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'personal' ? 'active bg-primary-custom text-white' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  <FaUser className="me-2" /> Personal Details
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'kyc' ? 'active bg-primary-custom text-white' : ''}`}
                  onClick={() => setActiveTab('kyc')}
                >
                  <FaIdCard className="me-2" /> KYC Verification
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'orders' ? 'active bg-primary-custom text-white' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <FaHistory className="me-2" /> Order History
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'activate' ? 'active bg-primary-custom text-white' : ''}`}
                  onClick={() => setActiveTab('activate')}
                >
                  <FaBarcode className="me-2" /> Activate Card
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="col-md-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {/* Personal Details Tab */}
              {activeTab === 'personal' && (
                <div>
                  <h4 className="mb-4">Personal Details</h4>
                  <Formik initialValues={user} validationSchema={personalDetailsSchema} onSubmit={handlePersonalDetailsUpdate} enableReinitialize>
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <Field name="name" className="form-control" />
                            <ErrorMessage name="name" component="div" className="text-danger small" />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field name="email" type="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger small" />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="mobile" className="form-label">Mobile</label>
                            <Field name="mobile" className="form-control" />
                            <ErrorMessage name="mobile" component="div" className="text-danger small" />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <Field name="pincode" className="form-control" />
                            <ErrorMessage name="pincode" component="div" className="text-danger small" />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">Address</label>
                          <Field name="address" as="textarea" className="form-control" rows={3} />
                          <ErrorMessage name="address" component="div" className="text-danger small" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : <><FaSave className="me-2" /> Save Changes</>}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}

              {/* KYC Verification Tab */}
              {activeTab === 'kyc' && (
                <div>
                  <h4>KYC Status: {user.kycStatus}</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <input type="file" onChange={(e) => handleDocumentUpload('idProof', e)} />
                      <p>ID Proof: {user.kycDocuments?.idProof || 'Not uploaded'}</p>
                    </div>
                    <div className="col-md-6">
                      <input type="file" onChange={(e) => handleDocumentUpload('addressProof', e)} />
                      <p>Address Proof: {user.kycDocuments?.addressProof || 'Not uploaded'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activate Card Tab */}
              {activeTab === 'activate' && (
                <div>
                  <h4 className="mb-4">Activate Card</h4>
                  <div className="mb-3">
                    <label htmlFor="barcode" className="form-label">Barcode Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="barcode"
                      value={barcode}
                      onChange={e => setBarcode(e.target.value)}
                      placeholder="Enter your card's barcode number"
                      disabled={otpSent || cardActivated}
                    />
                  </div>
                  {!otpSent && !cardActivated && (
                    <button
                      className="btn btn-primary mb-3"
                      disabled={!barcode || barcode.length < 8}
                      onClick={() => {
                        setOtpSent(true);
                        toast.info('OTP sent to your registered mobile number');
                      }}
                    >
                      Send OTP
                    </button>
                  )}
                  {otpSent && !cardActivated && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="otp" className="form-label">Enter 6-digit OTP</label>
                        <input
                          type="text"
                          className="form-control"
                          id="otp"
                          value={otp}
                          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                          maxLength={6}
                          placeholder="Enter OTP"
                        />
                      </div>
                      <button
                        className="btn btn-success"
                        disabled={otp.length !== 6}
                        onClick={() => {
                          setCardActivated(true);
                          setShowSuccess(true);
                          setTimeout(() => {
                            setShowSuccess(false);
                            setActiveTab('personal');
                            setBarcode('');
                            setOtp('');
                            setOtpSent(false);
                            setCardActivated(false);
                          }, 2500);
                          toast.success('Card activated successfully!');
                        }}
                      >
                        Verify & Activate
                      </button>
                    </>
                  )}
                  {showSuccess && (
                    <div className="alert alert-success mt-4" role="alert">
                      Card activated successfully!
                    </div>
                  )}
                  {cardActivated && !showSuccess && (
                    <div className="alert alert-success mt-4" role="alert">
                      Card already activated.
                    </div>
                  )}
                </div>
              )}
              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h4 className="mb-4">Order History</h4>

                  {orders.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Status</th>
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FaHistory className="text-muted mb-3" size={40} />
                      <h5>No Orders Yet</h5>
                      <p className="text-muted">You haven't placed any orders yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;