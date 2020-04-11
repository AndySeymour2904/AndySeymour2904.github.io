import React from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles } from '@material-ui/core/styles'

import Typewriter from 'typewriter-effect'

import Particles from 'react-particles-js'

import Laptop from '../../images/laptop.png'

import { AppBar, Button } from '@material-ui/core'

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
    heading: {
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
        fontSize: props => props.isMaxWidth ? '48px' : '4vw',
    },
    particlesContainer: {
        position: 'absolute',
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
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
    },
})

export default function Hero() {

    const isMaxWidth = useMediaQuery('(min-width:1200px)')

    const [ typingStage, setTypingStage ] = React.useState(0)

    const classes= useStyles({isMaxWidth})

    const typingStages = {
        TITLE: 0,
        SUBTITLE: 1,
    }

    return (
        <div className={classes.root}>
            <div className={classes.particlesContainer}>
             <Particles
                height="100vh"
                width="100vw"
                params={{
                    "particles": {
                        "number": {
                            "value": 50
                        },
                        "size": {
                            "value": 3
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
                    <pre >
                        <div className={classes.heading}>
                            {typingStage === typingStages.TITLE && (
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
                                        .typeString('Full stack web developer\nData engineer')
                                        .callFunction(() => setTypingStage(2))
                                        .start()
                                    }}
                                />
                            )}
                            {typingStage > typingStages.SUBTITLE && (
                                <React.Fragment>
                                    <span>Full stack web developer</span>
                                    <span>Data engineer</span>
                                </React.Fragment>
                            )}
                        </div>
                    </pre>
                </div>    
                <div className={classes.imageContainer}>      
                    <img src={Laptop} className={classes.laptop} />
                </div>
            </div>
        </div>
    )
}