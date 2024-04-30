const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { User } = require('../../../models');

/**
 * Get list of users with pagination, filter, and sorting
 * @param {number} page_number - nomor halaman yang ditampilkan
 * @param {number} page_size - jumlah data yang dimunculkan per halaman
 * @param {string} search - filter seawrch berdasarkan atribut tertentu
 * @param {string} sort - pengurutkan data berdasarkan atribut
 * @returns {Promise}
 */
async function getUsers(
  page_number,
  page_size,
  search = '',
  sort = 'email:asc'
) {
  try {
    //set nilai default jika parameter tidak diisi atau tidak valid
    page_number = page_number ? parseInt(page_number) : 1;
    page_size = page_size ? parseInt(page_size) : 0; //menggunakan 0 untuk menampilkan semua data dalam 1 halaman

    //validasi page_number dan page_size, jika bukan integer menampilkan error
    if (isNaN(page_number) || page_number < 1) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'Nilai page_number tidak valid, nilai page_number harus bertipe integer bilangan positif'
      );
    }
    if (isNaN(page_size) || page_size < 0) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'Nilai page_size tidak valid!nilai page_size harus bertipe integer bilangan positif'
      );
    }

    //melakukan search
    let query = {}; //Utk menyimpan kriteria pencarian
    //mengecek search, memastikan search tidak kosong, bertipe data string dan mengandung karakter (:)
    if (search && typeof search === 'string' && search.includes(':')) {
      const [field, searchKey] = search.split(':'); //memishkan search berdasarkan karater (:)
      //memeriksa field yg ditemukan dari search adalah name/email
      if (field === 'name' || field === 'email') {
        query[field] = { $regex: searchKey, $options: 'i' }; //melakukan pencarian dgn operator regex yg sesuai dgn nilai search key, dan options digunakan untuk pencaian menjadi case-insensitive
      }
    }

    //melakukan sorting
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

    //melakukan pangambilan data user berdasarkan search, sort, dan paginasi
    const users = await User.find(query, { password: 0, __v: 0 })
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page_number - 1) * page_size) //utk melakukan paginasi(menampilkan berapa banyak data dalam satu halaman)
      .limit(page_size > 0 ? page_size : undefined); //menggunakan undifined utk menampilkan semua data jika page_size tidak diisi

    //hitung jumlah total data user sesuai search
    const count = await User.countDocuments(query);
    const total_pages = page_size > 0 ? Math.ceil(count / page_size) : 1; //menampilkan 1 halaman jika page_size tidak diisi
    const has_previous_page = page_number > 1;
    const has_next_page = page_number < total_pages;

    return {
      page_number,
      page_size,
      count,
      total_pages,
      has_previous_page,
      has_next_page,
      data: users,
    };
  } catch (error) {
    throw error;
  }
}
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
