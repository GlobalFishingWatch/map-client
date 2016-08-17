import { connect } from 'react-redux';
import Blog from '../components/Blog';
import { getRecentPost } from '../actions/blog';

const mapStateToProps = (state, { location }) => ({
  recentPost: state.blog.recentPost,
  queryParams: location.query
});

const mapDispatchToProps = (dispatch) => ({
  getRecentPost: (page) => dispatch(getRecentPost(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
