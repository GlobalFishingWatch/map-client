import React, {Component} from "react";
import FiltersPanel from "./filters_panel";
import layerPanel from "../../../styles/components/c_layer_panel.scss";
import {Accordion, AccordionItem} from "react-sanfona";

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

  var title_accordion = [];
  title_accordion.push(<input className={layerPanel.input_acordion} placeholder="SEARCH VESSELS"></input>);
  title_accordion.push(<div className={layerPanel.title_acordion}>Basemap
    <div className={layerPanel.content_box}>
      <div className={layerPanel.box_basemap}></div>
      <div className={layerPanel.box_image_basemap}></div>
    </div>
  </div>);
  title_accordion.push(<span className={layerPanel.title_acordion}>Layers</span>);
  title_accordion.push(<span className={layerPanel.text_search}>advanced search</span>);

  var content_search_advanced = []
  content_search_advanced.push(<Accordion allowMultiple={false} activeItems={6}>
    {[title_accordion[3]].map((item_s) => {
      return (
        <AccordionItem title={item_s} key={item_s} >
          <div className={layerPanel.content_accordion}>
            {item_s === title_accordion[3] ? <div><FiltersPanel/><span className={layerPanel.button_advanced_search}>ADVANCED SEARCH</span></div> : null}
          </div>
        </AccordionItem>
      );
    })}
  </Accordion>);

  return (
    <div className={layerPanel.layerPanel}>
      <Accordion allowMultiple={false} activeItems={6}>
        {[title_accordion[0], title_accordion[1], title_accordion[2]].map((item) => {
          return (
            <AccordionItem title={item} key={item} className={layerPanel.title_accordion}>
              <div className={layerPanel.content_accordion}>
                {item === title_accordion[0] ? <div>{content_search_advanced}</div> : null}
                {item === title_accordion[1] ? <p>Hello2</p> : null}
                {item === title_accordion[2] ? <ul>{layers}</ul> : null}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
