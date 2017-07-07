import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  AsyncStorage,
  ScrollView,
  StatusBar,
  TextInput
} from 'react-native'
import RenderItem from '../common/RenderItem.js'
const { height, width } = Dimensions.get('window')
import { connect } from 'react-redux';
const cheerio = require('cheerio-without-node-native');
import * as Animatable from 'react-native-animatable';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      listKeyword: [],
      input: '',
      result: [],
      isSearchEnd: false
    };
  }
  searchWithSuggest(data) {
    var items = [];
    this.setState({ input: data }, () => { this.searchBegin() })
  }
  remove_unicode(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(" ", "%20");
    return str;
  }
  renderResult() {
    if ((this.props.listKeyword.length != 0) && (this.state.result.length == 0)) {
      return (
        <ScrollView
          style={{ paddingLeft: 10 }}
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {this.props.listKeyword.map((data, index) => {
            return (
              <TouchableOpacity
                onPress={() => { this.searchWithSuggest(data) }}
                key={index} style={{ marginTop: 10, marginRight: 10, borderColor: '#d8d8d8', borderWidth: 1, borderRadius: 4, padding: 5 }}>
                <Text style={{ color: this.props.textColor }}>{data}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )
    } else {
      return (
        <ScrollView style={{ backgroundColor: this.props.postBackground, }}>
          {this.state.result.map((row, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => {
                this.props.navigation.navigate('BookmarkReading_Screen', { row: row })
              }}>

                <Animatable.View animation="slideInDown" duration={300} style={{ width: width, padding: 15, paddingTop: 10 }}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ color: this.props.textColor, fontFamily: "Lora-Bold", fontWeight: 'bold', fontSize: 15 }}>{row.title}
                  </Text>
                  <View style={{ flexDirection: 'row', backgroundColor: this.props.postBackground }}>
                    <View style={{ height: 80, width: 80 }}>
                      <Image
                        style={{ width: 80, height: 80 }}
                        source={{ uri: row.thumb }}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={{ height: 55, color: this.props.textColor }}>{row.des}
                      </Text>
                      <Text style={{ fontStyle: 'italic', fontSize: 12, color: 'grey', marginTop: 5 }}>{row.date}
                      </Text>
                    </View>
                  </View>
                </Animatable.View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )
    }
  }
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.postBackground }]}>
        <View style={{ height: 20, width: width, backgroundColor: 'black' }}>
        </View>
        <View style={[styles.menuBar, { backgroundColor: this.props.postBackground }]}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', borderColor: "#9b9b9b",
            width: '80%',
            justifyContent: 'space-between',
            borderWidth: 1,
            marginLeft: 10,
            borderRadius: 14,
            backgroundColor: this.props.postBackground,
          }}>
            <TextInput
              autoCorrect={false}
              style={[styles.searchBox, { color: this.props.textColor }]}
              placeholder="Tìm kiếm"
              onChangeText={(value) => this.setState({ input: value })} />
            <TouchableOpacity onPress={() => { this.searchBegin() }}>
              <Image source={require('../../img/ic_search_w.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor, marginRight: 10 }} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, alignItems: 'center' }} onTouchStart={() => { this.props.navigation.goBack() }}>
            <Text style={{ fontSize: 17, color: 'rgb(0, 171, 255)' }}>Cancel
                  </Text>
          </View>
        </View>

        {(this.state.result.length == 0) ?
          <Text style={{ fontSize: 18, margin: 10, color: this.props.textColor, fontWeight: 'bold' }}>TỪ KHÓA HOT</Text>
          :
          <Text style={{ fontSize: 18, margin: 10, color: this.props.textColor, fontWeight: 'bold' }}>KẾT QUẢ TÌM KIẾM</Text>
        }

        {this.renderResult()}

        {this.state.isSearchEnd && (this.state.result.length == 0) &&
          <Animatable.View animation="slideInDown" duration={300} style={{ backgroundColor: this.props.postBackground, alignItems: 'center', marginTop: 20, position: 'absolute', top: height / 2, alignSelf: 'center' }}>
            <Text stye={{ color: this.props.textColor }}>Không tìm được bài viết nào tương ứng
                  </Text>
          </Animatable.View>
        }
      </View>
    )
  }
  searchBegin() {
    var term;
    var items = [];
    var _this = this;
    this.setState({ isSearchEnd: false })
    term = this.remove_unicode(this.state.input);
    fetch(`http://api.5play.mobi/news/search/query?limit=20&offset=0&q=${term}`)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData)
        responseData.linfos.forEach(function (row) {
          let a = new Date(row.posttime)
          items.push({
            thumb: row.cover,
            title: row.title,
            url: row.fplayurl,
            des: row.desc,
            date: a.toLocaleString()
          })
          _this.setState({ result: items })
        })
      });
    setTimeout(() => { this.setState({ isSearchEnd: true }) }, 3000)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuBar: {
    height: 35,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center'
  },
  searchBox: {
    width: 250,
    height: 28,
    paddingLeft: 15,
  },
})
const mapStateToProps = state => {
  return {
    listKeyword: state.listCateReducer.listKeyword,
    postBackground: state.readerModalReducer.postBackground,
    textColor: state.readerModalReducer.textColor
  }
}
export default connect(mapStateToProps)(Search);
