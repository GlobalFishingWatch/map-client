import { connect } from 'react-redux';
import ArticlesPublications from '../components/ArticlesPublications';
import { getArticlesPublicationsEntries } from '../actions/articlesPublications';

const mapStateToProps = (state) => ({
  articlesPublications: state.articlesPublications
});

const mapDispatchToProps = (dispatch) => ({
  getArticlesPublicationsEntries: () => dispatch(getArticlesPublicationsEntries())
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesPublications);
