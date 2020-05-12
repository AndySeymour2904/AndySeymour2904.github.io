import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
   root: {
       backgroundColor: 'white',
       height: '500px',
   },
   title: {
       textAlign: 'center',
   },
})

export default function Contact() {

    const classes = useStyles()

    return (
        <div className={classes.root} id="contact">
            <Typography classes={{root: classes.title}} variant='h3'>Contact</Typography>
        </div>
    )
}