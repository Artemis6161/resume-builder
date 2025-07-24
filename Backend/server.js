require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // Security middleware
const rateLimit = require('express-rate-limit'); // Brute force protection
const morgan = require('morgan'); // Request logging

// Initialize Express
const app = express();

//               Configuration

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

//               Middleware

app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
app.use(express.json({ limit: '10kb' })); // Body parser
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

//               Database Connection

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    console.log('✅ MongoDB Connected');

    // Event listeners for connection monitoring
    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection open');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose connection disconnected');
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    
    // Specific error handling
    if (err.message.includes('bad auth')) {
      console.error('Authentication failed - check MongoDB credentials');
    } else if (err.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('Network error - check your connection or MongoDB hostname');
    }
    
    process.exit(1);
  }
};


//                  Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);


//              Error Handling

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


//               Server Startup

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`
      🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
      🔗 Base URL: http://localhost:${PORT}
      🌐 Allowed Origins: ${FRONTEND_URL}
      📅 ${new Date().toLocaleString()}
    `);
  });
};

// Start the application
startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});