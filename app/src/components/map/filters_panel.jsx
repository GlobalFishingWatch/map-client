import React, {Component} from "react";
import filtersPanel from "../../../styles/components/c_filter_panel.scss";
import {FLAGS} from "../../constants";

export default function (props) {
  let countries = Object.keys(FLAGS).map(function(index) {
    return <option value={index} key={index}>{FLAGS[index]}</option>
  });

  return (
    <div className={filtersPanel.filtersPanel}>
        <select id="ISOfilter" onChange={(e) => props.onChange('flag', e.target.value)} defaultValue={0}>
          <option value="" key={0}>Vessel flag (ISO code)</option>
          {countries}
        </select>
    </div>
  );
}
