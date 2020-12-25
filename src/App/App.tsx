import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { theme } from "./theme/theme";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from "../Layout/Layout";
import { Home } from "./Home";
import { MusicContainer } from "../Music/Container";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Layout />} >
            <Route path=":category" element={<MusicContainer />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
