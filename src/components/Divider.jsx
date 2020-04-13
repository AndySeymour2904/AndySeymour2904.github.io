import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    divider: {
        marginTop: props => props.marginTop || 0,
        position: 'relative',
        width: '100%',
        height: props => props.height,
        '&::before': {
            position: 'absolute',
            content: '""',
            width: '100%',
            height: '100%',
            backgroundColor: props => props.topColor,
            clipPath: 'polygon(100% 0, 0 0, 0 100%)',
        },
        '&::after': {
            position: 'absolute',
            content: '""',
            width: '100%',
            height: '100%',
            backgroundColor: props => props.bottomColor,
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
        },
    },
    reverse: {
        transform: 'rotateY(180deg)',
    },
})

export default function Divider(props) {

    const classes= useStyles({...props})

    return (
        <div className={classes.divider + (props.reverse ? ' ' + classes.reverse : '')} />
    )
}
