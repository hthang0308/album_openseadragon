const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    totalPhotos: {
      type: Number,
      default: 0,
    },
    photos: [
      {
        type: Schema.Types.ObjectId,
        ref: "photos",
      },
    ],
    sharedWith: {
      type: Array,
      default: [],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("albums", AlbumSchema);
