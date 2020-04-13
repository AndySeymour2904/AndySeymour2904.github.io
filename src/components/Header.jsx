import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Button } from '@material-ui/core/'

const useStyles = makeStyles({
    appBarVariant1: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        position: 'absolute',
        transition: 'all 0.5s ease',
    },
    appBarVariant2: {
        backgroundColor: 'black',
        position: 'sticky',
        transition: 'all 1s ease',
        top: 0,
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '30px',
    },
    button: {
        margin: '10px',
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
        marginLeft: '40px',
        fontSize: '28px',
        fontWeight: 700,
        color: '#aeea00',
        display: 'flex',
    },
})

export default function App() {

  const [headerVariant, setHeaderVariant] = React.useState(1)

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
            <span onClick={handleNavigation('experience')} className={classes.title}>{headerVariant === 2 ? 'Andy Seymour' : ' '}</span>
            <div className={classes.buttonsContainer}>
                <Button onClick={handleNavigation('experience')} classes={{root: classes.button}} variant="outlined">Experience</Button>
                <Button onClick={handleNavigation('skills')} classes={{root: classes.button}} variant="outlined">Skills</Button>
                <Button onClick={handleNavigation('projects')} classes={{root: classes.button}} variant="outlined">Projects</Button>
                <Button onClick={handleNavigation('contact')} classes={{root: classes.button}} variant="outlined">Contact</Button>
            </div>
        </div>
    </AppBar>
  )
}

