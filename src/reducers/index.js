import {combineReducers} from 'redux';
import listReducer from './ListReducer';
export default combineReducers({
  lists: listReducer,
});
