import React, { Component } from "react";
import { Note } from "@jonathanhunsucker/music-js";
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
    'Key2': 16,
    'KeyW': 17,
    'Key3': 18,
    'KeyE': 19,
    'KeyR': 20,
    'Key5': 21,
    'KeyT': 22,
    'Key6': 23,
    'KeyY': 24,
    'Key7': 25,
    'KeyU': 26,
  };

  if (mapping.hasOwnProperty(code) === false) {
    return false;
  }

  return mapping[code];
}

function App() {
  const down = (event) => {
    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    console.dir(Note.fromStepsFromMiddleA(steps));
  };

  const up = (event) => {
    const steps = keyCodeToStepsFromMiddleA(event.code);
    if (steps === false) {
      return;
    }

    console.dir(Note.fromStepsFromMiddleA(steps));
  };

  document.addEventListener('keydown', down);
  document.addEventListener('keyup', up);

  return (
    <div className="App">
      <h1>hello world</h1>
    </div>
  );
}

export default App;
