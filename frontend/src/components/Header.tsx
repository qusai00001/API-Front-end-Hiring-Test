import { AppBar, Toolbar, Typography } from "@mui/material";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>
          Tasks
        </Typography>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
