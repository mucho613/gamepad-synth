import { useCallback, useEffect, useRef } from "react";

import { AxisEvent, ButtonPressedEvent, ButtonReleasedEvent, GamepadEvent } from '../types/gamepad';

export type Props = {
  onInput: (event: GamepadEvent) => void,
}

export const threthold = 0.1;

export const primaryGamepadIndex = 0 as const;

export const useGamepad = (props: Props) => {
  const requestRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const buttonPressedRef = useRef<boolean[]>([]);
  const axisRef = useRef<number[]>([]);

  const animate = useCallback(() => {
    const gamepad = navigator.getGamepads()[primaryGamepadIndex];

    if (gamepad) {
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed !== buttonPressedRef.current[index]) {
          const event: ButtonPressedEvent | ButtonReleasedEvent = {
            type: button.pressed ? 'buttonpressed' : 'buttonreleased',
            target: {
              index,
              button
            },
            gamepad
          };

          props.onInput(event);
        }
      });
      buttonPressedRef.current = gamepad.buttons.map(button => button.pressed);

      gamepad.axes.forEach((axis, index) => {
        if (axis !== axisRef.current[index]) {
          const event: AxisEvent = {
            type: 'axis',
            target: {
              index,
              value: axis
            },
            gamepad,
          }

          props.onInput(event);
        }
      });
      axisRef.current = gamepad.axes.map(axis => axis);
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [props]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        return cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
}
