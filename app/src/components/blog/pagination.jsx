'use strict';
import React, {Component} from "react";
import pagination from '../../../styles/components/c-pagination-blog.scss';
import boxtriangle from "../../../assets/icons/box_triangle.svg";

class PaginationBlog extends Component {

  render() {
    return <section className={pagination['c-pagination-blog']}>
      <img className={pagination['left-triangle']} src={boxtriangle}></img>
      <ul>
        <li className={pagination['page-selected']}>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>...</li>
        <li>23</li>
      </ul>
      <img className={pagination['right-triangle']} src={boxtriangle}></img>
    </section>
  }
}

export default PaginationBlog;
