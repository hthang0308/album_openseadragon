require("dotenv").config();
const fs = require("fs");
// const AdmZip = require("adm-zip");
// const sharp = require("sharp");
const Album = require("../models/Album");
const User = require("../models/User");
const Photo = require("../models/Photo");
const sizeOf = require("image-size");
// const path = require("path");
const fse = require("fs-extra");
// const lookSame = require("looks-same");

// const unzip = (filename, endPath, callback) => {
//   console.log("./uploads/" + filename + ".zip");
//   return new Promise((resolve, reject) => {
//     try {
//       var zip = new AdmZip("./uploads/" + filename + ".zip");
//       zip.extractAllTo(endPath, true);
//       fs.unlinkSync(path.join(__dirname, "../uploads/" + filename + ".zip"));

//       resolve("ok");
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

class AlbumController {
  // [GET] /album
  async getAlbum(req, res) {
    try {
      const existingUser = await User.findOne({ username: req.user.username }).populate("albums");

      res.status(200).json({
        message: "Get album success",
        content: existingUser.albums,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [GET] /album/:albumId
  async getAlbumById(req, res) {
    const albumId = req.params.albumId;
    const username = req.user.username;
    try {
      //check if album exist
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album belong to user
      if (!existingUser.albums.includes(albumId) && !existingUser.albumSharedWithMe.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to see this album" });
      //send response
      res.status(200).json({
        message: "Get album success",
        content: existingAlbum,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [POST] /album
  async createAlbum(req, res) {
    try {
      const album = new Album(req.body);
      const newAlbum = await album.save();
      // Add album to user's albums base on username
      const user = await User.findOne({ username: req.user.username });
      user.albums.push(newAlbum._id);
      await user.save();
      res.status(200).json({
        message: "Album created",
        content: newAlbum,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [PUT] /album/:albumId
  async updateAlbum(req, res) {
    try {
      //get albumId from params
      const albumId = req.params.albumId;
      //get username from req.user
      const username = req.user.username;
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album exist
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if album belong to user
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to update other's album" });
      //update album
      existingAlbum.name = req.body.name;
      await existingAlbum.save();
      //send response
      res.status(200).json({
        message: "Album updated",
        content: existingAlbum,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [DELETE] /album/:albumId
  async deleteAlbum(req, res) {
    try {
      //get albumId from params
      const albumId = req.params.albumId;
      //get username from req.user
      const username = req.user.username;
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album exist
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if album belong to user
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to delete other's album" });
      //delete all photos in album with albumId = albumId
      const photos = existingAlbum.photos;
      console.log("photos in album:");
      console.log(photos);
      photos.forEach((photo) => {
        //fs.unlinkSync(process.env.UPLOAD_PATH + photo._id);
        console.log(photo._id);
        fse.removeSync(process.env.UPLOAD_PATH + photo._id);
        Photo.findByIdAndDelete(photo._id);
      });
      //delete album
      await Album.findByIdAndDelete(albumId);
      //send response
      res.status(200).json({
        message: "Album deleted",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [POST] /album/:albumId
  async uploadPhoto(req, res) {
    //get albumId from params
    const albumId = req.params.albumId;
    //get username from req.user
    const username = req.user.username;
    console.log("Đã vượt qua hàng rào an ninh");
    try {
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      console.log("Vượt qua tầng bảo mật thứ nhất");
      //check if album exist
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      console.log("Vượt qua tầng bảo mật thứ hai");
      //check if album belong to user
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to upload photo to other's album" });
      console.log("req.files", req.files);
      for (const file of req.files) {
        //filename without extension
        const dimensionOfPhoto = await sizeOf(file.path);
        console.log("Đang xử lý 1 file...");

        const photo = new Photo({
          username,
          height: dimensionOfPhoto.height,
          width: dimensionOfPhoto.width,
        });
        const filename = photo._id + "";
        fs.renameSync(file.path, process.env.UPLOAD_PATH + filename + process.env.IMAGE_EXTENSION);
        await photo.save();
        console.log("Đang lưu lên mongodb...");
        // const filename = photo._id + "";

        // await sharp(process.env.UPLOAD_PATH + filename + process.env.IMAGE_EXTENSION)
        //   .png()
        //   .tile({
        //     size: 512,
        //     overlap: 2,
        //   })
        //   .toFile(process.env.UPLOAD_PATH + filename + ".zip");
        // console.log("kill");

        // unzip(filename, process.env.UPLOAD_PATH);
        // await sharp(process.env.UPLOAD_PATH + filename + process.env.IMAGE_EXTENSION)
        //   .resize(500, 500)
        //   .toFile(process.env.UPLOAD_PATH + filename + "/" + filename + process.env.IMAGE_EXTENSION);

        // console.log("asayo");
        // fs.unlinkSync(path.join(__dirname, "../uploads/" + filename + ".jpg"));
        existingAlbum.photos.push(photo._id);

        existingAlbum.totalPhotos = existingAlbum.photos.length;

        console.log("Đã chỉnh sửa xong album");

        //fse.removeSync(path.join(__dirname, "../uploads/" + filename + ".jpg"));
      }
      console.log("demacia");
      await existingAlbum.save();
      console.log("existing album saved");
      res.status(200).json({
        message: "Photo uploaded",
      });
    } catch (err) {
      console.log("Error while uploading photo", err);
      res.status(500).json({ message: err.message });
    }
  }

  // [GET] /album/:albumId/:photoId
  async getPhotoById(req, res) {
    //check if album belong to user
    console.log("1");
    const username = req.user.username;
    const photoId = req.params.photoId;
    const existingPhoto = await Photo.findById(photoId);
    if (!existingPhoto) return res.status(404).json({ message: "Photo does not exist" });
    console.log("2");
    const existingUser = await User.findOne({ username });
    console.log("3");
    if (!existingUser) return res.status(404).json({ message: "User does not exist" });
    console.log("4");
    if (existingUser.photoSharedWithMe.includes(photoId)) {
      //if exist, send response
      console.log("path");
      console.log("19");
      console.log(process.env.UPLOAD_PATH + photoId + "/" + photoId + process.env.IMAGE_EXTENSION);
      console.log("2");
      if (fs.existsSync(process.env.UPLOAD_PATH + photoId + "/" + photoId + process.env.IMAGE_EXTENSION)) {
        console.log("File có tồn tại");
        return res.sendFile(req.params.photoId + process.env.IMAGE_EXTENSION, {
          root: process.env.UPLOAD_PATH + req.params.photoId + "/",
        });
      } else {
        console.log("3");
        console.log("file not found");
        //delete photo from database
        await Photo.findByIdAndDelete(photoId);
        console.log("4");
        Photo.save();
        console.log("5");
        return res.status(404).json({ message: "Photo does not exist" });
      }
    }

    const albumId = req.params.albumId;
    try {
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if photo exist
      //check if photo belong to album
      if (!existingAlbum.photos.includes(existingPhoto._id))
        return res.status(404).json({ message: "This photo does not belong to this album" });
      if (!existingUser.albums.includes(albumId) && !existingUser.albumSharedWithMe.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to see this photo" });
      if (fs.existsSync(process.env.UPLOAD_PATH + photoId + "/" + photoId + process.env.IMAGE_EXTENSION)) {
        console.log("File có tồn tại");
        return res.sendFile(req.params.photoId + process.env.IMAGE_EXTENSION, {
          root: process.env.UPLOAD_PATH + req.params.photoId + "/",
        });
      }
      //   });
      // res.sendFile(req.params.photoId + process.env.IMAGE_EXTENSION, {
      //   root: process.env.UPLOAD_PATH + req.params.photoId + "/",
      // });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [GET] /album/:albumId/:photoId/detail
  async getPhotoDetail(req, res) {
    //check if album belong to user
    const username = req.user.username;
    const photoId = req.params.photoId;
    const existingPhoto = await Photo.findById(photoId);
    if (!existingPhoto) return res.status(404).json({ message: "Photo does not exist" });
    const existingUser = await User.findOne({ username });
    if (!existingUser) return res.status(404).json({ message: "User does not exist" });
    console.log("Lấy độ dài rộng của ảnh...");
    console.log(existingPhoto);
    if (existingUser.photoSharedWithMe.includes(photoId))
      return res.status(200).json({
        message: "Photo details",
        content: {
          sharedWith: existingPhoto.sharedWith,
          height: existingPhoto.height,
          width: existingPhoto.width,
        },
      });
    const albumId = req.params.albumId;
    try {
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if photo exist
      //check if photo belong to album
      if (!existingAlbum.photos.includes(existingPhoto._id))
        return res.status(404).json({ message: "This photo does not belong to this album" });
      if (!existingUser.albums.includes(albumId) && !existingUser.albumSharedWithMe.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to see this photo" });
      res.status(200).json({
        message: "Photo dimension",
        content: {
          sharedWith: existingPhoto.sharedWith,
          height: existingPhoto.height,
          width: existingPhoto.width,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [GET] /album/:albumId/:photoId/:x/:y
  async getPhotoDzi(req, res) {
    //check if album belong to user
    const username = req.user.username;
    const photoId = req.params.photoId;
    const existingPhoto = await Photo.findById(photoId);
    if (!existingPhoto) return res.status(404).json({ message: "Photo does not exist" });
    const existingUser = await User.findOne({ username });
    if (!existingUser) return res.status(404).json({ message: "User does not exist" });
    if (existingUser.photoSharedWithMe.includes(photoId))
      return res.sendFile(req.params.y, {
        root: process.env.UPLOAD_PATH + req.params.photoId + "/" + req.params.photoId + "_files/" + req.params.x + "/",
      });
    const albumId = req.params.albumId;
    try {
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if photo exist
      //check if photo belong to album
      if (!existingAlbum.photos.includes(existingPhoto._id))
        return res.status(404).json({ message: "This photo does not belong to this album" });
      if (!existingUser.albums.includes(albumId) && !existingUser.albumSharedWithMe.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to see this photo" });
      res.sendFile(req.params.y, {
        root: process.env.UPLOAD_PATH + req.params.photoId + "/" + req.params.photoId + "_files/" + req.params.x + "/",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [DELETE] /album/:albumId/:photoId
  async deletePhoto(req, res) {
    try {
      //get albumId from params
      const albumId = req.params.albumId;
      //get username from req.user
      const username = req.user.username;
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album exist
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if album belong to user
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to delete other's photo" });
      //check if photo exist
      const existingPhoto = await Photo.findById(req.params.photoId);
      if (!existingPhoto) return res.status(404).json({ message: "Photo does not exist" });
      //check if photo belong to album
      if (!existingAlbum.photos.includes(existingPhoto._id))
        return res.status(404).json({ message: "This photo is not in this album" });
      //delete photo from album
      existingAlbum.photos.pull(req.params.photoId);
      existingAlbum.totalPhotos = existingAlbum.photos.length;
      await existingAlbum.save();
      //delete photo
      await Photo.findByIdAndDelete(req.params.photoId);

      //delete photo from uploads folder
      //fse.removeSync(process.env.UPLOAD_PATH + existingPhoto._id);

      //send response
      res.status(200).json({
        message: "Photo deleted",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [POST] /album/:albumId/share
  async shareAlbum(req, res) {
    try {
      console.log("1");
      //get albumId from params
      const albumId = req.params.albumId;
      //get username from req.user
      const username = req.user.username;
      console.log("2");
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album exist
      console.log("3");
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //if user is the owner of album
      console.log("4");
      if (req.body.username === username) return res.status(404).json({ message: "You can't share with yourself" });
      //check if user is the owner of album
      console.log("5");
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to share other's album" });
      //if exist album not shared with user
      console.log("6");
      if (!existingAlbum.sharedWith.includes(req.body.username)) {
        //check if user exist
        console.log("7");
        const existingUserToShare = await User.findOne({ username: req.body.username });
        if (!existingUserToShare) return res.status(404).json({ message: "User does not exist" });
        //add album to sharedWith
        console.log("8");
        existingAlbum.sharedWith.push(req.body.username);
        await existingAlbum.save();
        //add album to user
        console.log("9");
        existingUserToShare.albumSharedWithMe.push(albumId);
        await existingUserToShare.save();
        console.log("10");
        //send response
        res.status(200).json({
          message: "Album shared",
          content: existingAlbum,
        });
      } else {
        res.status(404).json({
          message: "Album already shared",
          content: existingAlbum,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  //[POST] /album/:albumId/unshare
  async unshareAlbum(req, res) {
    try {
      //get albumId from params
      const albumId = req.params.albumId;
      //get username from req.user
      const username = req.user.username;
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album exist
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //if user is the owner of album
      if (req.body.username === username) return res.status(404).json({ message: "You can't unshare with yourself" });
      //check if user is the owner of album
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to unshare other's album" });
      if (existingAlbum.sharedWith.includes(req.body.username)) {
        //remove album from sharedWith
        existingAlbum.sharedWith.pull(req.body.username);
        //remove album from user
        existingUser.albumSharedWithMe = existingUser.albumSharedWithMe.pull(albumId);
        await existingAlbum.save();
        //send response
        res.status(200).json({
          message: "Album unshared",
          content: existingAlbum,
        });
      } else {
        res.status(404).json({
          message: "Album not shared to this user",
          content: existingAlbum,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  // share photo
  // [POST] /album/:albumId/:photoId/share
  async sharePhoto(req, res) {
    console.log("1");
    //get albumId from params
    const albumId = req.params.albumId;
    console.log("2");
    //get photoId from params
    const photoId = req.params.photoId;
    //get username from req.user
    const username = req.user.username;
    console.log("3");
    try {
      //check if user exist
      console.log("4");
      const existingUser = await User.findOne({ username });
      console.log("5");
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album exist
      console.log("6");
      const existingAlbum = await Album.findById(albumId);
      console.log("7");
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if photo exist
      console.log("8");
      const existingPhoto = await Photo.findById(photoId);
      console.log("9");
      if (!existingPhoto) return res.status(404).json({ message: "Photo does not exist" });
      //check if photo belong to album
      console.log("10");
      if (!existingAlbum.photos.includes(photoId))
        return res.status(404).json({ message: "This photo is not in this album" });
      //check if user is the owner of album
      console.log("11");
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to share other's photo" });
      //if exist photo not shared with user
      console.log("12");
      if (!existingPhoto.sharedWith.includes(req.body.username)) {
        //check if user exist
        console.log("13");
        const existingUserToShare = await User.findOne({ username: req.body.username });
        console.log("14");
        if (!existingUserToShare) return res.status(404).json({ message: "User does not exist" });
        //add photo to sharedWith
        existingPhoto.sharedWith.push(req.body.username);
        console.log("15");
        await existingPhoto.save();
        //add photo to user
        existingUserToShare.photoSharedWithMe.push(photoId);
        await existingUserToShare.save();
        //send response
        console.log("16");
        res.status(200).json({
          message: "Photo shared",
          content: existingPhoto,
        });
      } else {
        res.status(404).json({
          message: "Photo already shared",
          content: existingPhoto,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  // [POST] /album/:albumId/:photoId/unshare
  async unsharePhoto(req, res) {
    //get albumId from params
    const albumId = req.params.albumId;
    //get photoId from params
    const photoId = req.params.photoId;
    //get username from req.user
    const username = req.user.username;
    try {
      //check if user exist
      const existingUser = await User.findOne({ username });
      if (!existingUser) return res.status(404).json({ message: "User does not exist" });
      //check if album exist
      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) return res.status(404).json({ message: "Album does not exist" });
      //check if photo exist
      const existingPhoto = await Photo.findById(photoId);
      if (!existingPhoto) return res.status(404).json({ message: "Photo does not exist" });
      //check if photo belong to album
      if (!existingAlbum.photos.includes(photoId))
        return res.status(404).json({ message: "This photo is not in this album" });
      //check if user is the owner of album
      if (!existingUser.albums.includes(albumId))
        return res.status(404).json({ message: "You are not allowed to unshare other's photo" });
      if (existingPhoto.sharedWith.includes(req.body.username)) {
        //remove photo from sharedWith
        existingPhoto.sharedWith.pull(req.body.username);
        //remove photo from user
        existingUser.photoSharedWithMe = existingUser.photoSharedWithMe.pull(photoId);
        await existingPhoto.save();
        //send response
        res.status(200).json({
          message: "Photo unshared",
          content: existingPhoto,
        });
      } else {
        res.status(404).json({
          message: "Photo not shared to this user",
          content: existingPhoto,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  //api delete duplicate photo
  // [POST] /album/:albumId/deleteDuplicate
  async deleteDuplicate(req, res) {}
}
module.exports = new AlbumController();
