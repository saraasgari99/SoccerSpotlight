# CIS4500SoccerDatabase
## Running
This app runs using node js and react. To run this, open two terminals (one cd into the client folder, the other cd into the server folder). Do 'npm install' on both
terminals, and then do 'npm start'.

## SearchPlayersPage.js
This page allows the user to input a range of several metrics, like height, stamina, and agility. In the backend, the page queries the database to return all players who fit the metrics.

## SearchTeamsPage.js
This page allows the user to input a range of several metrics, like defensive pressure and aggression. In the backend, the page queries the database to return all teams who fit the metrics.

## WorldCupPlayers.js
This page is similar to SearchPlayersPage.js in that a user inputs metrics to search for specific players. It uses the same metrics as SearchPlayersPage.js, except it only looks at players that were in the World Cup 2018. It also combines information from both datasets, while SearchPlayersPage.js only uses information from the first dataset.

## SearchMatchupPage.js
This page allows the user to input the name of two teams. The page returns any matches that were played between these two teams, as well as the final score of the match. It queries the ‘Matches’ table based on the team names.

## PlayerInfo.js
This page displays unique information about a given player. It combines information from the two datasets. It displays many more metrics than SearchPlayersPage.js, including all the teams a player has played on.

## TeamInfo.js
This page displays unique information about a given team. It has certain metrics about a team, averaged across all players on that team. It also has the class of that metric (high, medium, or low), compared to all other teams. It displays more information than SearchTeamsPage.js.
