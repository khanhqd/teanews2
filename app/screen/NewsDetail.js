import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  TouchableHighlight,
  PanResponder,
  Animated,
  StatusBar,
  Share,
  AsyncStorage
} from 'react-native';
var { height, width } = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';
import NewsItem from '../common/NewsItem';
const cheerio = require('cheerio-without-node-native');

import { connect } from 'react-redux';
import { changeModalState, addBookmark, replaceBookmark } from '../actions';
import { selectedPost2, selectedPost1, selectedPost0, disableScrollWebview } from '../actions';
var Toast = require('react-native-toast');

class NewsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      left0: new Animated.Value(0),
      left1: new Animated.Value(width),
      left2: new Animated.Value(0),
      index0: 2,
      index1: 3,
      index2: 1,
      dx: 0,
    };
  };
  _set = async (key, value) => {
      try { await AsyncStorage.setItem(key, value); }
      catch (error) { console.log(error.message) }
  };
  componentWillMount() {
    let listLength = this.props.listData.length;
    var foo;
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: (event, gestureState) => true,
      onStartShouldSetPanResponder: (event, gestureState) => {
        return (event.nativeEvent.locationX > width - 50)
      },
      onPanResponderGrant: (event, gestureState) => {},
      onPanResponderMove: (event, gestureState) => {
        if ((gestureState.x0 > width - 50)&&(gestureState.dx < 0)) {
            switch (this.state.index0) {
              case 2:
                  if (this.props.dataSlot0 + 1 < listLength) {
                    this.state.left1.setValue(width + gestureState.dx)
                  }
                break;
              case 3:
                  if (this.props.dataSlot0 + 2 < listLength) {
                    this.state.left0.setValue(width + gestureState.dx)
                  }
                break;
              case 1:
                  if (this.props.dataSlot0 < listLength) {
                    this.state.left2.setValue(width + gestureState.dx)
                  }
                break;
            }
          this.setState({
            dx: gestureState.dx,
            // canScrollPage: true
          })
        }
        // else {
        //   this.setState({ canScrollPage: false })
        // }
      },
      onPanResponderRelease: (event, gestureState) => {
        // if (this.state.canScrollPage) {
          // this.setState({ canScrollPage: false })
        if (this.state.dx < 0) {
          switch (this.state.index0) {
            case 2:
                if ((this.state.dx < -width / 4) || (gestureState.vx < -1.1)) {
                  if (this.props.dataSlot0 + 1 < listLength) {
                    this.setState({ index2: 3, index1: 2, index0: 1 }, () => {
                      setTimeout(() => { this.props.dispatch(selectedPost0(this.props.dataSlot0 + 3)) }, 210)
                    })
                    Animated.timing(
                      this.state.left1,
                      { toValue: 0, duration: 200 }
                    ).start();
                    this.state.left2.setValue(width)
                  }
                } else {
                  Animated.timing(
                    this.state.left1,
                    { toValue: width, duration: 200 }
                  ).start();
                }
              break;
            case 3:
                if ((this.state.dx < -width / 4) || (gestureState.vx < -1.1)) {
                  if (this.props.dataSlot0 + 2 < listLength) {
                    this.setState({ index0: 2, index2: 1, index1: 3}, () => {
                      setTimeout(() => { this.props.dispatch(selectedPost2(this.props.dataSlot2 + 3)) }, 210)
                    })
                    Animated.timing(
                      this.state.left0,
                      { toValue: 0, duration: 200 }
                    ).start();
                    this.state.left1.setValue(width)
                  }
                } else {
                  Animated.timing(
                    this.state.left0,
                    { toValue: width, duration: 200 }
                  ).start();
                }
              break;
            case 1:
                if ((this.state.dx < -width / 4) || (gestureState.vx < -1.1)) {
                  if (this.props.dataSlot0 < listLength) {
                    this.setState({ index1: 1, index0: 3, index2: 2 }, () => {
                      setTimeout(() => { this.props.dispatch(selectedPost1(this.props.dataSlot1 + 3)) }, 210)
                    })
                    Animated.timing(
                      this.state.left2,
                      { toValue: 0, duration: 200 }
                    ).start();
                    this.state.left0.setValue(width)
                  }
                } else {
                  Animated.timing(
                    this.state.left2,
                    { toValue: width, duration: 200 }
                  ).start();
                }
            break;
          }
        }
      }
    });
  }
  saveBookmark() {
        var postInfo;
        if (this.state.index0 == 2) {
          postInfo = this.props.listData[this.props.dataSlot0];
        } else if (this.state.index1 == 2) {
          postInfo = this.props.listData[this.props.dataSlot1];
        } else {
          postInfo = this.props.listData[this.props.dataSlot2];
        }
        // this._set('listBookmark', JSON.stringify(this.props.listBookmark));
        let listBookmark = this.props.listBookmark;
        console.log(postInfo);
        if(this.state.selected == true) {
            //delete from Async
            for (var i = listBookmark.length - 1; i>=0; i--) {
              if (listBookmark[i].title == postInfo.title) {
                listBookmark.splice(i,1);
                Toast.show('Đã bỏ lưu')
              }
            }
            this.props.dispatch(replaceBookmark(listBookmark))
            this.setState({ selected: false, saving: false })
        } else {
            listBookmark.push(postInfo)
            this.props.dispatch(addBookmark(postInfo))
            this.setState({ selected: true, saving: false })
            Toast.show('Đã lưu')
        }
  }
  shareLink() {
    var page;
    if (this.state.index0 == 2) {
      page = this.props.listData[this.props.dataSlot0];
    } else if (this.state.index1 == 2) {
      page = this.props.listData[this.props.dataSlot1];
    } else {
      page = this.props.listData[this.props.dataSlot2];
    }
    Share.share({
      message: page.title,
      url: page.url,
      title: 'From News App'
    }, {
        dialogTitle: 'From News App',
        // excludedActivityTypes: [
        //   'com.apple.UIKit.activity.PostToTwitter'
        // ],
        tintColor: 'green'
      })
      .then(this._showResult)
      .catch((error) => this.setState({ result: 'error: ' + error.message }));
  }
  render() {
    if (this.props.listData != 0) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />
          <View style={styles.navBar}>
            <TouchableHighlight
              onPress={() => this.props.navigation.goBack()}
              style={[styles.navBarButton, { marginLeft: 0 }]}>
              <Image
                style={styles.iconNavBar}
                source={require('../../img/ic_back.png')} />
            </TouchableHighlight>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
              <TouchableHighlight
                onPress={() => this.shareLink()}
                style={styles.navBarButton}>
                <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_share.png')} />
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.saveBookmark()}
                style={styles.navBarButton}>
                <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_bookmark.png')} />
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.props.dispatch(changeModalState(!this.props.openMenu))}
                style={styles.navBarButton}>
                <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_more-vertical.png')} />
              </TouchableHighlight>
            </View>
          </View>

          <View style={{ flex: 1 }}>

            <Animated.View
              ref={(view) => topView = view}
              style={{ position: 'absolute', left: this.state.left0, zIndex: this.state.index0, backgroundColor: 'white', flex: 1 }}
              {...this._panResponder.panHandlers}>
              <NewsItem
                navigation = {this.props.navigation}
                row={this.props.listData[this.props.dataSlot0]} />
            </Animated.View>

            <Animated.View
              ref={(view) => topView = view}
              style={{ position: 'absolute', left: this.state.left1, zIndex: this.state.index1, backgroundColor: 'white', flex: 1 }}
              {...this._panResponder.panHandlers}>
              <NewsItem
                navigation = {this.props.navigation}
                row={this.props.listData[this.props.dataSlot1]} />
            </Animated.View>


            <Animated.View
              ref={(view) => topView = view}
              style={{ position: 'absolute', left: this.state.left2, zIndex: this.state.index2, backgroundColor: 'white', flex: 1 }}
              {...this._panResponder.panHandlers}>
              <NewsItem
                navigation = {this.props.navigation}
                row={this.props.listData[this.props.dataSlot2]} />
            </Animated.View>


          </View>

        </View>
      );
    } else {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...
          </Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 3,
    paddingLeft: 10,
    paddingRight: 10,
    width: width,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 50,
  },
  navBarButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    marginLeft: 15,
    alignItems: 'center'
  },
  navBarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  iconNavBar: {
    height: 25,
    width: 25,
    tintColor: 'black'
  }
});
const mapStateToProps = state => {
  return {
    listData: state.loadListDataReducer.list,
    dataSlot0: state.loadListDataReducer.selectedPost0,
    dataSlot1: state.loadListDataReducer.selectedPost1,
    dataSlot2: state.loadListDataReducer.selectedPost2,
    openMenu: state.readerModalReducer.modalState,
    menuBarColor : state.readerModalReducer.menuBarColor,
    listBookmark: state.bookmarkReducer.list
  }
}
export default connect(mapStateToProps)(NewsDetail);
