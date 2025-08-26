// Validation rules for forms
export const validationRules = {
  required: (message = 'This field is required') => (value) => {
    if (!value || value.toString().trim() === '') {
      return message;
    }
    return '';
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return '';
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return '';
  },

  email: (message = 'Please enter a valid email address') => (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message;
    }
    return '';
  },

  password: (message = 'Password must be at least 6 characters') => (value) => {
    if (value && value.length < 6) {
      return message;
    }
    return '';
  },

  username: (message = 'Username must be 3-20 characters and contain only letters, numbers, and underscores') => (value) => {
    if (value && (value.length < 3 || value.length > 20 || !/^[a-zA-Z0-9_]+$/.test(value))) {
      return message;
    }
    return '';
  }
};

// Common validation rule sets
export const loginValidation = {
  username: [
    validationRules.required('Username is required'),
    validationRules.minLength(3, 'Username must be at least 3 characters')
  ],
  password: [
    validationRules.required('Password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters')
  ]
};

export const registerValidation = {
  firstName: [
    validationRules.required('First name is required'),
    validationRules.minLength(2, 'First name must be at least 2 characters'),
    validationRules.maxLength(50, 'First name must be no more than 50 characters')
  ],
  lastName: [
    validationRules.required('Last name is required'),
    validationRules.minLength(2, 'Last name must be at least 2 characters'),
    validationRules.maxLength(50, 'Last name must be no more than 50 characters')
  ],
  username: [
    validationRules.required('Username is required'),
    validationRules.username()
  ],
  password: [
    validationRules.required('Password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters'),
    validationRules.maxLength(128, 'Password is too long')
  ]
};