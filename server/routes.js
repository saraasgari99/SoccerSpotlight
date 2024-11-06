const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /get_players_teams:player_id
// Returns player-team pairs as strings for every player and the teams they have played on. 
const get_players_teams = async function(req, res) {
  const player_id = req.params.player_id;

  connection.query(`
  SELECT DISTINCT team_name
  FROM (SELECT Player.player_name AS player_name, Team.team_long_name AS team_name
  FROM Player
  JOIN Players_Teams
  ON Player.player_api_id = Players_Teams.person
  JOIN Team
  ON Players_Teams.team = Team.team_api_id
  WHERE Player.player_api_id = ${player_id}
  UNION ALL
  SELECT Player_Games.player_name AS player_name, Team2.name AS team_name
  FROM Player_Games
  JOIN Team2
  ON Player_Games.team_id = Team2.wyId
  WHERE Player_Games.player_id = ${player_id}) temp
  ORDER BY player_name;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 2: GET /get_world_cup_players
// 
const get_world_cup_players = async function(req, res) {
  
  const playerName = req.params.player_name ?? '';
  const minWeight = req.query.min_weight ?? 0; 
  const maxWeight = req.query.max_weight ?? 250;
  const minHeight = req.query.min_height ?? 0;
  const maxHeight = req.query.max_height ?? 250;
  const minRating = req.query.min_rating ?? 0;
  const maxRating = req.query.max_rating ?? 100;
  const preferredFoot = req.query.preferred_foot ?? '';
  const minAgility = req.query.min_agility ?? 0;
  const maxAgility = req.query.max_agility ?? 100;
  const minStamina = req.query.min_stamina ?? 0;
  const maxStamina = req.query.max_stamina ?? 100;
  const minStrength = req.query.min_strength ?? 0;
  const maxStrength = req.query.max_strength ?? 100;

  if (playerName !== '') {

    connection.query(`
    SELECT european_player_attr.player_name AS player_name,
        MAX(european_player_attr.birthday) AS birthday,
        MIN(european_player_attr.date) AS min_play_date,
        MAX(european_player_attr.date) AS max_play_date,
        AVG(european_player_attr.height) AS height,
        AVG(european_player_attr.weight) AS weight,
        AVG(european_player_attr.overall_rating) AS overall_rating,
        MAX(european_player_attr.preferred_foot) AS preferred_foot,
        AVG(european_player_attr.agility) AS agility,
        AVG(european_player_attr.stamina) AS stamina,
        AVG(european_player_attr.strength) AS strength
    FROM (
          SELECT *
          FROM (SELECT player_api_id AS p_id, player_fifa_api_id AS fifa_id, player_name, birthday, height, weight
                FROM Player
            ) pl
          JOIN Player_Attribute
              ON pl.p_id = Player_Attribute.player_api_id
    ) european_player_attr
    JOIN (
      SELECT *
      FROM Player2
      JOIN (
          SELECT player_id, player_name, SUM(minutes_played) AS playtime_games, COUNT(team_id) AS games_played
          FROM Player_Games
          GROUP BY player_id, player_name
      ) game_stats
          ON Player2.name = game_stats.player_name
      JOIN (
          SELECT playerId, SUM(goalScored) AS goals, AVG(playerankScore) avgScore, SUM(minutesPlayed) AS playtime
          FROM Playerank
          GROUP BY playerId
      ) stats
          ON stats.playerId = game_stats.player_id
    ) events_player_attr
    ON european_player_attr.player_name = events_player_attr.name
    WHERE european_player_attr.player_name LIKE '%${playerName}%'
      AND european_player_attr.height >= ${minHeight} AND european_player_attr.height <= ${maxHeight}
      AND european_player_attr.weight >= ${minWeight} AND european_player_attr.weight <= ${maxWeight}
      AND european_player_attr.overall_rating >= ${minRating} AND european_player_attr.overall_rating <= ${maxRating}
      AND european_player_attr.agility >= ${minAgility} AND european_player_attr.agility <= ${maxAgility}
      AND european_player_attr.stamina >= ${minStamina} AND european_player_attr.stamina <= ${maxStamina}
      AND european_player_attr.strength >= ${minStrength} AND european_player_attr.strength <= ${maxStrength}
    GROUP BY european_player_attr.player_name
    ORDER BY european_player_attr.player_name;

    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  } else {

    connection.query(`
    SELECT european_player_attr.player_name AS player_name,
        MAX(european_player_attr.birthday) AS birthday,
        MIN(european_player_attr.date) AS min_play_date,
        MAX(european_player_attr.date) AS max_play_date,
        AVG(european_player_attr.height) AS height,
        AVG(european_player_attr.weight) AS weight,
        AVG(european_player_attr.overall_rating) AS overall_rating,
        MAX(european_player_attr.preferred_foot) AS preferred_foot,
        AVG(european_player_attr.agility) AS agility,
        AVG(european_player_attr.stamina) AS stamina,
        AVG(european_player_attr.strength) AS strength
    FROM (
          SELECT *
          FROM (SELECT player_api_id AS p_id, player_fifa_api_id AS fifa_id, player_name, birthday, height, weight
                FROM Player
            ) pl
          JOIN Player_Attribute
              ON pl.p_id = Player_Attribute.player_api_id
    ) european_player_attr
    JOIN (
      SELECT *
      FROM Player2
      JOIN (
          SELECT player_id, player_name, SUM(minutes_played) AS playtime_games, COUNT(team_id) AS games_played
          FROM Player_Games
          GROUP BY player_id, player_name
      ) game_stats
          ON Player2.name = game_stats.player_name
      JOIN (
          SELECT playerId, SUM(goalScored) AS goals, AVG(playerankScore) avgScore, SUM(minutesPlayed) AS playtime
          FROM Playerank
          GROUP BY playerId
      ) stats
          ON stats.playerId = game_stats.player_id
    ) events_player_attr
    ON european_player_attr.player_name = events_player_attr.name
    WHERE european_player_attr.height >= ${minHeight} AND european_player_attr.height <= ${maxHeight}
      AND european_player_attr.weight >= ${minWeight} AND european_player_attr.weight <= ${maxWeight}
      AND european_player_attr.overall_rating >= ${minRating} AND european_player_attr.overall_rating <= ${maxRating}
      AND european_player_attr.agility >= ${minAgility} AND european_player_attr.agility <= ${maxAgility}
      AND european_player_attr.stamina >= ${minStamina} AND european_player_attr.stamina <= ${maxStamina}
      AND european_player_attr.strength >= ${minStrength} AND european_player_attr.strength <= ${maxStrength}
    GROUP BY european_player_attr.player_name
    ORDER BY european_player_attr.player_name;

    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  }


}


// Route 3: GET /get_player_match_stats
/*
Given two teams and a player, returns the count of successful and 
failed actions taken by the player for each action type in all games 
between the two specified teams along with game dates
*/
const get_player_match_stats = async function(req, res) {
  // const 
  connection.query(`
  WITH Game_ids AS (
    (SELECT game_id, game_date
    FROM Teams T
    JOIN
        (SELECT game_id, game_date
          FROM Games G
          JOIN Teams T on T.wyId = G.home_team_id
          WHERE T.name = ${team_name_1}) home_games
    on T.wyId = home_games.game_id
    WHERE T.name = ${team_name_2}
    )
    UNION
    (SELECT game_id, game_date
    FROM Teams T
    JOIN
        (SELECT game_id, game_date
          FROM Games G
          JOIN Teams T on T.wyId = G.home_team_id
          WHERE T.name = ${team_name_2}) home_games
    on T.wyId = home_games.game_id
    WHERE T.name = ${team_name_1})
    ),
  Players_game_actions AS
    (SELECT game_date,
            type_name AS action_type,
            result_name AS action_result
            COUNT(action_id) AS action_count,
            player_id
      FROM Actions A
      JOIN Game_ids G ON A.game_id = G.game_id
      GROUP BY player_id, type_name, result_name, game_date)
  SELECT game_date, action_type, action_result, action_count
  FROM Players_game_actions A JOIN Players P
  ON A.player_id = P.wyId
  WHERE P.firstName = first_name AND P.lastName = last_name;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /search_players
const search_players = async function(req, res) {
  
  const searchPlayerName = req.query.search_player_name ?? '';
  const minWeight = req.query.min_weight ?? 0; 
  const maxWeight = req.query.max_weight ?? 250;
  const minHeight = req.query.min_height ?? 0;
  const maxHeight = req.query.max_height ?? 250;
  const minRating = req.query.min_rating ?? 0;
  const maxRating = req.query.max_rating ?? 100;
  const preferredFoot = req.query.preferred_foot ?? '';
  const minAgility = req.query.min_agility ?? 0;
  const maxAgility = req.query.max_agility ?? 100;
  const minStamina = req.query.min_stamina ?? 0;
  const maxStamina = req.query.max_stamina ?? 100;
  const minStrength = req.query.min_strength ?? 0;
  const maxStrength = req.query.max_strength ?? 100;

  if (searchPlayerName !== '' && preferredFoot !== '') {

    connection.query(`
    SELECT * FROM
      (SELECT player_name, height, weight, Player.player_api_id as player_id,
            MIN(Player_Attribute.date) AS min_play_date,
            MAX(Player_Attribute.date) AS max_play_date,
            AVG(Player_Attribute.overall_rating) AS overall_rating,
            MAX(Player_Attribute.preferred_foot) AS preferred_foot,
            AVG(Player_Attribute.agility) AS agility,
            AVG(Player_Attribute.stamina) AS stamina,
            AVG(Player_Attribute.strength) AS strength
      FROM Player
      LEFT JOIN Player_Attribute
      ON Player.player_api_id = Player_Attribute.player_api_id
      GROUP BY Player.player_api_id, Player.height, Player.weight) all_attributes
    WHERE player_name LIKE '%${searchPlayerName}%'
      AND weight >= ${minWeight} AND weight <= ${maxWeight}
      AND height >= ${minHeight} AND height <= ${maxHeight}
      AND overall_rating >= ${minRating} AND overall_rating <= ${maxRating}
      AND preferred_foot LIKE '%${preferredFoot}%'
      AND agility >= ${minAgility} AND agility <= ${maxAgility}
      AND stamina >= ${minStamina} AND stamina <= ${maxStamina}
      AND strength >= ${minStrength} AND strength <= ${maxStrength}
    ORDER BY player_name;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  } else if (searchPlayerName === '' && preferredFoot !== '') {

    connection.query(`
    SELECT * FROM
      (SELECT player_name, height, weight, Player.player_api_id as player_id,
            MIN(Player_Attribute.date) AS min_play_date,
            MAX(Player_Attribute.date) AS max_play_date,
            AVG(Player_Attribute.overall_rating) AS overall_rating,
            MAX(Player_Attribute.preferred_foot) AS preferred_foot,
            AVG(Player_Attribute.agility) AS agility,
            AVG(Player_Attribute.stamina) AS stamina,
            AVG(Player_Attribute.strength) AS strength
      FROM Player
      LEFT JOIN Player_Attribute
      ON Player.player_api_id = Player_Attribute.player_api_id
      GROUP BY Player.player_api_id, Player.height, Player.weight) all_attributes
    WHERE weight >= ${minWeight} AND weight <= ${maxWeight}
      AND height >= ${minHeight} AND height <= ${maxHeight}
      AND overall_rating >= ${minRating} AND overall_rating <= ${maxRating}
      AND preferred_foot LIKE '%${preferredFoot}%'
      AND agility >= ${minAgility} AND agility <= ${maxAgility}
      AND stamina >= ${minStamina} AND stamina <= ${maxStamina}
      AND strength >= ${minStrength} AND strength <= ${maxStrength}
    ORDER BY player_name;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  } else if (searchPlayerName !== '' && preferredFoot === '') {

    connection.query(`
    SELECT * FROM
      (SELECT player_name, height, weight, Player.player_api_id as player_id,
            MIN(Player_Attribute.date) AS min_play_date,
            MAX(Player_Attribute.date) AS max_play_date,
            AVG(Player_Attribute.overall_rating) AS overall_rating,
            MAX(Player_Attribute.preferred_foot) AS preferred_foot,
            AVG(Player_Attribute.agility) AS agility,
            AVG(Player_Attribute.stamina) AS stamina,
            AVG(Player_Attribute.strength) AS strength
      FROM Player
      LEFT JOIN Player_Attribute
      ON Player.player_api_id = Player_Attribute.player_api_id
      GROUP BY Player.player_api_id, Player.height, Player.weight) all_attributes
    WHERE player_name LIKE '%${searchPlayerName}%'
      AND weight >= ${minWeight} AND weight <= ${maxWeight}
      AND height >= ${minHeight} AND height <= ${maxHeight}
      AND overall_rating >= ${minRating} AND overall_rating <= ${maxRating}
      AND agility >= ${minAgility} AND agility <= ${maxAgility}
      AND stamina >= ${minStamina} AND stamina <= ${maxStamina}
      AND strength >= ${minStrength} AND strength <= ${maxStrength}
    ORDER BY player_name;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  } else {

    connection.query(`
    SELECT * FROM
      (SELECT player_name, height, weight, Player.player_api_id as player_id,
            MIN(Player_Attribute.date) AS min_play_date,
            MAX(Player_Attribute.date) AS max_play_date,
            AVG(Player_Attribute.overall_rating) AS overall_rating,
            MAX(Player_Attribute.preferred_foot) AS preferred_foot,
            AVG(Player_Attribute.agility) AS agility,
            AVG(Player_Attribute.stamina) AS stamina,
            AVG(Player_Attribute.strength) AS strength
      FROM Player
      LEFT JOIN Player_Attribute
      ON Player.player_api_id = Player_Attribute.player_api_id
      GROUP BY Player.player_api_id, Player.height, Player.weight) all_attributes
    WHERE weight >= ${minWeight} AND weight <= ${maxWeight}
      AND height >= ${minHeight} AND height <= ${maxHeight}
      AND overall_rating >= ${minRating} AND overall_rating <= ${maxRating}
      AND agility >= ${minAgility} AND agility <= ${maxAgility}
      AND stamina >= ${minStamina} AND stamina <= ${maxStamina}
      AND strength >= ${minStrength} AND strength <= ${maxStrength}
    ORDER BY player_name;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  }

}

// Route 5: GET /search_teams
const search_teams = async function(req, res) {
  
  const searchTeamName = req.query.search_team_name ?? '';
  const minPlaySpeed = req.query.min_play_speed ?? 0; 
  const maxPlaySpeed = req.query.max_play_speed ?? 80;
  const minDefencePressure = req.query.min_defence_pressure ?? 0;
  const maxDefencePressure = req.query.max_defence_pressure ?? 80;
  const minDefenceAggression = req.query.min_defence_aggression ?? 0;
  const maxDefenceAggression = req.query.max_defence_aggression ?? 80;
  const minDefenceWidth = req.query.min_defence_width ?? 0;
  const maxDefenceWidth = req.query.max_defence_width ?? 80;

  if (searchTeamName !== '') {

    connection.query(`
    SELECT * FROM (SELECT team_long_name, team_short_name, Team.team_api_id as team_id,
        LEFT(MIN(date), 10) AS min_play_date,
        LEFT(MAX(date), 10) AS max_play_date,
        AVG(Team_Attribute.buildUpPlaySpeed) AS buildUpPlaySpeed,
        MAX(Team_Attribute.buildUpPlaySpeedClass) AS buildUpPlaySpeedClass,
        AVG(Team_Attribute.defencePressure) AS defencePressure,
        MAX(Team_Attribute.defencePressureClass) AS defencePressureClass,
        AVG(Team_Attribute.defenceAggression) AS defenceAggression,
        MAX(Team_Attribute.defenceAggressionClass) AS defenceAggressionClass,
        AVG(Team_Attribute.defenceTeamWidth) AS defenceTeamWidth,
        MAX(Team_Attribute.defenceTeamWidthClass) AS defenceTeamWidthClass
      FROM Team
      LEFT JOIN Team_Attribute
      ON Team.team_api_id = Team_Attribute.team_api_id
      GROUP BY Team.team_api_id, team_long_name, team_short_name) all_attributes
    WHERE team_long_name LIKE '%${searchTeamName}%'
    AND buildUpPlaySpeed >= ${minPlaySpeed} AND buildUpPlaySpeed <= ${maxPlaySpeed}
    AND defencePressure >= ${minDefencePressure} AND defencePressure <= ${maxDefencePressure}
    AND defenceAggression >= ${minDefenceAggression} AND defenceAggression <= ${maxDefenceAggression}
    AND defenceTeamWidth >= ${minDefenceWidth} AND defenceTeamWidth <= ${maxDefenceWidth}
    ORDER BY team_long_name;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  } else {

    connection.query(`
    SELECT * FROM (SELECT team_long_name, team_short_name, Team.team_api_id as team_id,
        MIN(Team_Attribute.date) AS min_play_date,
        MAX(Team_Attribute.date) AS max_play_date,
        AVG(Team_Attribute.buildUpPlaySpeed) AS buildUpPlaySpeed,
        MAX(Team_Attribute.buildUpPlaySpeedClass) AS buildUpPlaySpeedClass,
        AVG(Team_Attribute.defencePressure) AS defencePressure,
        MAX(Team_Attribute.defencePressureClass) AS defencePressureClass,
        AVG(Team_Attribute.defenceAggression) AS defenceAggression,
        MAX(Team_Attribute.defenceAggressionClass) AS defenceAggressionClass,
        AVG(Team_Attribute.defenceTeamWidth) AS defenceTeamWidth,
        MAX(Team_Attribute.defenceTeamWidthClass) AS defenceTeamWidthClass
      FROM Team
      LEFT JOIN Team_Attribute
      ON Team.team_api_id = Team_Attribute.team_api_id
      GROUP BY Team.team_api_id, team_long_name, team_short_name) all_attributes
    WHERE buildUpPlaySpeed >= ${minPlaySpeed} AND buildUpPlaySpeed <= ${maxPlaySpeed}
    AND defencePressure >= ${minDefencePressure} AND defencePressure <= ${maxDefencePressure}
    AND defenceAggression >= ${minDefenceAggression} AND defenceAggression <= ${maxDefenceAggression}
    AND defenceTeamWidth >= ${minDefenceWidth} AND defenceTeamWidth <= ${maxDefenceWidth}
    ORDER BY team_long_name;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  }

}

/************************
 * GET SINGLE ROW ROUTES *
 ************************/

// Route 6: GET /get_player/:player_id
const get_player = async function(req, res) {
  const player_id = req.params.player_id;

  connection.query(`
  SELECT player_name as Name, Height, Weight, Birthday,
      MIN(date) AS \`First Appearence\`,
      MAX(date) AS \`Last Appearence\`,
      AVG(overall_rating) as \`Overall Rating\`,
      AVG(potential) as Potential,
      MAX(preferred_foot) as \`Preferred Foot\`,
      MAX(attacking_work_rate) as \`Attacking Work Rate\`,
      MAX(defensive_work_rate) as \`Defensive Work Rate\`,
      AVG(crossing) as Crossing,
      AVG(finishing) as Finishing,
      AVG(heading_accuracy) as \`Heading Accuracy\`,
      AVG(short_passing) as \`Short Passing\`,
      AVG(volleys) as Volleys,
      AVG(dribbling) as Dribbling,
      AVG(curve) as Curve,
      AVG(free_kick_accuracy) as \`Free Kick Accuracy\`,
      AVG(long_passing) as \`Long Passing\`,
      AVG(ball_control) as \`Ball Control\`,
      AVG(acceleration) as Acceleration,
      AVG(sprint_speed) as \`Sprint Speed\`,
      AVG(agility) as Agility,
      AVG(reactions) as Reactions,
      AVG(balance) as Balance,
      AVG(shot_power) as \`Shot Power\`,
      AVG(jumping) as Jumping,
      AVG(stamina) as Stamina,
      AVG(strength) as Strength,
      AVG(long_shots) as \`Long Shots\`,
      AVG(aggression) as Aggression,
      AVG(Interceptions) as Interceptions,
      AVG(positioning) as Positioning,
      AVG(vision) as Vision,
      AVG(penalties) as Penalties,
      AVG(marking) as Marking,
      AVG(standing_tackle) as \`Standing Tackle\`,
      AVG(sliding_tackle) as \`Sliding Tackle\`,
      AVG(gk_diving) as \`Goalkeeper Diving\`,
      AVG(gk_handling) as \`Goalkeeper Handling\`,
      AVG(gk_kicking) as \`Goalkeeper Picking\`,
      AVG(gk_positioning) as \`Goalkeeper Positioning\`,
      AVG(gk_reflexes) as \`Goalkeeper Reflexes\`
  FROM Player
  LEFT JOIN Player_Attribute
  ON Player.player_api_id = Player_Attribute.player_api_id
  WHERE Player.player_api_id = ${player_id}
  GROUP BY Player.player_api_id, player_name, height, weight, birthday;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });

}

// Route 7: GET /get_team/:team_id
const get_team = async function(req, res) {

  connection.query(`
  SELECT team_long_name as \`Team Name\`, team_short_name as \`Team Abbreviation\`,
      MIN(date) as \`First Appearence\`,
      MAX(date) as \`Last Appearence\`,
      AVG(buildUpPlaySpeed) as \`Play Speed\`,
      MAX(buildUpPlaySpeedClass) as \`Play Speed Class\`,
      AVG(buildUpPlayDribbling) as \`Play Dribbling\`,
      MAX(buildUpPlayDribblingClass) as \`Dribbling Class\`,
      AVG(buildUpPlayPassing) as \`Play Passing\`,
      MAX(buildUpPlayPassingClass) as \`Play Passing Class\`,
      MAX(buildUpPlayPositioningClass) as \`Positioning Class\`,
      AVG(chanceCreationPassing) as \`Passing\`,
      MAX(chanceCreationPassingClass) as \`Passing Class\`,
      AVG(chanceCreationCrossing) as Crossing,
      MAX(chanceCreationCrossingClass) as \`Crossing Class\`,
      AVG(chanceCreationShooting) as Shooting,
      MAX(chanceCreationShootingClass) as \`Shooting Class\`,
      MAX(chanceCreationPositioningClass) as \`Positioning Class\`,
      AVG(defencePressure) as \`Defence Pressure\`,
      MAX(defencePressureClass) as \`Defence Pressure Class\`,
      AVG(defenceAggression) as Aggression,
      MAX(defenceAggressionClass) as \`Aggression Class\`,
      AVG(defenceTeamWidth) as \`Team Width\`,
      MAX(defenceTeamWidthClass) as \`Team Width Class\`,
      MAX(defenceDefenderLineClass) as \`Defender Line Class\`
  FROM Team
  LEFT JOIN Team_Attribute
  ON Team.team_api_id = Team_Attribute.team_api_id
  WHERE Team.team_api_id = ${req.params.team_id}
  GROUP BY Team.team_api_id, team_long_name, team_short_name;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });

}

// Route 8: GET /get_coach/:coach_id
const get_coach = async function(req, res) {
  const coach_id = req.params.coach_id;
  
  connection.query(`
  SELECT shortName, birthDate, birthArea, passportArea, T.name, officialName AS team_official_name,
  city AS team_city, area AS team_area, type AS team_type
  FROM Coach C
  JOIN Team2 T
  ON T.wyId = C.currentTeamId
  WHERE C.wyId = ${coach_id};
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });

}

// Route 9: GET /search_matchups
// how can we meet the null requirement? 
const search_matchups = async function(req, res) {
  
  const searchHomeTeamName = req.query.search_home_name;
  const searchAwayTeamName = req.query.search_away_name; 

  connection.query(`
    SELECT match_api_id
    FROM MatchTable
    JOIN (SELECT team_long_name AS home_team_name, team_api_id FROM Team) HomeTeam
    ON MatchTable.home_team_api_id = HomeTeam.team_api_id
    JOIN (SELECT team_long_name AS away_team_name, team_api_id FROM Team) AwayTeam
    ON MatchTable.away_team_api_id = AwayTeam.team_api_id
    WHERE home_team_name = '${searchHomeTeamName}' AND 
    away_team_name = '${searchAwayTeamName}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 10: GET /get_match/:match_api_id
// Will retrieve information about a match given the match_api_id
const get_match_by_id = async function(req, res) {
  const match_api_id = req.params.match_api_id;

  connection.query(`
  SELECT Country.name AS country_name,
    League.name AS league_name,
    HomeTeam.team_long_name AS home_team_name,
    AwayTeam.team_long_name AS away_team_name,
    m.date,
    m.season,
    m.home_team_goal,
    m.away_team_goal,
    m.shoton,
    m.shotoff,
    m.foulcommit,
    m.card,
    m.cross,
    m.corner,
    m.possession,
    m.home_player_1,
    m.home_player_2,
    m.home_player_3,
    m.home_player_4,
    m.home_player_5,
    m.home_player_6,
    m.home_player_7,
    m.home_player_8,
    m.home_player_9,
    m.home_player_10,
    m.home_player_11,
    m.away_player_1,
    m.away_player_2,
    m.away_player_3,
    m.away_player_4,
    m.away_player_5,
    m.away_player_6,
    m.away_player_7,
    m.away_player_8,
    m.away_player_9,
    m.away_player_10,
    m.away_player_11,
    m.B365H,
    m.B365D,
    m.B365A
  FROM (SELECT * FROM MatchTable WHERE match_api_id = ${match_api_id}) m
  JOIN Country
  ON m.country_id = Country.id
  JOIN League
  ON m.league_id = League.id
  JOIN (SELECT team_long_name, team_api_id FROM Team) HomeTeam
  ON m.home_team_api_id = HomeTeam.team_api_id
  JOIN (SELECT team_long_name, team_api_id FROM Team) AwayTeam
  ON m.away_team_api_id = AwayTeam.team_api_id;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const get_player_attributes_by_id = async function(req, res) {
  const player_api_id = req.params.player_api_id;
  connection.query(`
  SELECT *
  FROM Player_Attribute
  WHERE player_api_id = ${player_api_id};
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


// Route 12: GET /get_match_players/:match_api_id
// Will retrieve ordered player information about a match given the match_api_id
const get_match_players = async function(req, res) {
  const match_api_id = req.params.match_api_id;
  connection.query(`
    WITH matchup AS (
      SELECT * FROM MatchTable WHERE match_api_id = ${match_api_id}
  ),
  home_players AS
  ((SELECT home_player_1 AS match_player_id, 1 AS number FROM matchup )
    UNION (SELECT home_player_2 AS match_player_id, 2 as number FROM matchup)
    UNION (SELECT home_player_3 AS match_player_id, 3 as number  FROM matchup)
    UNION (SELECT home_player_4 AS match_player_id, 4 as number  FROM matchup)
    UNION (SELECT home_player_5 AS match_player_id, 5 as number FROM matchup)
    UNION (SELECT home_player_6 AS match_player_id, 6 as number FROM matchup)
    UNION (SELECT home_player_7 AS match_player_id, 7 as number FROM matchup)
    UNION (SELECT home_player_8 AS match_player_id, 8 as number  FROM matchup)
    UNION (SELECT home_player_9 AS match_player_id, 9 as number FROM matchup)
    UNION (SELECT home_player_10 AS match_player_id, 10 as number FROM matchup)
    UNION (SELECT home_player_11 AS match_player_id, 11 as number FROM matchup)
  ), away_players AS
  ((SELECT away_player_1 AS match_player_id, 1 AS number FROM matchup )
    UNION (SELECT away_player_2 AS match_player_id, 2 as number FROM matchup)
    UNION (SELECT away_player_3 AS match_player_id, 3 as number  FROM matchup)
    UNION (SELECT away_player_4 AS match_player_id, 4 as number  FROM matchup)
    UNION (SELECT away_player_5 AS match_player_id, 5 as number FROM matchup)
    UNION (SELECT away_player_6 AS match_player_id, 6 as number FROM matchup)
    UNION (SELECT away_player_7 AS match_player_id, 7 as number FROM matchup)
    UNION (SELECT away_player_8 AS match_player_id, 8 as number  FROM matchup)
    UNION (SELECT away_player_9 AS match_player_id, 9 as number FROM matchup)
    UNION (SELECT away_player_10 AS match_player_id, 10 as number FROM matchup)
    UNION (SELECT away_player_11 AS match_player_id, 11 as number FROM matchup)
  ),
  home_ratings AS
  (SELECT match_player_id, number, 'home' as team, Player_Attribute.overall_rating, date FROM
    (SELECT number, home_players.match_player_id, Player_Attribute.overall_rating,
    MIN(ABS(DATEDIFF(Player_Attribute.date, (SELECT date FROM matchup)))) AS min_datediff
    FROM home_players JOIN Player_Attribute ON home_players.match_player_id = Player_Attribute.player_api_id
    GROUP BY home_players.match_player_id) ratings JOIN Player_Attribute
    ON ratings.match_player_id = Player_Attribute.player_api_id
    AND ABS(DATEDIFF(Player_Attribute.date, (SELECT date FROM matchup))) = min_datediff
  ), away_ratings AS
  (SELECT match_player_id, number, 'away' AS team, Player_Attribute.overall_rating, date FROM
    (SELECT number, away_players.match_player_id, Player_Attribute.overall_rating,
    MIN(ABS(DATEDIFF(Player_Attribute.date, (SELECT date FROM matchup)))) AS min_datediff
    FROM away_players JOIN Player_Attribute ON away_players.match_player_id = Player_Attribute.player_api_id
    GROUP BY away_players.match_player_id) ratings JOIN Player_Attribute
    ON ratings.match_player_id = Player_Attribute.player_api_id
    AND ABS(DATEDIFF(Player_Attribute.date, (SELECT date FROM matchup))) = min_datediff
  ) SELECT number, team, player_api_id, player_name, overall_rating, date AS rating_date FROM
  (SELECT * FROM home_ratings UNION ALL (SELECT * FROM away_ratings)) all_ratings
  JOIN Player on Player.player_api_id = all_ratings.match_player_id
  ORDER BY team DESC, number;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 13: GET /get_match_stats
// how can we meet the null requirement? 
const get_match_stats = async function(req, res) {
  
  const searchHomeTeamName = req.query.search_home_name;
  const searchAwayTeamName = req.query.search_away_name; 

  connection.query(`
    WITH goals as (SELECT match_api_id, home_team_goal, away_team_goal
    FROM MatchTable
    JOIN (SELECT team_long_name AS home_team_name, team_api_id FROM Team) HomeTeam
    ON MatchTable.home_team_api_id = HomeTeam.team_api_id
    JOIN (SELECT team_long_name AS away_team_name, team_api_id FROM Team) AwayTeam
    ON MatchTable.away_team_api_id = AwayTeam.team_api_id
    WHERE home_team_name = '${searchAwayTeamName}' AND
    away_team_name = '${searchHomeTeamName}')
    SELECT sum(case when home_team_goal > away_team_goal then 1 else 0 end) AS home_wins,
    sum(case when home_team_goal < away_team_goal then 1 else 0 end) AS away_wins,
    sum(case when home_team_goal = away_team_goal then 1 else 0 end) AS draws,
    sum(case when home_team_goal > away_team_goal then 1 else 0 end) / COUNT(*) AS home_win_percent,
    sum(case when home_team_goal < away_team_goal then 1 else 0 end) / COUNT(*) AS away_win_percent,
    sum(case when home_team_goal = away_team_goal then 1 else 0 end) / COUNT(*) AS draw_percent,
    sum(home_team_goal) AS home_total_goals,
    sum(away_team_goal) AS away_total_goals
    FROM goals;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


const get_league_matches = async function(req, res) {
  const league_id = req.params.league_id;
  connection.query(`
  SELECT * FROM MatchTable
  WHERE league_id = ${league_id}
  ORDER BY date DESC
  LIMIT 50;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  search_players,
  search_teams,
  get_player,
  get_team,
  get_coach,
  get_world_cup_players,
  get_player_match_stats,
  get_players_teams,
  search_matchups,
  get_match_by_id,
  get_league_matches,
  get_player_attributes_by_id,
  get_match_players,
  get_match_stats
}
