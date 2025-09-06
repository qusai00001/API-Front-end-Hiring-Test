const request = require("supertest");
const fs = require("fs/promises");
const path = require("path");
const app = require("../src/index");

const DB = path.join(__dirname, "..", "data", "db.json");

beforeEach(async () => { await fs.writeFile(DB, "[]"); });

test("POST → GET happy path", async () => {
  const create = await request(app).post("/tasks").send({
    title: "Write docs",
    description: "Finish README",
    status: "todo"
  }).expect(201);
  expect(create.body.id).toBeDefined();

  const list = await request(app).get("/tasks").expect(200);
  expect(list.body).toHaveLength(1);
});

test("PATCH status happy path", async () => {
  const { body } = await request(app).post("/tasks").send({ title: "A", status: "todo" });
  const up = await request(app).patch(`/tasks/${body.id}`).send({ status: "done" }).expect(200);
  expect(up.body.status).toBe("done");
});

// Negative #1: invalid status
test("rejects invalid status", async () => {
  const { body } = await request(app).post("/tasks").send({ title: "B", status: "todo" });
  await request(app).patch(`/tasks/${body.id}`).send({ status: "nope" }).expect(400);
});

// Negative #2: XSS attempt in description
test("rejects <script> in description", async () => {
  await request(app).post("/tasks").send({
    title: "XSS",
    description: "<script>alert(1)</script>",
    status: "todo"
  }).expect(400);
});
