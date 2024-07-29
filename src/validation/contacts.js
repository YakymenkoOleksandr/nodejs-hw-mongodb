import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(8).max(14).required().messages({
    'string.base': 'PhoneNumber should be a number',
    'string.min': 'PhoneNumber should have at least {#limit} characters',
    'string.max': 'PhoneNumber should have at most {#limit} characters',
    'any.required': 'PhoneNumber is required',
  }),
  email: Joi.string().email().messages({
    'string.base': 'E-mail should be a string',
    'string.email': 'Invalid e-mail format',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'IsFavourite should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'ContactType should be a string',
      'any.only': 'ContactType must be one of [work, home, personal]',
      'any.required': 'ContactType is required',
    })
    .default('personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Username should be a string', 
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().min(8).max(14).messages({
    'string.base': 'PhoneNumber should be a number',
    'string.min': 'PhoneNumber should have at least {#limit} characters',
    'string.max': 'PhoneNumber should have at most {#limit} characters',
  }),
  email: Joi.string().email().messages({
    'string.base': 'E-mail should be a string',
    'string.email': 'Invalid e-mail format',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'IsFavourite should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .messages({
      'string.base': 'ContactType should be a string',
      'any.only': 'ContactType must be one of [work, home, personal]',
      'any.required': 'ContactType is required',
    })
    .default('personal'),
});
