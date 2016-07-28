import React, {Component} from "react";
import FiltersPanel from "./filters_panel";
import layerPanel from "../../../styles/components/c_layer_panel.scss";
import {Accordion, AccordionItem} from "react-sanfona";
import $ from "jquery";

class LayerPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resultVisible: true,
      openSearch: true
    };
  }

  toggle() {
    this.setState({
      resultVisible: !this.state.resultVisible
    })
  }

  toggle_open_search() {
    this.setState({
      openSearch: !this.state.resultVisible
    })
  }

  render() {
    let layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        layers.push(
          <li className={layerPanel.list_checkbox} key={i}>
            <label>
              <input type="checkbox" checked={this.props.layers[i].visible} onChange={() => this.props.onToggle(this.props.layers[i])}></input>
              {this.props.layers[i].title}
            </label>
          </li>
        );
      }
    }

    var title_accordion = [];
    if (this.state.resultVisible) {
      title_accordion.push(
        <input className={layerPanel.input_acordion} placeholder="SEARCH VESSELS"></input>
      );
    } else {
      title_accordion.push(
        <input onClick={this.toggle.bind(this)} className={layerPanel.input_acordion} placeholder="SEARCH VESSELS"></input>
      );
    }
    title_accordion.push(
      <div className={layerPanel.title_acordion}>Basemap
        <div className={layerPanel.content_box}>
          <div className={layerPanel.box_basemap}></div>
          <div className={layerPanel.box_image_basemap}></div>
        </div>
      </div>
    );
    title_accordion.push(
      <span className={layerPanel.title_acordion}>Layers</span>
    );
    if (this.state.resultVisible) {
      title_accordion.push(
        <span onClick={this.toggle.bind(this)} className={layerPanel.text_search}>advanced search</span>
      );
    }

    var content_search_advanced = []
    content_search_advanced.push(
      <Accordion allowMultiple={false} activeItems={6}>
        {[title_accordion[3]].map((item_s) => {
          return (
            <AccordionItem title={item_s} key={item_s}>
              <div className={layerPanel.content_accordion}>
                {item_s === title_accordion[3]
                  ? <div><FiltersPanel/>
                      <span className={layerPanel.button_advanced_search}>SEARCH</span>
                      <p onClick={this.toggle.bind(this)} className={layerPanel.text_hide_search}>hide advanced search</p>
                    </div>
                  : null}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    );

    return (
      <div className={layerPanel.layerPanel}>
        <Accordion allowMultiple={false} activeItems={6}>
          {[title_accordion[0], title_accordion[1], title_accordion[2]].map((item) => {
            return (
              <AccordionItem title={item} key={item} className={layerPanel.title_accordion}>
                <div className={layerPanel.content_accordion}>
                  {item === title_accordion[0]
                    ? <div>{content_search_advanced} {this.state.resultVisible && <ul className={layerPanel.list_results}>
                          <li>JOVE,<span>MMSI012345</span>
                          </li>
                          <li>JOVE,<span>MMSI012345</span>
                          </li>
                        </ul>}
                      </div>
                    : null}
                  {item === title_accordion[1]
                    ? <p></p>
                    : null}
                  {item === title_accordion[2]
                    ? <ul>{layers}</ul>
                    : null}
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }
}
export default LayerPanel;
