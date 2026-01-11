class ApiResponse {
  constructor(success = true, message = '', data = null, meta = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  static success(message, data, meta) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message, errors = []) {
    const response = new ApiResponse(false, message);
    if (errors.length > 0) {
      response.errors = errors;
    }
    return response;
  }
}

module.exports = ApiResponse;