import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    divider: {
        position: 'relative',
        width: '100%',
        [theme.breakpoints.only('xs')]: {
            height: '60px',
            marginTop: props => props.pushUp ? '-60px' : '0px',
        },
        [theme.breakpoints.only('sm')]: {
            height: '90px',
            marginTop: props => props.pushUp ? '-90px' : '0px',
        },
        [theme.breakpoints.only('md')]: {
            height: '120px',
            marginTop: props => props.pushUp ? '-120px' : '0px',
        },
        [theme.breakpoints.only('lg')]: {
            height: '150px',
            marginTop: props => props.pushUp ? '-150px' : '0px',
        }, 
        [theme.breakpoints.only('xl')]: {
            height: '180px',
            marginTop: props => props.pushUp ? '-180px' : '0px',
        },
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
}))

export default function Divider(props) {
    const classes= useStyles({...props})

    return (
        <div className={classes.divider + (props.reverse ? ' ' + classes.reverse : '')} />
    )
}
