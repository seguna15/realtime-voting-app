import React from 'react'
import Header from '../components/Header';
import MainContent from '../components/MainContent';

const HomePage = () => {
  const title = "Welcome to the auth app"
  return (
    <>
      <Header />
      <MainContent title={title}/>
    </>
  );
}

export default HomePage