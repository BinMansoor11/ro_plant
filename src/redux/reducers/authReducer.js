import { USER } from '../actions/types';

const initialState = {
  user: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER:
      return {
        ...state,
        user: action.payload,
      };
      break;

    default:
      return state;
  }
}
