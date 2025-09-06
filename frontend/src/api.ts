export type Task = { id:number; title:string; description?:string; status:"todo"|"in-progress"|"done" };
const base = import.meta.env.VITE_API_URL;

export const api = {
  list: async (): Promise<Task[]> => (await fetch(`${base}/tasks`)).json(),
  create: async (t: Omit<Task,"id">): Promise<Task> =>
    (await fetch(`${base}/tasks`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(t) })).json(),
  setStatus: async (id:number, status: Task["status"]): Promise<Task> =>
    (await fetch(`${base}/tasks/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ status }) })).json(),
  del: async (id:number) => fetch(`${base}/tasks/${id}`, { method:"DELETE" })
};
