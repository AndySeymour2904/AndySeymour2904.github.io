import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
   root: {
       backgroundColor: 'white',
       height: '500px',
   }
})

export default function Contact() {

    const classes = useStyles()

    return (
        <div className={classes.root} id="contact">
            <span>CONTACT</span>
        </div>
    )
}