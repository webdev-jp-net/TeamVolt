import { Router } from 'react-router-dom';

import { Provider } from 'react-redux';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { store } from 'store';

import { EnergyCharge } from './EnergyCharge';
const history = createMemoryHistory();

describe('EnergyCharge', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('EnergyChargeのスナップショット', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          <EnergyCharge />
        </Router>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
