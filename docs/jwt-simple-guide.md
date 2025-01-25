# 🔐 Simple JWT Guide

## What is JWT?
JWT (JSON Web Token) is like a secure digital pass that proves who you are. Think of it as a special ID card for websites.

## 1. Generate JWT Secret
```bash
# Using Node.js to generate a secure secret
node
> require('crypto').randomBytes(64).toString('hex')
'1aa17f765d793161f89dd47b88ad6bdf39852933a416aa8c4de35b41a4c919d62bf7e7f78d86e672a3f90dec2eb0d72b2719d53d1dc882f3aca7c673f02d619d'
```

## 2. Basic Setup

### Install Required Packages
```bash
npm install jsonwebtoken bcryptjs
```

### Environment Setup (.env)
```env
JWT_SECRET=your_generated_secret
JWT_EXPIRES_IN=7d
```

## 3. Creating Tokens

### Simple Token Generation
```javascript
// Using Node.js REPL
const jwt = require('jsonwebtoken');

// Create a token
const token = jwt.sign(
  { userId: '123', role: 'admin' },
  'your_secret_key',
  { expiresIn: '7d' }
);

console.log(token);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Verify token
const decoded = jwt.verify(token, 'your_secret_key');
console.log(decoded);
// { userId: '123', role: 'admin', iat: 1616161616, exp: 1616766416 }
```

## 4. Using in Express Backend

### Login Route
```javascript
// authController.js
const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Send response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

## 5. Protect Routes

### Simple Auth Middleware
```javascript
// middleware/auth.js
const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Please log in' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Get user
    const user = await User.findById(decoded.id);
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

## 6. Using Protected Routes
```javascript
// routes/rooms.js
const express = require('express');
const router = express.Router();

// Protected route example
router.post('/rooms', protect, async (req, res) => {
  // Only logged-in users can access this
  const room = await Room.create({ ...req.body, user: req.user.id });
  res.json(room);
});
```

## 7. Testing in Terminal

### Generate Token
```bash
node
> const jwt = require('jsonwebtoken')
> const token = jwt.sign({ id: '123' }, 'secret', { expiresIn: '1h' })
> console.log(token)
```

### Verify Token
```bash
node
> const decoded = jwt.verify('your_token_here', 'secret')
> console.log(decoded)
```

## 8. Common Issues & Solutions

### Token Expired
```javascript
try {
  const decoded = jwt.verify(token, secret);
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    console.log('Token has expired');
  }
}
```

### Invalid Token
```javascript
try {
  const decoded = jwt.verify(token, secret);
} catch (error) {
  if (error.name === 'JsonWebTokenError') {
    console.log('Invalid token');
  }
}
```

## Quick Reference

### Generate New Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Token Structure
```
header.payload.signature
```

### Common Options
```javascript
const options = {
  expiresIn: '7d',    // Token expiry
  issuer: 'your-app', // Token issuer
  audience: 'your-api' // Token audience
};
```

---

<div align="center">
  <p>Need more help? Check the <a href="./jwt.md">detailed JWT documentation</a></p>
</div> 