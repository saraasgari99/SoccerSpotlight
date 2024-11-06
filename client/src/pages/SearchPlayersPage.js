import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function SearchPlayersPage() {
  console.log()
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [player_id, setPlayerId] = useState(0);
  const navigate = useNavigate();

  const [searchPlayerName, setSearchPlayerName] = useState('');
  const [weight, setWeight] = useState([0,300]);
  const [height, setHeight] = useState([0,300]);
  const [rating, setRating] = useState([0,100]);
  const [preferredFoot, setPreferredFoot] = useState([]);
  const [agility, setAgility] = useState([0,100]);
  const [stamina, setStamina] = useState([0,100]);
  const [strength, setStrength] = useState([0,100]);
  const [right, setRight] = useState(false);
  const [left, setLeft] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_players`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((player) => ({ id: player.player_name, ...player }));
        setData(playersWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_players?search_player_name=${searchPlayerName}` +
      `&min_weight=${weight[0]}&max_weight=${weight[1]}` +
      `&min_height=${height[0]}&max_height=${height[1]}` +
      `&min_rating=${rating[0]}&max_rating=${rating[1]}` +
      `&preferred_foot=${preferredFoot}` +
      `&min_agility=${agility[0]}&max_agility=${agility[1]}` +
      `&min_strength=${strength[0]}&max_strength=${strength[1]}` +
      `&min_stamina=${stamina[0]}&max_stamina=${stamina[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const playersWithId = Array.isArray(resJson) ? resJson.map((player) => ({ id: player.player_name, ... player})) : [];
        setData(playersWithId);
        console.log("data", playersWithId[0]);
        
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)

  // { field: 'player_name', headerName: "Player Name", width: 200,renderCell: (params) => (
  //   <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
  // ) },
  //{ field: 'player_name', headerName: "Player Name", width: 200 },
  const columns = [
    { field: 'player_name', headerName: "Player Name", width: 200,renderCell: (params) => (
        <Link onClick={() => {
              const pid = params.row.player_id;
              setPlayerId(params.row.player_id);
              navigate(`/playerInfo/${pid}`);
            }}>
          {params.value}
       </Link>
    ) },
    { field: 'height', headerName: 'Height' },
    { field: 'weight', headerName: 'Weight' },
    { field: 'min_play_date', headerName: 'Earliest Play Date', width: 200 },
    { field: 'max_play_date', headerName: 'Latest Play Date', width: 200 },
    { field: 'overall_rating', headerName: 'Rating' },
    { field: 'preferred_foot', headerName: 'Preferred Foot', width: 150 },
    { field: 'agility', headerName: 'Agility' },
    { field: 'stamina', headerName: 'Stamina' },
    { field: 'strength', headerName: 'Strength' }
  ]

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.

  
  return (
    <Container>
      <h2>Search Players</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Player Name' value={searchPlayerName} onChange={(e) => setSearchPlayerName(e.target.value)} 
            style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}><p> </p></Grid>
        <Grid item xs={4}>
          <p>Height</p>
          <Slider
            value={height}
            min={157}
            max={209}
            step={1}
            onChange={(e, newValue) => setHeight(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
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
          <p>Weight</p>
          <Slider
            value={weight}
            min={117}
            max={243}
            step={1}
            onChange={(e, newValue) => setWeight(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
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
          <p>Rating</p>
          <Slider
            value={rating}
            min={33}
            max={94}
            step={1}
            onChange={(e, newValue) => setRating(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
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
          <p>Agility</p>
          <Slider
            value={agility}
            min={11}
            max={96}
            step={1}
            onChange={(e, newValue) => setAgility(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
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
          <p>Stamina</p>
          <Slider
            value={stamina}
            min={10}
            max={96}
            step={1}
            onChange={(e, newValue) => setStamina(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
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
          <p>Strength</p>
          <Slider
            value={strength}
            min={10}
            max={96}
            step={1}
            onChange={(e, newValue) => setStrength(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
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
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
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