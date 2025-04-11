import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Options from '../components/opcoes';

export default function Home() {
  const name = "Menu Principal";

  return (
    <>
      <Header name={name} />
      <Options />
      <Footer />
    </>
  );
}