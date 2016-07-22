import React, {Component} from "react";
import filtersPanel from "../../styles/components/c_filter_panel.scss";

export default function (props) {
  return (
    <div className={filtersPanel.filtersPanel}>
      <label for="ISOfilter">Vessel flag (ISO code)
      <input type="text" id="ISOfilter" onChange={(e) => props.onChange(e.target.value)} /></label>
    </div>
  );
}
