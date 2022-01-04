import { storeSpy, expectRedux } from 'expect-redux';
import { configureStore } from '../../src/store';
import { reducer } from '../../src/sagas/custome';

describe('addCustomer', () => {
  let store;
  beforeEach(() => {
    store = configureStore([storeSpy]);
  });

  const dispatchRequest = (customer) =>
    store.dispatch({
      type: 'ADD_CUSTOMER_REQUEST',
      customer,
    });

  it('sets current status to submitting', () => {
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'ADD_CUSTOMER_SUBMITTING' });
  });
});

describe('reducer', () => {
  it('returns a default state for an undefined existing state', () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      status: undefined,
      validationErrors: {},
      error: false,
    });
  });

  describe('ADD_CUSTOMER_SUBMITTING action', () => {
    const action = { type: 'ADD_CUSTOMER_SUBMITTING' };
    it('sets status to SUBMITTING', () => {
      expect(reducer(undefined, action)).toMatchObject({
        status: 'SUBMITTING',
      });
    });
  });
});
