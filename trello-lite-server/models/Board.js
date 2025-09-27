const mongoose = require("mongoose");
const { Schema } = mongoose;

const BoardSchema = new Schema(
  {
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }], // owner included optionally
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", BoardSchema);
