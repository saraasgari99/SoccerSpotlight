import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Link, Stack, Table, TableBody, TableCell, TablePagination, TableContainer, TableHead, TableRow } from '@mui/material';

import MatchCard from '../components/MatchCard';
import '../assets/homepage.css';
const config = require('../config.json');

export default function LeagueMatches() {
  const { league_id } = useParams();
  const [pageSize, setPageSize] = useState(10);
  const [matches, setMatches] = useState([]);
  const [page, setPage] = useState(1);
  const [matchCards, setMatchCards] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_league_matches/${league_id}`)
      .then(res => res.json())
      .then(resJson => {
        setMatches(resJson);
        const temp = resJson.map(match => {
            return <td><MatchCard match_api_id={match.match_api_id} /> </td>
        })
        setMatchCards(temp);
      });
  }, []);

  const handleChangePage = (e, newPage) => {
    // Can always go to previous page (TablePagination prevents negative pages)
    // but only fetch next page if we haven't reached the end (currently have full page of data)
    if (newPage < page || matches.length === pageSize) {
      // Note that we set newPage + 1 since we store as 1 indexed but the default pagination gives newPage as 0 indexed
      setPage(newPage + 1);
    }
  }

  const handleChangePageSize = (e) => {
    // when handling events such as changing a selection box or typing into a text box,
    // the handler is called with parameter e (the event) and the value is e.target.value
    const newPageSize = e.target.value;

    // TODO (TASK 18): set pageSize state variable and reset the current page to 1
    setPageSize(newPageSize);
    setPage(1);
  }

  return (
    <Container style={{paddingTop: '15px'}}>
      <TableContainer>
        <Table>
          <TableHead className="league-title">
              <TableRow >
                  Matches Played
              </TableRow>
          </TableHead>
          <TableBody>
              {matches.map(match =>
                <TableRow key={match.match_api_id}>
                  <MatchCard match_api_id={match.match_api_id}/>
                </TableRow>
              )}
          </TableBody>
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={-1}
            rowsPerPage={pageSize}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangePageSize}
          /> */}
        </Table>
      </TableContainer>
    </Container>
  );
}