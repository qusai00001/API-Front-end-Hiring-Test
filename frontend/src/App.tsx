import { Container, Divider, Box } from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Header from "./components/Header";
import { useState } from "react";

export default function App() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* centered form */}
        <Box sx={{ maxWidth: 520, mx: "auto", mb: 3 }}>
          <TaskForm onCreated={() => setReloadKey(k => k + 1)} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* centered table */}
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <div key={reloadKey}><TaskList /></div>
        </Box>
      </Container>
    </>
  );
}
