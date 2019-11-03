import React, { useRef, useState } from "react";
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
  const [pressed, setPressed] = useState({});

  const press = (note) => {
    const binding = voice.bind(note.frequency);
    const addendum = {};
    addendum[note.pitch] = binding;
    const newSet = Object.assign({}, pressed, addendum);
    binding.play(audioContext, audioContext.destination);
    console.log('added binding for ' + note.pitch);
    setPressed(newSet);
  };

  const release = (note) => {
    if (pressed.hasOwnProperty(note.pitch) === false) {
      return;
    }

    const binding = pressed[note.pitch];
    binding.stop(audioContext);
    delete pressed[note.pitch];
    console.log('removed binding for ' + note.pitch);
    setPressed(pressed);
  };

  return [
    pressed,
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


  document.addEventListener('keydown', down);
  document.addEventListener('keyup', up);

  return (
    <div className="App">
      <h1>Keyboard</h1>
    </div>
  );
}

export default App;
