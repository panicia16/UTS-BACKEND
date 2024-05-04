const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');

//membuat map untuk melacak percobaan login
const loginAttempts = new Map();

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  //mengecek apakah email sudah mencapai batas percobaan login
  if (loginAttempts.has(email) && loginAttempts.get(email).attempts >= 5) {
    //mengambil waktu terkahir kali users mencoba login berdasarkan alamat email dari object 'loginAttempts'
    const lastAttemptTime = loginAttempts.get(email).time;
    //mengambil waktu saat ini dalam bentuk milisekon
    const currentTime = new Date().getTime();
    //menghitung selisih waktu antara waktu terakhir coba login dengan waktu saat ini,
    //kemudian mengkonversinya menjadi nilai dalam menit dgn membagi hasil pengurangan dalam milisekon
    //dengan 1000(untuk mengonversi ke detik) dan 60(untuk mengonversi ke menit)
    const timeDifference = (currentTime - lastAttemptTime) / (1000 * 60);
    //mengecek apakah selisih waktu kurang dari 30 menit atau tidak.
    //jika kurang dari 30 menit, dan users sudah mencoba login lebih dari 5 kali dalam waktu kurang dari 30 menit, maka akan menampilkan error
    if (timeDifference < 30) {
      //menampilkan error jika sudah mencapai batas percobaan login
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts!'
      );
    } else {
      //mereset percobaan login jika sudah lebih dari 30 menit
      loginAttempts.set(email, { attempts: 0, time: currentTime });
    }
  }
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    //Reset percobaan login jika berhasil login
    loginAttempts.set(email, { attempts: 0, time: new Date().getTime() });

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    //menambah jumlah percobaan login, jika login gagal
    const attempts = loginAttempts.has(email)
      ? loginAttempts.get(email).attempts + 1
      : 1;
    loginAttempts.set(email, { attempts, time: new Date().getTime() });

    //buat pesan utk reponse API degan informasi timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', '');
    const message = `[${timestamp}] User ${email} gagal login. Attempt = ${attempts}`;
    return message;
  }
}

module.exports = {
  checkLoginCredentials,
};
