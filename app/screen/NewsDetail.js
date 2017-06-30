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
import { changeModalState, addBookmark, replaceBookmark, addRecent } from '../actions';
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
      tutorialStep: 1,
      bookmarked: false
    };
    this._get("firstLogin");
    for (let i = 0; i < this.props.listBookmark.length; i++) {
      if (this.props.listBookmark[i].title == this.props.listData[this.props.dataSlot0].title) {
        this.setState({ bookmarked: true })
        break;
      }
    }
  };
  _set = async (key, value) => {
    try { await AsyncStorage.setItem(key, value); }
    catch (error) { console.log(error.message) }
  };
  _get = async (key) => {
    try {
      var value = await AsyncStorage.getItem(key);
      if (value !== null) {
          this.setState({tutorialStep: 0})
        }
    } catch (error) { alert(error) }
  };
  componentWillMount() {
    let listLength = this.props.listData.length;
    var foo;
    var dx;
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (
        event: { nativeEvent: { pageY: number, pageX: number } },
        gesture: any
      ) => {
        const currentDragDistance = gesture.dx;
        const currentDragPosition = event.nativeEvent.pageX;
        if (this.props.loadingDetailState) {
          Toast.show('Dữ liệu trang tiếp đang load trong giây lát')
        } else {
          // const axisLength = isVertical
          //   ? layout.height.__getValue()
          //   : layout.width.__getValue();
          // const axisHasBeenMeasured = !!axisLength;
          // Measure the distance from the touch to the edge of the screen
          const screenEdgeDistance = currentDragPosition - currentDragDistance;
          // Compare to the gesture distance relavant to card or modal
          const gestureResponseDistance = width - 130;
          if (screenEdgeDistance < gestureResponseDistance) {
            // Reject touches that started in the middle of the screen
            return false;
          }
          const hasDraggedEnough = Math.abs(currentDragDistance) > 20;
          const shouldSetResponder = hasDraggedEnough;
          // && axisHasBeenMeasured && !isOnFirstCard;
          return shouldSetResponder;
        }
      },
      // onStartShouldSetPanResponder: (event, gestureState) => {
      //   if (event.nativeEvent.locationX > width - 80) {
      //     if (this.props.loadingDetailState) {
      //       Toast.showLongBottom('Dữ liệu đang load trong giây lát')
      //     } else {
      //       return true
      //     }
      //   }
      // },

      onPanResponderGrant: (event, gestureState) => { },
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dx < 0) {
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
          dx = gestureState.dx;
        }
        // else {
        //   this.setState({ canScrollPage: false })
        // }
      },
      onPanResponderRelease: (event, gestureState) => {
        // if (this.state.canScrollPage) {
        // this.setState({ canScrollPage: false })
        if (dx < 0) {
          let listRecent = this.props.listRecent;
          let listBookmark = this.props.listBookmark;
          switch (this.state.index0) {
            case 2:
              if ((dx < -width / 4) || (gestureState.vx < -0.9)) {
                if (this.props.dataSlot0 + 1 < listLength) {
                  this.setState({ index2: 3, index1: 2, index0: 1 }, () => {

                    if (listRecent.length < 30) {
                      listRecent.unshift(this.props.listData[this.props.dataSlot1])
                    }
                    else {
                      listRecent.pop();
                      listRecent.unshift(this.props.listData[this.props.dataSlot1])
                    }
                    // this.props.dispatch(addRecent(this.props.listData[this.props.dataSlot1]))
                    this.setState({ bookmarked: false })
                    for (var i = 0; i < listBookmark.length; i++) {
                      if (listBookmark[i].title == this.props.listData[this.props.dataSlot1].title) {
                        this.setState({ bookmarked: true })
                        break;
                      }
                    }
                    AsyncStorage.setItem('listRecent', JSON.stringify(listRecent))
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
              if ((dx < -width / 4) || (gestureState.vx < -0.9)) {
                let listRecent = this.props.listRecent
                if (this.props.dataSlot0 + 2 < listLength) {
                  this.setState({ index0: 2, index2: 1, index1: 3 }, () => {

                    if (listRecent.length < 30) {
                      listRecent.unshift(this.props.listData[this.props.dataSlot0])
                    }
                    else {
                      listRecent.pop();
                      listRecent.unshift(this.props.listData[this.props.dataSlot0])
                    }
                    // this.props.dispatch(addRecent(this.props.listData[this.props.dataSlot0]))
                    this.setState({ bookmarked: false })
                    for (var i = 0; i < listBookmark.length; i++) {
                      if (listBookmark[i].title == this.props.listData[this.props.dataSlot1].title) {
                        this.setState({ bookmarked: true })
                        break;
                      }
                    }
                    AsyncStorage.setItem('listRecent', JSON.stringify(listRecent))
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
              if ((dx < -width / 4) || (gestureState.vx < -0.9)) {
                if (this.props.dataSlot0 < listLength) {
                  this.setState({ index1: 1, index0: 3, index2: 2 }, () => {

                    if (listRecent.length < 30) {
                      listRecent.unshift(this.props.listData[this.props.dataSlot2])
                    }
                    else {
                      listRecent.pop();
                      listRecent.unshift(this.props.listData[this.props.dataSlot2])
                    }
                    // this.props.dispatch(addRecent(this.props.listData[this.props.dataSlot2]))
                    this.setState({ bookmarked: false })
                    for (var i = 0; i < listBookmark.length; i++) {
                      if (listBookmark[i].title == this.props.listData[this.props.dataSlot1].title) {
                        this.setState({ bookmarked: true })
                        break;
                      }
                    }
                    AsyncStorage.setItem('listRecent', JSON.stringify(listRecent))
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
  componentDidMount() {
    this._set('firstLogin', 'false');
  }
  saveBookmark() {
    var postInfo;
    var selected = this.state.bookmarked;
    if (this.state.index0 == 2) {
      postInfo = this.props.listData[this.props.dataSlot0];
    } else if (this.state.index1 == 2) {
      postInfo = this.props.listData[this.props.dataSlot1];
    } else {
      postInfo = this.props.listData[this.props.dataSlot2];
    }
    // this._set('listBookmark', JSON.stringify(this.props.listBookmark));
    let listBookmark = this.props.listBookmark;
    for (var i = 0; i < listBookmark.length; i++) {
      if (listBookmark[i].title == postInfo.title) {
        selected = true;
        break;
      }
    }
    if (selected == true) {
      //delete from Async
      for (var i = listBookmark.length - 1; i >= 0; i--) {
        if (listBookmark[i].title == postInfo.title) {
          listBookmark.splice(i, 1);
          Toast.show('Đã bỏ lưu')
        }
      }
      this.setState({ bookmarked: false })
      this.props.dispatch(replaceBookmark(listBookmark))
      this._set('listBookmark', JSON.stringify(listBookmark))
    } else {
      // listBookmark.push(postInfo);
      this.setState({ bookmarked: true })
      this._set('listBookmark', JSON.stringify(listBookmark))
      this.props.dispatch(addBookmark(postInfo))
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
  renderTutorial() {
    switch (this.state.tutorialStep) {
      case 1:
        return (
          <View style={{width: width, height: height, position: 'absolute', zIndex: 6}}>
            <View style={{height: 20, width: width, backgroundColor: 'rgba(0, 0, 0, 0.33)'}}>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Animatable.View iterationCount="infinite" direction="alternate" animation="fadeIn" style={{width: 70, backgroundColor: 'rgba(0, 0, 0, 0.33)'}}>
              </Animatable.View>
              <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.33)', justifyContent: 'center'}}>
                <Animatable.View animation="fadeInRight" style={{width: 200, height: 110, backgroundColor: 'white', marginLeft: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                  <Text style={{fontWeight: 'bold'}}>Hướng dẫn
                  </Text>
                  <Text style={{marginTop: 5}}>Vuốt cạnh trái sang phải để về trang chủ!
                  </Text>
                  <View style={{width: 200, flexDirection: 'row', margin: 10, height: 40, flex:1, alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.setState({ tutorialStep: 0})} style={styles.loginButton}>
                      <View style={{ borderColor: '#4a90e2', height: 30, width: 80, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1,marginLeft: 10 }}>
                         <Text style={{color: '#4a90e2', fontWeight: '500', fontSize: 15}}>Kết thúc</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ tutorialStep: this.state.tutorialStep + 1})} style={styles.loginButton}>
                      <View style={{ backgroundColor: '#4a90e2', height: 30, width: 80, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                         <Text style={{color: 'white', fontWeight: '500', fontSize: 15}}>Tiếp</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              </View>
            </View>
            <View style={{height: 50, width: width, backgroundColor: 'rgba(0, 0, 0, 0.33)'}}>
            </View>
          </View>
        )
        break;
      case 2:
        return (
          <View style={{width: width, height: height, position: 'absolute', zIndex: 6}}>
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.33)', alignItems: 'center'}}>

              <Animatable.View animation="fadeInDown" style={{width: 200, height: 120, backgroundColor: 'white', marginLeft: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 5, position: 'absolute', bottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>Hướng dẫn
                </Text>
                <Text style={{marginTop: 5}}>Thanh menu với các chức năng chia sẻ, lưu, chỉnh sửa font chữ, chế độ đọc ...
                </Text>
                <View style={{width: 200, flexDirection: 'row', margin: 10, height: 40, flex:1, alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => this.setState({ tutorialStep: 0})} style={styles.loginButton}>
                    <View style={{ borderColor: '#4a90e2', height: 30, width: 80, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1,marginLeft: 10 }}>
                       <Text style={{color: '#4a90e2', fontWeight: '500', fontSize: 15}}>Kết thúc</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({ tutorialStep: this.state.tutorialStep + 1})} style={styles.loginButton}>
                    <View style={{ backgroundColor: '#4a90e2', height: 30, width: 80, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                       <Text style={{color: 'white', fontWeight: '500', fontSize: 15}}>Tiếp</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animatable.View>

            </View>
            <Animatable.View iterationCount="infinite" direction="alternate" animation="fadeIn" style={{height: 50, width: width, backgroundColor: 'rgba(0, 0, 0, 0.33)'}}>
            </Animatable.View>
          </View>
        )
        break;
      case 3:
        return (
          <View style={{width: width, height: height, position: 'absolute', zIndex: 6}}>
            <View style={{height: 20, width: width, backgroundColor: 'rgba(0, 0, 0, 0.33)'}}>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.33)', justifyContent: 'center'}}>
                <Animatable.View animation="fadeInLeft" style={{width: 200, height: 110, backgroundColor: 'white', marginLeft: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 5, position: 'absolute', right: 5}}>
                  <Text style={{fontWeight: 'bold'}}>Hướng dẫn
                  </Text>
                  <Text style={{marginTop: 5}}>Vuốt màn hình sang trái để chuyển trang tiếp theo!
                  </Text>
                  <View style={{width: 200, flexDirection: 'row', margin: 10, height: 40, flex:1, alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.setState({ tutorialStep: this.state.tutorialStep + 1})} style={styles.loginButton}>
                      <View style={{ backgroundColor: '#4a90e2', height: 30, width: 80, borderRadius: 5, justifyContent: 'center', marginLeft: 60, alignItems: 'center'}}>
                         <Text style={{color: 'white', fontWeight: '500', fontSize: 15}}>Kết thúc</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              </View>
              <Animatable.View iterationCount="infinite" direction="alternate" animation="fadeIn" style={{width: 120, backgroundColor: 'rgba(0, 0, 0, 0.33)'}}>
              </Animatable.View>
            </View>
            <View style={{height: 50, width: width, backgroundColor: 'rgba(0, 0, 0, 0.33)'}}>
            </View>
          </View>
        )
        break;
      default:
        return null
    }
  }
  renderIconBookmark() {
    if (this.state.bookmarked) {
      return (
        <Image
          style={styles.iconNavBar}
          source={require('../../img/ic_bookmark_on.png')} />
      )
    } else {
      return (
        <Image
          style={styles.iconNavBar}
          source={require('../../img/ic_bookmark.png')} />
      )
    }
  }
  render() {
    if (this.props.listData != 0) {
      return (
        <View style={{ flex: 1 }}>
          {this.renderTutorial()}
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={[styles.navBarButton, { marginLeft: 0 }]}>
              <Image
                style={styles.iconNavBar}
                source={require('../../img/ic_back.png')} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => this.shareLink()}
                style={styles.navBarButton}>
                <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_share.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.saveBookmark()}
                style={styles.navBarButton}>
                {this.renderIconBookmark()}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.dispatch(changeModalState(!this.props.openMenu))}
                style={styles.navBarButton}>
                <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_more-vertical.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }} {...this._panResponder.panHandlers}>

            <Animated.View
              style={{ position: 'absolute', left: this.state.left0, zIndex: this.state.index0, backgroundColor: 'white', flex: 1 }}
            >
              <NewsItem
                navigation={this.props.navigation}
                row={this.props.listData[this.props.dataSlot0]} />
            </Animated.View>

            <Animated.View
              style={{ position: 'absolute', left: this.state.left1, zIndex: this.state.index1, backgroundColor: 'white', flex: 1 }}
            >
              <NewsItem
                navigation={this.props.navigation}
                row={this.props.listData[this.props.dataSlot1]} />
            </Animated.View>


            <Animated.View
              style={{ position: 'absolute', left: this.state.left2, zIndex: this.state.index2, backgroundColor: 'white', flex: 1 }}
            >
              <NewsItem
                navigation={this.props.navigation}
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
    menuBarColor: state.readerModalReducer.menuBarColor,
    listBookmark: state.bookmarkReducer.list,
    loadingDetailState: state.loadListDataReducer.loading,
    listRecent: state.bookmarkReducer.listRecent
  }
}
export default connect(mapStateToProps)(NewsDetail);
