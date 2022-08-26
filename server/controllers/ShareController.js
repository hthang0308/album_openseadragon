require("dotenv").config();
const User = require("../models/User");
class ShareController {
  // [GET] /api/share/album-shared-with-me
  async getAlbumSharedWithMe(req, res) {
    try {
      const username = req.user.username;
      const detailUser = await User.findOne({
        username: username,
      }).populate("albumSharedWithMe");
      console.log(detailUser);
      res.status(200).json({
        message: "Get album shared with me success",
        content: detailUser.albumSharedWithMe,
      });
    } catch (err) {
      console.log(err);
    }
  }
  // [GET] /api/share/photo-shared-with-me
  async getPhotoSharedWithMe(req, res) {
    try {
      const username = req.user.username;
      const detailUser = await User.findOne({
        username: username,
      }).populate("photoSharedWithMe");
      console.log(detailUser);
      res.status(200).json({
        message: "Get photo shared with me success",
        content: detailUser.photoSharedWithMe,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new ShareController();
