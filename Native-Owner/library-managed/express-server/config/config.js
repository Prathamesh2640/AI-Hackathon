module.exports = {
  database: {
    host: "localhost",
    user: "root", // Your MySQL username
    password: "manager", // Your MySQL password
    database: "library_system",
    dialect: "mysql",
  },
  jwt: {
    secret: "a_very_secret_key_for_jwt_that_is_long_and_secure",
    expiresIn: "1h",
  },
};
