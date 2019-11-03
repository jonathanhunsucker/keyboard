import React, { useRef } from "react";
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

const context = new (window.webkitAudioContext || window.AudioContext)();

const voice = new Gain(
  1,
  [
    new Envelope(
      {},
      [
        new Wave('triangle'),
      ],
    ),
  ]
);

const set = {};

function App() {
  const audioContext = useAudioContext();

  const down = (event) => {
    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    const note = Note.fromStepsFromMiddleA(steps);
    const binding = voice.bind(note.frequency);
    set[event.code] = binding;
    binding.play(audioContext, audioContext.destination);
  };

  const up = (event) => {
    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    if (set.hasOwnProperty(event.code) === false) {
      return;
    }

    const binding = set[event.code];
    binding.stop(audioContext);
    delete set[event.code];
  };

  const click = (event) => {
    voice.press(context, new Note('C4').frequency);
  };

  document.addEventListener('keydown', down);
  document.addEventListener('keyup', up);

  return (
    <div className="App">
      <h1>Keyboard</h1>
    </div>
  );
}

export default App;
