import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Chip, Typography } from '@material-ui/core'

import WorkIcon from '@material-ui/icons/Work'
import StarIcon from '@material-ui/icons/Star'
import SchoolIcon from '@material-ui/icons/School'
import LocationIcon from '@material-ui/icons/Room'

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'

import * as experienceContent from '../content/experience'

const useStyles = makeStyles({
    root: {
      background: '#EEEEEE'
    },
    title: {
      textAlign: 'center',
    },
})

const useTimelineStyles = makeStyles({
  subtitle: {
    margin: 0,
    fontStyle: 'italic',
    fontWeight: 400,
  },
  locationContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  locationIcon: {
    color: '#EA4335',
  },
  skillsContainer: {
    marginTop: '1em',
  },
  skill: {
    marginRight: '5px'
  },
  lineBreak: {
    whiteSpace: 'pre-line',
  },
})

const TimelineElementWork = (props) => {

  const timelineClasses = useTimelineStyles()

  return (
    <VerticalTimelineElement
      className='vertical-timeline-element--work'
      date={props.dates}
      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      icon={<WorkIcon />}
    >
      <h3 className="vertical-timeline-element-title">{props.job}</h3>
      <h4 className={timelineClasses.subtitle}>{props.company}</h4>
      <div className={timelineClasses.locationContainer}>
        <LocationIcon className={timelineClasses.locationIcon} />
        <h4 className={timelineClasses.subtitle}>{props.location}</h4>
      </div>
      <p>
        {props.description}
      </p>
      <div className={timelineClasses.skillsContainer}>
        {props.skills.map(skill => <Chip classes={{root: timelineClasses.skill}} variant="outlined" color="primary" label={skill} />)}
      </div>
    </VerticalTimelineElement>
  )
}


const TimelineElementEducation = (props) => {

  const timelineClasses = useTimelineStyles()

  return (
    <VerticalTimelineElement
      className='vertical-timeline-element--education'
      date={props.dates}
      iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
      icon={<SchoolIcon />}
    >
      <h3 className="vertical-timeline-element-title">{props.title}</h3>
      <div className={timelineClasses.locationContainer}>
        <LocationIcon className={timelineClasses.locationIcon} />
        <h4 className={timelineClasses.subtitle}>{props.location}</h4>
      </div>
      <p className={timelineClasses.lineBreak}>
        {props.description}
      </p>
    </VerticalTimelineElement>
  )
}

export default function Experience() {

  const classes = useStyles()

    return (
      <div id="experience" className={classes.root}>
        <Typography classes={{root: classes.title}} variant='h3'>Experience</Typography>
        <VerticalTimeline>
          {experienceContent.work.map(work => (
            <TimelineElementWork {...work} />
          ))}

          {experienceContent.education.map(education => (
            <TimelineElementEducation {...education} />
          ))}
          <VerticalTimelineElement
            iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
            icon={<StarIcon />}
          />
        </VerticalTimeline>
      </div>
    )
}