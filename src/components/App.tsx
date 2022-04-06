import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.scss';
import * as Tone from 'tone'
import { Output } from 'webmidi';
import GamePadStatusDisplay from './GamePadStatusDisplay/GamePadStatusDisplay';
import { useGamepad } from './useGamepad';
import { AxisState, KeyPressedState } from '../types/gamepad';
import { useMidi } from './useMidi';
import MidiOutputStatusDisplay from './MidiOutputStatusDisplay/MidiOutputStatusDisplay';
import { getBaseNoteNumberByButtonIndex } from '../logic/gamepad';

export type KeyState = { noteNumber: number, button: number }[];

function App() {
  const [synth, setSynth] = useState<Tone.Synth>();
  const [midiOutputs, setMidiOutputs] = useState<Output[]>();
  const [primaryMidiOutput, setPrimaryMidiOutput] = useState<Output>();

  const [keyPressedStatus, setKeyPressedStatus] = useState<KeyPressedState[]>([]);
  const [axisStatus, setAxisStatus] = useState<AxisState[]>([]);

  const keyState = useRef<KeyState>([]);

  const outputs = useMidi();
  outputs.then((value) => {
    setMidiOutputs(value);
  })

  useEffect(() => {
    setSynth(new Tone.Synth().toDestination());
  }, []);

  const noteOn = useCallback((noteNumber: number) => {
    // synth?.triggerAttack((523 / 2) * Math.pow(2, (noteNumber-60) / 12));
    primaryMidiOutput?.sendNoteOn(noteNumber, {
      channels: 1,
      rawAttack: 100
    })
  }, [primaryMidiOutput]);

  const noteOff = useCallback((noteNumber: number) => {
    // synth?.triggerRelease();
    primaryMidiOutput?.sendNoteOff(noteNumber, {
      channels: 1
    })
  }, [primaryMidiOutput]);

  const onPressed = useCallback((index: number, buttonPressed: boolean[]) => {
    setKeyPressedStatus(buttonPressed.map((value, index) => {
      return {
        button: index,
        pressed: value
      }
    }));

    const noteName = getBaseNoteNumberByButtonIndex(index);
    if(noteName === null) return;

    const noteOffset =
      (buttonPressed[4] ? 12 : 0) + // Octave Up
      (buttonPressed[6] ? -12 : 0) + // Octave Down
      (buttonPressed[5] ? 1 : 0) + // Half-note Up
      (buttonPressed[7] ? -1 : 0); // Half-note Down

    const noteNumber = noteName + noteOffset + 60;
    noteOn(noteNumber);

    keyState.current.push({
      noteNumber,
      button: index
    })
  }, [keyState, noteOn]);

  const onReleased = useCallback((index: number, buttonPressed: boolean[]) => {
    setKeyPressedStatus(buttonPressed.map((value, index) => {
      return {
        button: index,
        pressed: value
      }
    }));

    const noteName = getBaseNoteNumberByButtonIndex(index);
    if(noteName === null) return;

    const key = keyState.current.find(value => value.button === index)
    if(key) {
      noteOff(key.noteNumber);
      keyState.current = keyState.current.filter(value => value.button !== index);
    }
  }, [keyState, noteOff]);

  const onAxis = useCallback((value: number) => {
    setAxisStatus([{ value }]);
    primaryMidiOutput?.sendPitchBend(-value, {
      channels: 1,
    })
  }, [primaryMidiOutput])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrimaryMidiOutput(midiOutputs?.find(output => output.id === e.target.value))
  };

  useGamepad({
    onPressed,
    onReleased,
    onAxis
  });

  return (
    <div className="container">
      <header>
        <h1 className='ui header'>Gamepad Synth</h1>
        <label htmlFor="midi-output-select">MIDI Output</label>
        <div>
          <select onChange={handleChange} id='midi-output-select'>
            {midiOutputs?.map(midiOutput =>
              <option key={midiOutput.id} value={midiOutput.id}>{midiOutput.name}</option>
            )}
          </select>
        </div>
      </header>

      <GamePadStatusDisplay keyPressedStatus={keyPressedStatus} axisStatus={axisStatus}/>
      <MidiOutputStatusDisplay keyStateRef={keyState} />
    </div>
  );
}

export default App;
