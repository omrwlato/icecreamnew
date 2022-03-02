import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from '@material-ui/core';
import styled from 'styled-components';

import ListItemLink from '../ListItemLink';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';
import icecreamLogo from '../../assets/img/NEWCREAM.png';
const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: 'var(--white)',
    'background-color': 'transparent!important',
    'backdrop-filter': 'blur(8px)',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '0 10px',
    marginBottom: '3rem',
    position: 'sticky',

  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toolbarTitle: {
    fontFamily: '"Gilroy"',
    fontSize: '30px',
  },
  link: {
    textTransform: 'uppercase',
    color: 'var(--white)',
    fontSize: '16px',
    margin: theme.spacing(1, 2),
    textDecoration: 'none',
    '&:hover': {
      color: '#571EB1',
    },
  },
  brandLink: {
    display: 'flex',
    textDecoration: 'none',
    color: 'var(--white)',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Grid item xs={4} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <img alt="icecream.finance" src={icecreamLogo} width="20%" />
              </Grid>
              <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
                <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: '0px', fontSize: '1rem', flexGrow: 1 }}>
                  <Link color="color" to="/" className={classes.link}>
                    Home
                  </Link>
                  <Link color="textPrimary" to="/farms" className={classes.link}>
                    Farm
                  </Link>
                  <Link color="textPrimary" to="/boardroom" className={classes.link}>
                    Boardroom
                  </Link>
                  {/*               <Link color="textPrimary" to="/bonds" className={classes.link}>
                Bonds
              </Link> */}
                  {/* <Link color="textPrimary" to="/rebates" className={classes.link}>
                DAO
              </Link> */}
                  {/* <Link color="textPrimary" to="/treasury" className={classes.link}>
                Treasury
              </Link>
              <a href="/" target="_blank" className={classes.link}>
                Vaults
              </a> */}
                  {/* <Link color="textPrimary" to="/sbs" className={classes.link}>
                SBS
              </Link>
              <Link color="textPrimary" to="/liquidity" className={classes.link}>
                Liquidity
              </Link>
              <Link color="textPrimary" to="/regulations" className={classes.link}>
                Regulations
              </Link> */}
                  <a href="https://yieldwolf.finance/avalanche/icecreamfinance" target="_blank" className={classes.link}>
                    Vaults
                  </a>
                  {/*               <a href="" target="_blank" className={classes.link}>
                Social Club
              </a>
              <a href="https://icecreamfinancial.gitbook.io/sundae-finance/" target="_blank" className={classes.link}>
                Docs
              </a>
              <a href="https://icecreamfinance.app" target="_blank" className={classes.link}>
                IceCream
              </a> */}
                </Box>
              </Grid>
              <Grid item xs={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AccountButton text="Connect" />
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              IceCream Finance
            </Typography>
            <AccountButton text="Connect" />
            <Drawer
              className={classes.drawer}
              onEscapeKeyDown={handleDrawerClose}
              onBackdropClick={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Farm" to="/farms" />
                <ListItemLink primary="Boardroom" to="/boardroom" />
                {/*                 <ListItemLink primary="Bonds" to="/bonds" />
                <ListItemLink primary="Dao" to="/rebates" /> */}
                <ListItem button component="a" href="https://yieldwolf.finance/avalanche/icecreamfinance">
                  <ListItemText disableTypography style={{ color: '#FFFFFF' }}>
                    Vaults
                  </ListItemText>
                </ListItem>
                {/*                 <ListItem button component="a" href="">
                  <ListItemText disableTypography style={{ color: '#FFFFFF' }}>
                    Social Club
                  </ListItemText>
                </ListItem> */}
                <ListItem button component="a" href="">
                  <ListItemText disableTypography style={{ color: '#FFFFFF' }}>
                    Documents
                  </ListItemText>
                </ListItem>
                {/*                 <ListItem button component="a" href="https://icecreamfinance.app">
                  <ListItemText disableTypography style={{ color: '#FFFFFF' }}>
                    IceCream
                  </ListItemText>
                </ListItem> */}
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar >
  );
};

export default Nav;
