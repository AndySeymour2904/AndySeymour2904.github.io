import React from 'react'

import Header from './Header'
import Hero from './Hero'
import Experience from './Experience'
import Skills from './Skills'
import AboutMe from './AboutMe'
import Contact from './Contact'
import Divider from './Divider'
import Footer from './Footer'

export default function App() {

  return (
    <div>
      <Header />
      <Hero />
      <Divider pushUp topColor='transparent' bottomColor='#EEEEEE' />
      <AboutMe />
      <Divider pushUp reverse topColor='transparent' bottomColor='white' />
      <Skills />
      <Divider topColor='white' bottomColor='#EEEEEE' />
      <Experience />
      <Divider reverse topColor='#EEEEEE' bottomColor='white' />
      <Contact />
      <Footer />
    </div>
  )
}
