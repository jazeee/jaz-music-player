import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { theme } from "./theme/theme";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from "../Layout/Layout";
import { Home } from "./Home";
import { MusicContainer } from "../Music/Container";
import { AppStateProvider } from "./state/AppStateProvider";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppStateProvider>
          <Routes>
            <Route path="/" element={<Layout />} >
              <Route path="" element={<Home />} />
              <Route path="music" >
                <Route path=":category" element={<MusicContainer />} />
              </Route>
            </Route>
          </Routes>
        </AppStateProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
