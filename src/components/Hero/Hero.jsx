import React from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles } from '@material-ui/core/styles'

import { Zoom } from '@material-ui/core'

import JSLogo from '../../images/logos/js.png'
import PythonLogo from '../../images/logos/python.png'
import DataLogo from '../../images/logos/data.png'

import SocialLinks from './SocialLinks'

import Typewriter from 'typewriter-effect'

const useStyles = makeStyles({
    root: {
        backgroundColor: '#263238',
        height: '90vh',
    },
    pre: {
        margin: 0,
    },
    heading: {
        paddingTop: props => 30 - props.minusPadding + 'vh',
        paddingBottom: '1vh',
        paddingLeft: '5vw',
        fontSize: props => props.isMaxWidth ? '96px' : '8vw',
        fontWeight: 700,
        color: '#aeea00',
        display: 'flex',
    },
    subheading: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '5vw',
        color: 'white',
        paddingBottom: '15vh',
        fontSize: props => props.isMaxWidth ? '48px' : '4vw',
    },
    topicHeading: {
        color: 'white',
        fontSize: props => props.isMaxWidth ? '36px' : '3vw',
        display: 'flex',
        justifyContent: 'space-around',
    },
    topicContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        margin: '10px',
        maxWidth: '350px',
    },
    topicImage: {
        width: '5vw',
        marginBottom: '20px'
    },
})

export default function Hero() {

    const isMaxWidth = useMediaQuery('(min-width:1200px)')

    const [ typingStage, setTypingStage ] = React.useState(0)
    const [ minusPadding, setMinusPadding ] = React.useState(0)

    const classes= useStyles({isMaxWidth, minusPadding})

    return (
        <div className={classes.root}>
        <SocialLinks />
        <pre className={classes.pre}>
            <div className={classes.heading}>
                {typingStage === 0 && (
                    <Typewriter
                        options={{
                            cursor: '_'
                        }}
                        onInit={(typewriter) => {
                            typewriter.pauseFor(1500)
                            .typeString('Andy Seymour')
                            .callFunction(() => setTypingStage(1))
                            .start();
                        }}
                    />
                )}
                {typingStage > 0 && (
                    <span>Andy Seymour </span>
                )}
            </div>
            <div className={classes.subheading}>
                {typingStage === 1 && (
                    <Typewriter
                        options={{
                            cursor: '_'
                        }}
                        onInit={(typewriter) => {
                            typewriter.changeDelay(75)
                            .typeString('Full stack web developer\nData engineer')
                            .pauseFor(500)
                            .changeDelay('natural')
                            .callFunction(() => setMinusPadding(4))
                            .typeString('\n')
                            .pauseFor(0)
                            .callFunction(() => setMinusPadding(8))
                            .typeString('\n')
                            .pauseFor(0)
                            .callFunction(() => setMinusPadding(12))
                            .typeString('\n')
                            .pauseFor(0)
                            .callFunction(() => setTypingStage(2))
                            .start()
                        }}
                    />
                )}
                {typingStage > 1 && (
                    <React.Fragment>
                        <span>Full stack web developer</span>
                        <span>Data engineer</span>
                    </React.Fragment>
                )}
            </div>
            <div className={classes.topicHeading}>
                {typingStage > 1 && (
                    <React.Fragment>
                        <Zoom in>
                            <div elevation={4} className={classes.topicContainer}>
                                <img className={classes.topicImage} src={JSLogo} alt='JavaScript' />
                                <span>React</span>
                                <span>Node</span>
                                <span>Redux</span>
                            </div>
                        </Zoom>
                        <Zoom in style={{transitionDelay: '500ms'}}>
                            <div elevation={4} className={classes.topicContainer}>
                                <img className={classes.topicImage} src={DataLogo} alt='Data' />
                                <span>Hadoop</span>
                                <span>Spark</span>
                                <span>PostgreSQL</span>
                            </div>
                        </Zoom>
                        <Zoom in style={{transitionDelay: '1000ms'}}>
                            <div elevation={4} className={classes.topicContainer}>
                                <img className={classes.topicImage} src={PythonLogo} alt='Python' />
                                <span>Flask</span>
                                <span>AsyncIO</span>
                                <span>AIOHTTP</span>
                            </div>
                        </Zoom>
                    </React.Fragment>
                )}
            </div>
           <button onClick={() => {setTypingStage(0); setMinusPadding(0)}}>RESET</button>
           <button onClick={() => {setTypingStage(2); setMinusPadding(12)}}>SKIP</button>
        </pre>
        </div>
    )
}