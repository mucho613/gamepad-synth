import React from 'react';
import { getButtonNameByButtonIndex } from '../../functions/gamepad';
import { AxisState, KeyPressedState } from '../../types/gamepad';
import './index.scss';

type Props = {
  deviceName: string;
  keyPressedStatus: KeyPressedState[];
  axisStatus: AxisState[];
}

function GamepadStatusDisplay(props: Props) {
  const { deviceName, keyPressedStatus, axisStatus } = props;

  const merged = (keyPressedStatus: KeyPressedState[], index: number, classes?: string[]) =>
    [
      ...(classes ?? []),
      'button',
      keyPressedStatus[index]?.pressed ? 'pressed' : ''
    ].join(' ');

  return (
    <section className='monitor'>
      <h3>Device Name</h3>
      <p>{deviceName}</p>

      {keyPressedStatus &&
        <div className='gamepad-status'>
          <div className="shoulder-buttons left">
            <div className={merged(keyPressedStatus, 6)}>LT</div>
            <div className={merged(keyPressedStatus, 4)}>LB</div>
          </div>
          <div className="shoulder-buttons right">
            <div className={merged(keyPressedStatus, 7)}>RT</div>
            <div className={merged(keyPressedStatus, 5)}>RB</div>
          </div>
          <div className="cluster-buttons left">
            <div className={merged(keyPressedStatus, 12, ['top'])}></div>
            <div className={merged(keyPressedStatus, 13, ['bottom'])}></div>
            <div className={merged(keyPressedStatus, 14, ['left'])}></div>
            <div className={merged(keyPressedStatus, 15, ['right'])}></div>
            <div className={'button center'}></div>
          </div>
          <div className="cluster-buttons right">
            <div className={merged(keyPressedStatus, 0, ['bottom'])}>A</div>
            <div className={merged(keyPressedStatus, 1, ['right'])}>B</div>
            <div className={merged(keyPressedStatus, 2, ['left'])}>X</div>
            <div className={merged(keyPressedStatus, 3, ['top'])}>Y</div>
          </div>
        </div>
      }

      <ul className='key-status'>
        {[
          ...keyPressedStatus?.filter(keyState => keyState.pressed).map(keyState => {
            const buttonName = getButtonNameByButtonIndex(keyState.button);
            return <li key={keyState.button}>{buttonName}</li>
          }),
        ]}
      </ul>
    </section>
  );
}

export default GamepadStatusDisplay;
