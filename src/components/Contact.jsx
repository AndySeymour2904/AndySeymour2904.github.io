import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Typography } from '@material-ui/core'

import { SocialMediaIconsReact } from 'social-media-icons-react'

import ContactForm from './ContactForm'

import socialIcons from '../content/socialIcons'

const useStyles = makeStyles({
   root: {
       backgroundColor: 'white',
       maxWidth: '600px',
       padding: '50px',
       margin: 'auto',
   },
   socialIcon: {
       padding: '10px',
   },
   socialIconsContainer: {
       display: 'flex',
       justifyContent: 'center',
       margin: '30px 0',
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
            <ContactForm />
            <div className={classes.socialIconsContainer}>
            {Object.keys(socialIcons).map(socialIcon => (
                <div className={classes.socialIcon}>
                    <SocialMediaIconsReact icon={socialIcon} url={socialIcons[socialIcon].url} backgroundColor={socialIcons[socialIcon].backgroundColor} iconSize="5" size="50" />
                </div>
            ))}
            </div>
        </div>
    )
}