import * as types from '../actions/types';
const INITIAL_STATE = {list:[], reload:false, listKeyword:[],
  fullList:[
    {
        name: 'Thời sự',
        link: 'http://tinmoi24.vn/thoi-su/1',
        color: 'rgb(221, 85, 85)'
    },
    {
        name: 'Giải trí',
        link: 'http://tinmoi24.vn/giai-tri/2',
        color: 'rgb(105, 151, 200)'
    },
    {
        name: 'Thể thao',
        link: 'http://tinmoi24.vn/the-thao/3',
        color: 'rgb(105, 151, 200)'
    },
    {
        name: 'Giáo Dục',
        link: 'http://tinmoi24.vn/giao-duc/8',
        color: 'rgb(231, 131, 106)'
    },
    {
        name: 'Kinh Tế',
        link: 'http://tinmoi24.vn/kinh-te/4',
        color: 'rgb(228, 158, 21)'
    },
    {
        name: 'Pháp luật',
        link: 'http://tinmoi24.vn/phap-luat/5',
        color: 'rgb(134, 134, 134)'
    },
    {
        name: 'Xe',
        link: 'http://tinmoi24.vn/xe/15',
        color: 'rgb(2, 5, 17)'
    },
    {
        name: 'Công nghệ',
        link: 'http://tinmoi24.vn/cong-nghe/6',
        color: 'rgb(187, 67, 198)'
    },
    {
        name: 'Sức khoẻ',
        link: 'http://tinmoi24.vn/suc-khoe/10',
        color: 'rgb(77, 205, 174)'
    },
    {
        name: 'Game',
        link: 'http://tinmoi24.vn/game/7',
        color: 'rgb(106, 90, 205)'
    },
    {
        name: 'Khám Phá',
        link: 'http://tinmoi24.vn/kham-pha/13',
        color: 'rgb(231, 131, 224)'
    },
    {
        name: 'Cẩm Nang',
        link: 'http://tinmoi24.vn/cam-nang/14',
        color: 'rgb(139, 200, 106)'
    },
  ]};

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
