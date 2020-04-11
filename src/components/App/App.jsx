import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Button } from '@material-ui/core/'

import Header from '../Header/Header'
import Hero from '../Hero/Hero'
import Experience from '../Experience/Experience'

const useStyles = makeStyles({
})

export default function App() {

  const classes= useStyles()

  return (
    <div>
      <Header />
      <Hero />
      <Experience />
    </div>
  )
}
