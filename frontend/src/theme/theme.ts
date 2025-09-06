import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import components from "./components";
import typography from "./typography";
import { lightPalette, darkPalette } from "./palette";

export type Mode = "light" | "dark";

export const getTheme = (mode: Mode) => {
  let theme = createTheme({
    palette: mode === "light" ? lightPalette : darkPalette,
    typography,
    components
  });
  theme = responsiveFontSizes(theme);
  return theme;
};
