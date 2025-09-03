const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: "Pending" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  tasks: [taskSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔹 logged-in user
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
