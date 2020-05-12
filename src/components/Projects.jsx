import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
   root: {
       backgroundColor: '#EEEEEE',
       height: '500px',
   },
   title: {
       textAlign: 'center',
   },
})

export default function Projects() {

    const classes = useStyles()

    return (
        <div className={classes.root} id="projects">
            <Typography classes={{root: classes.title}} variant='h3'>Projects</Typography>
        </div>
    )
}