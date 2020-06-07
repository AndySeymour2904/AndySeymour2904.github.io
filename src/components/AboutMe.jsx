import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import useWindowSize from '../hooks/windowSize'

import { Typography } from '@material-ui/core'

import Laptop from '../images/laptop.png'
import AboutMe1612 from '../images/AboutMe/AboutMe-1612.png'
import AboutMe1209 from '../images/AboutMe/AboutMe-1209.png'
import AboutMe806 from '../images/AboutMe/AboutMe-806.png'
import AboutMe564 from '../images/AboutMe/AboutMe-564.png'
import AboutMe322 from '../images/AboutMe/AboutMe-322.png'

const useStyles = makeStyles(theme => ({
   root: {
       backgroundColor: '#EEEEEE',
       paddingRight: theme.gutter,
       paddingLeft: theme.gutter,
       paddingBottom: theme.padding.containerBottom,
   },
   container: {
       display: 'flex',
       flexDirection: props => props.isVerticalDesign ? 'column' : 'row',
       margin: 'auto',
       alignItems: 'center',
       justifyContent: 'center',
   },
   contentContainer: {
       maxWidth: '900px',
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
       borderRadius: '100%',
       border: props => props.isVerticalDesign ? '0.75vh solid' : 'min(0.75vw, 9px) solid',
   },
   imgContainer: {
       flex: 1,
       maxWidth: props => props.isVerticalDesign ? '100%' : '600px',
       maxHeight: props => props.isVerticalDesign ? '100%' : '600px',
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
                    <img className={classes.img} srcSet={`
                        ${AboutMe1612} 1612w, 
                        ${AboutMe1209} 1209w, 
                        ${AboutMe806} 806w, 
                        ${AboutMe564} 564w, 
                        ${AboutMe322} 322w`} 
                        src={AboutMe1612} />
                </div>
                <div className={classes.contentContainer}>
                <Typography>
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