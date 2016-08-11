import { GET_DEFINITION_ENTRIES } from '../actions';
import 'whatwg-fetch';

export function getDefinitionEntries() {
  return (dispatch) => {
    fetch('/definitions.json', {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      dispatch({
        type: GET_DEFINITION_ENTRIES,
        payload: data
      });
    });
  };
}
