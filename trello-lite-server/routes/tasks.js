const express = require("express");
const Task = require("../models/Task");
const Board = require("../models/Board");
const auth = require("../middleware/auth");
const router = express.Router();

// helper: ensure user can access board
async function canAccessBoard(userId, boardId) {
  const board = await Board.findById(boardId);
  if (!board) return { ok: false, status: 404, msg: "Board not found" };
  const isOwner = board.owner.toString() === userId;
  const isMember = board.members.some(m => m.toString() === userId);
  if (!isOwner && !isMember) return { ok: false, status: 403, msg: "No access" };
  return { ok: true, board };
}

// Create task
router.post("/", auth, async (req, res) => {
  try {
    const { board, title, description, status, priority, assignee, dueDate, order } = req.body;
    const access = await canAccessBoard(req.user.id, board);
    if (!access.ok) return res.status(access.status).json({ error: access.msg });

    const task = await Task.create({
      board, title, description, status, priority, assignee, dueDate, order
    });
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List tasks for a board
router.get("/board/:boardId", auth, async (req, res) => {
  const { boardId } = req.params;
  const access = await canAccessBoard(req.user.id, boardId);
  if (!access.ok) return res.status(access.status).json({ error: access.msg });

  const tasks = await Task.find({ board: boardId }).sort({ order: 1, createdAt: -1 });
  res.json(tasks);
});

// Update task
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const access = await canAccessBoard(req.user.id, task.board.toString());
  if (!access.ok) return res.status(access.status).json({ error: access.msg });

  const fields = ["title", "description", "status", "priority", "assignee", "dueDate", "order"];
  fields.forEach(f => {
    if (req.body[f] !== undefined) task[f] = req.body[f];
  });
  await task.save();
  res.json(task);
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const access = await canAccessBoard(req.user.id, task.board.toString());
  if (!access.ok) return res.status(access.status).json({ error: access.msg });

  await task.deleteOne();
  res.json({ message: "Task deleted" });
});

module.exports = router;
