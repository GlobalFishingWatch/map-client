import { GET_DEFINITION_ENTRIES } from 'actions';
import 'whatwg-fetch';

export function getDefinitionEntries() {
  return (dispatch) => {
    fetch(DEFINITIONS_JSON_URL, {
      method: 'GET'
    }).then(response => response.json()).then((data) => {
      dispatch({
        type: GET_DEFINITION_ENTRIES,
        payload: data
      });
    });
  };
}

export { getDefinitionEntries as default };
