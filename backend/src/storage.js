const fs = require("fs/promises");
const path = require("path");
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

async function ensureFile() {
  try { await fs.access(DB_PATH); }
  catch { await fs.mkdir(path.dirname(DB_PATH), { recursive: true }); await fs.writeFile(DB_PATH, "[]"); }
}
async function readDB() { await ensureFile(); return JSON.parse(await fs.readFile(DB_PATH, "utf8") || "[]"); }
async function writeDB(tasks) { await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2)); }
async function nextId(tasks) { return (tasks.reduce((m, t) => Math.max(m, t.id || 0), 0) || 0) + 1; }

module.exports = { readDB, writeDB, nextId };
