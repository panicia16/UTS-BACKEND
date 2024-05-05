const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const Online_ShopControllers = require('./Online_Shop-controller');
const Online_ShopValidator = require('./Online_Shop-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/Online_Shop', route);

  // Get list of Online_Shop
  route.get(
    '/',
    authenticationMiddleware,
    Online_ShopControllers.getOnlineShops
  );

  // Create Online_Shop
  route.post(
    '/',
    celebrate(Online_ShopValidator.createOnline_Shop),
    authenticationMiddleware,
    Online_ShopControllers.createOnline_Shop
  );

  // Get Online_Shop detail
  route.get(
    '/:id',
    authenticationMiddleware,
    Online_ShopControllers.getonline_shop
  );
  // Update Online_Shop
  route.put(
    '/:id',
    celebrate(Online_ShopValidator.updateOnlineShop),
    authenticationMiddleware,
    Online_ShopControllers.updateOnlineShop
  );

  // Delete user
  route.delete(
    '/:id',
    authenticationMiddleware,
    Online_ShopControllers.deleteOnlineShop
  );
};
