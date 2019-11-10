import React from "react";

import { Wave, Gain, Envelope } from "@jonathanhunsucker/audio-js";

function WaveControls(wave, handleControlChange) {
  return (
    <React.Fragment>
      <label htmlFor="type">Type</label>:{' '}
      <select name="type" id="type" value={wave.type} onChange={(e) => handleControlChange(e.target.name, e.target.value)}>
        <option value="triangle">Triangle</option>
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
      </select>
    </React.Fragment>
  );
}

function EnvelopeControls(envelope, handleControlChange) {
  const handleChange = (e) => {
    handleControlChange(e.target.name, e.target.valueAsNumber);
  };

  return (
    <React.Fragment>
      <label htmlFor="attack">Attack</label>:{' '}
      <input
        id="attack"
        name="attack"
        type="range"
        value={envelope.attack}
        onChange={handleChange}
        min="0" step="0.01" max="1"
      />
      <br />
      <label htmlFor="decay">Decay</label>:{' '}
      <input
        id="decay"
        name="decay"
        type="range"
        value={envelope.decay}
        onChange={handleChange}
        min="0" step="0.01" max="1"
      />
      <br />
      <label htmlFor="sustain">Sustain</label>:{' '}
      <input
        id="sustain"
        name="sustain"
        type="range"
        value={envelope.sustain}
        onChange={handleChange}
        min="0" step="0.01" max="1"
      />
      <br />
      <label htmlFor="Release">Release</label>:{' '}
      <input
        id="release"
        name="release"
        type="range"
        value={envelope.release}
        onChange={handleChange}
        min="0" step="0.01" max="1"
      />
    </React.Fragment>
  );
}

function UnknownControls(unknown) {
  return "Unknown controls";
}

function ControlsDelegate(stage, handleControlChange) {
  switch (stage.kind) {
    case Wave.kind:
      return WaveControls(stage, handleControlChange);
    case Envelope.kind:
      return EnvelopeControls(stage, handleControlChange);
    default:
      return UnknownControls(stage, handleControlChange);
  }
}

function Stage(stage, setStage) {
  const handleControlChange = (name, value) => {
    const updated = stage.constructor.parse(Object.assign({}, stage.toJSON(), {[name]: value}));
    setStage(updated);
  };

  return (
    <form>
      <fieldset>
        <legend style={{textTransform: "capitalize"}}>{stage.toJSON().kind}</legend>
        {ControlsDelegate(stage.toJSON(), handleControlChange)}
      </fieldset>
    </form>
  );
}

function StageTree(stage, setStage) {
  const rewriteUpstream = (updated, index) => {
    const json = stage.toJSON();
    json.upstreams[index] = updated.toJSON();
    const rewritten = stage.constructor.parse(json);
    setStage(rewritten);
  };

  const rewriteStage = (updated) => {
    setStage(updated);
  };

  return (
    <React.Fragment>
      {stage.upstreams &&
        <React.Fragment>
          {stage.upstreams.map((upstream, index) => {
            return <React.Fragment key={index}>
              {StageTree(upstream, (updated) => rewriteUpstream(updated, index))}
            </React.Fragment>;
          })}
        </React.Fragment>
      }
      {Stage(stage, (updated) => rewriteStage(updated))}
    </React.Fragment>
  );
}

export default function Patch(props) {
  return StageTree(props.patch, props.setPatch);
}
