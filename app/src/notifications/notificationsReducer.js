import { SHOW_BANNER } from './notificationsActions';

const initialState = {
  visible: false,
  content: '',
  type: 'notification' // one of warning || error || notification
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_BANNER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
