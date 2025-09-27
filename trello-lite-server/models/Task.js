const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: { type: Number, default: 0 }, // 0=low,1=med,2=high
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    order: { type: Number, default: 0 }, // for drag-and-drop ordering
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
