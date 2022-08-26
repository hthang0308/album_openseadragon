const express = require("express");
const router = express.Router();

const userController = require("../controllers/UserController");
const verifyToken = require("../middleware/auth");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", verifyToken, userController.logout);
// router.put("/change-info", verifyToken, userController.changeInfo);
router.put("/change-password", verifyToken, userController.changePassword);

module.exports = router;
