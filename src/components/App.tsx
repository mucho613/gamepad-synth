import React from 'react';
import './App.scss';
import Instrument from './Instrument';

export type KeyState = { noteNumber: number, button: number }[];

function App() {
  return (
    <div className="container">
      <header>
        {/* <h1 className='ui header'>Gamepad Synth</h1> */}
      </header>

      <Instrument />
    </div>
  );
}

export default App;
