const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/get_players_teams/:player_id', routes.get_players_teams);
app.get('/get_world_cup_players', routes.get_world_cup_players);
app.get('/get_player_match_stats', routes.get_player_match_stats);
//app.get('/get_star_players', routes.get_star_players);
app.get('/search_players', routes.search_players);
app.get('/search_teams', routes.search_teams);
app.get('/get_player/:player_id', routes.get_player);
app.get('/get_team/:team_id', routes.get_team);
app.get('/get_coach/:coach_id', routes.get_coach);
app.get('/search_matchups', routes.search_matchups);
app.get('/get_match_players/:match_api_id', routes.get_match_players);
app.get('/get_match_stats', routes.get_match_stats);
app.get('/get_match/:match_api_id', routes.get_match_by_id);
app.get('/get_league_matches/:league_id', routes.get_league_matches);
app.get('/get_player_attributes_by_id/:player_api_id', routes.get_player_attributes_by_id);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
