const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const Online_Shop = require('./components/Online_Shop/Online_Shop-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  Online_Shop(app);

  return app;
};
