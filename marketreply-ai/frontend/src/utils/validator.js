export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
}

export function validateSellerForm(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Seller name is required'
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address'
  if (!form.productName?.trim()) errors.productName = 'Product name is required'
  if (!form.listedPrice || Number(form.listedPrice) <= 0) {
    errors.listedPrice = 'Listed price must be a positive number'
  }
  if (form.rules?.minPrice && Number(form.rules.minPrice) > Number(form.listedPrice)) {
    errors.minPrice = 'Minimum price cannot exceed listed price'
  }
  return errors
}

export function validateBuyerMessage(sellerId, message) {
  const errors = {}
  if (!sellerId) errors.sellerId = 'Please select a seller profile'
  if (!message?.trim()) errors.message = 'Enter the buyer message to analyze'
  return errors
}

export function validateRegisterForm(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Name is required'
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address'
  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match'
  }
  return errors
}

export function validateLoginForm(form) {
  const errors = {}
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address'
  if (!form.password) errors.password = 'Enter your password'
  return errors
}
