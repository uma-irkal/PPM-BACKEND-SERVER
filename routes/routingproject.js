// routes/routingproject.js
const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const protect = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// -----------------------------
// Project Routes
// -----------------------------

// Create Project
router.post("/", async (req, res) => {
  try {
    const project = new Project({ ...req.body, user: req.user._id });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Project
router.put("/:projectId", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    Object.assign(project, req.body);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Project
router.delete("/:projectId", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      user: req.user._id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted", id: req.params.projectId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// Task Routes
// -----------------------------

// Add Task
router.post("/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;
  const { title, dueDate, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId))
    return res.status(400).json({ message: "Invalid projectId" });

  try {
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = { title, dueDate, status: status || "Pending" };
    project.tasks.push(task);
    await project.save();

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Task
router.put("/:projectId/tasks/:taskId", async (req, res) => {
  const { projectId, taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId))
    return res.status(400).json({ message: "Invalid projectId" });
  if (!mongoose.Types.ObjectId.isValid(taskId))
    return res.status(400).json({ message: "Invalid taskId" });

  try {
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Task
router.delete("/:projectId/tasks/:taskId", async (req, res) => {
  const { projectId, taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId))
    return res.status(400).json({ message: "Invalid projectId" });
  if (!mongoose.Types.ObjectId.isValid(taskId))
    return res.status(400).json({ message: "Invalid taskId" });

  try {
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Remove task properly
    task.remove();
    await project.save();

    res.json({ message: "Task deleted successfully", project });
  } catch (err) {
    console.error("❌ Delete task error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
