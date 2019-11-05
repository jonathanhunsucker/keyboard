import React, { useRef, useState, useEffect } from "react";
import { Note } from "@jonathanhunsucker/music-js";
import { Gain, Envelope, Wave, silentPingToWakeAutoPlayGates } from "@jonathanhunsucker/audio-js";
import Keyboard from "./Keyboard.js";
import { Mapping, Handler } from "./KeyCommand.js";
import "./App.css";

class Timer {
  constructor(name, startedAt) {
    this.name = name;
    this.startedAt = startedAt;
  }
  static start(name) {
    return new Timer(name, Date.now());
  }
  get elapsed() {
    return Date.now() - this.startedAt;
  }
  record() {
    console.log(`${this.name} took ${this.elapsed}`);
  }
}

function useAudioContext() {
  const context = new (window.webkitAudioContext || window.AudioContext)();
  const ref = useRef(context);
  return ref.current;
}

function useKeyboard(audioContext, voice) {
  const [pressed, setPressed] = useState([]);

  const press = (note) => {
    const binding = voice.bind(note.frequency);
    binding.play(audioContext, audioContext.destination);
    setPressed((p) => p.concat([[note.pitch, binding]]));
  };

  const release = (note) => {
    setPressed((p) => {
      return p.filter((pair) => pair[0] !== note.pitch);
    });
    const candidates = pressed.filter((pair) => pair[0] === note.pitch);
    candidates[0][1].stop(audioContext);
  };

  return [
    pressed,
    press,
    release,
  ]
}

function useKeyboardMonitor(onPress, onRelease) {
  const [keysDownCurrently, setKeysDownCurrently] = useState([]);

  const onPressReference = useRef(onPress);
  const onReleaseReference = useRef(onRelease);

  useEffect(() => {
    onPressReference.current = onPress;
    onReleaseReference.current = onRelease;
  });

  const down = (event) => {
    if (event.repeat === true || event.altKey === true || event.ctrlKey === true || event.metaKey === true) {
      return;
    }

    setKeysDownCurrently(k => k.concat([event.code]));
    onPressReference.current(event.code);
  };

  const up = (event) => {
    setKeysDownCurrently(k => k.filter((code) => code !== event.code));
    onReleaseReference.current(event.code);
  };

  useEffect(() => {
    document.addEventListener('keyup', up);
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keyup', up);
      document.removeEventListener('keydown', down);
    };
  }, []);

  return keysDownCurrently;
}

function App() {
  const [level, setLevel] = useState(0.1);

  const voice = new Gain(
    level,
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

  const noteHandler = (note) => new Handler(translate(note).pitch, handlePress(note), handleRelease(note));
  const actionHandler = (action, label) => new Handler(label, action, () => {});

  const mapping = new Mapping({
    'KeyZ': noteHandler(Note.fromStepsFromMiddleA(3)),
    'KeyS': noteHandler(Note.fromStepsFromMiddleA(4)),
    'KeyX': noteHandler(Note.fromStepsFromMiddleA(5)),
    'KeyD': noteHandler(Note.fromStepsFromMiddleA(6)),
    'KeyC': noteHandler(Note.fromStepsFromMiddleA(7)),
    'KeyV': noteHandler(Note.fromStepsFromMiddleA(8)),
    'KeyG': noteHandler(Note.fromStepsFromMiddleA(9)),
    'KeyB': noteHandler(Note.fromStepsFromMiddleA(10)),
    'KeyH': noteHandler(Note.fromStepsFromMiddleA(11)),
    'KeyN': noteHandler(Note.fromStepsFromMiddleA(12)),
    'KeyJ': noteHandler(Note.fromStepsFromMiddleA(13)),
    'KeyM': noteHandler(Note.fromStepsFromMiddleA(14)),
    'Comma': noteHandler(Note.fromStepsFromMiddleA(15)),

    'KeyQ': noteHandler(Note.fromStepsFromMiddleA(15)),
    'Digit2': noteHandler(Note.fromStepsFromMiddleA(16)),
    'KeyW': noteHandler(Note.fromStepsFromMiddleA(17)),
    'Digit3': noteHandler(Note.fromStepsFromMiddleA(18)),
    'KeyE': noteHandler(Note.fromStepsFromMiddleA(19)),
    'KeyR': noteHandler(Note.fromStepsFromMiddleA(20)),
    'Digit5': noteHandler(Note.fromStepsFromMiddleA(21)),
    'KeyT': noteHandler(Note.fromStepsFromMiddleA(22)),
    'Digit6': noteHandler(Note.fromStepsFromMiddleA(23)),
    'KeyY': noteHandler(Note.fromStepsFromMiddleA(24)),
    'Digit7': noteHandler(Note.fromStepsFromMiddleA(25)),
    'KeyU': noteHandler(Note.fromStepsFromMiddleA(26)),
    'KeyI': noteHandler(Note.fromStepsFromMiddleA(27)),

    'Minus': actionHandler(() => setShift((s) => s - 12), '-'),
    'Equal': actionHandler(() => setShift((s) => s + 12), '+'),
  });

  const keysDownCurrently = useKeyboardMonitor((code) => mapping.onPress(code), (code) => mapping.onRelease(code));

  return (
    <div className="App">
      <h1>Keyboard</h1>
      <p>Shift: {shift}</p>
      <p>Level: <input type="range" min="0" step="0.01" max="1.0" value={level} onChange={(e) => {setLevel(e.target.valueAsNumber)}} /></p>
      <Keyboard mapping={mapping} pressed={keysDownCurrently} />
    </div>
  );
}

export default App;
