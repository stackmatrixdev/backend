/**
 * Handles and sends standardized error responses.
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 * @param {Object} error - Optional error details (e.g., for debugging)
 */

class ResponseHandler {
  // Handles and sends standardized success responses.
  static handleSuccess = (
    res,
    statusCode = 200,
    data = {},
    message = "Request successful"
  ) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  // Handles and sends standardized error responses.
  static handleError = (
    res,
    statusCode = 500,
    message = "Internal Server Error",
    error = null
  ) => {
    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error : undefined, // Only show error in dev mode
    });
  };
}

export const { handleSuccess, handleError } = ResponseHandler;
