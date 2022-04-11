import React from 'react';
import { getButtonNameByButtonIndex } from '../../functions/gamepad';
import { AxisState, KeyPressedState } from '../../types/gamepad';
import './index.scss';

type Props = {
  keyPressedStatus: KeyPressedState[];
  axisStatus: AxisState[];
}

function GamepadStatusDisplay(props: Props) {
  const { keyPressedStatus, axisStatus } = props;

  const octaveOffset =
    (keyPressedStatus[4]?.pressed ? 1 : 0) +
    (keyPressedStatus[6]?.pressed ? -1 : 0);
  const semitoneOffset =
    (keyPressedStatus[5]?.pressed ? 1 : 0) +
    (keyPressedStatus[7]?.pressed ? -1 : 0);

  return (
    <section className='monitor'>
      <ul className='note-status'>
        <li className={octaveOffset ? 'active' : ''}>
          Octave Shift
          <span>{octaveOffset}</span>
        </li>
        <li className={semitoneOffset ? 'active' : ''}>
          Semitone Shift
          <span>{semitoneOffset}</span>
        </li>
      </ul>
      <ul className='key-status'>
        {[
          ...keyPressedStatus?.map(keyState => {
            const buttonName = getButtonNameByButtonIndex(keyState.button);
            return <li key={keyState.button} className={keyState.pressed ? 'pressed' : ''}>{buttonName}</li>
          }),
          ...axisStatus?.map(axisState => <li key={`axis`}>{axisState.value}</li>)
        ]}
      </ul>
    </section>
  );
}

export default GamepadStatusDisplay;
