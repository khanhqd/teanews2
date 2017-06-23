import * as types from '../actions/types';
const INITIAL_STATE = {list:[]};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_BOOKMARK:
      let oldList = state.list
      return {
        ...state,
        list: [...oldList, action.payload]
      }
      break;
    case types.REPLACE_BOOKMARK:
      return {
        ...state,
        list: action.payload
      }
      break;
    default:
      return state
  }
}
