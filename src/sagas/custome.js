import { put } from 'redux-saga/effects';

export function* addCustomer() {
  yield put({ type: 'ADD_CUSTOMER_SUBMITTING' });
}

const defaultState = {
  customer: {},
  status: undefined,
  validationErrors: {},
  error: false,
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_CUSTOMER_SUBMITTING':
      return { status: 'SUBMITTING' };
    default:
      return state;
  }
};
