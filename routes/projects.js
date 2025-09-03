const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const protect = require("../middleware/auth");

router.use(protect); // All routes require login

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

// Get All Projects for Logged-in User
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
    res.json({ message: "Project deleted successfully", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task Routes

// Add Task
router.post("/:projectId/tasks", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, dueDate, status } = req.body;
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
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(req.params.taskId);
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
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.remove();
    await project.save();
    res.json({ message: "Task deleted", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
