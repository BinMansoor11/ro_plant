import { NEW_CUSTOMER, GET_DELIVERYBOYS, GET_AUTHDATA } from '../actions/types';

const initialState = {
  customer: [],
  _delivery_boys: [],
  _auth_Data: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NEW_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
      };
      break;

    case GET_DELIVERYBOYS:
      return {
        ...state,
        _delivery_boys: action.payload,
      };
      break;
    case GET_AUTHDATA:
      return {
        ...state,
        _auth_Data: action.payload,
      };
      break;

    default:
      return state;
  }
}

// case SELECTED_MEAL_ARR:
//   return {
//     ...state,
//     selectedMealArr: action.payload,
//   };
