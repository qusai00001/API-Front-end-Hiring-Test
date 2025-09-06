const express = require("express");
const { readDB, writeDB, nextId } = require("../storage");
const { createTaskSchema, patchStatusSchema } = require("../validation");

const router = express.Router();

// GET /tasks
router.get("/", async (_req, res, next) => {
  try {
    const tasks = await readDB();
    res.json(tasks);
  } catch (e) { next(e); }
});

// POST /tasks
router.post("/", async (req, res, next) => {
  try {
    const parsed = createTaskSchema.parse(req.body);
    const tasks = await readDB();
    const id = await nextId(tasks);
    const task = { id, ...parsed };
    tasks.push(task);
    await writeDB(tasks);
    res.status(201).json(task);
  } catch (e) {
    if (e.name === "ZodError") return res.status(400).json({ error: e.errors[0].message });
    next(e);
  }
});

// PATCH /tasks/:id  (status only)
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const patch = patchStatusSchema.parse(req.body);
    const tasks = await readDB();
    const idx = tasks.findIndex(t => String(t.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: "not found" });
    tasks[idx].status = patch.status;
    await writeDB(tasks);
    res.json(tasks[idx]);
  } catch (e) {
    if (e.name === "ZodError") return res.status(400).json({ error: e.errors[0].message });
    next(e);
  }
});

// DELETE /tasks/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = await readDB();
    const next = tasks.filter(t => String(t.id) !== String(id));
    if (next.length === tasks.length) return res.status(404).json({ error: "not found" });
    await writeDB(next);
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;
