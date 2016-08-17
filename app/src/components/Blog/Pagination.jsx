import React, { Component } from 'react';
import pagination from '../../../styles/components/c-pagination-blog.scss';
import boxtriangle from '../../../assets/icons/box_triangle.svg';
import ReactPaginate from 'react-paginate';

class PaginationBlog extends Component {

  render() {
    if (this.props.pages === 0) {
      return null;
    }

    return (
      <section className={pagination['c-pagination-blog']}>
        <div>
          <ReactPaginate
            previousLabel={<img className={pagination['left-triangle']} alt={'triangle icon'} src={boxtriangle} />}
            nextLabel={<img className={pagination['right-triangle']} alt={'triangle icon'} src={boxtriangle} />}
            pageNum={this.props.pages}
            initialSelected={this.props.initialPage - 1}
            clickCallback={this.props.onPageChange}
            disabledClassName={pagination['disabled-triangle']}
            activeClassName={pagination['page-selected']}
          />
        </div>
      </section>
    );
  }
}

PaginationBlog.propTypes = {
  pages: React.PropTypes.number,
  initialPage: React.PropTypes.number,
  onPageChange: React.PropTypes.func
};

export default PaginationBlog;
