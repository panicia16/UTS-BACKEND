const { User } = require('../../../models');

const Failed_Login_Attempts = new Map(); //deklarasi map failedLoginAttempts

//
/**
 * simpan informasi percobaan login yang gagal
 * @param {string} email - email users
 */
function saveFailedLoginAttempt(email) {
  //fungsi utk menyimpan informasi login yang gagal
  if (Failed_Login_Attempts.has(email)) {
    const attempts = Failed_Login_Attempts.get(email); //faildeLoginAttempts akan disimpan di variabel attempts
    Failed_Login_Attempts.set(email, attempts + 1); //utk mengupdate informasi jumlah percobaan login yang gagal
  } else {
    Failed_Login_Attempts.set(email, 1);
  }
}

/**
 * dapatkan jumlah percobaan login yang gagal untuk email tertentu
 * @param {string} email - email users
 * @returns {number} jumlah percobaan login yang gagal
 */
function getFailed_Login_Attempts(email) {
  return Failed_Login_Attempts.get(email) || 0;
}
/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

module.exports = {
  saveFailedLoginAttempt,
  getFailed_Login_Attempts,
  getUserByEmail,
  Failed_Login_Attempts,
};
