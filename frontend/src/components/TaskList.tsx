import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { api, Task } from "../api";
import { MenuItem, Select, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const statuses: Task["status"][] = ["todo","in-progress","done"];

export default function TaskList() {
  const [rows, setRows] = useState<Task[]>([]);
  const refresh = async () => setRows(await api.list());
  useEffect(() => { refresh(); }, []);

  const columns: GridColDef[] = [
    { field:"id", headerName:"ID", width:80 },
    { field:"title", headerName:"Title", flex:1 },
    { field:"description", headerName:"Description", flex:1,
      renderCell: (p) => <span style={{whiteSpace:"pre-wrap"}}>{String(p.value || "")}</span> },
    { field:"status", headerName:"Status", width:160,
      renderCell: (p: GridRenderCellParams<Task>) => (
        <Select size="small" value={p.value} onChange={async (e) => {
          const updated = await api.setStatus(p.row.id, e.target.value as Task["status"]);
          setRows(prev => prev.map(r => r.id === updated.id ? updated : r));
        }}>
          {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      )},
    { field:"actions", headerName:"", width:80, sortable:false, filterable:false,
      renderCell: (p) => (
        <Stack direction="row">
          <IconButton aria-label="delete" onClick={async () => { await api.del(p.row.id); refresh(); }}>
            <DeleteIcon color="error" />
          </IconButton>
        </Stack>
      )}
  ];

return (
  <div style={{ height: 480, width: "100%", maxWidth: 900, margin: "0 auto" }}>
    <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
  </div>
);
}
