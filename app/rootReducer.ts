import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { editorReducer } from './redux/reducers/tracks';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    editor: editorReducer,
  });
}
