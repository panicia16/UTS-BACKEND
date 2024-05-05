const { deserializeUser } = require('passport');
const {
  nama_produk,
  harga_produk,
  deskripsi_produk,
  kategori_produk,
  quantity_produk,
} = require('../../../models/Online_Shop-schema');
const Online_ShopRepository = require('./Online_Shop-repository');

/**
 * Get list of Online_Shop
 * @returns {Array}
 */
async function getOnlineShops() {
  const online_shops = await Online_ShopRepository.getOnlineShops();

  const results = [];
  for (let i = 0; i < online_shops.length; i += 1) {
    const online_shop = online_shops[i];
    results.push({
      id: online_shop.id,
      nama_produk: online_shop.nama_produk,
      harga_produk: online_shop.harga_produk,
      deskripsi_produk: online_shop.deskripsi_produk,
      kategori_produk: online_shop.kategori_produk,
      quantity_produk: online_shop.quantity_produk,
    });
  }

  return results;
}

/**
 * Get online_shops detail
 * @param {string} id - online_shops ID
 * @returns {Object}
 */
async function getonline_shop(id) {
  const online_shop = await Online_ShopRepository.getOnlineShops(id);

  // OnlineShops not found
  if (!online_shop) {
    return null;
  }

  return {
    id: online_shop.id,
    nama_produk: online_shop.nama_produk,
    harga_produk: online_shop.harga_produk,
    deskripsi_produk: online_shop.deskripsi_produk,
    kategori_produk: online_shop.kategori_produk,
    quantity_produk: online_shop.quantity_produk,
  };
}

/**
 * Create new product
 * @param {string} nama_produk - Nama Produk
 * @param {string} harga_produk - Harga Produk
 * @param {string} deskripsi_produk - Deskripsi Produk
 * @param {string} kategori_produk - Kategori Produk
 * @param {Number} quantity_produk - Quantity Produk
 * @returns {Promise}
 */

async function createOnline_Shop(
  nama_produk,
  harga_produk,
  deskripsi_produk,
  kategori_produk,
  quantity_produk
) {
  try {
    await Online_ShopRepository.createOnline_Shop(
      nama_produk,
      harga_produk,
      deskripsi_produk,
      kategori_produk,
      quantity_produk
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update Online_Shop
 * @param {string} id - Online_Shop ID
 * @param {string} nama_produk - Nama Produk
 * @param {string} harga_produk - Harga Produk
 * @param {Number} quantity_produk - Quantity Produk
 * @returns {Promise}
 */
async function updateOnlineShop(
  id,
  nama_produk,
  harga_produk,
  quantity_produk
) {
  const online_shop = await Online_ShopRepository.getonline_shop(id);

  // online_shop not found
  if (!online_shop) {
    return null;
  }

  try {
    //susun data pembaruan
    const updateData = {
      nama_produk,
      harga_produk,
      quantity_produk,
    };

    await Online_ShopRepository.updateOnlineShop(id, updateData);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete Produk
 * @param {string} id - Online_Shop ID
 * @returns {boolean}
 */
async function deleteOnlineShop(id) {
  const online_shop = await Online_ShopRepository.getonline_shop(id);

  // User not found
  if (!online_shop) {
    return null;
  }

  try {
    await Online_ShopRepository.deleteOnlineShop(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getOnlineShops,
  getonline_shop,
  createOnline_Shop,
  updateOnlineShop,
  deleteOnlineShop,
};
