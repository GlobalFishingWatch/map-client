import { connect } from 'react-redux';
import Definitions from '../components/Definitions';
import { getDefinitionEntries } from '../actions/definitions';

const mapStateToProps = (state) => ({
  definitionEntries: state.definitions
});

const mapDispatchToProps = (dispatch) => ({
  getDefinitionEntries: () => dispatch(getDefinitionEntries())
});

export default connect(mapStateToProps, mapDispatchToProps)(Definitions);
