import React, { useRef, useState, useEffect } from "react";

function codeToColor(mapping, pressed, code) {
  if (code === null) {
    return "transparent";
  }

  if (mapping.contains(code) === false) {
    return "lightgrey";
  }

  if (pressed.indexOf(code) === -1) {
    return "grey";
  }

  return "black";
}

function label(mapping, pressed, code) {
  if (mapping.contains(code) === false) {
    return "";
  }

  if (pressed.indexOf(code) === -1) {
    return mapping.label(code);
  }

  return <b>{mapping.label(code)}</b>;
}

function key(code, span) {
  return {
    code: code,
    span: span || 1,
  };
}

function offset(span) {
  return key(null, span);
}

function square(mapping, pressed, onPress, onRelease, key) {
  const basis = 7;// TODO dynamica calculation
  const width = key.span * basis;

  const onPointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    onPress(key.code);
  };

  const onPointerUp = (e) => {
    onRelease(key.code);
  };

  const onPointerCancel = (e) => {
    onRelease(key.code);
  };

  return (
    <div
      key={key.code}
      style={{
        background: codeToColor(mapping, pressed, key.code),
        float: "left",
        color: "white",
        display: "inline-block",
        fontSize: `${basis/2}vw`,
        minWidth: `${width}vw`,
        lineHeight: `${basis}vw`,
        minHeight: `${basis}vw`,
        margin: "0.1vw",
        textAlign: "center",
        verticalAlign: "middle",
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      >
      {label(mapping, pressed, key.code)}
    </div>
  );
}

export default function Keyboard(props) {
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
    <div>
      {layout.map((row, i) => {
        return (
          <div key={i} style={{overflow: "auto", with: "100%"}}>
            {row.map((item, j) => {
              return square(props.mapping, props.pressed, props.onPress, props.onRelease, item);
            })}
          </div>
        );
      })}
    </div>
  );
}

