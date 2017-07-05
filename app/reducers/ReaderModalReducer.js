import * as types from '../actions/types';
const INITIAL_STATE = { hideBottomBar: false, lineHeight: 28, modalState: false, fontSize: 18, postBackground: 'white', textColor: 'black', nightMode: false ,menuBarColor :'rgba(0, 0, 0, 0.39)'};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CHANGE_MODAL_STATE:
      return {
        ...state,
        modalState: action.payload
      }
      break;
    case types.CHANGE_FONTSIZE:
      return {
        ...state,
        fontSize: action.payload
      }
      break;
    case types.FONTSIZE_DEC:
      return {
        ...state,
        padding: action.payload
      }
      break;
    case types.CHANGE_BACKGROUND_COLOR:
      return {
        ...state,
        postBackground: action.payload
      }
      break;
    case types.CHANGE_TEXT_COLOR:
      return {
        ...state,
        textColor: action.payload
      }
      break;
    case types.DISABLE_SCROLL:
      return {
        ...state,
        disableScroll: action.payload
      }
      break;
    case types.CHANGE_CURRENT_PAGE:
      return {
        ...state,
        pageInfo: action.payload
      }
      break;
    case types.CHANGE_NIGHT_MODE:
      return {
        ...state,
        nightMode: action.payload
      }
      break;
    case types.CHANGE_MENUBAR_COLOR:
      return {
        ...state,
        menuBarColor: action.payload
      }
      break;
    case types.CHANGE_LINEHEIGHT:
      return {
        ...state,
        lineHeight: action.payload
      }
      break;
    case types.HIDE_BOTTOM_BAR:
      return {
        ...state,
        hideBottomBar: action.payload
      }
      break;
    default:
      return state
  }
}
