import React from 'react';
import { getButtonNameByButtonIndex } from '../../logic/gamepad';
import { AxisState, KeyPressedState } from '../../types/gamepad';
import './GamePadStatusDisplay.scss';

type Props = {
  keyPressedStatus: KeyPressedState[];
  axisStatus: AxisState[];
}

function GamePadStatusDisplay(props: Props) {
  const { keyPressedStatus, axisStatus } = props;

  const octaveOffset =
    (keyPressedStatus[4]?.pressed ? 1 : 0) +
    (keyPressedStatus[6]?.pressed ? -1 : 0);
  const semitoneOffset =
    (keyPressedStatus[5]?.pressed ? 1 : 0) +
    (keyPressedStatus[7]?.pressed ? -1 : 0);

  return (
    <section className='monitor'>
      <h2>Button Status</h2>
      <ul className='note-status'>
        <li className={octaveOffset ? 'active' : ''}>
          OCTAVE
          <span>{octaveOffset}</span>
        </li>
        <li className={semitoneOffset ? 'active' : ''}>
          SEMITONE
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

export default GamePadStatusDisplay;
