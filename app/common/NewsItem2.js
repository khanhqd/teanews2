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
          style={[{ flex: 1, height: height - 50, backgroundColor: this.props.postBackground }, this.props.style]}>
          <View style={styles.container}>
            <Image style={styles.imgContainer} resizeMode='cover' source={{ uri: this.props.data.thumb }}>
              <Triangle
                style={{ marginTop: (2 / 3 * height) - (height / 4) + 15 }}
                width={width + 20}
                height={height / 4 - 15}
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
                top: (2 / 3 * height) - (height / 4) + 55,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              >
                <Text style={{ fontSize: 14 , color:'white' }}>{this.props.data.cate}</Text>
              </View>
              <Text style={{ fontSize: 14, position: 'absolute', left: 20, top: (2 / 3 * height) - (height / 4) + 120 }}>{source} - {date.toLocaleString()}</Text>
            </Image>
            <View style={styles.botContainer}>
              <Text style={{ marginLeft: 20, fontSize: 16 , marginRight:20 }}> {this.props.data.title} </Text>
              <Text
                numberOfLines={4}
                ellipsizeMode="tail"
                style={{ marginLeft: 20, marginTop: 10, fontSize: 12 , marginRight:20 }}
              >{this.props.data.des}</Text>
            </View>
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
