import React, { useRef, useState, useEffect } from "react";
import { Note } from "@jonathanhunsucker/music-js";
import { Gain, Envelope, Wave, silentPingToWakeAutoPlayGates } from "@jonathanhunsucker/audio-js";
import Keyboard from "./Keyboard.js";
import "./App.css";

class Mapping {
  constructor(mapping) {
    this.mapping = mapping;
  }
  contains(code) {
    return this.mapping.hasOwnProperty(code);
  }
  onPress(code) {
    if (this.contains(code) === false) {
      return;
    }

    const handler = this.mapping[code][0];
    handler();
  }
  onRelease(code) {
    if (this.contains(code) === false) {
      return;
    }

    const handler = this.mapping[code][1];
    handler();
  }
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

function useKeyboardMonitor(onPress, onRelease) {
  const [keysDownCurrently, setKeysDownCurrently] = useState([]);

  const down = (event) => {
    if (event.repeat === true || event.altKey === true || event.ctrlKey === true || event.metaKey === true) {
      return;
    }

    setKeysDownCurrently(k => k.concat([event.code]));
    onPress(event.code);
  };

  const up = (event) => {
    setKeysDownCurrently(k => k.filter((code) => code !== event.code));
    onRelease(event.code);
  };

  useEffect(() => {
    document.addEventListener('keyup', up);
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keyup', up);
      document.removeEventListener('keydown', down);
    };
  });

  return keysDownCurrently;
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
  const [shift, setShift] = useState(0);

  const translate = (note) => {
    return Note.fromStepsFromMiddleA(note.stepsFromMiddleA + shift);
  };

  const handlePress = (note) => {
    return () => {
      press(translate(note));
    };
  };

  const handleRelease = (note) => {
    return () => {
      release(translate(note));
    };
  };

  const mapping = new Mapping({
    'KeyZ': [handlePress(Note.fromStepsFromMiddleA(3)), handleRelease(Note.fromStepsFromMiddleA(3))],
    'KeyS': [handlePress(Note.fromStepsFromMiddleA(4)), handleRelease(Note.fromStepsFromMiddleA(4))],
    'KeyX': [handlePress(Note.fromStepsFromMiddleA(5)), handleRelease(Note.fromStepsFromMiddleA(5))],
    'KeyD': [handlePress(Note.fromStepsFromMiddleA(6)), handleRelease(Note.fromStepsFromMiddleA(6))],
    'KeyC': [handlePress(Note.fromStepsFromMiddleA(7)), handleRelease(Note.fromStepsFromMiddleA(7))],
    'KeyV': [handlePress(Note.fromStepsFromMiddleA(8)), handleRelease(Note.fromStepsFromMiddleA(8))],
    'KeyG': [handlePress(Note.fromStepsFromMiddleA(9)), handleRelease(Note.fromStepsFromMiddleA(9))],
    'KeyB': [handlePress(Note.fromStepsFromMiddleA(10)), handleRelease(Note.fromStepsFromMiddleA(10))],
    'KeyH': [handlePress(Note.fromStepsFromMiddleA(11)), handleRelease(Note.fromStepsFromMiddleA(11))],
    'KeyN': [handlePress(Note.fromStepsFromMiddleA(12)), handleRelease(Note.fromStepsFromMiddleA(12))],
    'KeyJ': [handlePress(Note.fromStepsFromMiddleA(13)), handleRelease(Note.fromStepsFromMiddleA(13))],
    'KeyM': [handlePress(Note.fromStepsFromMiddleA(14)), handleRelease(Note.fromStepsFromMiddleA(14))],
    'Comma': [handlePress(Note.fromStepsFromMiddleA(15)), handleRelease(Note.fromStepsFromMiddleA(15))],

    'KeyQ': [handlePress(Note.fromStepsFromMiddleA(15)), handleRelease(Note.fromStepsFromMiddleA(15))],
    'Digit2': [handlePress(Note.fromStepsFromMiddleA(16)), handleRelease(Note.fromStepsFromMiddleA(16))],
    'KeyW': [handlePress(Note.fromStepsFromMiddleA(17)), handleRelease(Note.fromStepsFromMiddleA(17))],
    'Digit3': [handlePress(Note.fromStepsFromMiddleA(18)), handleRelease(Note.fromStepsFromMiddleA(18))],
    'KeyE': [handlePress(Note.fromStepsFromMiddleA(19)), handleRelease(Note.fromStepsFromMiddleA(19))],
    'KeyR': [handlePress(Note.fromStepsFromMiddleA(20)), handleRelease(Note.fromStepsFromMiddleA(20))],
    'Digit5': [handlePress(Note.fromStepsFromMiddleA(21)), handleRelease(Note.fromStepsFromMiddleA(21))],
    'KeyT': [handlePress(Note.fromStepsFromMiddleA(22)), handleRelease(Note.fromStepsFromMiddleA(22))],
    'Digit6': [handlePress(Note.fromStepsFromMiddleA(23)), handleRelease(Note.fromStepsFromMiddleA(23))],
    'KeyY': [handlePress(Note.fromStepsFromMiddleA(24)), handleRelease(Note.fromStepsFromMiddleA(24))],
    'Digit7': [handlePress(Note.fromStepsFromMiddleA(25)), handleRelease(Note.fromStepsFromMiddleA(25))],
    'KeyU': [handlePress(Note.fromStepsFromMiddleA(26)), handleRelease(Note.fromStepsFromMiddleA(26))],
    'KeyI': [handlePress(Note.fromStepsFromMiddleA(27)), handleRelease(Note.fromStepsFromMiddleA(27))],

    'Minus': [() => setShift((s) => s - 12), () => {}],
    'Equal': [() => setShift((s) => s + 12), () => {}],
  });

  const keysDownCurrently = useKeyboardMonitor((code) => mapping.onPress(code), (code) => mapping.onRelease(code));

  return (
    <div className="App">
      <h1>Keyboard</h1>
      <p>Shift: {shift}</p>
      <Keyboard mapping={mapping} pressed={keysDownCurrently} />
    </div>
  );
}

export default App;
