import React, { useState, useCallback } from 'react';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { AppointmentFormLoader } from './AppointmentFormLoader';

export const App = () => {
  // return view === 'addCustomer' ? (
  //   <CustomerForm onSave={transitionToAddAppointment} />
  // ) : (
  //   <React.Fragment>
  //     <div className="button-bar">
  //       <button
  //         type="button"
  //         id="addCustomer"
  //         onClick={transitionToAddCustomer}
  //       >
  //         Add customer and appointment
  //       </button>
  //     </div>
  //     <AppointmentsDayViewLoader today={today} />
  //   </React.Fragment>
  // );
  const [view, setView] = useState('');
  const [customer, setCustomer] = useState();

  const transitionToAddCustomer = useCallback((customer) => {
    setCustomer(customer);
    setView('addCustomer');
  }, []);

  const transitionToAddAppointment = useCallback(
    () => setView('addAppointment'),
    []
  );

  switch (view) {
    case 'addCustomer':
      return <CustomerForm onSave={transitionToAddAppointment} />;
    case 'addAppointment':
      return <AppointmentFormLoader customer={customer} />;
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
