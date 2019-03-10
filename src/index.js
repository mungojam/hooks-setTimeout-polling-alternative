import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const defaultDelay = 1000;

  const [startedCount, setStartedCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [delay, setDelay] = useState(defaultDelay);

  useRelaxedInterval(async () => {
    setStartedCount(count => count + 1);
    await fetch(
      "https://www.mocky.io/v2/5c83f73e3000004b256b0d6a?mocky-delay=1500ms"
    );
    setFinishedCount(count => count + 1);
  }, delay);

  const onStart = () => {
    setDelay(defaultDelay);
  };

  const onStop = () => {
    setDelay(null);
  };

  return (
    <>
      <h1>Started: {startedCount}</h1>
      <h1>Finished: {finishedCount}</h1>
      <button disabled={delay == null} onClick={onStop}>
        Stop
      </button>
      <button disabled={delay != null} onClick={onStart}>
        Start
      </button>
    </>
  );
}

function useRelaxedInterval(callback, delay) {
  const savedCallback = useRef();
  const [toggle, setToggle] = useState(false);

  useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback]
  );

  useEffect(
    () => {
      const tick = async () => {
        await savedCallback.current();
        setToggle(!toggle);
      };

      if (delay !== null) {
        const timeout = setTimeout(tick, delay);
        return () => clearTimeout(timeout);
      }
    },
    [delay, toggle]
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);
