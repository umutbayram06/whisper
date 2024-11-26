// Error handling middleware
export default function (err, req, res, next) {
  // Set default error properties
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Respond with error details
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Hide stack trace in production
  });
}
