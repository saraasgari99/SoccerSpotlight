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


export default function TeamInfo() {
    const [teamData, setTeamData] = useState({});
    const { team_id } = useParams();
    const team = team_id ? team_id : 2182;

    
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/get_team/${team}`)
          .then(res => res.json())
          .then(matchJsonArray => {
            if (matchJsonArray.length > 0) {
                setTeamData(matchJsonArray[0]);
            }
          });

      }, []);

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

    return (
        <Box> 
            <Typography variant="h2" sx={{textAlign: "center"}}>
                Team Information
            </Typography>

            <Grid mx={40} > 
                {objectToMuiTable(teamData)}
            </Grid>
        </Box> 
    );
}