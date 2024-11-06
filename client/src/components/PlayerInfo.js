import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Grid, Link, Modal } from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Timeplot from '../components/Timeplot';



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


export default function PlayerInfo() {
    const [playerData, setPlayerData] = useState({});
    const [playerTeams, setPlayerTeams] = useState("");
    const { player_id } = useParams();
    const player = player_id ? player_id : 2768;
    
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/get_player/${player}`)
          .then(res => res.json())
          .then(matchJsonArray => {
            console.log("matchJsonArray", matchJsonArray);
            if (matchJsonArray.length > 0) {
                setPlayerData(matchJsonArray[0]);
            }
          });

          fetch(`http://${config.server_host}:${config.server_port}/get_players_teams/${player}`)
          .then(res => res.json())
          .then(matchJsonArray => {
            console.log("playerTeamsJSONArray", matchJsonArray);
            let teamData = " ";
            for (let i = 0; i < matchJsonArray.length; i++) {
                teamData += (matchJsonArray[i].team_name + ", ")
            }
            setPlayerTeams(teamData);
          });

      }, []);

      function objectToMuiTable(obj) {
        const rows = [];
        for (const [key, value] of Object.entries(obj)) {
          rows.push([key, value]);
        }
      
        rows.push(["Teams Played On", playerTeams])
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

    return (
        <Box>
          <div style={{justifyContent: 'center'}}>
            <Typography variant="h2" sx={{textAlign: "center"}}>
              Player Information
            </Typography>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
              <Timeplot player_api_id={player_id} />
            </div>
          </div>
            
            <Grid mx={40} sx={{paddingTop:5}}> 
                {objectToMuiTable(playerData)}
            </Grid>
        </Box> 
    );
}