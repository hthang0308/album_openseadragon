const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      index: { unique: true },
    },
    password: {
      type: String,
      require: true,
    },
    totalAlbums: {
      type: Number,
      default: 0,
    },
    albums: [
      {
        type: Schema.Types.ObjectId,
        ref: "albums",
      },
    ],
    albumSharedWithMe: [
      {
        type: Schema.Types.ObjectId,
        ref: "albums",
      },
    ],
    photoSharedWithMe: [
      {
        type: Schema.Types.ObjectId,
        ref: "photos",
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("users", UserSchema);
