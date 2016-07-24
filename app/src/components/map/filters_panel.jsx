import React, {Component} from "react";
import filtersPanel from "../../../styles/components/c_filter_panel.scss";
import {FLAGS} from "../../constants";

export default function (props) {
  let countries = Object.keys(FLAGS).map(function(index) {
    return <option value={index} key={index}>{FLAGS[index]}</option>
  });

  return (
    <div className={filtersPanel.filtersPanel}>
      <label for="ISOfilter">Vessel flag (ISO code)
        <select id="ISOfilter" onChange={(e) => props.onChange(e.target.value)} defaultValue={0}>
          <option value={0} key={0}>Select one...</option>
          {countries}
        </select>
      </label>
    </div>
  );
}
