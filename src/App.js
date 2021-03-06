import React, { useState, useCallback } from 'react';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { AppointmentFormLoader } from './AppointmentFormLoader';
import { CustomerSearch } from './CustomSearch/CustomerSearch';

const searchActions = (customer) => (
  <React.Fragment>
    <button role="button" onClick={() => transitionToAddAppointment(customer)}>
      Create appointment
    </button>
  </React.Fragment>
);

export const App = () => {
  const [view, setView] = useState('');
  const [customer, setCustomer] = useState();

  const transitionToAddCustomer = useCallback(() => setView('addCustomer'), []);

  const transitionToAddAppointment = useCallback((customer) => {
    setCustomer(customer);
    setView('addAppointment');
  }, []);

  const transitionToDayView = useCallback(() => setView('dayView'), []);

  const transitionToSearchCustomers = useCallback(
    () => setView('searchCustomers'),
    []
  );

  switch (view) {
    case 'addCustomer':
      return <CustomerForm onSave={transitionToAddAppointment} />;
    case 'searchCustomers':
      return <CustomerSearch renderCustomerActions={searchActions} />;
    case 'addAppointment':
      return (
        <AppointmentFormLoader
          customer={customer}
          onSave={transitionToDayView}
        />
      );
    default:
      return (
        <React.Fragment>
          <div className="button-bar">
            <button
              type="button"
              id="addCustomer"
              onClick={transitionToAddCustomer}
            >
              Add customer and appointment
            </button>
            <button
              type="button"
              id="searchCustomers"
              onClick={transitionToSearchCustomers}
            >
              Search customers
            </button>
          </div>
          <AppointmentsDayViewLoader today={new Date()} />
        </React.Fragment>
      );
  }
};
