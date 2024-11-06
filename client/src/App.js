import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import PlayerInfo from './components/PlayerInfo';
import TeamInfo from './components/TeamInfo';
import HomePage from './pages/HomePage';
import SearchTeamsPage from './pages/SearchTeamsPage';
import SearchMatchupsPage from "./pages/SearchMatchupsPage";
import LeagueMatches from "./pages/LeagueMatches";
import SearchPlayersPage from "./pages/SearchPlayersPage";
import WorldCupPlayers from "./pages/WorldCupPlayers";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search_teams" element={<SearchTeamsPage />} />
          <Route path="/search_matchups" element={<SearchMatchupsPage />} />
          <Route path="/search_players" element={<SearchPlayersPage />} />
          <Route path="/league/:league_id" element={<LeagueMatches />} />
          <Route path="/get_world_cup_players" element={<WorldCupPlayers />} />
          <Route path="/playerInfo/:player_id" element={<PlayerInfo />} />
          <Route path="/teamInfo/:team_id" element={<TeamInfo/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}