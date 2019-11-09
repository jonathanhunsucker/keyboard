import React, { useRef, useState, useEffect } from "react";

export default function Keyboard(props) {
  function codeToColor(code) {
    if (code === null) {
      return "transparent";
    }

    if (props.mapping.contains(code) === false) {
      return "lightgrey";
    }

    if (props.pressed.indexOf(code) === -1) {
      return "grey";
    }

    return "black";
  }

  function asdf(code, label) {
    if (props.mapping.contains(code) === false) {
      return "";
    }

    if (props.pressed.indexOf(code) === -1) {
      return label;
    }

    return <b>{label}</b>;
  }

  function key(label, code, span) {
    span = span || 1;
    const basis = 7;
    const width = span * basis;

    return (
      <div style={{
        background: codeToColor(code),
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
      }}>
        {asdf(code, props.mapping.label(code))}
      </div>
    );
  }

  return (
    <div>
      <div style={{overflow: "auto", with: "100%"}}>
        {null && key("`", null && "Backquote")}
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
        {null && key("delete", null && "Backspace", 1.5)}
      </div>
      <div style={{overflow: "auto", with: "100%"}}>
        {key("tab", null && "Tab", 0.5)}
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
        {null && key("\\", null && "Backslash")}
      </div>
      <div style={{overflow: "auto", with: "100%"}}>
        {key("caps lock", null && "", 0.8)}
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
        {null && key("return", null && "Enter", 1.8)}
      </div>
      <div style={{overflow: "auto", with: "100%"}}>
        {key("shift", null && "ShiftLeft", 1)}
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
        {key("shift", "ShiftRight", 1.5)}
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

