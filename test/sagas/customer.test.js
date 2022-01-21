import { storeSpy, expectRedux } from 'expect-redux';
import 'whatwg-fetch';
import { configureStore } from '../../src/store';
import { reducer } from '../../src/sagas/custome';
import { fetchResponseOk, fetchResponseError } from '../spyHelps';
import { itMaintainsExistingState, itSetsStatus } from '../reducerGenerators';

// describe('addCustomer', () => {
//   let store, fetchSpy;
//   const customer = { id: 123 };

//   beforeEach(() => {
//     fetchSpy = jest.fn();
//     jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(customer));
//     store = configureStore([storeSpy]);
//   });

//   const dispatchRequest = (customer) =>
//     store.dispatch({
//       type: 'ADD_CUSTOMER_REQUEST',
//       customer,
//     });

//   it('sets current status to submitting', () => {
//     dispatchRequest();

//     return expectRedux(store)
//       .toDispatchAnAction()
//       .matching({ type: 'ADD_CUSTOMER_SUBMITTING' });
//   });

//   it('submits request to the fetch api', async () => {
//     const inputCustomer = { firstName: 'Ashley' };
//     dispatchRequest(inputCustomer);

//     expect(window.fetch).toHaveBeenCalledWith('/customers', {
//       body: JSON.stringify(inputCustomer),
//       method: 'POST',
//       credentials: 'same-origin',
//       headers: { 'Content-Type': 'application/json' },
//     });
//   });

//   it('dispatches ADD_CUSTOMER_SUCCESSFUL on success', () => {
//     dispatchRequest();
//     return expectRedux(store)
//       .toDispatchAnAction()
//       .matching({ type: 'ADD_CUSTOMER_SUCCESSFUL', customer });
//   });

//   it('dispatches ADD_CUSTOMER_FAILED on non-specific error', () => {
//     window.fetch.mockReturnValue(fetchResponseError());
//     dispatchRequest();
//     return expectRedux(store)
//       .toDispatchAnAction()
//       .matching({ type: 'ADD_CUSTOMER_FAILED' });
//   });

//   it('dispatches ADD_CUSTOMER_VALIDATION_FAILED if validation errors were returned', () => {
//     const errors = { field: 'field', description: 'error text' };
//     window.fetch.mockReturnValue(fetchResponseError(422, { errors }));
//     dispatchRequest();
//     return expectRedux(store).toDispatchAnAction().matching({
//       type: 'ADD_CUSTOMER_VALIDATION_FAILED',
//       validationErrors: errors,
//     });
//   });
// });

// describe('reducer', () => {
//   it('returns a default state for an undefined existing state', () => {
//     expect(reducer(undefined, {})).toEqual({
//       customer: {},
//       status: undefined,
//       validationErrors: {},
//       error: false,
//     });
//   });

//   describe('ADD_CUSTOMER_SUBMITTING action', () => {
//     const action = { type: 'ADD_CUSTOMER_SUBMITTING' };

//     it('sets status to SUBMITTING', () => {
//       expect(reducer(undefined, action)).toMatchObject({
//         status: 'SUBMITTING',
//       });
//     });
//   });

//   describe('ADD_CUSTOMER_VALIDATION_FAILED action', () => {
//     const validationErrors = { field: 'error text' };
//     const action = {
//       type: 'ADD_CUSTOMER_VALIDATION_FAILED',
//       validationErrors,
//     };

//     it('sets validation errors to provided errors', () => {
//       expect(reducer(undefined, action)).toMatchObject({
//         validationErrors,
//       });
//     });

//     it('maintains existing state', () => {
//       expect(reducer({ a: 123 }, action)).toMatchObject({
//         a: 123,
//       });
//     });
//   });

//   describe('ADD_CUSTOMER_SUCCESSFUL action', () => {
//     const customer = { id: 123 };
//     const action = {
//       type: 'ADD_CUSTOMER_SUCCESSFUL',
//       customer,
//     };

//     it('sets status to SUCCESSFUL', () => {
//       expect(reducer(undefined, action)).toMatchObject({
//         status: 'SUCCESSFUL',
//       });
//     });

//     it('maintains existing state', () => {
//       expect(reducer({ a: 123 }, action)).toMatchObject({
//         a: 123,
//       });
//     });

//     it('sets customer to provided customer', () => {
//       expect(reducer(undefined, action)).toMatchObject({
//         customer,
//       });
//     });
//   });
// });

describe('reducer', () => {
  it('returns a default state for an undefined existing state', () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      // customers: [],
      status: undefined,
      validationErrors: {},
      error: false,
    });
  });

  describe('ADD_CUSTOMER_SUBMITTING action', () => {
    const action = { type: 'ADD_CUSTOMER_SUBMITTING' };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'SUBMITTING');

    it('resets error to false', () => {
      expect(reducer({ error: true }, action)).toMatchObject({
        error: false,
      });
    });
  });

  describe('ADD_CUSTOMER_FAILED action', () => {
    const action = { type: 'ADD_CUSTOMER_FAILED' };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'FAILED');

    it('sets error to true', () => {
      expect(reducer(undefined, action)).toMatchObject({
        error: true,
      });
    });
  });

  describe('ADD_CUSTOMER_VALIDATION_FAILED action', () => {
    const validationErrors = { field: 'error text' };
    const action = {
      type: 'ADD_CUSTOMER_VALIDATION_FAILED',
      validationErrors,
    };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'VALIDATION_FAILED');

    it('sets validation errors to provided errors', () => {
      expect(reducer(undefined, action)).toMatchObject({
        validationErrors,
      });
    });
  });
  describe('ADD_CUSTOMER_SUCCESSFUL action', () => {
    const customer = { id: 123 };
    const action = { type: 'ADD_CUSTOMER_SUCCESSFUL', customer };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'SUCCESSFUL');

    it('sets customer to provided customer', () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer,
      });
    });
  });

  // describe('SEARCH_CUSTOMERS_REQUEST', () => {
  //   const action = { type: 'SEARCH_CUSTOMERS_REQUEST' };

  //   itMaintainsExistingState(reducer, action);

  //   it('resets customers array', () => {
  //     expect(reducer({ customers: [{}] }, action)).toMatchObject({
  //       customers: [],
  //     });
  //   });
  // });

  // describe('SEARCH_CUSTOMERS_SUCCESSFUL', () => {
  //   const customers = [{ id: '123' }, { id: '234' }];
  //   const action = {
  //     type: 'SEARCH_CUSTOMERS_SUCCESSFUL',
  //     customers,
  //   };

  //   itMaintainsExistingState(reducer, action);

  //   it('sets customers array', () => {
  //     expect(reducer(undefined, action)).toMatchObject({
  //       customers,
  //     });
  //   });
  // });
});
