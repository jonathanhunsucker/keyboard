import React from "react";

import { Wave, Gain, Envelope } from "@jonathanhunsucker/audio-js";

function WaveControls(wave) {
  return (
    <React.Fragment>
      <label htmlFor="type">Type</label>:{' '}
      <select value={wave.type} readOnly>
        <option value="triangle">Triangle</option>
        <option value="sine">Sine</option>
        <option value="square">Square</option>
      </select>
    </React.Fragment>
  );
}

function EnvelopeControls(envelope) {
  return (
    <React.Fragment>
      <label htmlFor="attack">Attack</label>:{' '}
      <input id="attack" name="attack" type="range"  value={envelope.attack} readOnly min="0" step="0.01" max="1" />
      <br />
      <label htmlFor="decay">Decay</label>:{' '}
      <input id="decay" name="decay" type="range" value={envelope.decay} readOnly min="0" step="0.01" max="1" />
      <br />
      <label htmlFor="sustain">Sustain</label>:{' '}
      <input id="sustain" name="sustain" type="range" value={envelope.sustain} readOnly min="0" step="0.01" max="1" />
      <br />
      <label htmlFor="Release">Release</label>:{' '}
      <input id="release" name="release" type="range" value={envelope.release} readOnly min="0" step="0.01" max="1" />
    </React.Fragment>
  );
}

function UnknownControls(unknown) {
  return "Unknown controls";
}

function ControlsDelegate(stage) {
  switch (stage.kind) {
    case Wave.kind:
      return WaveControls(stage);
    case Envelope.kind:
      return EnvelopeControls(stage);
    default:
      return UnknownControls(stage);
  }
}

function Stage(stage) {
  return (
    <form>
      <fieldset>
        <legend style={{textTransform: "capitalize"}}>{stage.kind}</legend>
        {ControlsDelegate(stage)}
      </fieldset>
    </form>
  );
}

function StageTree(stage) {
  return (
    <React.Fragment>
      {stage.upstreams &&
        <React.Fragment>
          {stage.upstreams.map((upstream, index) => {
            return <React.Fragment key={index}>{StageTree(upstream)}</React.Fragment>;
          })}
          <center>⟱</center>
        </React.Fragment>
      }
      {Stage(stage.toJSON())}
    </React.Fragment>
  );
}

export default function Patch(props) {
  return StageTree(props.patch);
}
