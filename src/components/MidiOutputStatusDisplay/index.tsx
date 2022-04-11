import React from 'react';
import { KeyState } from '../App';
import './index.scss';

type Props = {
  keyState: KeyState;
  target: number[];
}

const getNameByKeyNumber = (noteNumber: number) => {
  const baseKeyNumber = noteNumber % 12;

  switch(baseKeyNumber) {
    case 0:
      return {
        keyName: "c",
        keyColor: 'white',
        indexInColor: 0,
      }
    case 1:
      return {
        keyName: "c-sharp",
        keyColor: 'black',
        indexInColor: 0,
      }
    case 2:
      return {
        keyName: "d",
        keyColor: 'white',
        indexInColor: 1,
      }
    case 3:
      return {
        keyName: "d-sharp",
        keyColor: 'black',
        indexInColor: 1,
      }
    case 4:
      return {
        keyName: "e",
        keyColor: 'white',
        indexInColor: 2,
      }
    case 5:
      return {
        keyName: "f",
        keyColor: 'white',
        indexInColor: 3,
      }
    case 6:
      return {
        keyName: "f-sharp",
        keyColor: 'black',
        indexInColor: 2,
      }
    case 7:
      return {
        keyName: "g",
        keyColor: 'white',
        indexInColor: 4,
      }
    case 8:
      return {
        keyName: "g-sharp",
        keyColor: 'black',
        indexInColor: 3,
      }
    case 9:
      return {
        keyName: "a",
        keyColor: 'white',
        indexInColor: 5,
      }
    case 10:
      return {
        keyName: "a-sharp",
        keyColor: 'black',
        indexInColor: 4,
      }
    case 11:
    default:
      return {
        keyName: "c",
        keyColor: 'white',
        indexInColor: 6,
      }
  }
}

const whiteKeyWidth = 40 as const;
const blackKeyWidth = 20 as const;

function MidiOutputStatusDisplay(props: Props) {
  const { keyState, target } = props;

  return (
    <>
      <section className='keyboard'>
        <ol>
          {
            [...Array(128)].map((_value, index) => {
              const key = getNameByKeyNumber(index);
              const octave = Math.floor(index / 12);
              const keyPosition = (() => {
                if(key.keyColor === 'white') {
                  return (octave * whiteKeyWidth * 7) + key.indexInColor * whiteKeyWidth;
                } else {
                  // C#, D#
                  if(key.indexInColor <= 1) {
                    const upperPartWhiteWidth = whiteKeyWidth - (2 * blackKeyWidth / 3);
                    const index = key.indexInColor;
                    return (octave * whiteKeyWidth * 7) + ((index + 1) * upperPartWhiteWidth) + (index * blackKeyWidth)
                  }
                  // F#, G#, A#
                  else {
                    const upperPartWhiteWidth = whiteKeyWidth - (3 * blackKeyWidth / 4);
                    const index = key.indexInColor - 2;
                    return (octave * whiteKeyWidth * 7) + 3 * whiteKeyWidth + ((index + 1) * upperPartWhiteWidth) + (index * blackKeyWidth)
                  }
                }
              })();
              const style = key.keyColor === 'white' ? {
                width: `${whiteKeyWidth}px`,
                left: `${keyPosition}px`
              } : {
                width: `${blackKeyWidth}px`,
                left: `${keyPosition}px`
              };
              const pressed = keyState?.some(value => value.noteNumber === index)
              const className = [
                key.keyColor,
                pressed ? 'pressed' : '',
                target.find(value => value === index) ? 'target' : ''
              ].join(' ');
              return <li key={index} className={className} style={style}>{index}</li>
            })
          }
        </ol>
      </section>
    </>
  );
}

export default MidiOutputStatusDisplay;
