export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
}

export function isValidPhone(phone) {
  return (phone || '').replace(/[^0-9]/g, '').length >= 10
}

export function validateRegisterForm(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Name is required'
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address'
  if (!form.password || form.password.length < 6) errors.password = 'Password must be at least 6 characters'
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export function validateLoginForm(form) {
  const errors = {}
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address'
  if (!form.password) errors.password = 'Enter your password'
  return errors
}

export function validateProductForm(form) {
  const errors = {}
  if (!form.productName?.trim()) errors.productName = 'Give your product a name'
  if (!form.listedPrice || Number(form.listedPrice) <= 0) errors.listedPrice = 'Enter a selling price above 0'
  const d = Number(form.maxDiscountPercent || 0)
  if (d < 0 || d > 90) errors.maxDiscountPercent = 'Discount must be between 0% and 90%'
  if (form.stock !== '' && Number(form.stock) < 0) errors.stock = 'Stock cannot be negative'
  if (!form.deliveryAvailable && !form.pickupAvailable) errors.delivery = 'Offer delivery, pickup or both'
  if (form.deliveryAvailable && !form.deliveryLocations?.length) {
    errors.deliveryLocations = 'Add at least one city, area or pincode you deliver to'
  }
  if (!form.acceptedPaymentMethods?.length) errors.acceptedPaymentMethods = 'Choose at least one payment method'
  return errors
}
