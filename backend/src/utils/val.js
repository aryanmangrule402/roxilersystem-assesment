// backend/utils/validation.js
const Joi = require('joi');

// Common Joi extensions for custom password validation
const passwordComplexity = Joi.string()
  .min(8)
  .max(16)
  .pattern(new RegExp('(?=.*[A-Z])')) // At least one uppercase letter
  .pattern(new RegExp('(?=.*[!@#$%^&*])')) // At least one special character
  .messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.max': 'Password cannot exceed 16 characters.',
    'string.pattern.base': 'Password must include at least one uppercase letter and one special character.'
  });

const userSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: passwordComplexity.required(),
  address: Joi.string().max(400).allow(''), // Allow empty string for address
  role: Joi.string().valid('normal_user', 'store_owner', 'system_admin').optional(), // Only for admin creation
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const passwordUpdateSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordComplexity.required(),
});

const storeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(), // Add min/max for store name
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  ownerId: Joi.string().uuid().optional().allow(null), // Optional UUID for owner
});

const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  userSchema,
  loginSchema,
  passwordUpdateSchema,
  storeSchema,
  ratingSchema,
  validate,
};