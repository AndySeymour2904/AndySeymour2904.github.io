import React from 'react'

import Header from './Header'
import Hero from './Hero'
import Experience from './Experience'
import Skills from './Skills'
import Projects from './Projects'
import Contact from './Contact'
import Divider from './Divider'

export default function App() {

  return (
    <div>
      <Header />
      <Hero />
      <Divider marginTop='-150px' topColor='transparent' bottomColor='#EEEEEE' height='150px' />
      <Experience />
      <Divider reverse topColor='#EEEEEE' bottomColor='white' height='150px' />
      <Skills />
      <Divider topColor='white' bottomColor='#EEEEEE' height='150px' />
      <Projects />
      <Divider reverse topColor='#EEEEEE' bottomColor='white' height='150px' />
      <Contact />
    </div>
  )
}
