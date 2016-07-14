import React, {Component} from "react";
import layerPanel from "../../styles/components/layerPanel.scss";

export default function (props) {
  let layers = [];
  if (props.layers) {
    for (let i = 0, length = props.layers.length; i < length; i++) {
      layers.push(
        <li key={i}>
          <label>
            <input type="checkbox" checked={props.layers[i].visible}
                   onChange={() => props.onToggle(props.layers[i])}></input>
            {props.layers[i].title}
          </label>
        </li>
      );
    }
  }
  return (
    <div className={layerPanel.layerPanel}>
      <ul>
        {layers}
      </ul>
    </div>
  );
}
