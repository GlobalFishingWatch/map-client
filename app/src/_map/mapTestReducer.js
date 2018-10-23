// import {} from '../actions/mapTestActions';

const initialState = {
  hello: 'world'
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'test' : {
      return { ...state, hello: 'world' };
    }
    default:
      return state;
  }
}

