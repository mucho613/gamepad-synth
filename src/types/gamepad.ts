export type KeyPressedState = { button: number, pressed: boolean };
export type AxisState = { value: number };

export type GamepadEvent = ButtonPressedEvent | ButtonReleasedEvent | AxisEvent;
export type GamepadEventType = 'buttonpressed' | 'buttonreleased';

export type ButtonPressedEvent = {
  type: 'buttonpressed',
  target: {
    index: number,
    button: GamepadButton,
  },
  gamepad: Gamepad
}

export type ButtonReleasedEvent = {
  type: 'buttonreleased',
  target: {
    index: number,
    button: GamepadButton,
  },
  gamepad: Gamepad
}

export type AxisEvent = {
  type: 'axis',
  target: {
    index: number,
    value: number,
  }
  gamepad: Gamepad
}
