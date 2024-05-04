const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const authenticationRepository = require('./authentication-repository');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (loginSuccess.error) {
      authenticationRepository.saveFailedLoginAttempt(email); //menyimpan informasi percobaan yang gagal
      const attempts = authenticationRepository.getFailed_Login_Attempts(email); //utk mendapatkan jumlah percobaan login yg gagal

      //utk mencatat waktu saat gagal login, dgn menggunakan format ISO 8601, dan
      //kemudian menggunakan slice(0,19) supaya hanya mengambil tanggal dan waktu.
      //replace('T','') utk mengahpus T yg memishakan tanggal dan waktu.
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', '');

      //utk menampilkan message salah memasukan password atau email, dgn gabungan timestamp,email,dan jumlah attempts
      const message = `[${timestamp}] User ${email} gagal login. Attempt = ${attempts}`;

      return response.status(401).json({
        message,
      });
    }

    return response.status(200).json(loginSuccess); //login berhasil,kirim response dgn data user
  } catch (error) {
    return next(error); //terjadi kesalahan, lempar error ke middleware error handling
  }
}

module.exports = {
  login,
};
