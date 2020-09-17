const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.post("/signup", (req, res) => {
  const { username, email, password, pic } = req.body;
  if (!email || !username || !password) {
    return res.status(500).json({ error: "Vui lòng thêm tất cả các trường!" });
  }
  User.findOne({ username: username })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(200).json({ error: "Người dùng này đã tồn tại!" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          username,
          email,
          password: hashedpassword,
          pic,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Đăng ký thành công" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(500).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
  }
  User.findOne({ username }).then((savedUser) => {
    if (!savedUser) {
      return res
        .status(500)
        .json({ error: "Tên người dùng hoặc mật khẩu không hợp lệ!" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({ message: "Đăng nhập thành công" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, username, email, followers, following, pic } = savedUser;

          res.json({
            token,
            user: {
              _id,
              username,
              email,
              followers,
              following,
              pic,
            },
          });
        } else {
          return res.status(422).json({
            error: "Tên người dùng hoặc mật khẩu không hợp lệ!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/private", requireLogin, (req, res) => {
  res.send("Hello");
});

module.exports = router;
