import { connect } from 'react-redux';
import ContentAccordion from '../components/Shared/ContentAccordion';
import { push } from 'react-router-redux';


const mapDispatchToProps = (dispatch) => ({
  push: (term) => dispatch(push(`/definitions/${term}`))
});

export default connect(null, mapDispatchToProps)(ContentAccordion);
