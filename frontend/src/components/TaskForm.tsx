import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskInput, statusEnum } from "../validation";
import { TextField, Button, MenuItem, Stack } from "@mui/material";
import { api } from "../api";

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
  const { register, handleSubmit, formState:{ errors, isValid, isSubmitting }, reset } =
    useForm<TaskInput>({ resolver: zodResolver(taskSchema), mode:"onChange", defaultValues:{ status:"todo" } });

  const onSubmit = async (data: TaskInput) => {
    await api.create({ title: data.title, description: data.description || "", status: data.status });
    reset({ title:"", description:"", status:"todo" });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <TextField label="Title" {...register("title")} error={!!errors.title} helperText={errors.title?.message} sx={{ }} />
        <TextField label="Description" multiline minRows={2} {...register("description")}
          error={!!errors.description} helperText={errors.description?.message} />
        <TextField select label="Status" defaultValue="todo" {...register("status")}
          error={!!errors.status} helperText={errors.status?.message}>
          {statusEnum.options.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <Button type="submit" variant="contained" disabled={!isValid || isSubmitting} >Create Task</Button>
      </Stack>
    </form>
  );
}
