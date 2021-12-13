import React, { useState, useCallback } from 'react';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { AppointmentFormLoader } from './AppointmentFormLoader';

export const App = () => {
  const [view, setView] = useState('');
  const [customer, setCustomer] = useState();

  const transitionToAddCustomer = useCallback(() => setView('addCustomer'), []);

  const transitionToAddAppointment = useCallback((customer) => {
    setCustomer(customer);
    setView('addAppointment');
  }, []);

  const transitionToDayView = useCallback(() => setView('dayView'), []);

  switch (view) {
    case 'addCustomer':
      return <CustomerForm onSave={transitionToAddAppointment} />;
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
          </div>
          <AppointmentsDayViewLoader today={new Date()} />
        </React.Fragment>
      );
  }
};
