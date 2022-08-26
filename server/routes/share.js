const express = require("express");
const router = express.Router();

const shareController = require("../controllers/ShareController");
const verifyToken = require("../middleware/auth");

router.get("/album-shared-with-me", verifyToken, shareController.getAlbumSharedWithMe);
router.get("/photo-shared-with-me", verifyToken, shareController.getPhotoSharedWithMe);

module.exports = router;
