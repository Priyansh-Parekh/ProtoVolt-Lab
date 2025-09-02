src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <h1 className="p-8 text-center text-4xl font-bold">Welcome to ProtoVolt!</h1>
    </div>
  );
};

export default Home;