import { ThemeOptions } from "@mui/material/styles";

const components: ThemeOptions["components"] = {
  MuiButton: {
    defaultProps: { variant: "contained" },
    styleOverrides: { root: { borderRadius: 12, textTransform: "none" } }
  },
  MuiPaper: {
    styleOverrides: { root: { borderRadius: 16 } }
  }
};

export default components;
