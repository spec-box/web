import { useCallback, MouseEvent, KeyboardEvent } from "react";

export interface MousePressEvent {
  type: "mouse";
  source: MouseEvent;
}

export interface KeyboardPressEvent {
  type: "keyboard";
  source: KeyboardEvent;
}

export type PressEvent = MousePressEvent | KeyboardPressEvent;

export const usePress = (onPress?: (e: PressEvent) => void) => {
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        onPress?.({ type: "keyboard", source: e });
      }
    },
    [onPress]
  );

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      // отменяем действие, чтобы список не скроллился при нажатии на пробел
      e.preventDefault();
    }
  }, []);

  const onClick = useCallback(
    (e: MouseEvent) => onPress?.({ type: "mouse", source: e }),
    [onPress]
  );

  return { onKeyUp, onKeyDown, onClick, tabIndex: 0 };
};
