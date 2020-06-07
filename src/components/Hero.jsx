import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Typography, Button } from '@material-ui/core'

import Typewriter from 'typewriter-effect'

import Particles from 'react-particles-js'

import Fade from 'react-reveal/Fade'

import Laptop from '../images/laptop.png'

import useWindowSize from '../hooks/windowSize'

const useStyles = makeStyles({
    root: {
        backgroundColor: '#263238',
        height: '100vh',
        display: 'flex',
    },
    preContainer: {
        paddingLeft: props => props.isVerticalDesign ? 0 : '5vw',
        paddingTop: props => props.isVerticalDesign ? '5vh' : 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 0.5,
        margin: 0,
    },
    intro: {
        fontSize: props => props.isVerticalDesign ? '2.5vh' : '2.5vw',
        width: 'fit-content',
        margin: props => props.isVerticalDesign ? '0 auto' : 0,
        color: '#EEEEEE',
        display: 'flex',
    },
    heading: {
        fontSize: props => props.isVerticalDesign ? '5.5vh' : '5.5vw',
        width: 'fit-content',
        margin: props => props.isVerticalDesign ? '0 auto' : 0,
        color: '#aeea00',
        display: 'flex',
        fontWeight: 700,
        textAlign: 'center',
    },
    subheading: {
        fontSize: props => props.isVerticalDesign ? '3vh': '3vw',
        width: 'fit-content',
        margin: props => props.isVerticalDesign ? '0 auto' : 0,
        color: '#EEEEEE',
        display: 'flex',
        flexDirection: 'column',
        whiteSpace: 'pre-line',
    },
    particlesContainer: {
        maxWidth: '100%',
        position: 'absolute',
        overflowX: 'hidden',
    },
    laptop: {
        width: props => props.isVerticalDesign ? '30vh' : '30vw',
        height: props => props.isVerticalDesign ? '20vh' : '20vw',
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
        flexDirection: props => props.isVerticalDesign ? 'column' : 'row',
        alignItems: 'center',
        position: 'absolute',
    },
    buttonsContainer: {
        flexDirection: props => props.isVerticalDesign ? 'column': 'row',
        display: 'flex',
        alignItems: 'center',
        margin: props => props.isVerticalDesign ? '0 auto' : 0,
        width: 'fit-content',
    },
    hireButton: {
        backgroundColor: '#388e3c',
        fontSize: props => props.isVerticalDesign ? "max(1.25vh, 12px)" : "max(1.25vw, 12px)",
        '&:hover': {
            backgroundColor: '#27632a',
        },
        marginTop: props => props.isVerticalDesign ? 'max(1vh, 15px)' : 'max(1vw, 15px)',
        marginRight: props => props.isVerticalDesign ? 0 : 'max(1vw, 15px)',
    },
    downloadButton: {
        color: '#388e3c',
        borderColor: '#388e3c',
        fontSize:  props => props.isVerticalDesign ? "max(1.25vh, 12px)" : "max(1.25vw, 12px)",
        marginTop: props => props.isVerticalDesign ? 'max(1vh, 15px)' : 'max(1vw, 15px)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: '#388e3c',
        },
    },
    postTypeWriterSpan: {
        margin: props => props.isVerticalDesign ? '0 auto' : 0,
    },
})

export default function Hero() {

    const [ typingStage, setTypingStage ] = React.useState(0)

    const windowSize = useWindowSize()

    let isVerticalDesign = false

    if (windowSize.width < windowSize.height) {
        isVerticalDesign = true
    }

    const classes= useStyles({isVerticalDesign})

    const typingStages = {
        INTRO: 0,
        TITLE: 1,
        SUBTITLE: 2,
    }

    const handleNavigation = id => event => {

        const element = document.getElementById(id)
        const top = element.getBoundingClientRect().top + window.pageYOffset - window.innerHeight * 0.3

        window.scrollTo({
            top,
            behavior: 'smooth'
        })

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
                                <span className={classes.postTypeWriterSpan}>Hi, I'm</span>
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
                                <span className={classes.postTypeWriterSpan}>Andy Seymour</span>
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
                                    <span className={classes.postTypeWriterSpan}>Web developer / data engineer</span>
                                </React.Fragment>
                            )}
                        </div>
                    </Typography>
                    <Fade left={!isVerticalDesign} bottom={isVerticalDesign} delay={7000}>
                        <div className={classes.buttonsContainer}>
                            <Button variant='contained' color='primary' classes={{root: classes.hireButton}} onClick={handleNavigation('contact')}>Hire me</Button>
                            <Button variant='outlined' color='primary' classes={{root: classes.downloadButton}} >Download CV</Button>
                        </div>
                    </Fade>
                </div>    
                <div className={classes.imageContainer}>      
                    <img src={Laptop} className={classes.laptop} />
                </div>
            </div>
        </div>
    )
}