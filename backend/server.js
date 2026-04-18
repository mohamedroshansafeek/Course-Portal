require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/courses', courseRoutes);
app.use('/users', userRoutes);
app.use('/', require('./routes/enrollmentRoutes'));

// 1. Diagnostics to check runtime env (REMOVE once working!)
console.log("--- STARTUP DIAGNOSTICS ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI loaded?", !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
  console.log("MONGO_URI starts with:", process.env.MONGO_URI.substring(0, 15) + "...");
  if (process.env.MONGO_URI.includes('127.0.0.1') || process.env.MONGO_URI.includes('localhost')) {
      console.error("FATAL: App is attempting to connect to localhost in production!");
  }
} else {
  console.error("FATAL: MONGO_URI IS UNDEFINED!");
  process.exit(1);
}
console.log("---------------------------");

// 2. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    const { host, port } = mongoose.connection;
    console.log(`Connected to host: ${host} on port ${port}`);
  })
  .catch(err => {
    console.error('Fatal Error: MongoDB connection failed');
    console.error(err);
    process.exit(1); 
  });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
