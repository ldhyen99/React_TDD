import React from 'react';
import { createContainer } from './domManipulators';
import { CustomerSearch } from '../src/CustomerSearch';
import { SearchButtons } from '../src/SearchButtons';

describe('Search button', () => {
  let renderAndWait, elements;

  beforeEach(() => {
    ({ renderAndWait, elements } = createContainer());
  });
});
