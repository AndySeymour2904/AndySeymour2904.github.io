import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Typography, Button } from '@material-ui/core'

import Typewriter from 'typewriter-effect'

import Particles from 'react-particles-js'

import Laptop from '../images/laptop.png'

import useWindowSize from '../hooks/windowSize'

const useStyles = makeStyles({
    root: {
        backgroundColor: '#263238',
        height: '100vh',
        display: 'flex',
    },
    preContainer: {
        flex: 0.5,
        margin: 0,
    },
    intro: {
        paddingLeft: '5vw',
        fontSize: '2.5vw',
        color: '#EEEEEE',
        display: 'flex',
    },
    heading: {
        paddingLeft: '5vw',
        fontSize: '5.5vw',
        fontWeight: 700,
        color: '#aeea00',
        display: 'flex',
    },
    subheading: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '5vw',
        color: '#EEEEEE',
        whiteSpace: 'pre-line',
        fontSize: '3vw',
    },
    particlesContainer: {
        maxWidth: '100%',
        position: 'absolute',
        overflowX: 'hidden',
    },
    laptop: {
        width: '30vw',
        height: '20vw',
    },
    imageContainer: {
        flex: 0.5,
        display: 'flex',
        justifyContent: 'center'
    },
    heroContentContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
    },
})

export default function Hero() {

    const [ typingStage, setTypingStage ] = React.useState(0)

    const classes= useStyles()

    const windowSize = useWindowSize()

    const typingStages = {
        INTRO: 0,
        TITLE: 1,
        SUBTITLE: 2,
    }

    return (
        <div className={classes.root} id="hero">
            <div className={classes.particlesContainer}>
                <Particles
                    height="100vh"
                    width="100vw"
                    params={{
                        "particles": {
                            "number": {
                                "value": Math.sqrt(windowSize.height * windowSize.width) / 30
                            },
                            "size": {
                                "value": 3
                            },
                            "move": {
                                "speed": 3
                            },
                            "links": {
                                "distance": 1000
                            }
                        },
                        "interactivity": {
                            "events": {
                                "onhover": {
                                    "enable": true,
                                    "mode": "grab"
                                }
                            }
                        },
                        "retina_detect": false
                    }}
                />
            </div>
            <div className={classes.heroContentContainer}>
                <div className={classes.preContainer}>      
                    <Typography>
                        <div className={classes.intro}>
                            {typingStage === typingStages.INTRO && (
                                <Typewriter
                                    options={{
                                        cursor: '_'
                                    }}
                                    onInit={(typewriter) => {
                                        typewriter.typeString('Hi, I\'m')
                                        .callFunction(() => setTypingStage(typingStages.TITLE))
                                        .start()
                                    }}
                                />
                            )}
                            {typingStage > typingStages.INTRO && (
                                <span>Hi, I'm</span>
                            )}
                        </div>
                        <div className={classes.heading}>
                            {typingStage === typingStages.TITLE && (
                                <Typewriter
                                    options={{
                                        cursor: '_'
                                    }}
                                    onInit={(typewriter) => {
                                        typewriter.typeString('Andy Seymour')
                                        .callFunction(() => setTypingStage(typingStages.SUBTITLE))
                                        .start()
                                    }}
                                />
                            )}
                            {typingStage > typingStages.TITLE && (
                                <span>Andy Seymour</span>
                            )}
                        </div>
                        <div className={classes.subheading}>
                            {typingStage === typingStages.SUBTITLE && (
                                <Typewriter
                                    options={{
                                        cursor: '_'
                                    }}
                                    onInit={(typewriter) => {
                                        typewriter.changeDelay(75)
                                        .typeString('Web developer / data engineer')
                                        .callFunction(() => setTypingStage(typingStages.SUBTITLE + 1))
                                        .start()
                                    }}
                                />
                            )}
                            {typingStage > typingStages.SUBTITLE && (
                                <React.Fragment>
                                    <span>Web developer / data engineer</span>
                                </React.Fragment>
                            )}
                        </div>
                    </Typography>
                    <div>
                        <Button variant='contained' color='primary'>Hire me</Button>
                        <Button variant='outlined' color='primary'>Download CV</Button>
                    </div>
                </div>    
                <div className={classes.imageContainer}>      
                    <img src={Laptop} className={classes.laptop} />
                </div>
            </div>
        </div>
    )
}