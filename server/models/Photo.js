const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    sharedWith: {
      type: Array,
      default: [],
    },
    height: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("photos", PhotoSchema);
