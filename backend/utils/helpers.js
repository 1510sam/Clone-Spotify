const jwt = require("jsonwebtoken");

exports = {};

exports.getToken = async (email, user) => {
  const token = jwt.sign(
    { _id: user._id }, // Hoặc dùng 'identifier' nếu phù hợp
    "thisKeyIsSupposedToBeSecret", // Secret phải khớp
    { expiresIn: "1h" }
  );
  return token;
};

module.exports = exports;
