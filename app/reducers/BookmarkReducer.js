import * as types from '../actions/types';
const INITIAL_STATE = {list:[], listRecent: []};

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
    case types.ADD_RECENT:
      let oldListRecent = state.listRecent
      return {
        ...state,
        listRecent: [action.payload, ...oldListRecent]
      }
      break;
    case types.REPLACE_RECENT:
      return {
        ...state,
        listRecent: action.payload
      }
      break;
    default:
      return state
  }
}
