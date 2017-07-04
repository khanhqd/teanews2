import React, { Component } from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image, AsyncStorage } from 'react-native';
var { height, width } = Dimensions.get('window');
import NewsListItem from './NewsListItem';
import { loadListData, selectedPost0, selectedPost1, selectedPost2, addRecent } from '../actions';
import { connect } from 'react-redux';

class NewsList extends Component {
  constructor(props) {
    super(props)
  }
  toDetail(postId) {
    let listRecent = this.props.listRecent
    if (listRecent.length < 30) {
      listRecent.unshift(this.props.listData[postId])
    }
    else {
      listRecent.pop();
      listRecent.unshift(this.props.listData[postId])
    }
    AsyncStorage.setItem('listRecent', JSON.stringify(listRecent))
    this.props.dispatch(selectedPost0(postId))
    this.props.dispatch(selectedPost1(postId + 1))
    this.props.dispatch(selectedPost2(postId - 1))
    this.props.navigation.navigate('Detail_Screen')
  }
  renderStatusBar() {
    if (this.props.postBackground == 'white') {
      return (
        <View style={styles.menuBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
            style={{height: 45, width: 45, justifyContent: 'center', alignItems: 'center', marginLeft: 5}}
            onPress={() => { this.props.navigation.navigate('DrawerOpen') }}>
              <Image source={require('../../img/ic_list_b.png')} style={{ height: 24, width: 24 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', fontSize: 20, marginLeft: 20, color: this.props.textColor, fontWeight: 'bold' }}></Text>
          </View>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Search_Screen') }}>
            <Image source={require('../../img/ic_search_b.png')} style={{ height: 24, width: 24 }} />
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        <View style={styles.menuBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
            style={{height: 45, width: 45, justifyContent: 'center', alignItems: 'center', marginLeft: 5}}
            onPress={() => { this.props.navigation.navigate('DrawerOpen') }}>
              <Image source={require('../../img/ic_night_list_b.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', fontSize: 20, marginLeft: 20, color: this.props.textColor, fontWeight: 'bold' }}></Text>
          </View>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Search_Screen') }}>
            <Image source={require('../../img/ic_search_b.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor }} />
          </TouchableOpacity>
        </View>
      )
    }
  }
  msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100)
      , seconds = parseInt((duration / 1000) % 60)
      , minutes = parseInt((duration / (1000 * 60)) % 60)
      , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    //seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes
  }
  render() {
    if (this.props.data) {
      // let date = new Date(this.props.data[0].date).toDateString()
      // let time = this.msToTime(this.props.data[0].date)
      // let date1 = new Date(this.props.data[1].date).toDateString()
      // let time1 = this.msToTime(this.props.data[0].date)
      // let date2 = new Date(this.props.data[2].date).toDateString()
      // let time2= this.msToTime(this.props.data[0].date)
      return (
        <View style={[{ height: height, backgroundColor: this.props.postBackground }, this.props.style]}>
          {this.renderStatusBar()}
          <TouchableOpacity
            onPress={() => this.toDetail(this.props.dataIndex)}
            style={{ width: width - 20, height: width - 40, margin: 10 }}>
            <View style={{ flex: 1 }}>
              <Image
                resizeMode="cover"
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                source={{ uri: this.props.data[0].thumb }} />
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
                <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                  <View style={[styles.category, { backgroundColor: this.props.data[0].cateColor }]}>
                    <Text style={styles.categoryText}>{this.props.data[0].cate}
                    </Text>
                  </View>
                  <Text style={styles.categoryText}>{this.props.data[0].date}
                  </Text>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{this.props.data[0].title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ color: 'rgb(221, 221, 221)', fontSize: 15, marginBottom: 10 }}>{this.props.data[0].des}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ width: width - 20, height: height / 2 - 90, margin: 10, marginTop: 0, flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this.toDetail(this.props.dataIndex + 1)}
              style={{ flex: 1, marginRight: 5 }}>
              <View style={{ backgroundColor: this.props.data[1].cateColor, flex: 1, justifyContent: 'space-between', padding: 10 }}>
                <View style={[styles.category, { backgroundColor: this.props.data[1].cateColor, borderColor: 'white', borderWidth: 1 }]}>
                  <Text style={styles.categoryText}>{this.props.data[1].cate}
                  </Text>
                </View>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }} numberOfLines={5} ellipsizeMode="tail">{this.props.data[1].title}
                </Text>
                <Text style={styles.categoryText}>{this.props.data[1].date}
                </Text>

              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toDetail(this.props.dataIndex + 2)}
              style={{ flex: 1, marginLeft: 5, backgroundColor: 'yellow' }}>
              <View style={{ flex: 1 }}>
                <Image
                  resizeMode="cover"
                  style={{ position: 'absolute', width: '100%', height: '100%' }}
                  source={{ uri: this.props.data[2].thumb }} />
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'space-between', padding: 10 }}>
                  <View style={[styles.category, { borderColor: 'white', borderWidth: 1 }]}>
                    <Text style={styles.categoryText}>{this.props.data[2].cate}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={5}
                    ellipsizeMode="tail"
                    style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{this.props.data[2].title}
                  </Text>
                  <Text style={styles.categoryText}>{this.props.data[2].date}
                  </Text>

                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else { return <View></View> }
  }
}
// this.props.dataIndex+index
const mapStateToProps = state => {
  return {
    postBackground: state.readerModalReducer.postBackground,
    textColor: state.readerModalReducer.textColor,
    listData: state.loadListDataReducer.list,
    listRecent: state.bookmarkReducer.listRecent
  }
}
const styles = {
  category: {
    borderRadius: 5,
    marginBottom: 10,
    width: 80,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
    borderRadius: 4
  },
  menuBar: {
    marginTop: 30,
    height: 30,
    width: width,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20
  },
}
export default connect(mapStateToProps)(NewsList);
