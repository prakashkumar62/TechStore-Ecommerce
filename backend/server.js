const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 for container / Render cloud compatibility
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TechStore API Server] running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  console.log(`[Health check]: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SIGTERM received]: Closing HTTP server gracefully...');
  server.close(() => {
    console.log('[HTTP Server closed]');
    process.exit(0);
  });
});
