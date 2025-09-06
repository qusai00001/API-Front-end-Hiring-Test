import { PaletteOptions } from "@mui/material/styles";

export const lightPalette: PaletteOptions = {
  mode: "light",
  primary:   { main: "#0d6efd" },
  secondary: { main: "#6c757d" },
  background:{ default: "#f8f9fa", paper: "#ffffff" },
  text:      { primary: "#212529", secondary: "#495057" },


};

export const darkPalette: PaletteOptions = {
  mode: "dark",
  primary:   { main: "#0d6efd" },
  secondary: { main: "#6c757d" },
  background:{ default: "#212529", paper: "#343a40" },
  text:      { primary: "#f8f9fa", secondary: "#ced4da" },
};
