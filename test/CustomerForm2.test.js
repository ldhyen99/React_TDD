import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';

import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

import { fetchResponseOk, fetchResponseError, requestBodyOf } from './spyHelps';

describe('customerForm', () => {
  let render, container, form, field, labelFor;
  const originalFetch = window.fetch;
  let fetchSpy;
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const labelFor = (formElement) =>
    container.querySelector(`label[for="${formElement}"]`);

  const field = (formId, name) => form(formId).elements[name];

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  // expect.extend({
  //   toHaveBeenCalled(received) {
  //     if (received.receivedArguments() === undefined) {
  //       return {
  //         pass: false,
  //         message: () => 'Spy was not called.',
  //       };
  //     }
  //     return { pass: true, message: () => 'Spy was called.' };
  //   },
  // });

  beforeEach(() => {
    ({ render, container, form, field, labelFor } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
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
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
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
      render(<CustomerForm {...{ [fieldName]: value }} />);
      ReactTestUtils.Simulate.submit(form('customer'));

      expect(requestBodyOf(fetchSpy)).toMatchObject({
        [fieldName]: value,
      });
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it('saves new value when submitted', async () => {
      render(<CustomerForm {...{ [fieldName]: 'existingValue' }} />);

      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: 'newValue', name: fieldName },
      });

      await ReactTestUtils.Simulate.submit(form('customer'));

      expect(requestBodyOf(fetchSpy)).toMatchObject({
        [fieldName]: value,
      });
      // const fetchOpts = fetchSpy.receivedArgument(1);
      // expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual('newValue');
    });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm fetch={fetchSpy.fn} />);

    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchSpy).toHaveBeenCalledWith(
      '/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    fetchSpy.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    // const preventDefaultSpy = spy();
    const preventDefaultSpy = jest.fn();

    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: preventDefaultSpy,
      });
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
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
});
