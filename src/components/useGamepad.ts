import { useCallback, useEffect, useRef } from "react";

export type Props = {
  onPressed: (index: number, array: boolean[]) => void,
  onReleased: (index: number, array: boolean[]) => void,
  onAxis: (value: number) => void;
}

export const threthold = 0.1;

export const useGamepad = (props: Props) => {
  const requestRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const buttonPressedRef = useRef<boolean[]>([]);
  const axisLStickYRef = useRef<number>(0);
  const axisRStickYRef = useRef<number>(0);

  const animate = useCallback(() => {
    const gamePad = navigator.getGamepads()[0];
    const buttonPressed = gamePad?.buttons.map(button => button.pressed);
    const axisLStickY = gamePad?.axes[1];
    const axisRStickY = gamePad?.axes[3];

    if (buttonPressed) {
      buttonPressed.forEach((button, index) => {
        if (button !== buttonPressedRef.current[index]) {
          button
            ? props.onPressed(index, buttonPressed)
            : props.onReleased(index, buttonPressed);
        }
      })
      buttonPressedRef.current = buttonPressed;
    }

    if (axisLStickY) {
      const modifiedValue = Math.abs(axisLStickY) < 0.2 ? 0 : axisLStickY;

      if (axisLStickYRef.current !== modifiedValue) {
        props.onAxis(modifiedValue);
        axisLStickYRef.current = modifiedValue;
      }
    }

    if (axisRStickY) {
      const modifiedValue = Math.abs(axisRStickY) < 0.2 ? 0 : axisRStickY;

      if (axisRStickYRef.current !== modifiedValue) {
        props.onAxis(modifiedValue);
        axisRStickYRef.current = modifiedValue;
      }
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
