import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Menu, Popover, MenuItem, AppBar, Button, Typography, IconButton, useMediaQuery } from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'

import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks'

const useStyles = makeStyles(theme => ({
    appBarVariant1: {
        paddingLeft: theme.gutter,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        position: 'absolute',
        top: 0,
        transition: 'all 0.5s ease',
    },
    appBarVariant2: {
        paddingLeft: theme.gutter,
        backgroundColor: 'black',
        position: 'sticky',
        transition: 'all 1s ease',
        top: 0,
    },
    buttonsContainer: {
        marginRight: theme.gutter,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        margin: '10px 0 10px 20px',
        color: '#EEEEEE',
        borderColor: '#EEEEEE',
        '&:hover': {
            backgroundColor: props => `rgba(255, 255, 255, ${props.headerVariant === 1 ? 0.15 : 0.3})`,
        },
    },
    contentContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#aeea00',
        display: 'flex',
        cursor: 'pointer',
    },
}))

export default function Header() {

  const isMobileHeader = useMediaQuery('(max-width: 790px)')

  const [headerVariant, setHeaderVariant] = React.useState(1)

  const popupState = usePopupState({ variant: 'popover', popupId: 'menu' })

  const classes= useStyles({headerVariant})

  const listenScrollEvent = () => {
    window.scrollY < 1
      ? setHeaderVariant(1)
      : setHeaderVariant(2)
  }
  
  React.useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent)
  })

  const handleNavigation = id => event => {

    if (id === 'home') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })

        return
    }

    const element = document.getElementById(id)
    const top = element.getBoundingClientRect().top + window.pageYOffset - window.innerHeight * 0.3

    window.scrollTo({
        top,
        behavior: 'smooth'
    })
  }

  return (
    <AppBar classes={{root: classes[`appBarVariant${headerVariant}`]}} position="static">
        <div className={classes.contentContainer}>
            <Typography onClick={handleNavigation('home')} classes={{root: classes.title}}>{headerVariant === 2 ? 'Andy Seymour' : ' '}</Typography>
            {isMobileHeader && (
                <React.Fragment>
                    <IconButton className={classes.mobileMenuButton} color="inherit" aria-label="menu" {...bindTrigger(popupState)} >
                        <MenuIcon />
                    </IconButton>
                    <Popover {...bindMenu(popupState)}  
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}>
                        <MenuItem onClick={handleNavigation('aboutme')}>About me</MenuItem>
                        <MenuItem onClick={handleNavigation('skills')}>Skills</MenuItem>
                        <MenuItem onClick={handleNavigation('experience')}>Experience</MenuItem>
                        <MenuItem onClick={handleNavigation('contact')}>Contact</MenuItem>
                    </Popover>
                </React.Fragment>
            )}
            {!isMobileHeader && (
                <div className={classes.buttonsContainer}>
                    <Button onClick={handleNavigation('aboutme')} classes={{root: classes.button}} variant="outlined">About me</Button>
                    <Button onClick={handleNavigation('skills')} classes={{root: classes.button}} variant="outlined">Skills</Button>
                    <Button onClick={handleNavigation('experience')} classes={{root: classes.button}} variant="outlined">Experience</Button>
                    <Button onClick={handleNavigation('contact')} classes={{root: classes.button}} variant="outlined">Contact</Button>
                </div>
            )}
        </div>
    </AppBar>
  )
}

