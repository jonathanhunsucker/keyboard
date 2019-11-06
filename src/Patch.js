import React from "react";

export default function Patch(props) {
  return (
    <div>i'm a patch whose final stage is of kind `{props.patch.constructor.name}`</div>
  );
}
