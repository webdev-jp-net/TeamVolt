import { Router } from 'react-router-dom';

import { Provider } from 'react-redux';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { store } from 'store';

import { Play } from './Play';

const history = createMemoryHistory();
describe('Play', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('Playのスナップショット', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          <Play />
        </Router>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
