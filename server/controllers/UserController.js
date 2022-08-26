require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const checkConstraints = (user) => {
  // check if username has any space
  // if (user.username?.split(' ').length > 1)
  //     return false;
  // if (user.username && user.username.length == 0)
  //     return false;

  // // check if password length < 6
  // if (user.password?.length < 6)
  //     return false;

  // // check if phone does not contain exactly 10 number
  // if (user.phone && !phoneNumberPattern.test(user.phone))
  //     return false;

  // // check if email is wrong
  // if (user.email && !emailPattern.test(user.email))
  //     return false;

  // // check role
  // if (user.role && (user.role != 'student' && user.role != 'tutor'))
  //     return false;

  // // check balance
  // if (user.balance && user.balance < 0)
  //     return false;

  return true;
};

class UserController {
  // [POST] /api/user/signup
  async signup(req, res) {
    if (!checkConstraints(req.body)) return res.status(400).json({ message: "Given user's information is invalid" });
    const { username, password } = req.body;
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
      const hashedPassword = await bcrypt.hash(password, 10);
      delete req.body.password;
      const result = await User.create({
        ...req.body,
        password: hashedPassword,
      });
      // const accessToken = jwt.sign(result.username, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({
        message: "Signup successfully",
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
  // [POST] /api/user/login
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });

      const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
      if (!isCorrectPassword) return res.status(400).json({ message: "Invalid password" });

      const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h", // expires in 1 hour
      });
      const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1y", // expires in 1 year
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      res.cookie("isLoggedIn", true, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
      res.status(200).json({
        message: "Login successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  // [PUT] /api/user/change-info
  async changeInfo(req, res) {
    if (!checkConstraints(req.body)) return res.status(400).json({ message: "Given user's information is invalid" });

    const { username } = req.body;
    delete req.body["password"];

    try {
      const updatedUser = await User.findOneAndUpdate({ username: username }, req.body, { new: true });

      if (!updatedUser) return res.status(400).json({ message: "User does not exist" });

      const accessToken = jwt.sign(updatedUser.username, process.env.ACCESS_TOKEN_SECRET);

      res.status(200).json({
        message: "Change info successfully",
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
  // [PUT] /api/user/change-password
  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    try {
      const username = req.user.username;
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(400).json({ message: "User does not exist" });
      let isCorrectPassword = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isCorrectPassword) return res.status(400).json({ message: "Wrong password" });
      //isCorrectPassword = newPassword.length >= 6;
      //if (!isCorrectPassword) return res.status(400).json({ message: "New password must be at least 6 characters" });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { password: hashedPassword },
        { new: true }
      );
      const accessToken = jwt.sign(updatedUser.username, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({
        message: "Change password successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
  // [POST] /api/user/logout
  async logout(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("isLoggedIn");
    res.status(200).json({ message: "Logout successfully" });
  }
}

module.exports = new UserController();
