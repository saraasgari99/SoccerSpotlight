import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal, Container } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDate } from '../helpers/formatter';
import '../assets/matchcard.css';
import MatchDetail from '../components/MatchDetail';
const config = require('../config.json');

export default function MatchCard({ match_api_id }) {
  const [matchData, setMatchData] = useState({});
  const [cardSelected, setCardSelected] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_match/${match_api_id}`)
      .then(res => res.json())
      .then(matchJsonArray => {
        if (matchJsonArray.length > 0) {
          setMatchData(matchJsonArray[0]);
        }
      });
  }, []);

  return (
    <Container>
      {cardSelected && <MatchDetail match_api_id={match_api_id} handleClose={() => setCardSelected(false)}/>}
      <div style={{paddingTop: '5px'}} onClick={() => setCardSelected(true)}>
        <Box
          p={1}
          style={{ background: 'silver', borderRadius: '8px', border: '2px solid #000', width: 800 }}
        >
          {Object.keys(matchData).length > 0 ? (
            <div className="match-header-vs">
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
              <div className="match-header-vs-note"> {formatDate(matchData.date)} </div>
            </div>
          ): (
            <div>Invalid match_api_id: {match_api_id}</div>
          )}
        </Box>
      </div>  
    </Container>
  );
}