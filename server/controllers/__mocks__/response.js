const response = (methods) => ({
  status() {
    return this;
  },

  send() {
    return this;
  },

  json() {
    return this;
  },

  cookie() {
    return this;
  },

  redirect() {
    return this;
  },
  ...methods,
});

module.exports = response;
