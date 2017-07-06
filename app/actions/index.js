import {
  LOAD_LIST_DATA,
  ADD_LIST_DATA,
  REPLACE_FAVOR_VIDEO,
  CHANGE_MODAL_STATE,
  SELECTED_POST0,
  SELECTED_POST1,
  SELECTED_POST2,
  FONTSIZE_DEC,
  CHANGE_FONTSIZE,
  CHANGE_BACKGROUND_COLOR,
  CHANGE_TEXT_COLOR,
  ADD_CATE,
  REPLACE_LIST_CATE,
  RELOAD,
  DISABLE_SCROLL,
  CHANGE_CURRENT_PAGE,
  CHANGE_NIGHT_MODE,
  CHANGE_MENUBAR_COLOR,
  ADD_BOOKMARK,
  REPLACE_BOOKMARK,
  ADD_SEARCH_KEYWORD,
  CHANGE_LOADING_STATE,
  CHANGE_LINEHEIGHT,
  ADD_RECENT,
  REPLACE_RECENT,
  SAVE_LIST_CATE,
  HIDE_BOTTOM_BAR,
  ROOT_LINK1,
  ROOT_LINK2,
  ROOT_LINK3,
  OPEN_DROPDOWN_MENU,
  SELECT_CATE
} from './types';


export const loadListData = (data) => {
  return {
    type: LOAD_LIST_DATA,
    payload: data
  }
}
export const replaceFavorVideo = (item) => {
  return {
    type: REPLACE_FAVOR_VIDEO,
    payload: item
  }
}
export const changeModalState = (item) => {
  return {
    type: CHANGE_MODAL_STATE,
    payload: item
  }
}
export const selectedPost0 = (item) => {
  return {
    type: SELECTED_POST0,
    payload: item
  }
}
export const selectedPost1 = (item) => {
  return {
    type: SELECTED_POST1,
    payload: item
  }
}
export const selectedPost2 = (item) => {
  return {
    type: SELECTED_POST2,
    payload: item
  }
}
export const changeBackgroundColor = (item) => {
  return {
    type: CHANGE_BACKGROUND_COLOR,
    payload: item
  }
}
export const changeTextColor = (item) => {
  return {
    type: CHANGE_TEXT_COLOR,
    payload: item
  }
}
export const changeFontSize = (item) => {
  return {
    type: CHANGE_FONTSIZE,
    payload: item
  }
}
export const addCate = (item) => {
  return {
    type: ADD_CATE,
    payload: item
  }
}
export const replaceListCate = (item) => {
  return {
    type: REPLACE_LIST_CATE,
    payload: item
  }
}
export const reload = (data) => {
  return {
    type: RELOAD,
    payload: data
  }
}
export const disableScrollWebview = (data) => {
  return {
    type: DISABLE_SCROLL,
    payload: data
  }
}
export const changeCurrentPage = (data) => {
  return {
    type: CHANGE_CURRENT_PAGE,
    payload: data
  }
}
export const changeNightMode = (data) => {
  return {
    type: CHANGE_NIGHT_MODE,
    payload: data
  }
}
export const changeMenuBarColor = (data) => {
  return {
    type: CHANGE_MENUBAR_COLOR,
    payload: data
  }
}
export const addBookmark = (data) => {
  return {
    type: ADD_BOOKMARK,
    payload: data
  }
}
export const replaceBookmark = (data) => {
  return {
    type: REPLACE_BOOKMARK,
    payload: data
  }
}
export const addRecent = (data) => {
  return {
    type: ADD_RECENT,
    payload: data
  }
}
export const replaceRecent = (data) => {
  return {
    type: REPLACE_RECENT,
    payload: data
  }
}
export const addSearchKeyword = (item) => {
  return {
    type: ADD_SEARCH_KEYWORD,
    payload: item
  }
}
export const changeLoadingState = (item) => {
  return {
    type: CHANGE_LOADING_STATE,
    payload: item
  }
}
export const changeLineHeight = (item) => {
  return {
    type: CHANGE_LINEHEIGHT,
    payload: item
  }
}
export const saveListCate = (item) => {
  return {
    type: SAVE_LIST_CATE,
    payload: item
  }
}
export const addListData = (data) => {
  return {
    type: ADD_LIST_DATA,
    payload: data
  }
}
export const hideBottomBar = (data) => {
  return {
    type: HIDE_BOTTOM_BAR,
    payload: data
  }
}
export const rootLink1 = (data) => {
  return {
    type: ROOT_LINK1,
    payload: data
  }
}
export const rootLink2 = (data) => {
  return {
    type: ROOT_LINK2,
    payload: data
  }
}
export const rootLink3 = (data) => {
  return {
    type: ROOT_LINK3,
    payload: data
  }
}
export const openDropdownMenu = (data) => {
  return {
    type: OPEN_DROPDOWN_MENU,
    payload: data
  }
}
export const selectCate = (data) => {
  return {
    type: SELECT_CATE,
    payload: data
  }
}

// export const goToPlay = (number) => {
//   return (dispatch) => {
//     Actions.PlayScene({ numberOfPlayer: number })
//   }
// }
