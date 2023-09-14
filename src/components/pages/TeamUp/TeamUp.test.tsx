import { Provider } from 'react-redux';

import { Router } from 'react-router-dom';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { store } from 'store';

import { TeamUp } from './TeamUp';
const history = createMemoryHistory();

describe('Team', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('Teamのスナップショット', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          <TeamUp />
        </Router>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
