import React from "react";
import {Link} from "react-router";

export default function(props) {
  return (
    <nav>
      <Link to="/">
        <img src="#"/>
      </Link>
      <ul>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/">How to</Link>
        </li>
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <Link to="/">Login</Link>
        </li>
      </ul>
    </nav>
  )
};
