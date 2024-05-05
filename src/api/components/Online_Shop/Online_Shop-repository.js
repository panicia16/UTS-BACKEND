const { errorResponder, errorTypes } = require('../../../core/errors');
const { Online_Shop } = require('../../../models');

/**
 * Get a list of Online_Shop
 * @returns {Promise}
 */
async function getOnlineShops() {
  return Online_Shop.find({});
}

/**
 * Get user detail
 * @param {string} id - Online_Shop ID
 * @returns {Promise}
 */
async function getonline_shop(id) {
  return Online_Shop.findById(id);
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
  return Online_Shop.create({
    nama_produk,
    harga_produk,
    deskripsi_produk,
    kategori_produk,
    quantity_produk,
  });
}

/**
 * Update existing product
 * @param {string} id - Online_Shop ID
 * @param {object} updateData - Data to be updated
 * @returns {Promise}
 */
async function updateOnlineShop(id, updateData) {
  try {
    const updateProduk = await Online_Shop.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    //mengecek apakah produk yang di update di temukan atau tidak
    if (!updateProduk) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Gagal mengupdate produk: produk tidak ditemukan'
      );
    }
    return updateProduk;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a Online_Shop
 * @param {string} id - Online_Shop ID
 * @returns {Promise}
 */
async function deleteOnlineShop(id) {
  return Online_Shop.deleteOne({ _id: id });
}

module.exports = {
  getOnlineShops,
  getonline_shop,
  createOnline_Shop,
  updateOnlineShop,
  deleteOnlineShop,
};
