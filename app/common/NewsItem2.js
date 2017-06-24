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
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)' , flex:1}}>
              <View style={styles.menuBar}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate('DrawerOpen') }}>
                    <Image source={require('../../img/LeftMenu/ic_list_w.png')} style={{ height: 30, width: 30, marginLeft: 15 }} />
                  </TouchableOpacity>
                  <Text style={{ textAlign: 'center', fontSize: 20, marginLeft: 20, color:'white', fontWeight: 'bold'}}>TEANEWS</Text>
                </View>
                <Image source={require('../../img/LeftMenu/ic_search_w@4x.png')} style={{ height: 30, width: 30}} />
              </View>
              <Triangle
                style={{ marginTop: (2 / 3 * height) - (height / 4) + 90 }}
                width={width + 120}
                height={height / 4 - 70}
                direction={"down-left"}
              >
              </Triangle>
              <View style={{
                marginTop: 10,
                height: 30,
                width: 80,
                backgroundColor: this.props.data.cateColor,
                position: 'absolute',
                borderRadius: 4,
                left: 10,
                top: (2 / 3 * height) - (height / 4) + 110,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              >
                <Text style={{ fontSize: 14, color: 'white' }}>{this.props.data.cate}</Text>
              </View>
            </View>
          </Image>
          <View style={{ flex: 1 / 3, width: width }} >
            <Text style={{ fontSize: 14, marginLeft: 10 }}>{source} - {date.toLocaleString()}</Text>
            <Text numberOfLines={3} ellipsizeMode="tail" style={{ marginLeft: 10, marginRight:5, fontSize: 18, marginTop: 10, fontFamily:'Lora-Bold' }}>{this.props.data.title}</Text>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={{ marginLeft: 10, marginTop: 5, fontSize: 15, marginRight: 5 , lineHeight: 25, color:'#5c5757' }}
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
    position: 'absolute',
    paddingRight: 20,
    top: 20,
    alignItems:'center'
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
