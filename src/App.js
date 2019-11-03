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

function Keyboard(props) {
  function key(label, code, span) {
    span = span || 3;
    return <td colSpan={span}>{props.pressed.indexOf(code) !== -1 ? <b>{label}</b> : (label)}</td>;
  }

  return (
    <table>
      <tbody>
        <tr>
          {key("`", "Backquote")}
          {key("1", "Digit1")}
          {key("2", "Digit2")}
          {key("3", "Digit3")}
          {key("4", "Digit4")}
          {key("5", "Digit5")}
          {key("6", "Digit6")}
          {key("7", "Digit7")}
          {key("8", "Digit8")}
          {key("9", "Digit9")}
          {key("0", "Digit0")}
          {key("-", "Minus")}
          {key("=", "Equal")}
          {key("delete", "Backspace")}
        </tr>
        <tr>
          {key("tab", "Tab", 4)}
          {key("q", "KeyQ")}
          {key("w", "KeyW")}
          {key("e", "KeyE")}
          {key("r", "KeyR")}
          {key("t", "KeyT")}
          {key("y", "KeyY")}
          {key("u", "KeyU")}
          {key("i", "KeyI")}
          {key("o", "KeyO")}
          {key("p", "KeyP")}
          {key("[", "BracketLeft")}
          {key("]", "BracketRight")}
          {key("\\", "Backslash")}
        </tr>
        <tr>
          {key("caps lock", "", 5)}
          {key("a", "KeyA")}
          {key("s", "KeyS")}
          {key("d", "KeyD")}
          {key("f", "KeyF")}
          {key("g", "KeyG")}
          {key("h", "KeyH")}
          {key("j", "KeyJ")}
          {key("k", "KeyK")}
          {key("l", "KeyL")}
          {key(";", "Semicolon")}
          {key("&#39;", "Quote")}
          {key("return", "Enter")}
        </tr>
        <tr>
          {key("shift", "ShiftLeft", 6)}
          {key("z", "KeyZ")}
          {key("x", "KeyX")}
          {key("c", "KeyC")}
          {key("v", "KeyV")}
          {key("b", "KeyB")}
          {key("n", "KeyN")}
          {key("m", "KeyM")}
          {key(",", "Comma")}
          {key(".", "Period")}
          {key("/", "Slash")}
          {key("shift", "ShiftRight", 6)}
        </tr>
        <tr>
          {key("control", "ControlLeft")}
          {key("alt", "AltLeft")}
          {key("cmd", "MetaLeft")}
          {key("space", "Space", 16)}
          {key("cmd", "MetaRight")}
          {key("option", "AltRight")}
          {key("left", "ArrowLeft")}
          {key("down", "ArrowDown")}
          {key("up", "ArrowUp")}
          {key("right", "ArrowRight")}
        </tr>
      </tbody>
    </table>
  );
}

function useKeyboardMonitor(onPress, onRelease) {
  const [keysDownCurrently, setKeysDownCurrently] = useState([]);

  const down = (event) => {
    if (event.repeat === true || event.altKey === true || event.ctrlKey === true || event.metaKey === true) {
      return;
    }

    setKeysDownCurrently(keysDownCurrently.concat([event.code]));
    onPress(event.code);
  };

  const up = (event) => {
    setKeysDownCurrently(keysDownCurrently.filter((code) => code !== event.code));
    onRelease(event.code);
  };

  useEffect(() => {
    document.addEventListener('keyup', up);
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keyup', up);
      document.removeEventListener('keydown', down);
    };
  }, []);// bad practice to tell react not to teardown this effect, but with teardown, some key events are missed

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

  const onPress = (code) => {
    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    press(Note.fromStepsFromMiddleA(steps));
  };

  const onRelease = (code) => {
    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    release(Note.fromStepsFromMiddleA(steps));
  };

  const keysDownCurrently = useKeyboardMonitor(onPress, onRelease);

  return (
    <div className="App">
      <h1>Keyboard</h1>
      <Keyboard pressed={keysDownCurrently} />
    </div>
  );
}

export default App;
