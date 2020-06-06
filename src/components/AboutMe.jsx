import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
   root: {
       backgroundColor: '#EEEEEE',
       paddingRight: theme.gutter,
       paddingLeft: theme.gutter,
       paddingBottom: theme.padding.containerBottom,
   },
   container: {
       display: 'flex',
       maxWidth: '900px',
       margin: 'auto',
       alignItems: 'center',
   },
   contentContainer: {
       flex: 1, 
   },
   title: {
       textAlign: 'center',
       paddingTop: theme.padding.titleTop,
       paddingBottom: theme.padding.titleBottom,
   },
   placeholder: {
       height: '400px',
       width: '400px',
       background: 'grey',
       flex: 0.5,
       margin: '20px',
       marginLeft: 0
   },
   highlight: {
    color: '#237cab',
    fontWeight: 700,
   },
}))

export default function AboutMe() {

    const classes = useStyles()

    return (
        <div className={classes.root} id="aboutme">
            <Typography classes={{root: classes.title}} variant='h3'>About Me</Typography>
            <div className={classes.container}>
                <div className={classes.placeholder}></div>
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