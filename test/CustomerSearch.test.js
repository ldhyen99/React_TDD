import React from 'react';
import 'whatwg-fetch';

import { CustomerSearch } from '../src/CustomerSearch';
import { createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelps';

const oneCustomer = [
  { id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1' },
];

const twoCustomers = [
  { id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1' },
  { id: 2, firstName: 'C', lastName: 'D', phoneNumber: '2' },
];

describe('customer search', () => {
  let renderAndWait, elements;

  beforeEach(() => {
    ({ renderAndWait, elements } = createContainer());
    jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(oneCustomer));
  });

  it('renders a table with four headings', async () => {
    await renderAndWait(<CustomerSearch />);
    const headings = elements('table th');
    expect(headings.map((h) => h.textContent)).toEqual([
      'First name',
      'Last name',
      'Phone number',
      'Actions',
    ]);
  });

  it('fetches all customer data when component mounts', async () => {
    await renderAndWait(<CustomerSearch />);
    expect(window.fetch).toHaveBeenCalledWith('/customers', {
      method: 'GET',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('renders all customer data in a table row', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch />);
    const rows = elements('table tbody td');
    expect(rows[0].textContent).toEqual('A');
    expect(rows[1].textContent).toEqual('B');
    expect(rows[2].textContent).toEqual('1');
  });

  it('renders multiple customer rows', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
    await renderAndWait(<CustomerSearch />);
    const rows = elements('table tbody tr');
    expect(rows[1].childNodes[0].textContent).toEqual('C');
  });
});
