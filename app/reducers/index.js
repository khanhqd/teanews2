import { combineReducers } from 'redux';
import LoadListDataReducer from './LoadListDataReducer';
import ReaderModalReducer from './ReaderModalReducer';
import ListCateReducer from './ListCateReducer';
import BookmarkReducer from './BookmarkReducer';

export default combineReducers({
  loadListDataReducer: LoadListDataReducer,
  readerModalReducer: ReaderModalReducer,
  listCateReducer: ListCateReducer,
  listCateReducer: ListCateReducer,
  bookmarkReducer: BookmarkReducer
})
