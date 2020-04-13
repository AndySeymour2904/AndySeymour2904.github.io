import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ReactWordcloud from 'react-wordcloud'
import words from '../content/words'

const useStyles = makeStyles({
   root: {
       backgroundColor: 'white',
       height: '500px',
   }
})

export default function Skills() {

    const classes = useStyles()

    return (
        <div className={classes.root} id="skills">
            <span>SKILLS</span>
            <ReactWordcloud
                options={{
                    scale: 'logn',
                    rotations: 6,
                    rotationAngles: [-6, 6],
                }}
                words={words}
            />
        </div>
    )
}