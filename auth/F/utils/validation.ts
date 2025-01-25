// Check if email is valid
export const validateEmail = (email: string): string => {
  // Check if empty
  if (!email.trim()) return 'Email is required';
  
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

// Check if password meets requirements
export const validatePassword = (password: string): string => {
  // Check if empty
  if (!password) return 'Password is required';
  // Check length
  if (password.length < 6) return 'Password must be at least 6 characters';
  
  // Check for numbers
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  // Check for letters
  if (!/[a-zA-Z]/.test(password)) {
    return 'Password must contain at least one letter';
  }
  
  return '';
};

// Check if name is valid
export const validateName = (name: string): string => {
  // Check if empty
  if (!name.trim()) return 'Name is required';
  // Check min length
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  // Check max length
  if (name.trim().length > 50) return 'Name must be less than 50 characters';
  
  // Check allowed characters
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  return '';
};

// Check if passwords match
export const validatePasswordMatch = (password: string, confirmPassword: string): string => {
  // Check if confirm password empty
  if (!confirmPassword) return 'Please confirm your password';
  // Check if passwords match
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
}; 