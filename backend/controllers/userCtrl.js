const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

// const CreateToken = () => {
//   var JwtStrategy = require("passport-jwt").Strategy,
//     ExtractJwt = require("passport-jwt").ExtractJwt;
//   var opts = {};
//   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//   opts.secretOrKey = "thisKeyisSupportedToBeSecret";
//   passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//       UserModel.findOne({ id: jwt_payload.sub }, function (err, user) {
//         if (err) {
//           return done(err, false);
//         }
//         if (user) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//           // or you could create a new account
//         }
//       });
//     })
//   );
// };

const SignupCtrl = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const { username, email, password } = req.body;
    try {
      // Kiểm tra xem email đã tồn tại hay chưa
      const isUserExisted = await UserModel.findOne({ email: email });
      if (isUserExisted) {
        // Nếu email đã tồn tại, trả về lỗi
        return reject({
          status: "ERROR",
          message: "Email đã tồn tại",
        });
      }
      // Mã hóa password
      const hashedPass = await bcrypt.hash(password, 10);

      // Tạo user mới
      const createUser = await UserModel.create({
        username,
        email,
        password: hashedPass,
      });

      if (createUser) {
        const token = await getToken(email, createUser);
        const userToReturn = { ...createUser.toJSON(), token };
        delete userToReturn.password;
        return resolve({
          status: "OK",
          message: "Đăng ký thành công",
          data: userToReturn,
        });
      }
    } catch (err) {
      reject({
        status: "ERROR",
        message: "Đã xảy ra lỗi khi đăng ký",
        error: err.message,
      });
    }
  })
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(400).json(error));
};

const SinginCtrl = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
    const checkUser = await UserModel.findOne({ email: email });

    if (!checkUser) {
      return res.status(404).json({
        status: "ERR",
        message: "Tài khoản không tồn tại",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = bcrypt.compareSync(password, checkUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "ERR",
        message: "Mật khẩu không chính xác",
      });
    }

    // Tạo token (bạn cần thay thế `getToken` bằng hàm tạo token thực tế)
    const token = await getToken(email, checkUser);

    // Chuẩn bị dữ liệu trả về
    const userToReturn = { ...checkUser.toJSON(), token };
    delete userToReturn.password; // Xóa mật khẩu khỏi kết quả trả về

    // Trả về phản hồi thành công
    return res.status(200).json({
      status: "OK",
      message: "Đăng nhập thành công",
      data: userToReturn,
    });
  } catch (e) {
    // Xử lý lỗi server
    return res.status(500).json({
      status: "ERROR",
      message: "Đã xảy ra lỗi trong quá trình xử lý",
      error: e.message,
    });
  }
};

module.exports = {
  SignupCtrl,
  SinginCtrl,
};
