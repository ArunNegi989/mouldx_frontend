export const REGEX = {
  // Phone (Indian, 10 digit, starting 6-9)
  phone: /^[6-9]\d{9}$/,

  // Email
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // PAN Card - ABCDE1234F
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,

  // GST Number - 22AAAAA0000A1Z5
  gst: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,

  // IFSC Code - SBIN0001234
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,

  // Bank Account Number (9-18 digits, most Indian banks)
  bankAccount: /^\d{9,18}$/,

  // UPI ID - name@bank
  upiId: /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/,

  // Pincode (Indian, 6 digit)
  pincode: /^[1-9][0-9]{5}$/,

  // OTP (6 digit)
  otp: /^\d{6}$/,

  // Lat/Long (decimal degrees, e.g. 28.6139, 77.2090)
  latLong: /^-?\d{1,3}\.\d{1,6}$/,

  // Alphanumeric with spaces (Firm Name, Mould Name)
  nameField: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
};

// Reusable validator function
export const validate = (pattern: keyof typeof REGEX, value: string): boolean => {
  return REGEX[pattern].test(value.trim());
};