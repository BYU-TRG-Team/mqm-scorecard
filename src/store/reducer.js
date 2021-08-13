import { getToken } from '../utils';

export const reducer = (state, action) => {
  switch (action.type) {
    case 'update_token':
      return {
        ...state,
        token: action.token,
      };

    default:
      return state;
  }
};

export const initialState = {
  token: getToken(),
};
