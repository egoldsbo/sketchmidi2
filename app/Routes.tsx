/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';

// Lazily load routes and code split with webpacck
const LazyEditorPage = React.lazy(() =>
  import(/* webpackChunkName: "EditorPage" */ './containers/EditorPage')
);

const EditorPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyEditorPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.EDITOR} component={EditorPage} />
      </Switch>
    </App>
  );
}
