import React, { Component } from 'react';
import Root from './root';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import Home from './screen/Home';
import News from './screen/News';
import NewsDetail from './screen/NewsDetail';
import Category from './screen/Category';
import Search from './screen/Search';
import ReadOffline from './screen/ReadOffline';
import Bookmark from './screen/Bookmark';
import BookmarkReading from './screen/BookmarkReading';
import { StackNavigator, DrawerNavigator, StackNavigatorConfig } from 'react-navigation';
import ListNewsOffline from './screen/ListNewsOffline';
import * as Animatable from 'react-native-animatable';
import SideMenu from './screen/Menu.js';
import Recent from './screen/Recent.js';
import RecentReading from './screen/RecentReading.js';
import Settings from './screen/Settings.js';
const { width, height } = Dimensions.get("window");
// import * as firebase from 'firebase';
// const firebaseConfig = {
//   apiKey: "AIzaSyCrbUWDKlBCJCOTlF_D17y4zB7BZFHi-6A",
//   authDomain: "apptele-78fed.firebaseapp.com",
//   databaseURL: "https://apptele-78fed.firebaseio.com",
//   projectId: "apptele-78fed",
//   storageBucket: "apptele-78fed.appspot.com",
//   messagingSenderId: "68342702073"
//   };
// const firebaseApp = firebase.initializeApp(firebaseConfig);

export const TeaNews = StackNavigator({
  Home_Screen: {
    screen: Home,
    navigationOptions: {
      header: null,
    }
  },
  Detail_Screen: {
    screen: NewsDetail,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
    mode: 'card'
  },
  Category_Screen: {
    screen: Category,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    }
  },
  Search_Screen: {
    screen: Search,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    }
  },
  ReadOffline_Screen: {
    screen: ReadOffline
  },
  Bookmark_Screen: {
    screen: Bookmark,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    }
  },
  BookmarkReading_Screen: {
    screen: BookmarkReading,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    }
  },
  Recent_Screen: {
    screen: Recent,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    }
  },
  RecentReading_Screen: {
    screen: RecentReading,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    }
  },
  Settings_Screen: {
    screen: Settings,
    navigationOptions: {
      header: null,
      gesturesEnabled: true,
    }
  },
},
);
export const Menu = DrawerNavigator({
  tabbar: {
    screen: TeaNews,
  },
},
  {
    drawerWidth: 200,
    drawerPosition: 'left',
    drawerLockMode: 'locked-closed',
    contentComponent: props => <SideMenu {...props} />
  },
);
