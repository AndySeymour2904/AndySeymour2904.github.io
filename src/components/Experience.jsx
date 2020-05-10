import React from 'react'

import WorkIcon from '@material-ui/icons/Work'
import StarIcon from '@material-ui/icons/Star'
import SchoolIcon from '@material-ui/icons/School'

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'

import * as experienceContent from '../content/experience'


import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    root: {
      background: '#EEEEEE'
    }
})

const TimelineElement = (props) => {

  return (
    <VerticalTimelineElement
      className={`vertical-timeline-element--work`}
      date={props.dates}
      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      icon={<WorkIcon />}
    >
      <h3 className="vertical-timeline-element-title">{props.job}</h3>
      <h4 className="vertical-timeline-element-subtitle">{props.company}</h4>
      <h4 className="vertical-timeline-element-subtitle">{props.location}</h4>
      <p>
        {props.description}
      </p>
    </VerticalTimelineElement>
  )
}

export default function Experience() {

  const classes = useStyles()

    return (
      <div id="experience" className={classes.root}>
        <VerticalTimeline>
          {experienceContent.work.map(work => (
            <TimelineElement {...work} />
          ))}
          <VerticalTimelineElement
            iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
            icon={<StarIcon />}
          />
        </VerticalTimeline>
      </div>
    )
}