import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Products from '../query/Products';

// helper: createStore(state)
// helper: renderWithStore(overrides)

describe('Products', () => {
  beforeEach(() => {
    // reset mock alerts, mock fetchProducts thunks, provide base state
  });

  it('renders loading, error, and product cards based on slice status', () => {
    // render with loading status → expect spinner/text
    // change to error status → expect error message
    // then render with items → expect cards/filter text
  });

  describe('state transitions', () => {
    it('triggers fetchProducts when idle and empty', () => {
      // render with idle status + empty list, assert dispatch(fetchProducts)
    });

    it('filters cards when category prop is set', () => {
      // render with items from two categories, assert only matching cards appear
    });
  });

  describe('user interactions', () => {
    it('alerts and aborts when no user and Add to Cart clicked', () => {
      // render without currentUser, click button, expect alert called once and no dispatch
    });

    it('dispatches addItem when logged-in user clicks Add to Cart', () => {
      // render with currentUser, click button, expect addItem called with product
    });
  });
});