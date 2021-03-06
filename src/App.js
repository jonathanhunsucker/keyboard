import React, { useRef, useState, useEffect } from "react";

import { Note } from "@jonathanhunsucker/music-js";
import { Gain, Envelope, Wave, silentPingToWakeAutoPlayGates } from "@jonathanhunsucker/audio-js";

import { key, offset, Keyboard } from "./Keyboard.js";
import Patch from "./Patch.js";
import { Mapping, Handler } from "./KeyCommand.js";
import useKeystrokeMonitor from "./useKeystrokeMonitor.js";
import useSet from "./useSet.js";
import useDestructiveReadMap from "./useDestructiveReadMap.js";

import "./App.css";

function removeFirst(criteria) {
  var hasRemoved = false;
  return (item) => {
    const shouldRemove = criteria(item);
    if (shouldRemove === true && hasRemoved === false) {
      hasRemoved = true;
      return false;
    }

    return true;
  };
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
    const pitchMatches = (pair) => pair[0] === note.pitch;

    setPressed((p) => {
      const candidates = p.filter(pitchMatches);
      if (candidates.length > 0) {
        candidates[0][1].stop(audioContext);
      }
      return p.filter(removeFirst(pitchMatches));
    });
  };

  return [
    pressed,
    press,
    release,
  ];
}

function App() {
  const [level, setLevel] = useState(0.1);

  const [patch, setPatch] = useState(
    new Envelope(
      {},
      [
        new Wave('triangle'),
      ],
    )
  );

  const voice = new Gain(
    level,
    [
      patch,
    ]
  );

  const audioContext = useAudioContext();
  const [pressed, press, release] = useKeyboard(audioContext, voice);
  const [shift, setShift] = useState(0);
  const [mod, setMod] = useState(false);

  const nudgeSize = mod ? 1 : 12;

  const translate = (note) => {
    return Note.fromStepsFromMiddleA(note.stepsFromMiddleA + shift);
  };

  const noteHandler = (note) => new Handler(translate(note).pitch, () => {
    press(translate(note));
    return () => {
      release(translate(note));
    };
  });

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

    'ShiftRight': new Handler('^', () => {
      setMod(true);
      return () => {
        setMod(false);
      };
    }),
    'Minus': new Handler(`-${nudgeSize}`, () => setShift((s) => s - nudgeSize)),
    'Equal': new Handler(`+${nudgeSize}`, () => setShift((s) => s + nudgeSize)),
  });

  const [keysDownCurrently, add, remove] = useSet([]);
  const [put, read] = useDestructiveReadMap({});

  const onPress = (code) => {
    add(code);
    put(code, mapping.onPress(code));
  };
  const onRelease = (code) => {
    remove(code);
    const handler = read(code);
    if (handler) {
      handler();
    }
  };

  useKeystrokeMonitor(onPress, onRelease);

  const layout = [
    [
      key("Digit1"),
      key("Digit2"),
      key("Digit3"),
      key("Digit4"),
      key("Digit5"),
      key("Digit6"),
      key("Digit7"),
      key("Digit8"),
      key("Digit9"),
      key("Digit0"),
      key("Minus"),
      key("Equal"),
    ],
    [
      offset(0.5),
      key("KeyQ"),
      key("KeyW"),
      key("KeyE"),
      key("KeyR"),
      key("KeyT"),
      key("KeyY"),
      key("KeyU"),
      key("KeyI"),
      key("KeyO"),
      key("KeyP"),
      key("BracketLeft"),
      key("BracketRight"),
    ],
    [
      offset(0.8),
      key("KeyA"),
      key("KeyS"),
      key("KeyD"),
      key("KeyF"),
      key("KeyG"),
      key("KeyH"),
      key("KeyJ"),
      key("KeyK"),
      key("KeyL"),
      key("Semicolon"),
      key("Quote"),
    ],
    [
      offset(1),
      key("KeyZ"),
      key("KeyX"),
      key("KeyC"),
      key("KeyV"),
      key("KeyB"),
      key("KeyN"),
      key("KeyM"),
      key("Comma"),
      key("Period"),
      key("Slash"),
      key("ShiftRight", 1.5),
    ],
  ];

  return (
    <div className="App">
      <h1>Keyboard</h1>
      <p>Shift: {shift}</p>
      <p>Level: <input type="range" min="0" step="0.01" max="1.0" value={level} onChange={(e) => {setLevel(e.target.valueAsNumber)}} /></p>
      <Keyboard layout={layout} mapping={mapping} pressed={keysDownCurrently} onPress={onPress} onRelease={onRelease} />
      <br />
      <Patch patch={patch} setPatch={setPatch} />
    </div>
  );
}

export default App;
