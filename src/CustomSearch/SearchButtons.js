import React from 'react';

const SearchButtons = ({ handleNext }) => (
  <div className="button-bar">
    <button role="button" id="next-page" onClick={handleNext}>
      Next
    </button>
  </div>
);
