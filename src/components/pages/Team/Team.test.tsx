import { Router } from 'react-router-dom';

import { Provider } from 'react-redux';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { store } from 'store';

import { Team } from './Team';
const history = createMemoryHistory();

describe('Team', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('Teamのスナップショット', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          <Team />
        </Router>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
