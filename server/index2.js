require("dotenv").config();
const connectDB = require("./config/database");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const sharp = require("sharp");
const fse = require("fs-extra");

const unzip = (filename, endPath, callback) => {
  console.log("./uploads/" + filename + ".zip");
  return new Promise((resolve, reject) => {
    try {
      var zip = new AdmZip("./uploads/" + filename + ".zip");
      zip.extractAllTo(endPath, true);
      fs.unlinkSync(path.join(__dirname, "./uploads/" + filename + ".zip"));

      resolve("ok");
    } catch (error) {
      reject(error);
    }
  });
};

const Photo = require("./models/Photo");
connectDB();
Photo.watch().on("change", async (data) => {
  if (data.operationType === "insert") {
    setTimeout(async function () {
      console.log("Bắt đầu xử lý ảnh");
      const filename = data.fullDocument._id + "";

      // await Photo.updateOne({ _id: data.fullDocument._id }, { $unset: { path: "" } });
      await sharp(process.env.UPLOAD_PATH + filename + process.env.IMAGE_EXTENSION)
        .tile({
          size: 512,
          overlap: 2,
        })
        .toFile(process.env.UPLOAD_PATH + filename + ".zip");
      console.log("Đã tạo file zip");
      console.log("Đường dẫn là ", path.join(__dirname, "./uploads/" + filename + ".jpg"));

      unzip(filename, process.env.UPLOAD_PATH);
      console.log(data.fullDocument);
      console.log("Dài: ", data.fullDocument.height);
      console.log("Rộng: ", data.fullDocument.width);
      await sharp(process.env.UPLOAD_PATH + filename + process.env.IMAGE_EXTENSION)
        .resize(500, Math.floor(500 * (data.fullDocument.height / data.fullDocument.width)))
        .toFile(process.env.UPLOAD_PATH + filename + "/" + filename + process.env.IMAGE_EXTENSION);

      console.log("Tạo ảnh mini thành công! ");
      if (fs.existsSync(path.join(__dirname, "./uploads/" + filename + ".zip"))) {
        fs.unlinkSync(path.join(__dirname, "./uploads/" + filename + ".zip"));
      }
    }, 5000);
  } else if (data.operationType === "delete") {
    const filename = data.documentKey._id + "";
    fse.removeSync(process.env.UPLOAD_PATH + filename);
    console.log("1 ảnh bị xóa");
  } else if (data.operationType === "update") {
    console.log("Bắt đầu cập nhật ảnh");
  }
});
//ALBum here

// Album.watch().on("change", async (data) => {
//   if (data.operationType === "insert") {
//     console.log("New album addedddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
//   } else if (data.operationType === "delete") {
//     console.log(data.documentKey._id + "");
//     console.log("IT HURT IT HURT SO MUCH");
//   }
// });
// Connect to database
