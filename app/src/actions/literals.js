import { LOAD_LITERALS } from 'actions';

export function loadLiterals() {
  return (dispatch) => {
    fetch(`${PUBLIC_PATH}literals.json`)
      .then(res => res.json())
      .then((data) => {
        dispatch({
          type: LOAD_LITERALS, payload: data
        });
      });
    return true;
  };
}

export { loadLiterals as default };
