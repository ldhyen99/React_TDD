import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { expectRedux } from 'expect-redux';

import {
  createContainer,
  withEvent,
  createContainerWithStore,
} from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

describe('customerForm', () => {
  let render, container, blur, element;
  const originalFetch = window.fetch;
  let fetchSpy;
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const labelFor = (formElement) =>
    container.querySelector(`label[for="${formElement}"]`);

  const field = (name) => form('customer').elements[name];

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const spy = () => {
    let receivedArguments;
    let returnValue;
    return {
      fn: (...args) => {
        receivedArguments = args;
        return returnValue;
      },
      receivedArguments: () => receivedArguments,
      receivedArgument: (n) => receivedArguments[n],
      stubReturnValue: (value) => (returnValue = value),
    };
  };

  const fetchResponseOk = (body) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    });

  const fetchResponseError = () => Promise.resolve({ ok: false });

  expect.extend({
    toHaveBeenCalled(received) {
      if (received.receivedArguments() === undefined) {
        return {
          pass: false,
          message: () => 'Spy was not called.',
        };
      }
      return { pass: true, message: () => 'Spy was called.' };
    },
  });

  beforeEach(() => {
    ({ render, container, blur, element } = createContainer());
    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  const itRendersAsATextBox = (fieldName) =>
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });

  const itIncludesTheExistingValue = (fieldName) =>
    it('include the exitsting value', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field(fieldName).value).toEqual('value');
    });

  const itRenderLabel = (fieldName, value) =>
    it('renders a label for the first name field', () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName).textContent).toEqual(value);
    });

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName, value) =>
    it('assigns an id that matches the label id to the first name field', () => {
      render(<CustomerForm />);
      expect(field(fieldName).id).toEqual(value);
    });

  // const itSubmitsExistingValue = (fieldName, value) =>
  //   it('saves existing first name when submitted', async () => {
  //     expect.hasAssertions(); // wait for one assertion to occur;

  //     render(
  //       <CustomerForm
  //         firstName="Ashley"
  //         lastName="Jame"
  //         onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
  //       />
  //     );

  //     await ReactTestUtils.Simulate.change(field(fieldName), {
  //       target: { value: 'value', name: fieldName },
  //     });

  //     await ReactTestUtils.Simulate.submit(form('customer'));
  //   });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      render(<CustomerForm {...{ [fieldName]: value }} fetch={fetchSpy.fn} />);
      ReactTestUtils.Simulate.submit(form('customer'));

      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual('value');
      // expect(submitSpy.receivedArguments()).toBeDefined();
      // expect(submitSpy.receivedArgument(0)[fieldName]).toEqual(value);
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it('saves new value when submitted', async () => {
      render(
        <CustomerForm
          {...{ [fieldName]: 'existingValue' }}
          fetch={fetchSpy.fn}
        />
      );

      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: 'newValue', name: fieldName },
      });

      await ReactTestUtils.Simulate.submit(form('customer'));

      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual('newValue');
    });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm fetch={fetchSpy.fn} />);

    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.receivedArgument(0)).toEqual('/customers');

    const fetchOpts = fetchSpy.receivedArgument(1);
    // individual properties of the fetch options
    expect(fetchOpts.method).toEqual('POST');
    expect(fetchOpts.credentials).toEqual('same-origin');
    expect(fetchOpts.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(customer));
    const saveSpy = spy();

    render(<CustomerForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy.receivedArgument(0)).toEqual(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    fetchSpy.stubReturnValue(fetchResponseError());
    const saveSpy = spy();

    render(<CustomerForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = spy();

    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: preventDefaultSpy.fn,
      });
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.stubReturnValue(Promise.resolve({ ok: false }));
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    const errorElement = container.querySelector('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRenderLabel('firstName', 'First name');
    itAssignsAnIdThatMatchesTheLabelId('firstName', 'firstName');
    itSubmitsExistingValue('firstName', 'value');
    itSubmitsNewValue('firstName', 'newValue');
  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRenderLabel('lastName', 'Last name');
    itAssignsAnIdThatMatchesTheLabelId('lastName', 'lastName');
    itSubmitsExistingValue('lastName', 'value');
    itSubmitsNewValue('lastName', 'newValue');
  });

  describe('phoneNumber field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRenderLabel('phoneNumber', 'Phone number');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber', 'phoneNumber');
    itSubmitsExistingValue('phoneNumber', 'value');
    itSubmitsNewValue('phoneNumber', 'newValue');
  });

  // it('displays error after blur when first name field is blank', () => {
  //   render(<CustomerForm />);
  //   blur(
  //     field('firstName'),
  //     withEvent('firstName', '')
  //     );
  //     expect(element('.error')).not.toBeNull();
  //     expect(element('.error').textContent).toMatch(
  //       'First name is required'       
  //       );
  // });

  // it('displays error after blur when last name field is blank', () => {
  //   act(() => {
  //     render(<CustomerForm />);
  //     blur(
  //       field('lastName'),
  //       withEvent('lastName', ' ')
  //       ); 
  //     });

  //     expect(element('.error')).not.toBeNull();
  //     expect(element('.error').textContent).toMatch(
  //       'Last name is required'
  //     );
  // })

  const itInvalidatesFieldWithValue = (
    fieldName,
    value,
    description
    ) => {
      it(`displays error after blur when ${fieldName} field is
      '${value}'`, () => {
        render(<CustomerForm />);
        blur(
          field(fieldName),
          withEvent(fieldName, value)
      );
      expect(element('.error')).not.toBeNull();
      expect(element('.error').textContent).toMatch(
        description
      );
     });
    }

    itInvalidatesFieldWithValue(
      'firstName',
      ' ',
      'First name is required'
    );
    itInvalidatesFieldWithValue(
      'lastName',
      ' ',
      'Last name is required'
    );

    itInvalidatesFieldWithValue(
      'phoneNumber',
      ' ',
      'Phone number is required'
    );

    itInvalidatesFieldWithValue(
      'phoneNumber',
      'invalid',
      'Only numbers, spaces and these symbols are allowed: ( ) + -'
    );

    it('accepts standard phone number characters when validating', () => {
      render(<CustomerForm />);
      blur(
        element("[name='phoneNumber']"),
        withEvent('phoneNumber', '0123456789+()- ')
      );
      expect(element('.error')).toBeNull();
    });
});
