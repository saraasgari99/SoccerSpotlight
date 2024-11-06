import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'verdana',
        fontWeight: 700,
        letterSpacing: '.2rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static'>
      <Container maxWidth='xl' style={{backgroundColor: "#009c5d"}}>
        <Toolbar disableGutters>
          <NavText href='/' text='SoccerSpotlight' isMain />
          <NavText href='/search_teams' text='Teams' />
          <NavText href='/search_players' text='Players' />
          <NavText href='/search_matchups' text='Matchups' />
          <NavText href='get_world_cup_players' text='World Cup Players'/>
        </Toolbar>
      </Container>
    </AppBar>
  );
}