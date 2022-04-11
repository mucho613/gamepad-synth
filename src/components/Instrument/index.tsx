import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone'
import { Output } from 'webmidi';
import { getBaseNoteNumberByButtonIndex } from '../../functions/gamepad';
import { AxisState, KeyPressedState } from '../../types/gamepad';
import MidiOutputStatusDisplay from '../MidiOutputStatusDisplay';
import { useGamepad } from '../useGamepad';
import { useMidi } from '../useMidi';
import { GamepadEvent } from '../../types/gamepad';
import GamepadStatusDisplay from '../GamepadStatusDisplay';
import './index.scss';

export type KeyState = { noteNumber: number, button: number }[];

function Instrument() {
  const [synth, setSynth] = useState<Tone.Synth>();
  const [midiOutputs, setMidiOutputs] = useState<Output[]>();
  const [primaryMidiOutput, setPrimaryMidiOutput] = useState<Output>();
  const [keyPressedStatus, setKeyPressedStatus] = useState<KeyPressedState[]>([]);
  const [axisStatus, setAxisStatus] = useState<AxisState[]>([]);

  const noteNumberBase = 60;

  const keyStateRef = useRef<KeyState>([]);
  const [keyState, setKeyState] = useState<KeyState>([]);

  // keyShift の情報とか
  const [target, setTarget] = useState<number[]>([]);

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

  const handleInput = useCallback((event: GamepadEvent) => {
    if (event.type === 'buttonpressed') {
      setKeyPressedStatus(event.gamepad.buttons
        .map((value, index) => ({
          button: index,
          pressed: value.pressed
        })));

      const noteName = getBaseNoteNumberByButtonIndex(event.target.index);

      const noteOffset =
        (event.gamepad.buttons[4].pressed ? 12 : 0) + // Octave Up
        (event.gamepad.buttons[6].pressed ? -12 : 0) + // Octave Down
        (event.gamepad.buttons[5].pressed ? 1 : 0) + // Half-note Up
        (event.gamepad.buttons[7].pressed ? -1 : 0); // Half-note Down

      const offset = noteNumberBase + noteOffset;
      setTarget([0, 2, 4, 5, 7, 9, 11, 12].map(value => value + offset));

      if(noteName === null) return;

      const noteNumber = noteName + noteOffset + noteNumberBase;
      noteOn(noteNumber);

      keyStateRef.current.push({
        noteNumber,
        button: event.target.index
      })

      setKeyState(keyState => [
        ...keyState,
        {
          noteNumber,
          button: event.target.index
        }
      ]);
    }

    if(event.type === 'buttonreleased') {
      setKeyPressedStatus(event.gamepad.buttons
        .map((value, index) => ({
          button: index,
          pressed: value.pressed
        })));

      const noteName = getBaseNoteNumberByButtonIndex(event.target.index);

      const noteOffset =
        (event.gamepad.buttons[4].pressed ? 12 : 0) + // Octave Up
        (event.gamepad.buttons[6].pressed ? -12 : 0) + // Octave Down
        (event.gamepad.buttons[5].pressed ? 1 : 0) + // Semitone Up
        (event.gamepad.buttons[7].pressed ? -1 : 0); // Semitone Down

      const offset = noteNumberBase + noteOffset;
      setTarget([0, 2, 4, 5, 7, 9, 11, 12].map(value => value + offset));

      if(noteName === null) return;

      const key = keyStateRef.current.find(value => value.button === event.target.index)
      if(key) {
        noteOff(key.noteNumber);
        keyStateRef.current = keyStateRef.current.filter(value => value.button !== event.target.index);
        setKeyState(keyState => keyState.filter(value => value.button !== event.target.index));
      }
    }

    if(event.type === 'axis') {
      if(event.target.index === 0 || event.target.index === 2) {
        primaryMidiOutput?.sendPitchBend(event.target.value);
        setAxisStatus([{ value: event.target.value }]);
      } else {
        if (event.target.value <= 0) { // 下
          const value = event.target.value * -1;
          primaryMidiOutput?.sendControlChange(1, Math.floor(value * 127)); // Modulation
        } else {
          // const value = 1 - event.target.value;
          // primaryMidiOutput?.sendControlChange(11, Math.floor(value * 127)); // Expression
        }
      }
    }
  }, [noteOff, noteOn, primaryMidiOutput]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrimaryMidiOutput(midiOutputs?.find(output => output.id === e.target.value))
  };

  useGamepad({
    onInput: handleInput,
  });

  return (
    <div>
      <h2>Gamepad Input Status</h2>
      <GamepadStatusDisplay keyPressedStatus={keyPressedStatus} axisStatus={axisStatus}/>

      <h2>MIDI Output Status</h2>
      <label htmlFor="midi-output-select">MIDI Output</label>
      <select onChange={handleChange} id='midi-output-select'>
        {midiOutputs?.map(midiOutput =>
          <option key={midiOutput.id} value={midiOutput.id}>{midiOutput.name}</option>
        )}
      </select>
      <h3>Device Name</h3>
      <p>{primaryMidiOutput?.name}</p>
      <p>{primaryMidiOutput?.manufacturer}</p>
      <p>{primaryMidiOutput?.state.toUpperCase()}</p>

      <MidiOutputStatusDisplay keyState={keyState} target={target}/>

      {JSON.stringify(axisStatus)}
    </div>
  );
}

export default Instrument;
