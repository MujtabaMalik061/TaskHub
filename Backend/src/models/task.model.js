// src/models/task.model.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    discription: { type: String, default: "" },
    status: { type: String, required: true, trim: true, default: "todo" },
    dueDate: { type: Date, required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
