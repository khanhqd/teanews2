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
import { connect } from 'react-redux';
import { changeModalState, addBookmark, replaceBookmark } from '../actions';
var Toast = require('react-native-toast');

class RecentReading extends Component {
  constructor(props) {
    super(props);
  };
  _set = async (key, value) => {
      try { await AsyncStorage.setItem(key, value); }
      catch (error) { console.log(error.message) }
  };
  saveBookmark() {
        var postInfo = this.props.navigation.state.params.row;
        var selected = false;
        // this._set('listBookmark', JSON.stringify(this.props.listBookmark));
        let listBookmark = this.props.listBookmark;
        for(var i=0; i<listBookmark.length; i++) {
          if (listBookmark[i].title == postInfo.title) {
            selected = true;
            break;
          }
        }
        if(selected == true) {
            //delete from Async
            for (var i = listBookmark.length - 1; i>=0; i--) {
              if (listBookmark[i].title == postInfo.title) {
                listBookmark.splice(i,1);
                Toast.show('Đã bỏ lưu')
              }
            }
            this.props.dispatch(replaceBookmark(listBookmark))
            this._set('listBookmark', JSON.stringify(listBookmark))
        } else {
            // listBookmark.push(postInfo);
            this._set('listBookmark', JSON.stringify(listBookmark))
            this.props.dispatch(addBookmark(postInfo))
            Toast.show('Đã lưu')
        }
  }
  shareLink() {
    var page = this.props.navigation.state.params.row;
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
            <NewsItem
              navigation = {this.props.navigation}
              row={this.props.navigation.state.params.row} />
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
    listBookmark: state.bookmarkReducer.list
  }
}
export default connect(mapStateToProps)(RecentReading);
