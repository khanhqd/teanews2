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
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
var { height, width } = Dimensions.get('window');

import _ from 'lodash';
import { RunsItem, Button1 } from '../common';
const cheerio = require('cheerio-without-node-native');
import * as Animatable from 'react-native-animatable';
var Toast = require('react-native-toast');

// import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { connect } from 'react-redux';
import {
  changeFontSize, changeModalState, changeBackgroundColor, rootLink2, rootLink3,
  changeTextColor, changeNightMode, changeLoadingState, changeLineHeight, hideBottomBar, rootLink1
} from '../actions';
var WEBVIEW_REF = 'webview';
import FitImage from 'react-native-fit-image';
import HTMLView from './react-native-htmlview';

class NewsItem extends Component {
  constructor(props) {
    super(props);
    this.onScroll = this.onScroll.bind(this);
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
    logo: '',
    reRender: false,
    linkShare: ''
  };
  componentWillMount() {
    if (this.props.row) {
      this.fetchContent(this.props.row)
    }
  }
  componentWillReceiveProps(props) {
    if ((props.row != this.props.row) && (props.row)) {
      this.setState({ loading: true, reRender: true }, () => { this.fetchContent(this.props.row) })
    }
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
        Linking.openURL(this.state.linkShare);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.row.url);
      }
    });
  }
  fetchContent(row) {
    this.props.dispatch(changeLoadingState(true))
    let sourceReal;
    this.setState({ loading: true, reRender: false });
    setTimeout(() => this.setState({ loading: false }), 4000);
    let url = row.url
    let other = []
    fetch(url)
      .then((response) => response.text())
      .then((responseData) => {
        $ = cheerio.load(responseData);
        let source = $(".meta > .span-website").text().replace(/\s+ /g, '')
        $("a").parent(".Normal").remove();
        $("em").parent(".Normal").remove();
        $("i").parent().parent(".blockquote-reverse").remove();
        $("span,em,i,a,b,strong,ins ,u").replaceWith(function () { return $(this).contents(); });
        $("[data-component-type=video]").replaceWith("<strong>Bài viết chứa video, vui lòng mở link bằng trình duyệt để xem video</strong>");
        $("video").replaceWith("<strong>Bài viết chứa video, vui lòng mở link bằng trình duyệt để xem video</strong>");
        $(".see-now,.author_mail.width_common,.tbl_insert, span.author").remove();
        console.log(source)
        let text = $(".newbody p").last().text()
        let linkShare = $("input.hidden").attr("value")
        if (text.includes(">>> Đọc thêm") || text.includes("Bấm xem")) {
          $(".newbody p").last().remove();
        }
        this.setState({
          bodyHTML: $('.newbody').html(),
          sourceReal: source
        }, () => {
          this.setState({
            loading: false,
            linkShare: linkShare
          }, () => this.updateWebview(row))

        })

      })
  }
  updateWebview(row) {
    this.props.dispatch(changeLoadingState(false))
    switch (this.props.stt) {
      case 0: {
        this.props.dispatch(rootLink1(this.state.linkShare))
        break;
      }
      case 1: {
        this.props.dispatch(rootLink2(this.state.linkShare))
        break;
      }
      case 2: {
        this.props.dispatch(rootLink3(this.state.linkShare))
        break;
      }
    }
    let source = this.state.sourceReal
    let icon = source.replace(/\s+/g, '')
    switch (icon) {
      case 'VnExpress': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/vnExpress.png`),
        })
        break;
      }
      case '24h': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/24h.png`)
        })
        break;
      }
      case 'Bóngđá24h': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/bongda24h.png`),
        })
        break;
      }
      case 'BóngđáPlus': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/bongdaplus.png`),
        })
        break;
      }
      case 'Dân Việt': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/danviet.png`),
        })
        break;
      }
      case 'Dântrí': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/dantri.png`),
        })
        break;
      }
      case 'BáođấtViệt': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/baodatviet.png`),
        })
        break;
      }
      case 'ViệtBáo': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/vietbao.png`),
        })
        break;
      }
      case 'ThanhNiên': {
        this.setState({
          source: this.props.row.source,
          loading: false,
          logo: require(`../../img/logo/thanhnien.png`),
        })
        break;
      }
      case 'Tiền Phong': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/tienphong.png`),
        })
        break;
      }
      case 'Thể thao văn hoá': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/thethaovanhoa.png`),
        })
        break;
      }
      case 'CafeBiz': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/cafeBiz.png`),
        })
        break;
      }
      case 'Vov': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/vov.png`),
        })
        break;
      }
      case 'PhápLuậtHCM': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/plo.png`),
        })
        break;
      }
      case 'Báomới': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/baomoi.png`),
        })
        break;
      }
      case 'BáoGiaothông': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/baogiaothong.png`),
        })
        break;
      }
      case 'InfoNet': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/infonet.png`),
        })
        break;
      }
      case 'Vinacorp': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/vinacorp.png`),
        })
        break;
      }
      case 'Một thế giới': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/motthegioi.png`),
        })
        break;
      }
      case 'Soha': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/soha.png`),
        })
        break;
      }
      case 'BáoLaoĐộng': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/baolaodong.png`),
        })
        break;
      }
      case 'Vietnamnet': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/vietnamnet.png`),
        })
        break;
      }
      case 'NgôiSao': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/ngoisao.png`),
        })
        break;
      }
      case 'ĐờiSốngPhápLuật': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/doisongphapluat.png`),
        })
        break;
      }
      case 'NgườiĐưaTin': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/nguoiduatin.png`),
        })
        break;
      }
      case 'Phunutoday': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/phunutoday.png`),
        })
        break;
      }
      case 'BlogTâmSự': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/blogtamsu.png`),
        })
        break;
      }
      case 'PhápLuậtPlus': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/phapluatplus.png`),
        })
        break;
      }
      case 'NgườiLaoĐộng': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/nguoilaodong.png`),
        })
        break;
      }
      case 'BáoTuổiTrẻ': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/tuoitre.png`),
        })
        break;
      }
      case 'XeHay': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/xehay.png`),
        })
        break;
      }
      case 'Kiếnthức': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/kienthuc.png`),
        })
        break;
      }
      case 'AutoPro': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/autopro.png`),
        })
        break;
      }
      case 'CafeAuto': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/cafeauto.png`),
        })
        break;
      }
      case 'AutoDaily': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/autodaily.png`),
        })
        break;
      }
      case 'ICTNews': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/infonet.png`),
        })
        break;
      }
      case 'Kênh14': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/kenh14-2.png`),
        })
        break;
      }
      case 'ĐạiKỷNguyên': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/daikynguyen-3.png`),
        })
        break;
      }
      case 'TríThứcTrẻ': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/trithuctre-2.png`),
        })
        break;
      }
      case '2Sao': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/2sao-2.png`),
        })
        break;
      }
      case 'VnEconomy': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/vneconomy-2.png`),
        })
        break;
      }
      case 'GiáodụcThờiđại': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/giaoducthoidai.png`),
        })
        break;
      }
      case 'Eva': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/eva.png`),
        })
        break;
      }
      case 'Thểthao247': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/thethao247.png`),
        })
        break;
      }
      case 'Côngannhândân': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/cand.png`),
        })
        break;
      }
      case 'PcWorld': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/infonet.png`),
        })
        break;
      }
      case 'BáoPhụNữ': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/baophunu-0.png`),
        })
        break;
      }
      case 'NetLife': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/netlife.png`),
        })
        break;
      }
      case 'Baoduhoc': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/baoduhoc.png`),
        })
        break;
      }
      case 'Game4V': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/game4v.png`),
        })
        break;
      }
      case 'GameK': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/gameK.png`),
        })
        break;
      }
      case 'BáoXãHội': {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/logo/baoxahoi.png`),
        })
        break;
      }
      default: {
        this.setState({
          source: source,
          loading: false,
          logo: require(`../../img/tinmoi24h.png`),
        })
        break;
      }
    }
  }
  loading() {
    if (this.state.loading) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 4, backgroundColor: this.props.postBackground, width: width, height: height }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
  }

  onScroll = (e) => {
    var scrollHeight = e.nativeEvent.contentOffset.y + height - 50;
    var contentHeight = e.nativeEvent.contentSize.height;
    var num = scrollHeight - contentHeight;
    if (e.nativeEvent.contentOffset.y > 100) {
      if (e.nativeEvent.contentOffset.y > this.state.disToTop) {
        this.props.dispatch(hideBottomBar(true))
        this.setState({ disToTop: e.nativeEvent.contentOffset.y })
      } else {
        this.props.dispatch(hideBottomBar(false))
        this.setState({ disToTop: e.nativeEvent.contentOffset.y })
      }
    } else {
      this.props.dispatch(hideBottomBar(false))
    }
    if (contentHeight > height) {
      this.setState({ pullToCloseDist: num })
      if (num <= 10) {
        this.setState({ pullToCloseColor: "white" })
      } else if ((num > 10) && (num < 100)) {
        this.setState({ pullToCloseColor: "rgba(0,0,0,0." + Math.floor(num) + ")" })
      } else {
        this.setState({ pullToCloseColor: "black" })
      }
    } else {
      this.setState({ pullToCloseDist: e.nativeEvent.contentOffset.y })
    }
  }
  switcherPressed() {
    if (this.props.postBackground == 'white') {
      this.props.dispatch(changeTextColor('#d8d8d8'));
      this.props.dispatch(changeBackgroundColor('#171717'));
      this.props.dispatch(changeNightMode(true));
    } else {
      this.props.dispatch(changeTextColor('black'));
      this.props.dispatch(changeBackgroundColor('white'));
      this.props.dispatch(changeNightMode(false));
    }
    setTimeout(() => { this.fetchContent(this.props.row) }, 100)
  }
  // msToTime(duration) {
  //   var milliseconds = parseInt((duration % 1000) / 100)
  //     , seconds = parseInt((duration / 1000) % 60)
  //     , minutes = parseInt((duration / (1000 * 60)) % 60)
  //     , hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  //
  //   hours = (hours < 10) ? "0" + hours : hours;
  //   minutes = (minutes < 10) ? "0" + minutes : minutes;
  //   seconds = (seconds < 10) ? "0" + seconds : seconds;
  //
  //   return hours + ":" + minutes + ":" + seconds;
  // }
  render() {
    const styles2 = {
      h1: {
        fontSize: this.props.fontSize,
        color: this.props.textColor,
      },
      h2: {
        fontSize: this.props.fontSize,
        fontWeight: '500',
        color: this.props.textColor,
      },
      h3: {
        fontWeight: '400',
        fontSize: this.props.fontSize,
        color: this.props.textColor,
      },
      p: {
        fontSize: this.props.fontSize,
        color: this.props.textColor,
        lineHeight: this.props.lineHeight,

      },
      td: {
        fontSize: 15,
        color: this.props.textColor,
        lineHeight: this.props.lineHeight
      },
      strong: {
        color: this.props.textColor,
        fontSize: this.props.fontSize,
        fontWeight: '600',
        lineHeight: this.props.lineHeight
      },
      ul: {
        padding: 0,
      },
      span: {
        fontSize: this.props.fontSize,
        color: this.props.textColor,
        lineHeight: this.props.lineHeight
      },
      i: {
        fontSize: this.props.fontSize,
        color: this.props.textColor,
        lineHeight: this.props.lineHeight
      },
      div: {
        fontSize: this.props.fontSize,
        color: this.props.textColor,
        lineHeight: this.props.lineHeight
      },
      font: {
        fontSize: this.props.fontSize,
        color: this.props.textColor,
        lineHeight: this.props.lineHeight
      },
      em: {
        fontSize: this.props.fontSize,
        color: this.props.textColor,
        lineHeight: this.props.lineHeight
      },
    };
    // let date = new Date(this.props.row.date);
    // let convertToDate = date.toDateString();
    // let time = this.msToTime(this.props.row.date);
    return (
      <View>
        <View style={{ height: 20, width: width, backgroundColor: 'black' }}>
        </View>
        {this.props.openMenu &&
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={() => this.props.dispatch(changeModalState(!this.props.openMenu))}>
            <Animatable.View animation="slideInUp" useNativeDriver duration={300} style={[styles.menuModal, { backgroundColor: this.props.postBackground, borderColor: this.props.textColor }]}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={() => {
                    if (this.props.fontSize > 7) {
                      this.props.dispatch(changeFontSize(this.props.fontSize - 2));
                      this.props.dispatch(changeLineHeight(this.props.lineHeight - 2));
                      setTimeout(() => { this.fetchContent(this.props.row) }, 100)
                    } else {
                      Toast.show('Cỡ chữ đã thu nhỏ tối đa');
                    }
                    if (Platform.OS === 'android') {
                      setTimeout(() => this.reloadWebview(), 200)
                    }
                  }}
                  style={[styles.modalItem, { borderRightWidth: 0.5, borderTopLeftRadius: 10, borderColor: this.props.textColor }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: this.props.textColor, fontSize: 18 }}>A</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={() => {
                    if (this.props.fontSize < 30) {
                      this.props.dispatch(changeFontSize(this.props.fontSize + 2));
                      this.props.dispatch(changeLineHeight(this.props.lineHeight + 2));
                      setTimeout(() => { this.fetchContent(this.props.row) }, 100)
                    } else {
                      Toast.show('Cỡ chữ đã tăng tối đa');
                    }
                    if (Platform.OS === 'android') {
                      setTimeout(() => this.reloadWebview(), 200)
                    }
                  }}
                  style={[styles.modalItem, { borderTopRightRadius: 10, borderColor: this.props.textColor }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: this.props.textColor }}>A</Text>
                  </View>
                </TouchableHighlight>

              </View>
              <TouchableHighlight
                underlayColor="white"
                onPress={() => this.switcherPressed()}
                style={[styles.modalItem, { borderColor: this.props.textColor, borderTopWidth: 0.5 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2 }}>
                    <Image source={require('../../img/ic_moon_b.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor }} />
                    <Text style={[styles.modalText, { color: this.props.textColor }]}>Chế độ đọc ban đêm</Text>
                  </View>
                  <Switch
                    value={this.props.nightMode}
                    onValueChange={() => {
                      this.switcherPressed();
                    }} />
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
                onPress={() => this._openLink()}
                style={[styles.modalItem, { borderColor: this.props.textColor }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 19 }}>
                  <Image source={require('../../img/ic_web_b.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor }} />
                  <Text style={[styles.modalText, { color: this.props.textColor }]}>Mở trang trong trình duyệt
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
                style={[styles.modalItem, { borderBottomWidth: 0, borderColor: this.props.textColor }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 19 }}>
                  <Image source={require('../../img/ic_offline_b.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor }} />
                  <Text style={[styles.modalText, { color: this.props.textColor }]}>Lưu trang đọc offline</Text>
                </View>
              </TouchableHighlight>

            </Animatable.View>
          </TouchableOpacity>
        }
        {this.loading()}

        {!this.state.reRender &&
          <ScrollView
            onScroll={this.onScroll}
            scrollEventThrottle={100}
            onTouchEnd={() => {
              this.props.dispatch(hideBottomBar(false))
              if (this.state.pullToCloseDist > 70) {
                this.props.navigation.goBack();
              }
            }}
            style={{ width: width, height: height - 20, backgroundColor: this.props.postBackground, marginBottom: 50 }}
          >
            <Text style={{ fontFamily: 'Lora-Regular', margin: 10, marginLeft: 15, color: this.props.textColor, fontSize: 30, fontWeight: 'bold', marginTop: 0 }}>{this.props.row.title}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              {this.props.row.cate !== undefined &&
                <View style={[styles.cateContainer, { backgroundColor: this.props.row.cateColor }]}>
                  <Text style={styles.textCate}>{this.props.row.cate}</Text>
                </View>
              }
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                {(this.state.logo != '') &&
                  <Image resizeMode='cover' source={this.state.logo} style={{ height: 20, width: 20 }} />
                }
                <Text style={{ textAlign: 'center', marginLeft: 10, fontSize: 11, color: '#9b9b9b' }}>{this.state.source} | </Text>
              </View>
              <Text style={{ marginRight: 20, textAlign: 'center', color: '#9b9b9b', fontSize: 11 }}>{this.props.row.date}</Text>
            </View>
            <HTMLView
              value={this.state.bodyHTML}
              stylesheet={styles2}
            />

            <View style={{ width: 100, height: 40, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
              <Text style={{ color: this.state.pullToCloseColor }}> Pull To Close
              </Text>
            </View>

          </ScrollView>
        }
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
    marginLeft: 15,
    borderRadius: 3,
    marginRight: 15,
    width: 80,
  },
  textCate: {
    color: "white",
    textAlign: "center",
    fontSize: 13,
    margin: 3,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 4,
  },
  sourceContainer: {
    marginLeft: 15,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    justifyContent: 'center',
    flex: 1
  },
  modalText: {
    marginLeft: 10
  },
  menuModal: {
    elevation: 5,
    shadowOpacity: 0.3,
    height: 200,
    width: width * 3 / 4,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  modalContainer: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.39)',
    justifyContent: 'flex-end',
    paddingBottom: 55,
    alignItems: 'flex-end'
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
    menuBarColor: state.readerModalReducer.menuBarColor,
    lineHeight: state.readerModalReducer.lineHeight,
  }
}
export default connect(mapStateToProps)(NewsItem);
