import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  PanResponder,
  Animated,
  AsyncStorage,
  StatusBar
} from 'react-native';
var { height, width } = Dimensions.get('window');
import { Button1 } from '../common';
import NewsItem2 from '../common/NewsItem2';
import NewsList from '../common/NewsList';
const cheerio = require('cheerio-without-node-native');

import { loadListData, selectedPost0, selectedPost1, selectedPost2, replaceBookmark, replaceRecent, addListData, saveListCate } from '../actions';
import { connect } from 'react-redux';
import { replaceListCate, reload, addSearchKeyword } from '../actions';

import { firebaseApp } from '../app';
const numberOfItem = 3;

var Toast = require('react-native-toast');

class Home extends Component {
  static navigationOptions = {
    title: 'Tea News',
    headerTitleStyle: { alignSelf: 'center' }
  }
  constructor(props) {
    super(props);
    topView = null;
    paddingTop = 0;
    this.state = {
      data: [],
      top0: new Animated.Value(0),
      top1: new Animated.Value(0),
      top2: new Animated.Value(-height),
      index0: 2,
      index1: 1,
      index2: 3,
      dataSlot0: 0,
      dataSlot1: 1,
      dataSlot2: -1,
      dy: 0,
      listCate: [],
      loading: true,
      bigData: [],
      listRecent: [],
      pageNumber: 1
    }
    topViewStyle = {
      style: {
        top: paddingTop
      }
    }

    firebaseApp.database().ref("search").child("keyword").on('child_added', (data) => {
      this.props.dispatch(addSearchKeyword(data.val().key))
    })

    this._get('listCate');
    this._get('fullListCate');
    this._get('listBookmark');
    this._get("listRecent");

    this.tracker = firebaseApp.database().ref('tracker/detail');
    this.tracker2 = firebaseApp.database().ref('tracker/categoryView');
  }
  _updateStyle() {
    topView && topView.setNativeProps(topViewStyle)
  }
  _get = async (key) => {
    try {
      var value = await AsyncStorage.getItem(key);
      if (value !== null) {
        switch (key) {
          case 'listBookmark':
            this.props.dispatch(replaceBookmark(JSON.parse(value)))
            break;
          case 'fullListCate':
            this.props.dispatch(saveListCate(JSON.parse(value)))
            break;
          case 'listRecent':
            this.props.dispatch(replaceRecent(JSON.parse(value)));
            this.setState({
              listRecent: JSON.parse(value)
            })
            break;
          case 'listCate':
            this.props.dispatch(replaceListCate(JSON.parse(value)))
            this.setState({ listCate: JSON.parse(value) }, () => {
              let listCate = this.state.listCate;
              if (listCate.length > 0) {
                let newObj = {};
                for (var i = 0; i < listCate.length; i++) {
                  newObj["data" + i] = []
                }
                this.setState({ ...newObj }, () => {
                  let arrPromise = listCate.map((val, index) => {
                    return new Promise((resolve, reject) => {
                      this.fetchData(val.link, val.name, val.color, index, resolve)
                    })
                  })
                  Promise.all(arrPromise).then(() => {
                    this.arrangeData()
                  })
                })
              }
              // else {
              //   this.fetchData('http://vnexpress.net/rss/kinh-doanh.rss')
              // }
            })
            break;
        }
      }
    } catch (error) { alert(error) }
  };
  arrangeData() {
    let listCate = this.props.listCate;
    var bigData = [];
    function compare(a, b) {
      var date1;
      var date2;
      if (a.date.includes('phút')) {
        date1 = parseInt(a.date.replace(' phút trước')) / 60
      }
      if (b.date.includes('phút')) {
        date2 = parseInt(b.date.replace(' phút trước')) / 60
      }
      if (a.date.includes('giờ')) {
        date1 = parseInt(a.date.replace(' giờ trước'))
      }
      if (b.date.includes('giờ')) {
        date2 = parseInt(b.date.replace(' giờ trước'))
      }
      if (a.date.includes('ngày')) {
        date1 = parseInt(a.date.replace(' ngày trước')) * 24
      }
      if (b.date.includes('ngày')) {
        date2 = parseInt(b.date.replace(' ngày trước')) * 24
      }
      if (date1 > date2)
        return 1;
      if (date1 < date2)
        return -1;
      return 0;
    }
    for (let i = 0; i < listCate.length; i++) {
      for (let n = 0; n < this.state["data" + i].length; n++) {
        bigData.push(this.state["data" + i][n]);
      }
    }
    bigData = bigData.sort(compare);
    for (let i = 0; i< bigData.length; i++) {
      this.props.dispatch(addListData(bigData[i]));
    }
    this.setState({loading: false})
    // this.setState({ bigData: bigData.sort(compare), loading: false }, () => {
    //   this.props.dispatch(loadListData(this.state.bigData))
    // })
  }
  arrangeDataReload() {
    let listCate = this.props.listCate;
    var bigData = [];
    function compare(a, b) {
      var date1;
      var date2;
      if (a.date.includes('phút')) {
        date1 = parseInt(a.date.replace(' phút trước')) / 60
      }
      if (b.date.includes('phút')) {
        date2 = parseInt(b.date.replace(' phút trước')) / 60
      }
      if (a.date.includes('giờ')) {
        date1 = parseInt(a.date.replace(' giờ trước'))
      }
      if (b.date.includes('giờ')) {
        date2 = parseInt(b.date.replace(' giờ trước'))
      }
      if (a.date.includes('ngày')) {
        date1 = parseInt(a.date.replace(' ngày trước')) * 24
      }
      if (b.date.includes('ngày')) {
        date2 = parseInt(b.date.replace(' ngày trước')) * 24
      }
      if (date1 > date2)
        return 1;
      if (date1 < date2)
        return -1;
      return 0;
    }
    for (let i = 0; i < listCate.length; i++) {
      for (let n = 0; n < this.state["data" + i].length; n++) {
        bigData.push(this.state["data" + i][n]);
      }
    }
    this.setState({ bigData: bigData.sort(compare), loading: false }, () => {
      this.props.dispatch(loadListData(this.state.bigData))
    })
  }
  reloadData(props) {
    this.setState({ listCate: props.listCate }, () => {
      let listCate = props.listCate;
      if (listCate.length > 0) {
        let newObj = {};
        for (var i = 0; i < listCate.length; i++) {
          newObj["data" + i] = []
        }
        this.setState({ ...newObj }, () => {
          let arrPromise = listCate.map((val, index) => {
            return new Promise((resolve, reject) => {
              this.fetchData(val.link, val.name, val.color, index, resolve)
            })
          })
          Promise.all(arrPromise).then(() => {
            this.arrangeDataReload()
          })
        })
      }
    })
  }
  loadMore() {
    Toast.show('Đang tải thêm dữ liệu!');
    this.setState({ pageNumber: this.state.pageNumber + 1 },() => {
      let listCate = this.props.listCate;
      if (listCate.length > 0) {
        let newObj = {};
        for (var i = 0; i < listCate.length; i++) {
          newObj["newdata" + i] = []
        }
        this.setState({ ...newObj }, () => {
          let arrPromise = listCate.map((val, index) => {
            return new Promise((resolve, reject) => {
              this.fetchData(val.link + `/trang${this.state.pageNumber}`, val.name, val.color, index, resolve)
            })
          })
          Promise.all(arrPromise).then(() => {
            this.arrangeData()
          })
        })
      }
    })
  }
  componentWillReceiveProps(props) {
    if (props.reload) {
      this.reloadData(props);
      this.setState({
        top0: new Animated.Value(0),
        top1: new Animated.Value(0),
        top2: new Animated.Value(-height),
        index0: 2,
        index1: 1,
        index2: 3,
        dataSlot0: 0,
        dataSlot1: 1,
        dataSlot2: -1
      })
      this.props.dispatch(reload(false))
    }
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      // onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },
      onPanResponderGrant: (event, gestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        switch (this.state.index0) {
          case 2:
            if (gestureState.dy > 0) {
              if (this.state.dataSlot0 > 0) {
                this.state.top2.setValue(-height + gestureState.dy)
              }
            } else {
              if (this.state.dataSlot0 + 2 < this.props.listData.length) {
                this.state.top0.setValue(gestureState.dy)
              }
            }
            break;
          case 3:
            if (gestureState.dy > 0) {
              this.state.top0.setValue(-height + gestureState.dy)
            } else {
              if (this.state.dataSlot0 + numberOfItem + 2 < this.props.listData.length) {
                this.state.top1.setValue(gestureState.dy)
              }
            }
            break;
          case 1:
            if (gestureState.dy > 0) {
              this.state.top1.setValue(-height + gestureState.dy)
            } else {
              if (this.state.dataSlot0 + 1< this.props.listData.length) {
                this.state.top2.setValue(gestureState.dy)
              }
            }
            break;
        }
        this.setState({ dy: gestureState.dy })
      },
      onPanResponderRelease: (event, gestureState) => {
        const axisDistance = height;
        const movedDistance = gestureState.moveY;
        const defaultVelocity = axisDistance / height;
        const gestureVelocity = gestureState.vy;
        const velocity = Math.max(gestureVelocity, defaultVelocity);
        const resetDuration = movedDistance / velocity;
        const nextPageDuration = (axisDistance - movedDistance) / velocity;

        switch (this.state.index0) {
          case 2:
            if (this.state.dy > 0) {
              if ((this.state.dy > height / 4) || (gestureState.vy > 0.5)) {
                if (this.state.dataSlot0 > 0) {
                  this.setState({ index2: 2, index1: 3, index0: 1 }, () => {
                    if (this.state.dataSlot1 > numberOfItem + 1) {
                      this.setState({ dataSlot1: this.state.dataSlot1 - numberOfItem - 2 })
                    }
                  })
                  Animated.timing(
                    this.state.top2,
                    { toValue: 0, duration: nextPageDuration }
                  ).start();
                  this.state.top1.setValue(-height)
                }
              } else {
                Animated.timing(
                  this.state.top2,
                  { toValue: -height, duration: resetDuration }
                ).start();
              }
            } else {
              if ((this.state.dy < -height / 4) || (gestureState.vy < -0.5)) {
                if (this.state.dataSlot0 + 2 < this.props.listData.length) {
                  this.setState({ index2: 1, index1: 2, index0: 3 }, () => {
                    this.setState({ dataSlot2: this.state.dataSlot2 + numberOfItem + 2 })
                  })
                  Animated.timing(
                    this.state.top0,
                    { toValue: -height, duration: nextPageDuration }
                  ).start();
                  this.state.top2.setValue(0)
                } else {
                  this.loadMore()
                }
              } else {
                Animated.timing(
                  this.state.top0,
                  { toValue: 0, duration: resetDuration }
                ).start();
              }
            }
            break;
          case 3:
            if (this.state.dy > 0) {
              if ((this.state.dy > height / 4) || (gestureState.vy > 0.5)) {
                this.setState({ index0: 2, index2: 3, index1: 1 }, () => {
                  if (this.state.dataSlot2 > numberOfItem + 1) {
                    this.setState({ dataSlot2: this.state.dataSlot2 - numberOfItem - 2 })
                  }
                })
                Animated.timing(
                  this.state.top0,
                  { toValue: 0, duration: nextPageDuration }
                ).start();
                this.state.top2.setValue(-height)
              } else {
                Animated.timing(
                  this.state.top0,
                  { toValue: -height, duration: resetDuration }
                ).start();
              }
            } else {
              if ((this.state.dy < -height / 4) || (gestureState.vy < -0.5)) {
                if (this.state.dataSlot0 + numberOfItem + 2 < this.props.listData.length) {
                  this.setState({ index0: 1, index2: 2, index1: 3 }, () => {
                    this.setState({ dataSlot0: this.state.dataSlot0 + numberOfItem + 2 })
                  })
                  Animated.timing(
                    this.state.top1,
                    { toValue: -height, duration: nextPageDuration }
                  ).start();
                  this.state.top0.setValue(0)
                } else {
                  this.loadMore()
                }
              } else {
                Animated.timing(
                  this.state.top1,
                  { toValue: 0, duration: resetDuration }
                ).start();
              }
            }
            break;
          case 1:
            if (this.state.dy > 0) {
              if ((this.state.dy > height / 4) || (gestureState.vy > 0.5)) {
                this.setState({ index1: 2, index0: 3, index2: 1 }, () => {
                  if (this.state.dataSlot0 > numberOfItem + 1) {
                    this.setState({ dataSlot0: this.state.dataSlot0 - numberOfItem - 2 })
                  }
                })
                Animated.timing(
                  this.state.top1,
                  { toValue: 0, duration: nextPageDuration }
                ).start();
                this.state.top0.setValue(-height)
              } else {
                Animated.timing(
                  this.state.top1,
                  { toValue: -height, duration: resetDuration }
                ).start();
              }
            } else {
              if ((this.state.dy < -height / 3) || (gestureState.vy < -0.5)) {
                if (this.state.dataSlot0 + 1< this.props.listData.length) {
                  this.setState({ index1: 1, index0: 2, index2: 3 }, () => {
                    this.setState({ dataSlot1: this.state.dataSlot1 + numberOfItem + 2 })
                  })
                  Animated.timing(
                    this.state.top2,
                    { toValue: -height, duration: nextPageDuration }
                  ).start();
                  this.state.top1.setValue(0)
                } else {
                  this.loadMore()
                }
              } else {
                Animated.timing(
                  this.state.top2,
                  { toValue: 0, duration: resetDuration }
                ).start();
              }
            }
            break;
          default:

        }

        // if ((0 > this.state["top"+this.state.itemIndex%3]._value)&&(this.state["top"+this.state.itemIndex%3]._value < -height/3)) {
        //   Animated.timing(
        //     this.state["top"+this.state.itemIndex%3],
        //     {toValue: -height, duration: 300}
        //   ).start();
        // } else {
        //   Animated.timing(
        //     this.state.top3,
        //     {toValue: 0, duration: 300}
        //   ).start();
        // }
      }
    });
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.props.listCate.length == 0) {
        this.props.navigation.navigate('Category_Screen')
      }
    }, 200)
  }
  fetchData(linkRSS, cate, cateColor, i, callback) {
    // let data = this.state["data" + i]
    let data = []
    fetch(linkRSS)
      .then((response) => response.text())
      .then((responseData) => {
        $ = cheerio.load(responseData, {
          xmlMode: true,
          decodeEntities: true
        })
        $('.list-remain-category >article').each(function () {
          let thumb = $(this).find('figure').find('a img').attr('src').replace(/\s+ /g, "").replace(/(\r\n|\n|\r)/gm, "")
          let title = $(this).find('.title-full').attr('title').toString().replace(/\s+ /g, "").replace(/(\r\n|\n|\r)/gm, "")
          let summary = $(this).find('.summary').text().toString().replace(/\s+ /g, "").replace(/(\r\n|\n|\r)/gm, "")
          //date
          // let date = $(this).find('.time').text().toString().replace(/\s+ /g, "").replace(/(\r\n|\n|\r)/gm, "")
          // let decodeDate = $.parseHTML(date);
          // title
          let decodeTitle = $.parseHTML(title);
          let editTitle = decodeTitle[0].data.replace(/[$\\@\\\#%\^\&\*\(\)\[\]\+\_\{\}\`\~\=\.\|]/g ,"");
          let decodeSummary = $.parseHTML(summary);
          // //time
          // let time = decodeDate[0].data
          // let minutes = time.slice(0, 2)
          // let convertMinutesToMiliSe = parseInt(minutes) * 60 * 1000
          // let now = new Date().getTime()
          // let newsTime = now - convertMinutesToMiliSe
          let newsTime = $(this).find('.time').text().trim().replace('ph&uacute;t', 'phút');
          //source
          let source = $(this).find('.meta span').text().toString().replace(/\s+ /g, "").replace(/(\r\n|\n|\r)/gm, "")
          let decodeSource = $.parseHTML(source);
          let newSource = decodeSource[0].data
          if (decodeSummary !== null) {
            data.push({
              title: editTitle,
              thumb: thumb,
              des: decodeSummary[0].data,
              url: $(this).find('figure').find('a').attr('href').replace(/\s+ /g, ""),
              date: newsTime,
              cate: cate,
              cateColor: cateColor,
              source: newSource
            })
          }
        })
        this.setState({
          ['data' + i]: data,
          refreshing: false,
        }, () => callback())
      })
  }
  toDetail(postId, data) {
    let listRecent = this.state.listRecent;
    for (var i = 0; i < listRecent.length; i++) {
      if (listRecent[i].title == data.title) {
        listRecent.splice(i, 1);
      }
    }
    if (listRecent.length < 30) {
      listRecent.unshift(data)
    }
    else {
      listRecent.pop();
      listRecent.unshift(data)
    }
    this.props.dispatch(replaceRecent(listRecent));
    //tracking
    this.tracker.child(data.title.replace(/\./g,"")).transaction(function(view) {
      return view + 1;
    })
    this.tracker2.child(data.cate).transaction(function(view) {
      return view + 1;
    })
    AsyncStorage.setItem('listRecent', JSON.stringify(listRecent))
    this.props.dispatch(selectedPost0(postId))
    if (postId + 1 < this.props.listData.length) {
      this.props.dispatch(selectedPost1(postId + 1))
    }
    // if (postId - 1 >= 0) {
      this.props.dispatch(selectedPost2(postId - 1))
    // }
    setTimeout(() => { this.props.navigation.navigate('Detail_Screen') }, 100)
  }
  renderLoading() {
    if (this.props.listCate.length == 0) {
      return (
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate('Category_Screen') }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Text>   Hãy chọn Category --></Text></View>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: width, height: height }}><Text>Loading...</Text></View>
      )
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.postBackground }}>
        {/*<View style={styles.navBarContainer}>
          <Image
            style={{ width: 25, height: 25, marginLeft: 20, tintColor: this.props.textColor }}
            source={require('../../img/navicon_menu.png')} />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ListNewsOffline_Screen')}>
            <View style={{ marginRight: 20, height: 30, width: 100, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text>

              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Category_Screen')}>
            <View style={{ marginRight: 20, height: 30, width: 100, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'transparent' }}>
              <Text style={{ color: this.props.textColor }}>
                Chọn Cate
                </Text>
            </View>
          </TouchableOpacity>
        </View>*/}
        <StatusBar
          barStyle="light-content"
        />
        <View style={{ height: 20, width: width, backgroundColor: 'black', position: 'absolute', zIndex: 5 }}>
        </View>
        {!this.state.loading ?
          <View {...this._panResponder.panHandlers}>

            <Animated.View
              style={{ position: 'absolute', top: this.state.top0, zIndex: this.state.index0, backgroundColor: (this.state.index0 == 1) ? 'rgba(232, 232, 232, 0.43)' : 'white' }}
            >
              <NewsItem2
                navigation={this.props.navigation}
                onPress={() => this.toDetail(this.state.dataSlot0, this.props.listData[this.state.dataSlot0])}
                data={this.props.listData[this.state.dataSlot0]} />
            </Animated.View>

            <Animated.View
              style={{ position: 'absolute', top: this.state.top1, zIndex: this.state.index1, backgroundColor: (this.state.index1 == 1) ? 'rgba(232, 232, 232, 0.43)' : 'white' }}
            >
              <NewsList
                navigation={this.props.navigation}
                data={this.props.listData.slice(this.state.dataSlot1, this.state.dataSlot1 + numberOfItem)}
                dataIndex={this.state.dataSlot1} />
            </Animated.View>

            <Animated.View
              style={{ position: 'absolute', top: this.state.top2, zIndex: this.state.index2, backgroundColor: (this.state.index2 == 1) ? 'rgba(232, 232, 232, 0.43)' : 'white' }}
            >
              <NewsItem2
                navigation={this.props.navigation}
                onPress={() => this.toDetail(this.state.dataSlot2, this.props.listData[this.state.dataSlot2])}
                data={this.props.listData[this.state.dataSlot2]} />
            </Animated.View>
          </View>
          :
          this.renderLoading()}

      </View>
    );
  }
}
const styles = StyleSheet.create({
  menuBar: {
    height: 40,
    width: width,
    flexDirection: 'row',
    backgroundColor: 'blue',
    position: 'absolute',
    top: 20,
    left: 20
  }
})
const mapStateToProps = state => {
  return {
    listData: state.loadListDataReducer.list,
    listCate: state.listCateReducer.list,
    reload: state.listCateReducer.reload,
    postBackground: state.readerModalReducer.postBackground,
    textColor: state.readerModalReducer.textColor,
  }
}
export default connect(mapStateToProps)(Home);
