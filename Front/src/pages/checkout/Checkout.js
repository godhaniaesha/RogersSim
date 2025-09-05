import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, fetchCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import cartService from '../../services/cartService';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get cart state from Redux
  const { items: cartItems } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculate cart total from Redux
  const cartTotal = cartItems ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0) : 547;
  
  // Fetch cart items when component mounts
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // If cart is empty, redirect to products
    if (cartItems && cartItems.length === 0 && !loading) {
      toast.error('Your cart is empty');
      navigate('/products');
    }
    
    setLoading(false);
  }, [isAuthenticated, cartItems, loading, navigate]);
  
  // Fetch addresses from API
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Doe',
      mobile: '9876543210',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
    {
      id: 2,
      name: 'John Doe',
      mobile: '9876543210',
      address: '456 Park Avenue, Floor 2',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      isDefault: false
    }
  ]);
  
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('full');
  const [emiMonths, setEmiMonths] = useState(3);
  
  // Calculate EMI details
  const calculateEMI = () => {
    const finalPrice = cartTotal + (cartTotal * 0.10);
    const advance = finalPrice * 0.5;
    const emiPerMonth = (finalPrice - advance) / emiMonths;
    
    return {
      finalPrice: finalPrice.toFixed(2),
      advance: advance.toFixed(2),
      emiPerMonth: emiPerMonth.toFixed(2),
      totalMonths: emiMonths
    };
  };
  
  // Address form validation schema
  const addressSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
    isDefault: Yup.boolean()
  });
  
  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };
  
  // Handle add/edit address form submission
  const handleAddressSubmit = async (values, { resetForm }) => {
    try {
      if (editingAddress) {
        // Update existing address via API
        await cartService.updateAddress({ ...values, id: editingAddress.id });
        
        // Update local state
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? { ...values, id: addr.id } : addr
        ));
        setEditingAddress(null);
        toast.success('Address updated successfully');
      } else {
        // Add new address via API
        const newAddress = {
          ...values,
          id: addresses.length + 1
        };
        const savedAddress = await cartService.addAddress(newAddress);
        
        // Update local state with the saved address
        setAddresses([...addresses, savedAddress || newAddress]);
        toast.success('Address added successfully');
      }
      
      setShowAddressForm(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    }
  };
  
  // Edit address
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };
  
  // Process payment
  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    
    try {
      // Create order in the backend
      const orderData = await cartService.createOrder({
        addressId: selectedAddress,
        paymentMethod,
        emiMonths: paymentMethod === 'emi' ? emiMonths : null
      });
      
      // Navigate to payment page with payment details and order ID
      navigate('/payment', { 
        state: { 
          orderId: orderData?.orderId,
          paymentMethod,
          amount: paymentMethod === 'full' ? cartTotal : calculateEMI().advance,
          emiDetails: paymentMethod === 'emi' ? calculateEMI() : null
        } 
      });
    } catch (err) {
      toast.error(err.message || 'Failed to create order');
    }
  };
  
  return (
    <div className="container py-5">
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading checkout...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">Checkout</h1>
            <Link to="/cart" className="btn btn-outline-primary">
              <FaArrowLeft className="me-2" /> Back to Cart
            </Link>
          </div>
        </div>
      </div>

      // <div className="row">
      //   {/* Checkout Form */}
      //   <div className="col-lg-8 mb-4">
      //     {/* Delivery Address */}
      //     <div className="card border-0 shadow-sm mb-4">
      //       <div className="card-header bg-white py-3">
      //         <h4 className="mb-0">Delivery Address</h4>
      //       </div>
      //       <div className="card-body">
      //         {!showAddressForm ? (
      //           <>
      //             {addresses.map(address => (
      //               <div 
      //                 key={address.id} 
      //                 className={`card mb-3 ${selectedAddress === address.id ? 'border-primary' : 'border-light'}`}
      //                 onClick={() => handleAddressSelect(address.id)}
      //                 style={{ cursor: 'pointer' }}
      //               >
      //                 <div className="card-body">
      //                   <div className="d-flex justify-content-between">
      //                     <div className="form-check">
      //                       <input 
      //                         className="form-check-input" 
      //                         type="radio" 
      //                         name="addressSelection" 
      //                         id={`address-${address.id}`}
      //                         checked={selectedAddress === address.id}
      //                         onChange={() => handleAddressSelect(address.id)}
      //                       />
      //                       <label className="form-check-label" htmlFor={`address-${address.id}`}>
      //                         <strong>{address.name}</strong>
      //                         {address.isDefault && (
      //                           <span className="badge bg-primary ms-2">Default</span>
      //                         )}
      //                       </label>
      //                     </div>
      //                     <button 
      //                       className="btn btn-sm btn-link text-decoration-none"
      //                       onClick={(e) => {
      //                         e.stopPropagation();
      //                         handleEditAddress(address);
      //                       }}
      //                     >
      //                       <FaEdit /> Edit
      //                     </button>
      //                   </div>
      //                   <div className="mt-2 ps-4">
      //                     <div>{address.mobile}</div>
      //                     <div>{address.address}</div>
      //                     <div>{address.city}, {address.state} - {address.pincode}</div>
      //                   </div>
      //                 </div>
      //               </div>
      //             ))}
                  
      //             <button 
      //               className="btn btn-outline-primary mt-2"
      //               onClick={() => {
      //                 setEditingAddress(null);
      //                 setShowAddressForm(true);
      //               }}
      //             >
      //               <FaPlus className="me-2" /> Add New Address
      //             </button>
      //           </>
      //         ) : (
      //           <div className="card border-light">
      //             <div className="card-body">
      //               <h5 className="mb-3">{editingAddress ? 'Edit Address' : 'Add New Address'}</h5>
                    
      //               <Formik
      //                 initialValues={editingAddress || {
      //                   name: '',
      //                   mobile: '',
      //                   address: '',
      //                   city: '',
      //                   state: '',
      //                   pincode: '',
      //                   isDefault: false
      //                 }}
      //                 validationSchema={addressSchema}
      //                 onSubmit={handleAddressSubmit}
      //               >
      //                 {({ isSubmitting }) => (
      //                   <Form>
      //                     <div className="row">
      //                       <div className="col-md-6 mb-3">
      //                         <label htmlFor="name" className="form-label">Full Name</label>
      //                         <Field name="name" type="text" className="form-control" />
      //                         <ErrorMessage name="name" component="div" className="text-danger small" />
      //                       </div>
                            
      //                       <div className="col-md-6 mb-3">
      //                         <label htmlFor="mobile" className="form-label">Mobile Number</label>
      //                         <Field name="mobile" type="text" className="form-control" />
      //                         <ErrorMessage name="mobile" component="div" className="text-danger small" />
      //                       </div>
      //                     </div>
                          
      //                     <div className="mb-3">
      //                       <label htmlFor="address" className="form-label">Address</label>
      //                       <Field name="address" as="textarea" className="form-control" rows="2" />
      //                       <ErrorMessage name="address" component="div" className="text-danger small" />
      //                     </div>
                          
      //                     <div className="row">
      //                       <div className="col-md-4 mb-3">
      //                         <label htmlFor="city" className="form-label">City</label>
      //                         <Field name="city" type="text" className="form-control" />
      //                         <ErrorMessage name="city" component="div" className="text-danger small" />
      //                       </div>
                            
      //                       <div className="col-md-4 mb-3">
      //                         <label htmlFor="state" className="form-label">State</label>
      //                         <Field name="state" type="text" className="form-control" />
      //                         <ErrorMessage name="state" component="div" className="text-danger small" />
      //                       </div>
                            
      //                       <div className="col-md-4 mb-3">
      //                         <label htmlFor="pincode" className="form-label">Pincode</label>
      //                         <Field name="pincode" type="text" className="form-control" />
      //                         <ErrorMessage name="pincode" component="div" className="text-danger small" />
      //                       </div>
      //                     </div>
                          
      //                     <div className="mb-3">
      //                       <div className="form-check">
      //                         <Field 
      //                           name="isDefault" 
      //                           type="checkbox" 
      //                           className="form-check-input" 
      //                           id="isDefault" 
      //                         />
      //                         <label className="form-check-label" htmlFor="isDefault">
      //                           Set as default address
      //                         </label>
      //                       </div>
      //                     </div>
                          
      //                     <div className="d-flex gap-2">
      //                       <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
      //                         {editingAddress ? 'Update Address' : 'Save Address'}
      //                       </button>
      //                       <button 
      //                         type="button" 
      //                         className="btn btn-outline-secondary"
      //                         onClick={() => setShowAddressForm(false)}
      //                       >
      //                         Cancel
      //                       </button>
      //                     </div>
      //                   </Form>
      //                 )}
      //               </Formik>
      //             </div>
      //           </div>
      //         )}
      //       </div>
      //     </div>
          
      //     {/* Payment Options */}
      //     <div className="card border-0 shadow-sm">
      //       <div className="card-header bg-white py-3">
      //         <h4 className="mb-0">Payment Options</h4>
      //       </div>
      //       <div className="card-body">
      //         <div className="mb-4">
      //           <div className="form-check mb-3">
      //             <input 
      //               className="form-check-input" 
      //               type="radio" 
      //               name="paymentMethod" 
      //               id="fullPayment" 
      //               checked={paymentMethod === 'full'}
      //               onChange={() => setPaymentMethod('full')}
      //             />
      //             <label className="form-check-label" htmlFor="fullPayment">
      //               <div className="d-flex align-items-center">
      //                 <FaCreditCard className="text-primary me-2" />
      //                 <div>
      //                   <div><strong>Full Payment</strong></div>
      //                   <div className="text-muted small">Pay the entire amount now</div>
      //                 </div>
      //               </div>
      //             </label>
      //           </div>
                
      //           <div className="form-check">
      //             <input 
      //               className="form-check-input" 
      //               type="radio" 
      //               name="paymentMethod" 
      //               id="emiPayment" 
      //               checked={paymentMethod === 'emi'}
      //               onChange={() => setPaymentMethod('emi')}
      //             />
      //             <label className="form-check-label" htmlFor="emiPayment">
      //               <div className="d-flex align-items-center">
      //                 <FaMoneyBill className="text-primary me-2" />
      //                 <div>
      //                   <div><strong>EMI Payment</strong></div>
      //                   <div className="text-muted small">Pay 50% now and rest in monthly installments</div>
      //                 </div>
      //               </div>
      //             </label>
      //           </div>
      //         </div>
              
      //         {paymentMethod === 'emi' && (
      //           <div className="card bg-light border-0 mt-3">
      //             <div className="card-body">
      //               <h5 className="mb-3">EMI Details</h5>
                    
      //               <div className="mb-3">
      //                 <label htmlFor="emiMonths" className="form-label">Select EMI Duration</label>
      //                 <select 
      //                   className="form-select" 
      //                   id="emiMonths"
      //                   value={emiMonths}
      //                   onChange={(e) => setEmiMonths(parseInt(e.target.value))}
      //                 >
      //                   <option value="3">3 Months</option>
      //                   <option value="6">6 Months</option>
      //                   <option value="9">9 Months</option>
      //                   <option value="12">12 Months</option>
      //                 </select>
      //               </div>
                    
      //               <div className="table-responsive">
      //                 <table className="table table-sm">
      //                   <tbody>
      //                     <tr>
      //                       <td>Original Price:</td>
      //                       <td className="text-end">₹{cartTotal}</td>
      //                     </tr>
      //                     <tr>
      //                       <td>Processing Fee (10%):</td>
      //                       <td className="text-end">₹{(cartTotal * 0.1).toFixed(2)}</td>
      //                     </tr>
      //                     <tr>
      //                       <td>Final Price:</td>
      //                       <td className="text-end">₹{calculateEMI().finalPrice}</td>
      //                     </tr>
      //                     <tr className="table-primary">
      //                       <td><strong>Advance Payment (Now):</strong></td>
      //                       <td className="text-end"><strong>₹{calculateEMI().advance}</strong></td>
      //                     </tr>
      //                     <tr>
      //                       <td>Monthly Payment:</td>
      //                       <td className="text-end">₹{calculateEMI().emiPerMonth} x {emiMonths} months</td>
      //                     </tr>
      //                   </tbody>
      //                 </table>
      //               </div>
      //             </div>
      //           </div>
      //         )}
      //       </div>
      //     </div>
      //   </div>
        
      //   {/* Order Summary */}
      //   <div className="col-lg-4">
      //     <div className="card border-0 shadow-sm sticky-lg-top" style={{ top: '2rem' }}>
      //       <div className="card-header bg-white py-3">
      //         <h4 className="mb-0">Order Summary</h4>
      //       </div>
      //       <div className="card-body">
      //         <div className="d-flex justify-content-between mb-2">
      //           <span>Subtotal</span>
      //           <span>₹{cartTotal}</span>
      //         </div>
      //         <div className="d-flex justify-content-between mb-2">
      //           <span>Delivery</span>
      //           <span>Free</span>
      //         </div>
      //         {paymentMethod === 'emi' && (
      //           <div className="d-flex justify-content-between mb-2">
      //             <span>Processing Fee (10%)</span>
      //             <span>₹{(cartTotal * 0.1).toFixed(2)}</span>
      //           </div>
      //         )}
      //         <hr />
      //         <div className="d-flex justify-content-between fw-bold mb-3">
      //           <span>{paymentMethod === 'emi' ? 'Advance Payment' : 'Total'}</span>
      //           <span className="text-primary">
      //             ₹{paymentMethod === 'emi' ? calculateEMI().advance : cartTotal}
      //           </span>
      //         </div>
      //         {paymentMethod === 'emi' && (
      //           <div className="d-flex justify-content-between text-muted small mb-3">
      //             <span>Remaining EMI</span>
      //             <span>₹{calculateEMI().emiPerMonth} x {emiMonths} months</span>
      //           </div>
      //         )}
      //         <button 
      //           className="btn btn-primary w-100 py-2" 
      //           onClick={handlePayment}
      //           disabled={!selectedAddress}
      //         >
      //           Proceed to Payment
      //         </button>
      //         {!selectedAddress && (
      //           <div className="text-center text-danger small mt-2">
      //             Please select a delivery address
      //           </div>
      //         )}
      //       </div>
      //     </div>
      //   </div>
      // </div>
      )}
    </div>
  );
};

export default Checkout;