# Rogers Backend API

A comprehensive backend API for the Rogers application built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**
  - Email/Password registration and login
  - Mobile OTP verification
  - Google OAuth integration
  - JWT token-based authentication
  - User profile management
  - KYC document upload

- **Product Management**
  - Product catalog with categories
  - Plan management for products
  - Add-ons for plans
  - Search and filtering
  - Product reviews and ratings

- **Shopping Cart**
  - Add/remove items from cart
  - Update quantities
  - Cart persistence
  - Price calculations

- **Order Management**
  - Order creation and tracking
  - Order status updates
  - Delivery slot management
  - Invoice generation

- **Payment Processing**
  - Multiple payment methods (COD, Online, EMI)
  - Razorpay integration
  - EMI calculations
  - Payment verification
  - Refund processing

- **Address Management**
  - Multiple addresses per user
  - Default address selection
  - Address validation

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP to mobile
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/kyc` - Upload KYC documents
- `GET /api/users/kyc` - Get KYC status

### Addresses
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `PUT /api/users/addresses/:id/default` - Set default address

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search` - Search products
- `POST /api/products/filter` - Filter products

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get plan by ID
- `GET /api/plans/product/:productId` - Get plans by product

### Add-ons
- `GET /api/addons` - Get all add-ons
- `GET /api/addons/:id` - Get add-on by ID
- `GET /api/addons/plan/:planId` - Get add-ons by plan

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/delivery-slot` - Update delivery slot
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/invoice` - Generate invoice

### Payments
- `GET /api/payments` - Get payment history
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Process payment
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/calculate-emi` - Calculate EMI
- `POST /api/payments/:id/refund` - Initiate refund

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rogers
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   GOOGLE_CLIENT_ID=your_google_client_id
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## Database Models

- **User**: User authentication and profile information
- **Product**: Product catalog with categories and features
- **Plan**: Service plans for products
- **Addon**: Additional services for plans
- **Cart**: Shopping cart with items and calculations
- **Address**: User addresses for delivery
- **Order**: Order management and tracking
- **Payment**: Payment processing and history

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting (can be added)
- SQL injection protection via Mongoose

## Error Handling

- Centralized error handling middleware
- Custom error response class
- Proper HTTP status codes
- Detailed error messages for development

## Development

- Use `npm run dev` for development with nodemon
- Use `npm start` for production
- API documentation available at `/api` (can be added with Swagger)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
