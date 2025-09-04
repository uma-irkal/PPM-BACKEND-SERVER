const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Projects CRUD
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tasks CRUD
router.post("/:id/tasks", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    project.tasks.push(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:projectId/tasks/:taskId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const task = project.tasks.id(req.params.taskId);
    Object.assign(task, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:projectId/tasks/:taskId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    project.tasks.id(req.params.taskId).remove();
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
