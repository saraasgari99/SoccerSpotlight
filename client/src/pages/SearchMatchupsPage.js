import { useEffect, useState } from 'react';
import { Grid, TextField, Slider, Button, Container, Link, TableRow } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination } from '@mui/material';
import MatchCard from '../components/MatchCard';
import CardTable from '../components/CardTable';
import DataTable from 'react-data-table-component';
import Paper from '@mui/material/Paper';

const config = require('../config.json');

export default function SearchMatchupsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [stats, setStats] = useState([]);

  //const [albums, setAlbums] = useState([]);
  const [searchHomeTeamName, setSearchHomeTeamName] = useState('');
  const [searchAwayTeamName, setSearchAwayTeamName] = useState('');


  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_matchups?search_home_name=${searchHomeTeamName}` +
      `&search_away_name=${searchAwayTeamName}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const matchesWithId = Array.isArray(resJson) ? resJson.map((match) => ({id: match.match_api_id, ...match })) : [];
        setMatches(matchesWithId);
        fetch(`http://${config.server_host}:${config.server_port}/get_match_stats?search_home_name=${searchHomeTeamName}` +
          `&search_away_name=${searchAwayTeamName}`
        )
          .then(res => res.json())
          .then(resJson => {
            // DataGrid expects an array of objects with a unique id.
            // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
            const matchStats = Array.isArray(resJson) ? resJson.map((match) => ({id: match.home_wins, ...match })) : [];
            setStats(matchStats);
          });
      });

  }

  const columns = [
    { field: 'home_wins', headerName: 'Home Wins', width: 100 },
    { field: 'away_wins', headerName: 'Away Wins', width: 100 },
    { field: 'draws', headerName: 'Draws', width: 100 },
    { field: 'home_win_percent', headerName: 'home_win_percent', width: 100 },
    { field: 'away_win_percent', headerName: 'away_win_percent', width: 100 },
    { field: 'draw_percent', headerName: 'draw_percent', width: 100 },
    { field: 'home_total_goals', headerName: 'home_total_goals', width: 100 },
    { field: 'away_total_goals', headerName: 'away_total_goals', width: 100 }

  ]

  const statRows = [
    stats.home_wins, stats.away_wins, stats.draws, stats.home_win_percent, stats.away_win_percent,
    stats.draw_percent, stats.home_total_goals, stats.away_total_goals
  ]
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // TODO (TASK 22): replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // TODO (TASK 22): then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <Container>
      {selectedMatchId && <MatchCard match_api_id={selectedMatchId} handleClose={() => setSelectedMatchId(null)} />}
      <h2>Search Matchups</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Home Team Name' value={searchHomeTeamName} onChange={(e) => setSearchHomeTeamName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={8}>
          <TextField label='Away Team Name' value={searchAwayTeamName} onChange={(e) => setSearchAwayTeamName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      {/* <TableContainer component={Paper} sx={{ width:1000, paddingTop: 3 }}>
      <Table size='small' aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell> Home Wins </TableCell>
            <TableCell align="right">Away Wins </TableCell>
            <TableCell align="right"> Draws </TableCell>
            <TableCell> Home Win Percent </TableCell>
            <TableCell align="right">Away Win Percent </TableCell>
            <TableCell align="right"> Draw Percent </TableCell>
            <TableCell> Home Goals </TableCell>
            <TableCell align="right">Away Goals </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.home_wins}
              </TableCell>
              <TableCell align="right">{row.away_wins}</TableCell>
              <TableCell align="right">{row.draws}</TableCell>
              <TableCell align="right">{row.home_win_percent}</TableCell>
              <TableCell align="right">{row.away_win_percent}</TableCell>
              <TableCell align="right">{row.draw_percent}</TableCell>
              <TableCell align="right">{row.home_total_goals}</TableCell>
              <TableCell align="right">{row.away_total_goals}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> */}
      <Container style={{paddingTop: '15px'}}>
        <TableContainer>
          <Table>
            <TableHead>
                <TableRow>
                    Matches Played
                </TableRow>
            </TableHead>
            <TableBody>
                {matches.map(match =>
                  <TableRow key={match.id}>
                    <MatchCard match_api_id={match.id}/>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

    </Container>
  );
}