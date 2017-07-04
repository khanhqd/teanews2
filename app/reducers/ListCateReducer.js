import * as types from '../actions/types';
const INITIAL_STATE = {list:[], reload:false, listKeyword:[], fullList:[]};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_CATE:
      let oldList = state.list
      return {
        ...state,
        list: [...oldList, action.payload]
      }
      break;
    case types.REPLACE_LIST_CATE:
      return {
        ...state,
        list: action.payload
      }
      break;
    case types.RELOAD:
      return {
        ...state,
        reload: action.payload
      }
      break;
    case types.ADD_SEARCH_KEYWORD:
      let oldList2 = state.listKeyword
      return {
        ...state,
        listKeyword: [...oldList2, action.payload]
      }
      break;
    case types.SAVE_LIST_CATE:
      return {
        ...state,
        fullList: action.payload
      }
      break;
    default:
      return state
  }
}
