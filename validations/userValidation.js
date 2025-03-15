const Joi = require('joi');

// Signup Validation
const validateSignup = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must be at most 30 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
    terms: Joi.alternatives().try(
      Joi.boolean().valid(true),
      Joi.string().valid('true', 'on')
    ).required().messages({
      'any.only': 'You must agree to our terms and conditions',
      'any.required': 'You must agree to our terms and conditions'
    }),
  });

  return schema.validate(data);
};

// Login Validation (username or email)
const validateLogin = (data) => {
  const schema = Joi.object({
    identifier: Joi.string().required().messages({
      'string.empty': 'Email or username is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  });

  return schema.validate(data);
};

module.exports = { validateSignup, validateLogin };
