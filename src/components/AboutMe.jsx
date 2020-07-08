import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import useWindowSize from '../hooks/windowSize'

import { Typography } from '@material-ui/core'

import Hero3 from '../images/Hero3.png'

const useStyles = makeStyles(theme => ({
   root: {
       backgroundColor: '#EEEEEE',
       paddingRight: theme.gutter,
       paddingLeft: theme.gutter,
       paddingBottom: theme.padding.containerBottom,
   },
   container: {
       display: 'flex',
       flexDirection: props => props.isVerticalDesign ? 'column-reverse' : 'column-reverse',
       margin: 'auto',
       alignItems: 'center',
       justifyContent: 'center',
   },
   contentContainer: {
       maxWidth: props => props.isVerticalDesign ? '100vw' : '60vw',
       flex: 1, 
       textAlign: props => props.isVerticalDesign ? 'center' : 'left',
   },
   title: {
       textAlign: 'center',
       paddingTop: theme.padding.titleTop,
       paddingBottom: theme.padding.titleBottom,
   },
   highlight: {
        color: '#237cab',
        fontWeight: 700,
   },
   img: {
       width: props => props.isVerticalDesign ? 'min(40vh, 80vw)' : '80%',
       height: props => props.isVerticalDesign ? 'min(40vh, 80vw)' : '80%',
   },
   imgContainer: {
       flex: 1,
       maxWidth: props => props.isVerticalDesign ? '100%' : '600px',
       maxHeight: props => props.isVerticalDesign ? '100%' : '600px',
   },
   biography: {
       fontSize: props => props.isVerticalDesign ? 'max(1.75vh, 1rem)' : 'max(1.75vw, 1rem)',
       lineSpacing: props => props.isVerticalDesign ? 'max(3.5vh, 2rem)' : 'max(3.5vw, 2rem)',
   }
}))

export default function AboutMe() {

    const windowSize = useWindowSize()

    let isVerticalDesign = false

    if (windowSize.width < windowSize.height) {
        isVerticalDesign = true
    }

    const classes = useStyles({isVerticalDesign})

    return (
        <div className={classes.root} id="aboutme">
            <Typography classes={{root: classes.title}} variant='h3'>About Me</Typography>
            <div className={classes.container}>
                <div className={classes.imgContainer}>
                    <img className={classes.img} src={Hero3} />
                </div>
                <div className={classes.contentContainer}>
                <Typography classes={{root: classes.biography}}>
                    I'm a <span className={classes.highlight}>web developer</span> / <span className={classes.highlight}>data engineer</span> living in <span className={classes.highlight}>London</span>. 
                    Over the last <span className={classes.highlight}>4 years</span>, I’ve been involved in a variety of different projects
                    with different stacks, gaining a large depth of knowledge in web development including <span className={classes.highlight}>UI / UX design</span>. 
                    At the moment, I love using <span className={classes.highlight}>React</span> and the <span className={classes.highlight}>Hadoop</span> ecosystem.
                    When I’m not coding you can find me playing <span className={classes.highlight}>rugby</span>, <span className={classes.highlight}>climbing</span> or <span className={classes.highlight}>cycling</span>. 
                    I recently completed the North Coast 500 around the coast of Scotland by bicycle.</Typography>
                </div>
                
            </div>
        </div>
    )
}