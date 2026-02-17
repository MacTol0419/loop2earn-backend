const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
