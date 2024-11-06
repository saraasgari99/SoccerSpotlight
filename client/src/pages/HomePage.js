// import { useEffect, useState } from 'react';
// import { Container, Divider, Link } from '@mui/material';
// import { NavLink } from 'react-router-dom';

import MatchCard from '../components/MatchCard';
import Timeplot from '../components/Timeplot';
import '../assets/homepage.css';
import { useNavigate } from "react-router-dom";
import MatchDetail from '../components/MatchDetail';
const config = require('../config.json');

export default function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="background">
      <div className="league-text" onClick={() => navigate('league/1')}>Belgium Jupiler League</div>
      <span className="league-text" onClick={() => navigate('league/1729')}>England Premier League</span>
      <span className="league-text" onClick={() => navigate('league/4769')}>France Ligue 1</span>
      <span className="league-text" onClick={() => navigate('league/7809')}>Germany 1. Bundesliga</span>
      <span className="league-text" onClick={() => navigate('league/10257')}>Italy Serie A</span>
      <span className="league-text" onClick={() => navigate('league/13274')}>Netherlands Eredivisie</span>
      <span className="league-text" onClick={() => navigate('league/15722')}>Poland Ekstraklasa</span>
      <span className="league-text" onClick={() => navigate('league/17642')}>Portugal Liga ZON Sagres</span>
      <span className="league-text" onClick={() => navigate('league/19694')}>Scotland Premier League</span>
      <span className="league-text" onClick={() => navigate('league/21518')}>Spain LIGA BBVA</span>
      <span className="league-text" onClick={() => navigate('league/24558')}>Switzerland Super League</span>
      {/* <MatchDetail player_id={2857} /> */}
    </div>
  );
};