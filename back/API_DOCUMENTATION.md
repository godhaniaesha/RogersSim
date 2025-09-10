# API Documentation - Forgot Password & Product Management

## Forgot Password APIs

### 1. Forgot Password - Send OTP
**POST** `/api/auth/forgot-password`

Send OTP to user's mobile number for password reset.

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your mobile number for password reset",
  "data": {
    "otp": "123456"  // Only in development mode
  }
}
```

### 2. Verify Reset OTP
**POST** `/api/auth/verify-reset-otp`

Verify OTP and get reset token for password reset.

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "resetToken": "abc123def456...",
    "mobile": "9876543210"
  }
}
```

### 3. Reset Password
**POST** `/api/auth/reset-password`

Reset user password using reset token.

**Request Body:**
```json
{
  "mobile": "9876543210",
  "resetToken": "abc123def456...",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## Product Management APIs

### 4. Create Product
**POST** `/api/products`

Create a new product (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Mobile Plan - Unlimited",
  "description": "Unlimited calls and 1GB data per day",
  "category": "mobile",
  "image": "mobile-plan.jpg",
  "images": ["image1.jpg", "image2.jpg"],
  "price": 299,
  "originalPrice": 399,
  "discount": 25,
  "features": ["Unlimited calls", "1GB data per day", "SMS pack"],
  "specifications": {
    "dataLimit": "1GB per day",
    "validity": "30 days",
    "calls": "Unlimited"
  },
  "isActive": true,
  "isPopular": true,
  "tags": ["popular", "best-seller", "unlimited"],
  "stock": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Mobile Plan - Unlimited",
    "description": "Unlimited calls and 1GB data per day",
    "category": "mobile",
    "price": 299,
    "originalPrice": 399,
    "discount": 25,
    "features": ["Unlimited calls", "1GB data per day", "SMS pack"],
    "isActive": true,
    "isPopular": true,
    "tags": ["popular", "best-seller", "unlimited"],
    "stock": 100,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

All APIs return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common Error Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user/product not found)
- `500` - Internal Server Error

## Testing

Use the provided test file `test-forgot-password-api.js` to test the APIs:

```bash
cd back
node test-forgot-password-api.js
```

## Notes

1. **OTP Expiry**: OTP expires after 10 minutes
2. **Reset Token Expiry**: Reset token expires after 10 minutes
3. **Password Validation**: New password must be at least 6 characters
4. **Admin Access**: Product creation requires admin role
5. **Development Mode**: OTP is returned in response for testing in development environment
6. **Production**: In production, OTP should be sent via SMS service like Twilio

## Environment Variables Required

```
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Database Schema Updates

The User model has been updated with:
- `resetPasswordToken`: String field for reset token
- `resetPasswordExpire`: Date field for token expiry
- `getResetPasswordToken()`: Method to generate reset token
