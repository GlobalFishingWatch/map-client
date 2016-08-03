import { connect } from 'react-redux';
import Blog from '../components/blog';
import { getRecentPost } from '../actions/blog';

const mapStateToProps = (state) => ({
  recentPost: state.blog.recentPost
});

const mapDispatchToProps = (dispatch) => ({
  getRecentPost: () => dispatch(getRecentPost())
});

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
