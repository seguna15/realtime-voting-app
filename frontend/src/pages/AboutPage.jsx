import React from 'react'
import Header from '../components/Header'
import MainContent from '../components/MainContent';

const AboutPage = () => {
  const title = "About";
  return (
    <>
      <Header />
      <MainContent title={title}/>
      
    </>
  );
}

export default AboutPage