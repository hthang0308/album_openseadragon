const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const albumController = require("../controllers/AlbumController");
const path = require("path");
const multer = require("multer");

//upload multiple
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  // filename: function (req, file, cb) {
  //   console.log("Chào tớ là multer");
  //   console.log("Đây là thông tin của file: ", file);
  //   cb(null, file.originalname.substring(0, 2) + "-" + Date.now() + ".jpg");
  // },
});
const multi_upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1000MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
});
// router.route("/:albumId/photo/:photoId/share").post(verifyToken, photoController.sharePhoto);
// router.route("/:albumId/photo/search").get(verifyToken, photoController.searchPhoto);
// router
//   .route("/:albumId/photo/:photoId")
//   .get(verifyToken, photoController.getPhotoById)
//   .delete(verifyToken, photoController.deletePhoto);
// router
//   .route("/:albumId/photo")
//   .get(verifyToken, photoController.getAllPhotos)
//   .post(verifyToken, upload.single("file"), photoController.uploadPhoto);
// router.route("/:albumId/share").post(verifyToken, albumController.shareAlbum);
// router
//   .route("/:albumId")
//   .get(verifyToken, albumController.getAlbumById)
//   .delete(verifyToken, albumController.deleteAlbum);
router.route("/:albumId/:photoId/share").post(verifyToken, albumController.sharePhoto);
router.route("/:albumId/:photoId/unshare").post(verifyToken, albumController.unsharePhoto);

router.route("/").get(verifyToken, albumController.getAlbum).post(verifyToken, albumController.createAlbum);
router
  .route("/:albumId")
  .get(verifyToken, albumController.getAlbumById)
  .put(verifyToken, albumController.updateAlbum)
  .delete(verifyToken, albumController.deleteAlbum);
router.route("/:albumId/share").post(verifyToken, albumController.shareAlbum);
router.route("/:albumId/unshare").post(verifyToken, albumController.unshareAlbum);
//image
//upload multiple
router.route("/:albumId").post(verifyToken, multi_upload.array("files", 50), albumController.uploadPhoto);

router
  .route("/:albumId/:photoId")
  .get(verifyToken, albumController.getPhotoById)
  .delete(verifyToken, albumController.deletePhoto);
router.route("/:albumId/:photoId/detail").get(verifyToken, albumController.getPhotoDetail);
router.route("/:albumId/:photoId/:x/:y").get(verifyToken, albumController.getPhotoDzi);
module.exports = router;
