const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// -----------------------------
// Project routes
// -----------------------------

// Add a project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res
      .status(200)
      .json({ message: "Project deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// Task routes under a project
// -----------------------------

// Add a task
router.post("/:projectId/tasks", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, dueDate, status } = req.body;
    if (!title)
      return res.status(400).json({ message: "Task title is required" });

    const task = { title, dueDate, status: status || "Pending" };
    project.tasks.push(task);
    await project.save();

    res.status(201).json(project); // return updated project
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a task
router.put("/:projectId/tasks/:taskId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await project.save();

    res.json(project); // return updated project
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a task
router.delete("/:projectId/tasks/:taskId", async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Remove the task using pull
    const initialLength = project.tasks.length;
    project.tasks.pull({ _id: taskId }); // ✅ safer
    if (project.tasks.length === initialLength)
      return res.status(404).json({ message: "Task not found" });

    await project.save();

    res.status(200).json(project); // return updated project
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
