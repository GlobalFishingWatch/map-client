import React, { Component } from 'react';
import pagination from '../../../styles/components/c-pagination-blog.scss';
import boxtriangle from '../../../assets/icons/box_triangle.svg';
import ReactPaginate from 'react-paginate';

class PaginationBlog extends Component {

  render() {
    return (<section className={pagination['c-pagination-blog']}>
      <div>
        <ReactPaginate
          previousLabel={<img className={pagination['left-triangle']} alt={'triangle icon'} src={boxtriangle} />}
          nextLabel={<img className={pagination['right-triangle']} alt={'triangle icon'} src={boxtriangle} />}
          pageNum={10}
          activeClassName={pagination['page-selected']}
        />
      </div>
    </section>);
  }
}

export default PaginationBlog;
