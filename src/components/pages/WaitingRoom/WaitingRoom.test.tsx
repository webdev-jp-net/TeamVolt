import { Router } from 'react-router-dom';

import { Provider } from 'react-redux';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { store } from 'store';

import { WaitingRoom } from './WaitingRoom';
const history = createMemoryHistory();

describe('WaitingRoom', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('WaitingRoomのスナップショット', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          <WaitingRoom />
        </Router>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
