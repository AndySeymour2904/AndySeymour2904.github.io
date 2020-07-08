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
    heading: {
        position: 'relative',
        fontSize: props => props.isVerticalDesign ? '5.5vh' : '5.5vw',
        width: 'fit-content',
        margin: props => props.isVerticalDesign ? '0 auto' : 0,
        color: '#aeea00',
        display: 'flex',
        fontWeight: 700,
        textAlign: 'center',
    },
    subheading: {
        position: 'relative',
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
        position: 'relative',
        width: props => props.isVerticalDesign ? '30vh' : '30vw',
        height: props => props.isVerticalDesign ? '20vh' : '20vw',
    },
    imageContainer: {
        flex: 0.5,
        display: 'flex',
        justifyContent: 'center',
    },
    heroContentContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: props => props.isVerticalDesign ? 'column' : 'row',
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: props => props.isVerticalDesign ? 'column': 'row',
        display: 'flex',
        alignItems: 'center',
        margin: props => props.isVerticalDesign ? '0 auto' : 0,
        width: 'fit-content',
    },
    hireButton: {
        position: 'relative',
        backgroundColor: '#388e3c',
        fontSize: props => props.isVerticalDesign ? "max(1.25vh, 12px)" : "max(1.25vw, 12px)",
        '&:hover': {
            backgroundColor: '#27632a',
        },
        marginTop: props => props.isVerticalDesign ? 'max(1vh, 15px)' : 'max(1vw, 15px)',
        marginRight: props => props.isVerticalDesign ? 0 : 'max(1vw, 15px)',
    },
    downloadButton: {
        position: 'relative',
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
        TITLE: 0,
        SUBTITLE: 1,
    }

    const handleNavigation = id => event => {

        const element = document.getElementById(id)
        const top = element.getBoundingClientRect().top + window.pageYOffset - window.innerHeight * 0.3

        window.scrollTo({
            top,
            behavior: 'smooth'
        })

    }

    const particleScaleFactor = Math.sqrt(windowSize.height * windowSize.width)

    return (
        <div className={classes.root} id="hero">
            <div className={classes.particlesContainer}>
                <Particles
                    height="100vh"
                    width="100vw"
                    params={{
                        particles: {
                            number: {
                                value: particleScaleFactor / 30
                            },
                            collisions: {
                                enable: false
                            },
                            size: {
                                value: 3
                            },
                            move: {
                                speed: 3
                            },
                            line_linked: {
                                enable: true,
                                distance: Math.max(175, particleScaleFactor / 9)
                            }
                        },
                        interactivity: {
                            events: {
                                onhover: {
                                    enable: true,
                                    mode: "grab"
                                },
                                onClick: {
                                    enable: true,
                                    mode: "repulse"
                                },
                            },
                            modes: {
                                grab: {
                                  distance: Math.max(200, particleScaleFactor / 8),
                                },
                                repulse: {
                                    distance: Math.max(150, particleScaleFactor / 15),
                                    duration: 4,
                                },
                            },
                        },
                        retina_detect: false
                    }}
                />
            </div>
            <div className={classes.heroContentContainer}>
                <div className={classes.preContainer}>      
                    <Typography>
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
                    <Fade left={!isVerticalDesign} bottom={isVerticalDesign} delay={5000}>
                        <div className={classes.buttonsContainer}>
                            <Button variant='contained' color='primary' classes={{root: classes.hireButton}} onClick={handleNavigation('contact')}>Hire me</Button>
                            <Button href={process.env.PUBLIC_URL + "/AndySeymourCV.pdf"} variant='outlined' color='primary' classes={{root: classes.downloadButton}} download>Download CV</Button>
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