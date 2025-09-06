import { z } from "zod";
export const statusEnum = z.enum(["todo","in-progress","done"]);
const noScript = (s = "") => !/<\s*script/i.test(s);

export const taskSchema = z.object({
  title: z.string().min(1, "Required").max(100, "Max 100 chars"),
  description: z.string().max(500, "Max 500 chars").refine(noScript, "Must not contain <script>").optional().or(z.literal("")),
  status: statusEnum
});
export type TaskInput = z.infer<typeof taskSchema>;
