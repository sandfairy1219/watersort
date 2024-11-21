import React from 'react';
import Image from "next/image";
import localFont from "next/font/local";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import useGameLogic from '@/functions/function';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Home: React.FC = () => {
  useGameLogic();

  return (
    <div>
      <div id="waiting-screen">
        <h1>Water Sort Game</h1>
        <button type="button" className="btn btn-info" id="start-button">Start</button>
        <div>
          <button className="difficulty-button btn btn-secondary" data-difficulty="easy" id="easy">Easy</button>
          <button className="difficulty-button btn btn-secondary" data-difficulty="medium" id="medium">Medium</button>
          <button className="difficulty-button btn btn-secondary" data-difficulty="hard" id="hard">Hard</button>
        </div>
      </div>
      <div id="game-container" style={{ display: 'none' }}>
        <button id="reset-button" className="btn btn-warning">Reset</button>
        <div id="bottles-container">
          {/* Bottles will be dynamically generated here */}
        </div>
        <div id="clear-message">Clear</div>
      </div>
    </div>
  );
};

export default Home;
