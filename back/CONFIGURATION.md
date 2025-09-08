# Configuration Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/rogers

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here

# Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Setup Instructions

1. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGO_URI` with your database connection string

2. **JWT Configuration**
   - Generate a strong secret key for JWT
   - Update `JWT_SECRET` with your secret key

3. **Google OAuth Setup**
   - Go to Google Cloud Console
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Update `GOOGLE_CLIENT_ID`

4. **Twilio Setup (for SMS OTP)**
   - Sign up for Twilio account
   - Get your Account SID and Auth Token
   - Purchase a phone number
   - Update Twilio credentials

5. **Email Setup**
   - Use Gmail SMTP or any other SMTP service
   - For Gmail, use App Password instead of regular password
   - Update SMTP credentials

6. **Razorpay Setup**
   - Sign up for Razorpay account
   - Get your API keys from dashboard
   - Update Razorpay credentials

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your configuration

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Seed sample data (optional):
   ```bash
   npm run seed
   ```

## API Testing

The API will be available at `http://localhost:5000`

- Health check: `GET /`
- API base: `http://localhost:5000/api`

## Frontend Integration

Update your frontend `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```
