import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
   root: {
       backgroundColor: '#525252',
   },
   footerText: {
       textAlign: 'center',
       color: 'white',
       padding: '20px',
   },
})

export default function Footer() {

    const classes = useStyles()

    return (
        <div className={classes.root} id="footer">
            <Typography classes={{root: classes.footerText}}>Made by Andy Seymour (2020)</Typography>
        </div>
    )
}