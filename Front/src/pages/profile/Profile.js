import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaIdCard, FaHistory, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  // Mock user data (would come from API/Redux store in real app)
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '9876543210',
    address: '123 Main Street, Mumbai, Maharashtra',
    pincode: '400001',
    kycStatus: 'pending', // 'pending', 'verified', 'rejected'
    kycDocuments: {
      idProof: null,
      addressProof: null
    }
  });

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
  const handlePersonalDetailsUpdate = (values, { setSubmitting }) => {
    console.log('Updated personal details:', values);
    // Here you would make an API call to update user details
    setTimeout(() => {
      setUserData(values);
      alert('Profile updated successfully!');
      setSubmitting(false);
    }, 1000);
  };

  // Handle KYC document upload
  const handleDocumentUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`Uploading ${type} document:`, file.name);
      // Here you would make an API call to upload the document
      setUserData(prev => ({
        ...prev,
        kycDocuments: {
          ...prev.kycDocuments,
          [type]: file.name
        }
      }));
      alert(`${type} document uploaded successfully!`);
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
                <h5 className="mb-0">{userData.name}</h5>
                <p className="text-muted small">{userData.email}</p>
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
                  <Formik
                    initialValues={userData}
                    validationSchema={personalDetailsSchema}
                    onSubmit={handlePersonalDetailsUpdate}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <Field 
                              type="text" 
                              name="name" 
                              className="form-control" 
                            />
                            <ErrorMessage name="name" component="div" className="text-danger mt-1 small" />
                          </div>
                          
                          <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <Field 
                              type="email" 
                              name="email" 
                              className="form-control" 
                            />
                            <ErrorMessage name="email" component="div" className="text-danger mt-1 small" />
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="mobile" className="form-label">Mobile Number</label>
                            <div className="input-group">
                              <span className="input-group-text">+91</span>
                              <Field 
                                type="text" 
                                name="mobile" 
                                className="form-control" 
                              />
                            </div>
                            <ErrorMessage name="mobile" component="div" className="text-danger mt-1 small" />
                          </div>
                          
                          <div className="col-md-6 mb-3">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <Field 
                              type="text" 
                              name="pincode" 
                              className="form-control" 
                            />
                            <ErrorMessage name="pincode" component="div" className="text-danger mt-1 small" />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">Address</label>
                          <Field 
                            as="textarea" 
                            name="address" 
                            className="form-control" 
                            rows="3"
                          />
                          <ErrorMessage name="address" component="div" className="text-danger mt-1 small" />
                        </div>
                        
                        <div className="d-grid d-md-flex justify-content-md-end">
                          <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Saving...' : <><FaSave className="me-2" /> Save Changes</>}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
              
              {/* KYC Verification Tab */}
              {activeTab === 'kyc' && (
                <div>
                  <h4 className="mb-4">KYC Verification</h4>
                  
                  <div className="alert alert-info mb-4">
                    <div className="d-flex align-items-center">
                      <FaIdCard className="me-3 fs-4" />
                      <div>
                        <h5 className="mb-1">KYC Status: {userData.kycStatus === 'verified' ? 'Verified' : userData.kycStatus === 'rejected' ? 'Rejected' : 'Pending Verification'}</h5>
                        <p className="mb-0">
                          {userData.kycStatus === 'verified' 
                            ? 'Your KYC verification is complete. You can enjoy all services.' 
                            : userData.kycStatus === 'rejected'
                            ? 'Your KYC verification was rejected. Please re-upload valid documents.'
                            : 'Please upload your ID and address proof documents for verification.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">ID Proof</h5>
                          <p className="card-text text-muted small">Upload your Aadhaar Card, PAN Card, Voter ID, or Driving License</p>
                          
                          {userData.kycDocuments.idProof ? (
                            <div className="d-flex align-items-center justify-content-between">
                              <span>{userData.kycDocuments.idProof}</span>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => document.getElementById('idProofUpload').click()}
                              >
                                <FaEdit /> Change
                              </button>
                            </div>
                          ) : (
                            <div className="d-grid">
                              <button 
                                type="button" 
                                className="btn btn-outline-primary"
                                onClick={() => document.getElementById('idProofUpload').click()}
                              >
                                Upload ID Proof
                              </button>
                            </div>
                          )}
                          
                          <input 
                            type="file" 
                            id="idProofUpload" 
                            className="d-none" 
                            accept="image/*, application/pdf"
                            onChange={(e) => handleDocumentUpload('idProof', e)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">Address Proof</h5>
                          <p className="card-text text-muted small">Upload your Utility Bill, Rental Agreement, or Passport</p>
                          
                          {userData.kycDocuments.addressProof ? (
                            <div className="d-flex align-items-center justify-content-between">
                              <span>{userData.kycDocuments.addressProof}</span>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => document.getElementById('addressProofUpload').click()}
                              >
                                <FaEdit /> Change
                              </button>
                            </div>
                          ) : (
                            <div className="d-grid">
                              <button 
                                type="button" 
                                className="btn btn-outline-primary"
                                onClick={() => document.getElementById('addressProofUpload').click()}
                              >
                                Upload Address Proof
                              </button>
                            </div>
                          )}
                          
                          <input 
                            type="file" 
                            id="addressProofUpload" 
                            className="d-none" 
                            accept="image/*, application/pdf"
                            onChange={(e) => handleDocumentUpload('addressProof', e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alert alert-warning">
                    <small>
                      <strong>Note:</strong> Please ensure that the documents are clear and all details are visible. 
                      Verification may take up to 24-48 hours after submission.
                    </small>
                  </div>
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