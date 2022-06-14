import { useRef, useState } from "react";

export default function useLongPress(
  { handleModal } = {},
  { handleModalParticipation } = {},
  { handleBonus } = {},
  { handleAvertissement } = {}
) {
  const [action, setAction] = useState(null);
  const timerRef = useRef();
  const isLongPress = useRef(false);

  const handleOnMouseDown = () => {
    startPressTimer();
  };

  const handleOnMouseUp = () => {
    clearTimeout(timerRef.current);
  };

  const handleOnTouchStart = () => {
    startPressTimer();
  };

  const handleOnTouchEnd = () => {
    clearTimeout(timerRef.current);
  };

  const startPressTimer = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      setAction("press");
      isLongPress.current = true;
    }, 500);
  };

  const handleOnClick = (event, eleve, note) => {
    // event.preventDefault();
    if (isLongPress.current) {
      if (eleve[note] > 0) {
        if (
          typeof handleModal === "function" &&
          typeof handleModalParticipation === "function" && note === 'participation'
        ) {
          handleModalParticipation(eleve);
          handleModal(true);
        }
        if (note === 'bonus' || note === 'avertissement'
        ) {
          eleve[note] = eleve[note] - 1;
        }
      }
    //   console.log("its a long press!");
      return;
    }
    // console.log("its a short click!");
    setAction("click");
    if (!eleve.empty) eleve[note] = eleve[note] + 1;
  };
  return {
    action,
    handlers: {
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchEnd: handleOnTouchEnd,
      onTouchStart: handleOnTouchStart,
      onClick: handleOnClick,
    },
  };
}
