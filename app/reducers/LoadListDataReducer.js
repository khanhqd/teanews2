import * as types from '../actions/types';
const INITIAL_STATE = { list: [], selectedPost: 1, loading: false, rootLink1: '',rootLink2: '',rootLink3: '' };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_LIST_DATA:
      return {
        ...state,
        list: action.payload
      }
      break;
    case types.ADD_LIST_DATA:
      let oldList = state.list
      return {
        ...state,
        list: [...oldList, action.payload]
      }
      break;
    case types.SELECTED_POST0:
      return {
        ...state,
        selectedPost0: action.payload
      }
      break;
    case types.SELECTED_POST1:
      return {
        ...state,
        selectedPost1: action.payload
      }
      break;
    case types.SELECTED_POST2:
      return {
        ...state,
        selectedPost2: action.payload
      }
      break;
    case types.CHANGE_LOADING_STATE:
      return {
        ...state,
        loading: action.payload
      }
      break;
    case types.ROOT_LINK1:
      return {
        ...state,
        rootLink1: action.payload
      }
      break;
    case types.ROOT_LINK2:
      return {
        ...state,
        rootLink2: action.payload
      }
      break;
    case types.ROOT_LINK3:
      return {
        ...state,
        rootLink3: action.payload
      }
      break;
    default:
      return state
  }
}
