const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const router = express.Router();

// Đăng ký tk
router.post("/signup", userCtrl.SignupCtrl);
// Đăng nhập tk
router.post("/signin", userCtrl.SinginCtrl);
//

module.exports = router;
