const { User } = require('../../../models');

/**
 * Get a list of users
 * @param {object} query - object query untuk filter users
 * @param {string} sort - string untuk pengurutan data
 * @param {number} page_number - Page_number untuk pagination
 * @param {number} page_size - page_size untuk pagination
 * @returns {Promise}
 */

async function getUsers(query, sort, page_number, page_size) {
  //inisialisasi sortField dan sortOrder dgn nilai default
  let sortField = 'email';
  let sortOrder = 'asc';
  //memeriksa parameter "sort" kosong atau tidak
  if (sort) {
    const sortParts = sort.split(':'); //memisahkan string sort berdasarkan (:)
    if (sortParts.length == 2) {
      // jika sortParts memiliki panjang 2, maka pengurutan nya valid
      sortField = sortParts[0]; //mengatur sortField menjadi nilai pertama sortParts
      sortOrder = sortParts[1]; // mengatur sortOrder menjadi nilai kedua sortParts

      //memeriksa apakah nilai sortOrder valid atau tidak
      if (sortOrder !== 'asc' && sortOrder !== 'desc') {
        sortOrder = 'asc';
      }
    } else {
    }
  }

  //mengambil data pengguna
  const users = await User.find(query) //utk melakukan filter data users
    .skip((page_number - 1) * page_size) //utk melakukan paginasi(menampilkan berapa banyak data dalam satu halaman)
    .limit(page_size); // jumlah data yang akan ditampilkan perhalaman
  return users;
}

/**Get total coount of users based on query
 * @param {object} query - object query untuk filter users
 * @returns {Promise}
 */

async function getTotalUserscount(query) {
  const count = await User.countDocuments(query);
  return count;
}

/**
 * Get user detail by
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
