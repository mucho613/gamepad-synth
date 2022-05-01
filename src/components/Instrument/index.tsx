import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone'
import { Output } from 'webmidi';
import { getBaseNoteNumberByButtonIndex as buttonNumberToBaseNoteNumber } from '../../functions/gamepad';
import { AxisState, KeyPressedState } from '../../types/gamepad';
import MidiOutputStatusDisplay from '../MidiOutputStatusDisplay';
import { useGamepad } from '../useGamepad';
import { useMidi } from '../useMidi';
import { GamepadEvent } from '../../types/gamepad';
import GamepadStatusDisplay from '../GamepadStatusDisplay';
import './index.scss';
import { bitmapToSysExBytes, stringToSysExBytes } from '../../functions/midi';

export type KeyState = { targetChannel: number, noteNumber: number, button: number }[];

function Instrument() {
  const [synth, setSynth] = useState<Tone.Synth>();
  const [midiOutputs, setMidiOutputs] = useState<Output[]>();
  const [primaryMidiOutput, setPrimaryMidiOutput] = useState<Output>();
  const [keyPressedStatus, setKeyPressedStatus] = useState<KeyPressedState[]>([]);
  const [axisStatus, setAxisStatus] = useState<AxisState[]>([]);
  const [gamepadDeviceName, setGamepadDeviceName] = useState<string>("");

  const [pitchBend, setPitchBend] = useState<number>(0);

  const noteNumberBase = 60;
  const targetChannel = 1;

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
    primaryMidiOutput?.channels[targetChannel].sendNoteOn(noteNumber, {
      rawAttack: 100
    })
  }, [primaryMidiOutput?.channels]);

  const noteOff = useCallback((noteNumber: number) => {
    // synth?.triggerRelease();
    primaryMidiOutput?.channels[targetChannel].sendNoteOff(noteNumber);
  }, [primaryMidiOutput?.channels]);

  const handleInput = useCallback((event: GamepadEvent) => {
    setGamepadDeviceName(event.gamepad.id);

    if (event.type === 'buttonpressed') {
      setKeyPressedStatus(event.gamepad.buttons
        .map((value, index) => ({
          button: index,
          pressed: value.pressed
        })));

      const noteName = buttonNumberToBaseNoteNumber(event.target.index);

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
        targetChannel,
        noteNumber,
        button: event.target.index
      })

      setKeyState(keyState => [
        ...keyState,
        {
          targetChannel,
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

      const noteName = buttonNumberToBaseNoteNumber(event.target.index);

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
      // TODO: コントロールチェンジの送信インターバルを実装する
      if(event.target.index === 0 || event.target.index === 2) {
        primaryMidiOutput?.sendPitchBend(event.target.value);
        setAxisStatus([{ value: event.target.value }]);
        setPitchBend(event.target.value);
      } else {
        if (event.target.value <= 0) { // 下
          // const value = event.target.value * -1;
          // primaryMidiOutput?.sendControlChange(1, Math.floor(value * 127)); // Modulation
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
      <h2>Gamepad</h2>
      <GamepadStatusDisplay deviceName={gamepadDeviceName} keyPressedStatus={keyPressedStatus} axisStatus={axisStatus}/>

      <h2>MIDI Output Device</h2>

      <label htmlFor="midi-output-select">MIDI Output</label>
      <select onChange={handleChange} id='midi-output-select'>
        {midiOutputs?.map(midiOutput =>
          <option key={midiOutput.id} value={midiOutput.id}>{midiOutput.name}</option>
        )}
      </select>

      <h3>Device Name</h3>
      <p>{primaryMidiOutput?.name ?? 'Unknown'}</p>

      <MidiOutputStatusDisplay keyState={keyState} pitchBend={pitchBend} target={target}/>
    </div>
  );
}

export default Instrument;
