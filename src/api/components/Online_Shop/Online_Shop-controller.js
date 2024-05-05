const Online_ShopService = require('./Online_Shop-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { deskripsi_produk } = require('../../../models/Online_Shop-schema');
const { Online_Shop } = require('../../../models');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOnlineShops(request, response, next) {
  try {
    const online_shops = await Online_ShopService.getOnlineShops();
    return response.status(200).json(online_shops);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getonline_shop(request, response, next) {
  try {
    const online_shop = await Online_ShopService.getOnlineShops(
      request.params.id
    );

    if (!online_shop) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Unknown Online_Shop'
      );
    }

    return response.status(200).json(online_shop);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function createOnline_Shop(request, response, next) {
  try {
    const nama_produk = request.body.nama_produk;
    const harga_produk = request.body.harga_produk;
    const deskripsi_produk = request.body.deskripsi_produk;
    const kategori_produk = request.body.kategori_produk;
    const quantity_produk = request.body.quantity_produk;

    const success = await Online_ShopService.createOnline_Shop(
      nama_produk,
      harga_produk,
      deskripsi_produk,
      kategori_produk,
      quantity_produk
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({
      message: 'Product created successfully',
      data: {
        nama_produk,
        harga_produk,
        deskripsi_produk,
        kategori_produk,
        quantity_produk,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update Online_Shop request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateOnlineShop(request, response, next) {
  try {
    const { id } = request.params;
    const { nama_produk, harga_produk, quantity_produk } = request.body;

    const success = await Online_ShopService.updateOnlineShop(
      id,
      nama_produk,
      harga_produk,
      quantity_produk
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({
      message: 'Product updated successfully',
      data: {
        nama_produk,
        harga_produk,
        quantity_produk,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete Online_Shop request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteOnlineShop(request, response, next) {
  try {
    const id = request.params.id;

    const success = await Online_ShopService.deleteOnlineShop(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'gagal menghapus produk'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOnlineShops,
  getonline_shop,
  createOnline_Shop,
  updateOnlineShop,
  deleteOnlineShop,
};
