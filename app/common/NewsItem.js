import React, { Component } from 'react';
import {
  View, Text, Dimensions, Platform, TouchableOpacity, Image,
  TouchableHighlight,
  TextInput,
  WebView,
  Share,
  Linking,
  Clipboard,
  ScrollView,
  AsyncStorage,
  Alert,
  Switch,
  Animated,
  Easing,
  StyleSheet
} from 'react-native';
var { height, width } = Dimensions.get('window');
import _ from 'lodash';
import { RunsItem, Button1 } from '../common';
const cheerio = require('cheerio-without-node-native');
import * as Animatable from 'react-native-animatable';
var Toast = require('react-native-toast');

// import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { connect } from 'react-redux';
import { changeFontSize, changeModalState, changeBackgroundColor, changeTextColor, changeNightMode, changeMenuBarColor } from '../actions';
var WEBVIEW_REF = 'webview';

import HTMLView from './react-native-htmlview';
import Video from 'react-native-video';

class NewsItem extends Component {
  constructor(props) {
    super(props)
    this.spinValue = new Animated.Value(0)
  }
  state = {
    html: '',
    openMenu: false,
    bookMark: [],
    bodyHTML: '',
    headHTML: '',
    isSaved: false,
    textSelected: '',
    loading: true,
    videoUrl: null,
    list: [],
    switcher: false,
    fontSize: 14,
    sourceReal: '',
    source: '',
    arr: [],
    logo: ''
  };
  componentWillMount() {
    if (this.props.row) {
      this.fetchContent(this.props.row)
    }
  }
  componentWillReceiveProps(props) {
    if ((props.row != this.props.row) && (props.row)) {
      this.setState({ loading: true }, () => { this.fetchContent(this.props.row) })
    }
  }
  componentDidMount() {
    this.props.dispatch(changeMenuBarColor('rgba(0, 0, 0, 0)'))
    let list = this.state.list
    AsyncStorage.getItem(`listOffline`, (err, result) => {
      if (result !== null) {
        list = JSON.parse(result)
        this.setState({
          list: list
        })
        console.log(list)
      }
    })
    this.spinLoading()
  }
  spinLoading() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 2500,
        easing: Easing.ease,
      }
    ).start(() => this.spinLoading())
  }

  _share() {
    Share.share({
      message: this.props.row.title,
      url: this.props.row.url,
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
  _showResult(result) {
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        this.setState({ result: 'shared with an activityType: ' + result.activityType });
      } else {
        this.setState({ result: 'shared' });
      }
      alert(this.state.result)
    } else if (result.action === Share.dismissedAction) {
      this.setState({ result: 'dismissed' });
      alert(this.state.result)
    }
  }
  _openLink() {
    Linking.canOpenURL(this.props.row.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.row.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.row.url);
      }
    });
  }
  fetchContent(row) {
    let sourceReal;
    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false }), 4000);
    let url = row.url
    let other = []
    fetch(url)
      .then((response) => response.text())
      .then((responseData) => {
        $ = cheerio.load(responseData);
        $("[data-component-type=video]").replaceWith("<strong>Bài viết chứa video, vui lòng mở link bằng trình duyệt để xem video</strong>");
        sourceReal = $(".span-website").text();
        $(".image,iframe,.block_filter_live,.detail_top_live.width_common,.block_breakumb_left,#menu-box,.bi-related,head,#result_other_news,#social_like,noscript,#myvne_taskbar,.block_more_info,#wrapper_header,#header_web,#wrapper_footer,.breakumb_timer.width_common,.banner_980x60,.right,#box_comment,.nativeade,#box_tinkhac_detail,#box_tinlienquan,.block_tag.width_common.space_bottom_20,#ads_endpage,.block_timer_share,.title_news,.div-fbook.width_common.title_div_fbook,.xemthem_new_ver.width_common,.relative_new,#topbar,#topbar-scroll,.text_xemthem,#box_col_left,.form-control.change_gmt,.tt_2,.back_tt,.box_tinkhac.width_common,#sticky_info_st,.col_fillter.box_sticky_left,.start.have_cap2,.cap2,.list_news_dot_3x3,.minutes,#live-updates-wrapper,.block_share.right,.block_goithutoasoan,.xemthem_new_ver.width_common,meta,link,.menu_main,.top_3,.number_bgs,.filter_right,#headmass,.box_category.width_common,.banner_468.width_common,.adsbyeclick,.block_col_160.right,#ArticleBanner2,#ad_wrapper_protection,#WIDGET").remove();
        if (url.includes("http://tinmoi24.vn/") == false) {
          this.setState({ bodyHTML: $('.main_content_detail.width_common').html() }, () => {
            this.updateWebview(row)
          })
        }
        else {
          $("a").parent().remove();
          this.setState({
            bodyHTML: $('.newbody').html(),
            sourceReal: sourceReal
          }, () => {
            this.setState({ loading: false }, () => this.updateWebview(row))

          })
        }
      })
  }
  updateWebview(row) {
    if (row.url.includes("vnexpress")) {
      this.setState({
        source: "Vnexpress.net",
        loading: false,

      })
    } else {
      this.setState({
        source: 'Tinmoi24h.vn',
        loading: false,

      })
    }
  }
  loading() {
    if (this.state.loading) {
      const spin = this.spinValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '360deg', '720deg']
      })
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 4, backgroundColor: this.props.postBackground, width: width, height: height }}>
          <Animated.Image
            source={require('../../img/load-icon.png')}
            style={{
              height: 40,
              width: 40,
              transform: [{ rotate: spin }]
            }}
          />
          <Text style={{ color: this.props.textColor }}>Loading...
          </Text>
        </View>
      )
    }
  }

  switcherPressed() {
    if (this.props.postBackground == 'white') {
      this.props.dispatch(changeTextColor('white'));
      this.props.dispatch(changeBackgroundColor('black'));
      this.props.dispatch(changeNightMode(true));
    } else {
      this.props.dispatch(changeTextColor('black'));
      this.props.dispatch(changeBackgroundColor('white'));
      this.props.dispatch(changeNightMode(false));
    }

  }
  render() {
    const styles2 = {
      h1: {
        paddingLeft: 20,
        paddingRight: 10,
        fontSize: this.props.fontSize,
        color: this.props.textColor,
      },
      h2: {
        paddingLeft: 20,
        paddingRight: 10,
        fontSize: this.props.fontSize,
        fontWeight: '500',
        color: this.props.textColor,
      },
      h3: {
        paddingLeft: 20,
        paddingRight: 10,
        fontWeight: '400',
        fontSize: this.props.fontSize,
        color: this.props.textColor,
      },
      p: {
        paddingLeft: 20,
        paddingRight: 10,
        fontSize: this.props.fontSize,
        color: this.props.textColor,
      },
      td: {
        paddingLeft: 20,
        paddingRight: 10,
        fontSize: 15,
        color: this.props.textColor
      },
      strong: {
        color: this.props.textColor,
        fontSize: this.props.fontSize,
      },
      ul: {
        padding: 0,
      }
    };
    let date = new Date(this.props.row.date)
    let time = date.toLocaleDateString();
    return (
      <View>
        {this.props.openMenu &&
          <TouchableOpacity style={styles.modalContainer} onPress={() => this.props.dispatch(changeModalState(!this.props.openMenu))}>
            <Animatable.View animation="slideInDown" duration={300} style={[styles.menuModal, { backgroundColor: this.props.postBackground }]}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={() => {
                    if (this.props.fontSize < 30) {
                      this.props.dispatch(changeFontSize(this.props.fontSize + 2));
                      setTimeout(() => {
                        this.props.dispatch(changeModalState(!this.props.openMenu))
                      }, 100)
                    } else {
                      Toast.show('Cỡ chữ đã tăng tối đa');
                    }
                    if (Platform.OS === 'android') {
                      setTimeout(() => this.reloadWebview(), 200)
                    }
                  }}
                  style={[styles.modalItem, { borderRightWidth: 1, borderTopLeftRadius: 10 }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: this.props.textColor }}>A</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={() => {
                    if (this.props.fontSize > 7) {
                      this.props.dispatch(changeFontSize(this.props.fontSize - 2));
                      setTimeout(() => {
                        this.props.dispatch(changeModalState(!this.props.openMenu))
                      }, 100)
                    } else {
                      Toast.show('Cỡ chữ đã thu nhỏ tối đa');
                    }
                    if (Platform.OS === 'android') {
                      setTimeout(() => this.reloadWebview(), 200)
                    }
                  }}
                  style={[styles.modalItem, { borderTopRightRadius: 10 }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: this.props.textColor }}>A</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                underlayColor="white"
                onPress={() => this.switcherPressed()}
                style={styles.modalItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
                  <Text style={[styles.modalText, { color: this.props.textColor }]}>Chế độ đọc ban đêm
                          </Text>
                  <Switch
                    value={this.props.nightMode}
                    onValueChange={() => {
                      this.switcherPressed();
                      setTimeout(() => {
                        this.props.dispatch(changeModalState(!this.props.openMenu))
                      }, 100)
                    }} />
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
                onPress={() => this._openLink()}
                style={styles.modalItem}>
                <View>
                  <Text style={[styles.modalText, { color: this.props.textColor }]}>Mở trong trình duyệt
                          </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
                onPress={() => {
                  Clipboard.setString(this.props.row.url);
                  Toast.show('Đã sao chép link');
                  this.props.dispatch(changeModalState(!this.props.openMenu))
                }}
                style={[styles.modalItem, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomWidth: 0 }]}
              >
                <View>
                  <Text style={[styles.modalText, { color: this.props.textColor }]}>Sao chép link
                          </Text>
                </View>
              </TouchableHighlight>

            </Animatable.View>
          </TouchableOpacity>
        }
        {this.loading()}

        <ScrollView style={{ height: height, backgroundColor: this.props.postBackground, paddingTop: 56 }}
        >
          <Text style={{ marginLeft: 20, color: this.props.textColor, fontSize: this.props.fontSize + 5, fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{this.props.row.title.toUpperCase()}</Text>
          <View style={[styles.cateContainer, { backgroundColor: this.props.row.cateColor }]}>
            <Text style={styles.textCate}>{this.props.row.cate}</Text>
          </View>
          <View style={styles.sourceContainer}>
            <Image source={this.props.row.logo} style={{ height: 20, width: 20, marginLeft: 20 }} />
            <Text style={{ textAlign: 'center', marginLeft: 10 }}>{this.state.source}</Text>
            <Text style={{ marginRight: 20 , marginLeft : width/2 -50, textAlign: 'center' }}>{time}</Text>
          </View>
          <HTMLView
            value={this.state.bodyHTML}
            stylesheet={styles2}
          />
        </ScrollView>

      </View>

    )
  }
}
// function renderNode(node, index, siblings, parent, defaultRenderer) {
//   if (node.name == 'figure') {
//     const a = node.attribs["data-video-src"];
//     console.log(a)
//     return (
//       <View key={index} style={{width: width, height: 300}}>
//         <Video source={{uri: a}}   // Can be a URL or a local file.
//          ref={(ref) => {
//            this.player = ref
//          }}                                      // Store reference
//          rate={1.0}                              // 0 is paused, 1 is normal.
//          muted={false}
//          paused={false}
//          resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
//          repeat={true}                           // Repeat forever.
//          playInBackground={false}                // Audio continues to play when app entering background.
//          playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
//          style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             bottom: 0,
//             right: 0,
//           }} />
//       </View>
//     );
//   }
// }
const styles = {
  cateContainer: {
    marginTop: 5,
    marginLeft: 20,
    borderRadius: 4,
    width: 70,
  },
  textCate: {
    color: "white",
    textAlign: "center",
    fontSize: 12,
    margin: 5,
    borderRadius: 4,
  },
  sourceContainer: {
    marginTop: 10,
    height: 50,
    flexDirection: 'row',
  },
  cover: {
    justifyContent: 'center',
    height: 200,
    width: width
  },
  content: {
    justifyContent: 'flex-start',
    padding: 10,
    width: width
  },
  title: {
    fontWeight: '500',
    fontSize: 15,
    marginRight: 10
  },
  date: {
    fontSize: 13,
    color: 'grey'
  },
  info1: {
    flexDirection: 'row'
  },
  shareModal: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        zIndex: 3,
      },
      android: {
        borderColor: 'rgb(217, 217, 217)',
        borderLeftWidth: 1,
        zIndex: 4
      }
    }),
    bottom: 0,
    elevation: 5,
    shadowOpacity: 0.3,
    width: '100%'
  },
  modalItem: {
    borderColor: 'rgb(217, 217, 217)',
    borderBottomWidth: 1,
    justifyContent: 'center',
    flex: 1
  },
  modalText: {
    paddingLeft: 20
  },
  menuModal: {
    elevation: 5,
    top: 60,
    right: 20,
    marginLeft: width / 3,
    shadowOpacity: 0.3,
    borderRadius: 30,
    height: 200,
    borderColor: 'white',
    borderWidth: 1
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.39)'
  }
}

const mapStateToProps = state => {
  return {
    openMenu: state.readerModalReducer.modalState,
    fontSize: state.readerModalReducer.fontSize,
    postBackground: state.readerModalReducer.postBackground,
    textColor: state.readerModalReducer.textColor,
    disableScroll: state.readerModalReducer.disableScroll,
    nightMode: state.readerModalReducer.nightMode,
    menuBarColor: state.readerModalReducer.menuBarColor
  }
}
export default connect(mapStateToProps)(NewsItem);
