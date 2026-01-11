const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { storage } = require('../config/cloudinary');

// Configure multer for memory storage (for Cloudinary)
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new ApiError('Only image files are allowed!', 400), false);
  }
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError('File size too large. Max 5MB', 400));
        }
        return next(new ApiError(err.message, 400));
      }
      
      if (req.fileValidationError) {
        return next(new ApiError(req.fileValidationError, 400));
      }
      
      next();
    });
  };
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError('File size too large. Max 5MB', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(`Maximum ${maxCount} files allowed`, 400));
        }
        return next(new ApiError(err.message, 400));
      }
      
      if (req.fileValidationError) {
        return next(new ApiError(req.fileValidationError, 400));
      }
      
      next();
    });
  };
};

// Fields upload middleware
const uploadFields = (fields) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return next(new ApiError(err.message, 400));
      }
      
      if (req.fileValidationError) {
        return next(new ApiError(req.fileValidationError, 400));
      }
      
      next();
    });
  };
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
};