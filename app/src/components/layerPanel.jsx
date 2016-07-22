import React, {Component} from "react";
import { Accordion, AccordionItem } from 'react-sanfona';
import layerPanel from "../../styles/components/c_layer_panel.scss";

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
      <Accordion allowMultiple={false}>
        {["Search Vessels", "BaseMap", "Layers"].map((item) => {
          return (
            <AccordionItem title={`${ item }`} key={item} className={layerPanel.title_accordion}>
              <div className={layerPanel.content_accordion}>
                {item === "Search Vessels" ? <p>Hola</p> : null}
                {item === "BaseMap" ? <p>Hola</p> : null}
                {item === "Layers" ? <p>{layers}</p>: null}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
