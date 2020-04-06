import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { SocialIcon } from 'react-social-icons'

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        right: 0,
        top: 0,
        display: 'flex',
    }
})

export default function SocialLinks() {

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <SocialIcon url='https://github.com/AndySeymour2904' />
            <p>LinkedIn</p>
            <p>Stack Overflow</p>
            <p>Email</p>
        </div>
    )
}