import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { theme } from "./theme/theme";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MusicPicker } from "../MusicPicker/MusicPicker";
import { Layout } from "../Layout/Layout";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="*" element={<MusicPicker />} />
            <Route path="" element={<MusicPicker />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
