import React, { Component } from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image } from 'react-native';
var { height, width } = Dimensions.get('window');
import { connect } from 'react-redux';
import Triangle from 'react-native-triangle';


var source = "";
class NewsItem2 extends Component {
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
          <Image resizeMode='cover' source={{ uri: this.props.data.thumb }} style={{ flex: 2 / 3 }}>
            <View style={styles.menuBar}>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('DrawerOpen') }}>
                <Image source={require('../../img/navicon_menu@2x.png')} style={{ height: 30, width: 30 }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, marginLeft: 20 }}>TEANEWS</Text>
              <Image source={require('../../img/search_icon.png')} style={{ height: 30, width: 30, marginLeft: width / 2 - 40 }} />
            </View>
            <Triangle
              style={{ marginTop: (2 / 3 * height) - (height / 4) + 90 }}
              width={width + 120}
              height={height / 4 - 70}
              direction={"down-left"}
            >

            </Triangle>
            <View style={{
              height: 30,
              width: 70,
              backgroundColor: this.props.data.cateColor,
              position: 'absolute',
              borderRadius: 4,
              left: 15,
              right: 0,
              top: (2 / 3 * height) - (height / 4) + 110,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            >
              <Text style={{ fontSize: 14, color: 'white' }}>{this.props.data.cate}</Text>
            </View>
          </Image>
          <View style={{ flex: 1 / 3, width: width }} >
            <Text style={{ fontSize: 14, marginLeft:15 }}>{source} - {date.toLocaleString()}</Text>
            <Text numberOfLines={3} ellipsizeMode="tail" style={{ marginLeft: 10, fontSize: 20, marginTop: 20 }}> {this.props.data.title} </Text>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={{ marginLeft: 10, marginTop: 30, fontSize: 16, marginRight: 5 }}
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
    height: 30,
    width: width,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 20,
    left: 20
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
