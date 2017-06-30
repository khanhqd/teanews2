import React, { Component } from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image, AsyncStorage } from 'react-native';
var { height, width } = Dimensions.get('window');
import { connect } from 'react-redux';
import Triangle from 'react-native-triangle';


var source = "";
class NewsItem2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }
  componentWillReceiveProps(props) {
    if (props.data != this.props.data) {
      this.setState({ loading: true }, () => this.setState({ loading: false }))
    }
  }
  render() {
    if (this.props.data) {
      var date = new Date(this.props.data.date);
      if (this.props.data.url.includes("vnexpress")) {
        source = "Vnexpress.net";
      } else {
        source = "Tinmoi24.vn"
      }
      return (
        <TouchableOpacity
          onPress={this.props.onPress}
          activeOpacity={1}
          style={[{ height: height, backgroundColor: this.props.postBackground }, this.props.style]}>
          {!this.state.loading &&
            <Image resizeMode='cover' source={{ uri: this.props.data.thumb }} defaultSource={require('../../img/background.jpg')} style={{ width: width, height: width, }}>
              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'space-between' }}>
                <View style={styles.menuBar}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('DrawerOpen') }}>
                      <Image source={require('../../img/LeftMenu/ic_list_w.png')} style={{ height: 24, width: 24, marginLeft: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', fontSize: 20, marginLeft: 20, color: 'white', fontWeight: 'bold' }}>TEANEWS</Text>
                  </View>
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate('Search_Screen') }}>
                    <Image source={require('../../img/ic_search_w.png')} style={{ height: 24, width: 24 }} />
                  </TouchableOpacity>
                </View>
                <Triangle
                  width={width}
                  height={50}
                  direction={"down-left"}
                  color={this.props.postBackground}
                >
                </Triangle>
                <View style={{
                  height: 24,
                  width: 80,
                  backgroundColor: this.props.data.cateColor,
                  position: 'absolute',
                  borderRadius: 4,
                  left: 13,
                  top: height - width + 47,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                >
                  <Text style={{ fontSize: 14, color: 'white', }}>{this.props.data.cate}</Text>
                </View>
              </View>
            </Image>
          }
          <View style={{ height: height - width, width: width }} >
            <Text style={{ fontSize: 13, marginLeft: 13, color: '#4a4a4a' }}>{source} - {date.toDateString()}</Text>
            <Text numberOfLines={3} ellipsizeMode="tail" style={{ marginLeft: 10, marginRight: 9, fontSize: 30, marginTop: 10, fontFamily: 'Lora-Bold', lineHeight: 35, color: this.props.textColor }}>{this.props.data.title}</Text>
            <Text
              numberOfLines={4}
              ellipsizeMode="tail"
              style={{ marginLeft: 10, marginTop: 10, fontSize: 16, marginRight: 9, lineHeight: 25, color: this.props.textColor, fontFamily: 'Lora-Regular' }}
            >{this.props.data.des}</Text>
          </View>
        </TouchableOpacity>
      )
    } else { return <View></View> }
  }
}

const styles = {
  title: {
    paddingLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    lineHeight: 30
  },
  date: {
    fontSize: 14,
    color: 'grey',
    paddingLeft: 15,
    marginTop: 15,

  },
  description: {
    fontSize: 16,
    paddingLeft: 15,
    marginTop: 15,
    lineHeight: 30
  },
  category: {
    borderRadius: 5,
    marginLeft: 15,
    marginTop: 10,
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
    height: 40,
    width: width,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingRight: 20,
    marginTop: 32,
    alignItems: 'center'
  }
}
const mapStateToProps = state => {
  return {
    openMenu: state.readerModalReducer.modalState,
    postBackground: state.readerModalReducer.postBackground,
    textColor: state.readerModalReducer.textColor,
  }
}
export default connect(mapStateToProps)(NewsItem2);
