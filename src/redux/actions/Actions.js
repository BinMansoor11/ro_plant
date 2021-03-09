import { NEW_CUSTOMER, GET_AUTHDATA, GET_DELIVERYBOYS } from './types';

// import { PermissionsAndroid, Platform } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';

// import { NavigationActions } from 'react-navigation';

// const accessPoint = 'http://3pikit.com/';
import { API } from '../../utils';
const axios = require('axios');

export const newCustomer = (user) => {
  return {
    type: NEW_CUSTOMER,
    payload: user,
  };
};

export const getAuthData = (userData) => {
  return {
    type: GET_AUTHDATA,
    payload: userData,
  };
};

export const getDeliveryBoys = (user_id) => async (dispatch) => {
  try {
    var bodyFormData = new FormData();

    bodyFormData.append('admin_id', JSON.stringify(user_id));

    const res = await axios.post(API + '/get_delivery_boys', bodyFormData, {
      headers: {
        'Content-Type': 'application/form-data',
      },
    });

    dispatch({
      type: GET_DELIVERYBOYS,
      payload: res.data.status == 'ERROR' ? [] : res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_DELIVERYBOYS,
      payload: [],
    });
  }
};

// export const uploadProfilePic = (accessToken, image) => async dispatch => {
//   console.log(accessToken, image);
//   const imageData = { uri: image, name: "profilePic", type: "image/jpg" };
//   const bodyFormData = new FormData();

//   bodyFormData.append("profile_pic", imageData);
//   const up = await axios

//     .post(accessPoint + "api/v1/edit-profile", bodyFormData, {
//       headers: {
//         Accept: "application/json",
//         Authorization: "Bearer " + accessToken,
//         "Content-Type": "multipart/form-data"
//       }
//     })
//     .then(res => {
//       console.log(res);
//       // dispatch({
//       //   type: GET_RESTAURANT_DATA,
//       //   payload: res.data.data
//       // });
//       console.log("Navigating to Home");
//       dispatch(NavigationActions.navigate({ routeName: "Home" }));
//     })
//     .catch(function(error) {
//       console.log("Error is", error);
//     });

// };
