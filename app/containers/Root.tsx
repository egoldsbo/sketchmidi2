import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Store } from '../store';
import Routes from '../Routes';

import Theme from '../components/theme';

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <Theme>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Theme>
  </Provider>
);

export default hot(Root);
