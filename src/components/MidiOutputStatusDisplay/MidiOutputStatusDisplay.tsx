import React from 'react';
import { KeyState } from '../App';
import './MidiOutputStatusDisplay.scss';

type Props = {
  keyStateRef: React.MutableRefObject<KeyState>;
}

const getKeyNameByKeyNumber = (noteNumber: number) => {
  const baseKeyNumber = noteNumber % 12;

  switch(baseKeyNumber) {
    case 0:
      return "c";
    case 1:
      return "c-sharp";
    case 2:
      return "d";
    case 3:
      return "d-sharp";
    case 4:
      return "e";
    case 5:
      return "f";
    case 6:
      return "f-sharp";
    case 7:
      return "g";
    case 8:
      return "g-sharp";
    case 9:
      return "a";
    case 10:
      return "a-sharp";
    case 11:
    default:
      return "b";
  }
}

function MidiOutputStatusDisplay(props: Props) {
  const { keyStateRef } = props;

  console.log(keyStateRef.current);

  return (
    <section className='keyboard'>
      <ol>
        {
          [...Array(128)].map((_value, index) => {
            const style = {
              left: `${index * 20}px`
            };

            const pressed = keyStateRef?.current.some(value => value.noteNumber === index)

            const className = [
              getKeyNameByKeyNumber(index),
              pressed ? 'pressed' : ''
            ].join(' ');

            return <li key={index} className={className} style={style}>{index}</li>
          })
        }
      </ol>
    </section>
  );
}

export default MidiOutputStatusDisplay;
