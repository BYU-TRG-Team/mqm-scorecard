const request = (attributes) => ({
  role: 'superadmin',
  userId: 10,
  ...attributes,
});

module.exports = request;
