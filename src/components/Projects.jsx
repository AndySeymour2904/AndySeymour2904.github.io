import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
   root: {
       backgroundColor: '#EEEEEE',
       height: '500px',
   }
})

export default function Projects() {

    const classes = useStyles()

    return (
        <div className={classes.root} id="projects">
            <span>PROJECTS</span>
        </div>
    )
}