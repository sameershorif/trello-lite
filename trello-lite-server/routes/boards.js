const express = require("express");
const Board = require("../models/Board");
const auth = require("../middleware/auth");
const router = express.Router();

// Create board
router.post("/", auth, async (req, res) => {
  try {
    const { title, members = [] } = req.body;
    const board = await Board.create({
      title,
      owner: req.user.id,
      members: [req.user.id, ...members.filter(m => m !== req.user.id)],
    });
    res.status(201).json(board);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get my boards (owner or member)
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;
  const boards = await Board.find({
    $or: [{ owner: userId }, { members: userId }],
  }).sort({ updatedAt: -1 });
  res.json(boards);
});

// Update board (title, members) — only owner
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, members } = req.body;
  const board = await Board.findById(id);
  if (!board) return res.status(404).json({ error: "Board not found" });
  if (board.owner.toString() !== req.user.id)
    return res.status(403).json({ error: "Not board owner" });

  if (title !== undefined) board.title = title;
  if (members !== undefined) board.members = members;
  await board.save();
  res.json(board);
});

// Delete board — only owner
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id);
  if (!board) return res.status(404).json({ error: "Board not found" });
  if (board.owner.toString() !== req.user.id)
    return res.status(403).json({ error: "Not board owner" });

  await board.deleteOne();
  res.json({ message: "Board deleted" });
});

module.exports = router;
