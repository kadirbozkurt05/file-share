import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import FileShare from './components/FileShare';
import Information from './components/Information';
import Reviews from './components/Reviews';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header />
      <main className="flex-grow">
        <FileShare />
        <Information />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}

export default App;