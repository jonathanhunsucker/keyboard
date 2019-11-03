import React, { useRef, useState, useEffect } from "react";
import { Note } from "@jonathanhunsucker/music-js";
import { Gain, Envelope, Wave, silentPingToWakeAutoPlayGates } from "@jonathanhunsucker/audio-js";
import "./App.css";

function keyCodeToStepsFromMiddleA(code) {
  const mapping = {
    'KeyZ': 3,
    'KeyS': 4,
    'KeyX': 5,
    'KeyD': 6,
    'KeyC': 7,
    'KeyV': 8,
    'KeyG': 9,
    'KeyB': 10,
    'KeyH': 11,
    'KeyN': 12,
    'KeyJ': 13,
    'KeyM': 14,

    'KeyQ': 15,
    'Digit2': 16,
    'KeyW': 17,
    'Digit3': 18,
    'KeyE': 19,
    'KeyR': 20,
    'Digit5': 21,
    'KeyT': 22,
    'Digit6': 23,
    'KeyY': 24,
    'Digit7': 25,
    'KeyU': 26,
  };

  if (mapping.hasOwnProperty(code) === false) {
    return false;
  }

  return mapping[code];
}

function useAudioContext() {
  const context = new (window.webkitAudioContext || window.AudioContext)();
  const ref = useRef(context);
  return ref.current;
}

function useKeyboard(audioContext, voice) {
  const pressed = useRef([]);

  const press = (note) => {
    const binding = voice.bind(note.frequency);
    binding.play(audioContext, audioContext.destination);
    pressed.current.push([note.pitch, binding]);
  };

  const release = (note) => {
    const candidates = pressed.current.filter((pair) => pair[0] === note.pitch);
    candidates[0][1].stop(audioContext);
    pressed.current = pressed.current.filter((pair) => pair[0] !== note.pitch);
  };

  return [
    pressed.current,
    press,
    release,
  ]
}

function App() {
  const voice = new Gain(
    .1,
    [
      new Envelope(
        {},
        [
          new Wave('triangle'),
        ],
      ),
    ]
  );

  const audioContext = useAudioContext();
  const [pressed, press, release] = useKeyboard(audioContext, voice);

  const down = (event) => {
    if (event.repeat === true) {
      return;
    }

    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    press(Note.fromStepsFromMiddleA(steps));
  };

  const up = (event) => {
    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    release(Note.fromStepsFromMiddleA(steps));
  };

  useEffect(() => {
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);

    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  });

  return (
    <div className="App">
      <h1>Keyboard</h1>
    </div>
  );
}

export default App;
