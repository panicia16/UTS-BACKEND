const joi = require('joi');
const { errorResponder } = require('../../../core/errors');
const { deskripsi_produk } = require('../../../models/Online_Shop-schema');

module.exports = {
  createOnline_Shop: {
    body: {
      nama_produk: joi.string().min(1).max(100).required().label('Nama Produk'),
      harga_produk: joi.string().required().label('Harga Produk'),
      deskripsi_produk: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Deskripsi Produk'),
      kategori_produk: joi.string().required().label('Kategori_Produk'),
      quantity_produk: joi.number().required().label('Quantity Produk'),
    },
  },

  updateOnlineShop: {
    body: {
      nama_produk: joi.string().min(1).max(100).required().label('Nama Produk'),
      harga_produk: joi.string().required().label('Harga Produk'),
      quantity_produk: joi.number().required().label('Quantity Produk'),
    },
  },
};
