import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Button } from '@material-ui/core/'

const useStyles = makeStyles({
    appBar: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        position: 'absolute',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '30px',
    },
    button: {
        margin: '10px',
        color: 'white',
        borderColor: 'white',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
    },
})

export default function App() {

  const classes= useStyles()

  return (
    <AppBar classes={{root: classes.appBar}} position="static">
        <div className={classes.buttonsContainer}>
            <Button classes={{root: classes.button}} variant="outlined">Experience</Button>
            <Button classes={{root: classes.button}} variant="outlined">Skills</Button>
            <Button classes={{root: classes.button}} variant="outlined">Projects</Button>
            <Button classes={{root: classes.button}} variant="outlined">Contact</Button>
        </div>
    </AppBar>
  )
}

