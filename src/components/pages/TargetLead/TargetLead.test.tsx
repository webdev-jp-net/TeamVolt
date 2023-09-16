import { Provider } from 'react-redux';

import { Router } from 'react-router-dom';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { store } from 'store';

import { TargetLead } from './TargetLead';
const history = createMemoryHistory();

describe('TargetLead', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('TargetLeadのスナップショット', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          <TargetLead />
        </Router>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
