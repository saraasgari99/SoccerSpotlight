import { useEffect, useState } from 'react';
import { Grid, TextField, Slider, Button, Container, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function SearchTeamsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const navigate = useNavigate();

  //const [albums, setAlbums] = useState([]);
  const [searchTeamName, setSearchTeamName] = useState('');
  const [playSpeed, setPlaySpeed] = useState([0,100]);
  const [defencePressure, setDefencePressure] = useState([0,100]);
  const [defenceAggression, setDefenceAggression] = useState([0,100]);
  const [defenceWidth, setDefenceWidth] = useState([0,100]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_teams`)
      .then(res => res.json())
      .then(resJson => {
        const teamsWithId = resJson.map((team) => ({ id: team.team_long_name, ...team }));
        setData(teamsWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_teams?search_team_name=${searchTeamName}` +
      `&min_play_speed=${playSpeed[0]}&max_play_speed=${playSpeed[1]}` +
      `&min_defence_pressure=${defencePressure[0]}&max_defence_pressure=${defencePressure[1]}` +
      `&min_defence_aggression=${defenceAggression[0]}&max_defence_aggression=${defenceAggression[1]}` +
      `&min_defence_width=${defenceWidth[0]}&max_defence_width=${defenceWidth[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const teamsWithId = Array.isArray(resJson) ? resJson.map((team) => ({ id: team.team_long_name, ...team })) : [];
        setData(teamsWithId);
      });
  }

  const columns = [
    { field: 'team_long_name', headerName: 'Team Name', width: 300, renderCell: (params) => (
      <Link onClick={() => {
            const team_id = params.row.team_id;
            navigate(`/teamInfo/${team_id}`);
          }}>
        {params.value}
     </Link>
    ) },
    { field: 'team_short_name', headerName: 'Team Name Abbreviation', width: 200 },
    { field: 'min_play_date', headerName: 'Earliest Play Date', width: 200 },
    { field: 'max_play_date', headerName: 'Latest Play Date', width: 200 },
    { field: 'buildUpPlaySpeed', headerName: 'Play Speed' },
    { field: 'buildUpPlaySpeedClass', headerName: 'Play Speed Class', width: 150 },
    { field: 'defencePressure', headerName: 'Defensive Pressure', width: 150 },
    { field: 'defencePressureClass', headerName: 'Defensive Pressure Class', width: 200 },
    { field: 'defenceAggression', headerName: 'Defensive Aggression', width: 170 },
    { field: 'defenceAggressionClass', headerName: 'Defensive Aggression Class', width: 220 },
    { field: 'defenceTeamWidth', headerName: 'Defensive Team Width', width: 200 },
    { field: 'defenceTeamWidthClass', headerName: 'Defensive Team Width Class', width: 250 }
  ]

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // TODO (TASK 22): replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // TODO (TASK 22): then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <Container>
      <h2>Search Teams</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Team Name' value={searchTeamName} onChange={(e) => setSearchTeamName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}><p> </p></Grid>
        <Grid item xs={4}>
          <p>Play Speed</p>
          <Slider
            value={playSpeed}
            min={20}
            max={80}
            step={1}
            onChange={(e, newValue) => setPlaySpeed(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{(value)}</div>}
            style={{color: '#52af77',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none',
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&:before': {
                display: 'none',
              },
            },
            '& .MuiSlider-valueLabel': {
              lineHeight: 1.2,
              fontSize: 12,
              background: 'unset',
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#52af77',
              transformOrigin: 'bottom left',
              transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
              '&:before': { display: 'none' },
              '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
              },
              '& > *': {
                transform: 'rotate(45deg)',
              },
            }}}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Defensive Pressure</p>
          <Slider
            value={defencePressure}
            min={23}
            max={72}
            step={1}
            onChange={(e, newValue) => setDefencePressure(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{(value)}</div>}
            style={{color: '#52af77',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none',
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&:before': {
                display: 'none',
              },
            },
            '& .MuiSlider-valueLabel': {
              lineHeight: 1.2,
              fontSize: 12,
              background: 'unset',
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#52af77',
              transformOrigin: 'bottom left',
              transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
              '&:before': { display: 'none' },
              '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
              },
              '& > *': {
                transform: 'rotate(45deg)',
              },
            }}}
          />
        </Grid>
        <Grid item xs={4}><p> </p></Grid>
        <Grid item xs={4}>
          <p>Defensive Aggression</p>
          <Slider
            value={defenceAggression}
            min={24}
            max={72}
            step={1}
            onChange={(e, newValue) => setDefenceAggression(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{(value)}</div>}
            style={{color: '#52af77',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none',
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&:before': {
                display: 'none',
              },
            },
            '& .MuiSlider-valueLabel': {
              lineHeight: 1.2,
              fontSize: 12,
              background: 'unset',
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#52af77',
              transformOrigin: 'bottom left',
              transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
              '&:before': { display: 'none' },
              '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
              },
              '& > *': {
                transform: 'rotate(45deg)',
              },
            }}}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Defensive Team Width</p>
          <Slider
            value={defenceWidth}
            min={29}
            max={73}
            step={1}
            onChange={(e, newValue) => setDefenceWidth(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{(value)}</div>}
            style={{color: '#52af77',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none',
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&:before': {
                display: 'none',
              },
            },
            '& .MuiSlider-valueLabel': {
              lineHeight: 1.2,
              fontSize: 12,
              background: 'unset',
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#52af77',
              transformOrigin: 'bottom left',
              transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
              '&:before': { display: 'none' },
              '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
              },
              '& > *': {
                transform: 'rotate(45deg)',
              },
            }}}
          />
        </Grid>
      </Grid>
      <Button onClick={() => search() } variant="contained" style={{ left: '50%', transform: 'translateX(-50%)', backgroundColor: "#96e0c2" }}>
        Search
      </Button>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}