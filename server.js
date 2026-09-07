require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth.routes');
const personnelRoutes = require('./routes/personnel.routes');
const dutyRoutes = require('./routes/duty.routes');
const deploymentRoutes = require('./routes/deployment.routes');
const leaveRoutes = require('./routes/leave.routes');
const wellnessRoutes = require('./routes/wellness.routes');
const riskRoutes = require('./routes/risk.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Mission Well AI API is running...' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/duty', dutyRoutes);
app.use('/api/deployment', deploymentRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/risk', riskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Mission Well AI backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();

module.exports = app;
