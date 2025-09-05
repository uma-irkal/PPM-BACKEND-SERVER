const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Create Project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, deletedProjectId: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- Tasks --------------------

// Add Task
router.post("/:projectId/tasks", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    project.tasks.push(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Task
router.put("/:projectId/tasks/:taskId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const task = project.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.set(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Task
// Delete Task
router.delete("/:projectId/tasks/:taskId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = project.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.remove();
    await project.save();

    res.json(project); // ✅ return updated project
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
