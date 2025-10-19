exports.isEmail = (email) => {
  return typeof email === 'string' && email.includes('@');
};

exports.isNotEmpty = (val) => {
  return val !== undefined && val !== null && val.toString().trim() !== '';
};
