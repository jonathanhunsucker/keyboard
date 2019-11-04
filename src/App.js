import React, { useRef, useState, useEffect } from "react";
import { Note } from "@jonathanhunsucker/music-js";
import { Gain, Envelope, Wave, silentPingToWakeAutoPlayGates } from "@jonathanhunsucker/audio-js";
import "./App.css";

function keyCodeToNote(code) {
  const mapping = {
    'KeyZ': Note.fromStepsFromMiddleA(3),
    'KeyS': Note.fromStepsFromMiddleA(4),
    'KeyX': Note.fromStepsFromMiddleA(5),
    'KeyD': Note.fromStepsFromMiddleA(6),
    'KeyC': Note.fromStepsFromMiddleA(7),
    'KeyV': Note.fromStepsFromMiddleA(8),
    'KeyG': Note.fromStepsFromMiddleA(9),
    'KeyB': Note.fromStepsFromMiddleA(10),
    'KeyH': Note.fromStepsFromMiddleA(11),
    'KeyN': Note.fromStepsFromMiddleA(12),
    'KeyJ': Note.fromStepsFromMiddleA(13),
    'KeyM': Note.fromStepsFromMiddleA(14),

    'KeyQ': Note.fromStepsFromMiddleA(15),
    'Digit2': Note.fromStepsFromMiddleA(16),
    'KeyW': Note.fromStepsFromMiddleA(17),
    'Digit3': Note.fromStepsFromMiddleA(18),
    'KeyE': Note.fromStepsFromMiddleA(19),
    'KeyR': Note.fromStepsFromMiddleA(20),
    'Digit5': Note.fromStepsFromMiddleA(21),
    'KeyT': Note.fromStepsFromMiddleA(22),
    'Digit6': Note.fromStepsFromMiddleA(23),
    'KeyY': Note.fromStepsFromMiddleA(24),
    'Digit7': Note.fromStepsFromMiddleA(25),
    'KeyU': Note.fromStepsFromMiddleA(26),
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
  function codeToColor(code) {
    if (code === null) {
      return "transparent";
    }

    if (keyCodeToNote(code) === false) {
      return "lightgrey";
    }

    if (props.pressed.indexOf(code) === -1) {
      return "grey";
    }

    return "black";
  }

  function asdf(code, label) {
    if (keyCodeToNote(code) === false) {
      return "";
    }

    if (props.pressed.indexOf(code) === -1) {
      return label;
    }

    return <b>{label}</b>;
  }

  function key(label, code, span) {
    span = span || 1;
    const basis = 6;
    const width = span * basis;

    return (
      <div style={{
        background: codeToColor(code),
        float: "left",
        color: "white",
        display: "inline-block",
        minWidth: `${width}vw`,
        lineHeight: `${width}vw`,
        minHeight: `${basis}vw`,
        margin: "0.1vw",
        textAlign: "center",
        verticalAlign: "middle",
      }}>
        {asdf(code, label)}
      </div>
    );
  }

  return (
    <div>
      <div style={{overflow: "auto", with: "100%"}}>
        {key("`", null && "Backquote")}
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
        {key("delete", null && "Backspace", 1.5)}
      </div>
      <div style={{overflow: "auto", with: "100%"}}>
        {key("tab", null && "Tab", 1.5)}
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
        {key("\\", null && "Backslash")}
      </div>
      <div style={{overflow: "auto", with: "100%"}}>
        {key("caps lock", null && "", 1.8)}
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
        {key("return", null && "Enter", 1.8)}
      </div>
      <div style={{overflow: "auto", with: "100%"}}>
        {key("shift", null && "ShiftLeft", 2)}
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
        {key("shift", null && "ShiftRight", 2.7)}
      </div>
    </div>
  );

  /*
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
  */
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
    const note = keyCodeToNote(event.code);
    if (note === false) {
      return;
    }

    press(note);
  };

  const onRelease = (code) => {
    const note = keyCodeToNote(event.code);
    if (note === false) {
      return;
    }

    release(note);
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
