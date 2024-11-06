import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Grid, Link, Modal } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import Typography from "@mui/material/Typography";

import { formatDate } from '../helpers/formatter';
import '../assets/matchcard.css';
const config = require('../config.json');

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: '50px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function MatchDetail({ match_api_id, handleClose }) {
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState({});
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_match/${match_api_id}`)
      .then(res => res.json())
      .then(matchJsonArray => {
        if (matchJsonArray.length > 0) {
          let temp = (({away_team_name, away_team_goal, home_team_name, home_team_goal, season, country_name, league_name, date}) => ({away_team_name, away_team_goal, home_team_name, home_team_goal, season, country_name, league_name, date}))(matchJsonArray[0]);
          setMatchData(temp);
        }
      });
    fetch(`http://${config.server_host}:${config.server_port}/get_match_players/${match_api_id}`)
    .then(res => res.json())
    .then(playersJsonArray => {
      if (playersJsonArray.length > 0) {
        let hometemp = [];
        let awaytemp = [];
        playersJsonArray.map(player => {
          if (player.team === 'home') {
            hometemp.push(player);
          } else if (player.team === 'away') {
            awaytemp.push(player);
          }
        });
        setHomePlayers(hometemp);
        setAwayPlayers(awaytemp);
      }
    });
  }, []);

  console.log('match data:', matchData);
  console.log('home players:', homePlayers);
  console.log('away players:', awayPlayers);
  console.log('testing:', homePlayers.map(player => (({ player_name, overall_rating }) => ({ player_name, overall_rating }))(player)));

  function objectToMuiTable(obj) {
    const rows = [];
    for (const [key, value] of Object.entries(obj)) {
      rows.push([key, value]);
    }
    return (
      <Table mx={40} pr={100}>
        <TableBody >
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
                <StyledTableCell >{row[0]}</StyledTableCell>
                <StyledTableCell >{row[1]}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  function objectArrayToMuiTable(arr, homeOrAway) {
    const rows = [];
    arr.map(player => {
      rows.push([player.player_name, player.overall_rating, player.player_api_id]);
    })
    
    return (
      <Table mx={40} pr={100} sx={{ width: 250 }} size='small'>
        <TableHead>
          <TableRow>
              {homeOrAway === 1 ? (<TableCell>Home Player Name</TableCell>) : (<TableCell>Away Player Name</TableCell>)}
              <TableCell>Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
                <StyledTableCell><Link style={{ cursor: 'pointer'}} onClick={() => navigate(`/playerInfo/${row[2]}`)}>{row[0]}</Link></StyledTableCell>
                <StyledTableCell>{row[1]}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
      <Modal open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
          <Box p={3}
            style={{ background: 'white', borderRadius: '10px', border: '2px solid #000', width: 800 }}> 
            <Typography variant="h4" sx={{textAlign: "center"}}>
                Match Information
            </Typography>

            <div className="match-header-vs">
              <div className="wf-title-med">{matchData.home_team_name}</div>
              <div className="match-header-vs-score">
                {(matchData.home_team_goal > matchData.away_team_goal) ? 
                (<span className="match-header-vs-score-winner">{matchData.home_team_goal}</span>) 
                : (<span className="match-header-vs-score-normal">{matchData.home_team_goal}</span>)}
                <span className="match-header-vs-score-normal">:</span>
                {(matchData.away_team_goal > matchData.home_team_goal) ? 
                (<span className="match-header-vs-score-winner">{matchData.away_team_goal}</span>) 
                : (<span className="match-header-vs-score-normal">{matchData.away_team_goal}</span>)}
              </div>
              <div className="wf-title-med">{matchData.away_team_name}</div>
            </div>
            <div className='match-header-vs'> 
              <Grid style={{maxWidth: 300}}>
                {objectArrayToMuiTable(homePlayers, 1)}
              </Grid>
              <Grid style={{maxWidth: 300}}>
                {objectArrayToMuiTable(awayPlayers, 0)}
              </Grid>
            </div>
            <div className="match-detail-date"> {formatDate(matchData.date)} </div>
            <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
              Close
            </Button>
          </Box> 
      </Modal>  
  );
}