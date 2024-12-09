import React from 'react';
import './home-screen.css';

const HomeScreen: React.FC = () => {

  return (
    <div className="home-screen">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="hexagon-container">
          <div className="hexagon"></div>
          <div className="hexagon"></div>
          <div className="hexagon"></div>
          <div className="hexagon"></div>
          <div className="hexagon"></div>
        </div>
        <h1 className="logo-text">USAMO Guide</h1>
      </div>

      <div className="scroll-section">
        <h2 className="blueprint-header">A Blueprint for Success</h2>
        <p className="blueprint-subtext">
          AMC 8 &nbsp;&nbsp;|&nbsp;&nbsp; AMC 10/12 &nbsp;&nbsp;|&nbsp;&nbsp; AIME &nbsp;&nbsp;|&nbsp;&nbsp; USAMO &nbsp;&nbsp;|&nbsp;&nbsp; Beyond
        </p>
      </div>
    </div>
  )
};

export default HomeScreen;