const { z } = require("zod");

const statusEnum = z.enum(["todo", "in-progress", "done"]);
const noScript = (s = "") => !/<\s*script/i.test(s);

const createTaskSchema = z.object({
  title: z.string().min(1, "title is required").max(100, "max 100 chars"),
  description: z
    .string()
    .max(500, "max 500 chars")
    .refine(noScript, "description must not contain <script>")
    .optional()
    .default(""),
  status: statusEnum
});

const patchStatusSchema = z.object({
  status: statusEnum
});

module.exports = { createTaskSchema, patchStatusSchema };
