import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  // signupStart,
  // signupSuccess,
  // signupFailure,
  // clearError,
  signupUser,
} from "../../store/slices/authSlice";
import authService from "../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../../style/theme.css'

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  // password toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // useEffect(() => {
  //   dispatch(clearError());
  // }, [dispatch]);

  // Validation schema
  const signupSchema = Yup.object({
    name: Yup.string()
      .required("Full name is required")
      .min(3, "Name must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number, and special char"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    termsAccepted: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const resultAction = await dispatch(signupUser(userData));

      if (signupUser.fulfilled.match(resultAction)) {
        toast.success("Signup successful! Please verify your email.");
        navigate("/login");
      } else {
        toast.error(resultAction.payload || "Signup failed");
      }
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold" style={{ color: '#ac2020' }}>
                Create Account
              </h2>

              {/* Signup Form */}
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  mobile: "",
                  password: "",
                  confirmPassword: "",
                  termsAccepted: false,
                }}
                validationSchema={signupSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {/* Full Name */}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter your full name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger mt-1 small"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger mt-1 small"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="mb-3">
                      <label htmlFor="mobile" className="form-label">
                        Mobile Number
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">+91</span>
                        <Field
                          type="text"
                          name="mobile"
                          className="form-control"
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-danger mt-1 small"
                      />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <div className="input-group">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger mt-1 small"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <div className="input-group">
                        <Field
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => setShowConfirm(!showConfirm)}
                        >
                          {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-danger mt-1 small"
                      />
                    </div>

                    {/* Terms */}
                    <div className="mb-3 form-check">
                      <Field
                        type="checkbox"
                        name="termsAccepted"
                        className="form-check-input"
                        id="termsAccepted"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="termsAccepted"
                      >
                        I agree to the{" "}
                        <Link to="/terms" className="" style={{ color: '#e70000' }}>
                          Terms & Conditions
                        </Link>
                      </label>
                      <ErrorMessage
                        name="termsAccepted"
                        component="div"
                        className="text-danger mt-1 small"
                      />
                    </div>

                    {/* Submit */}
                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting || loading}
                      >
                        {isSubmitting || loading
                          ? "Creating Account..."
                          : "Create Account"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>

              {/* Already have account */}
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: '#e70000' }}>
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
