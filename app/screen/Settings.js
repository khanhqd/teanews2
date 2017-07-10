import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    Image,
    Switch
} from 'react-native';

const { height, width } = Dimensions.get('window')
import { connect } from 'react-redux';
import { changeTextColor, changeBackgroundColor, changeNightMode, hideImageMode } from '../actions';

class Settings extends React.Component {
    constructor(props) {
        super(props);
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
    }
    render() {
        return (
          <View style={[styles.container, { backgroundColor: this.props.postBackground }]}>
            <View style={{ height: 20, width: width, backgroundColor: 'black' }}>
            </View>
            <View style={[styles.menuBar, { backgroundColor: this.props.postBackground, borderColor: this.props.textColor }]}>
              <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                <Image source={require('../../img/ic_back@3x.png')} style={{ marginLeft: 20, height: 25, width: 25, tintColor: this.props.textColor }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 19, marginLeft: 20, fontWeight: 'bold', color: this.props.textColor }}>CÀI ĐẶT</Text>
            </View>

            <View style={styles.itemContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../img/ic_moon_b.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor, marginLeft: 15 }} />
                <Text style={[styles.modalText, { color: this.props.textColor, marginRight: 15 }]}>Chế độ đọc ban đêm</Text>
              </View>

              <Switch
                value={this.props.nightMode}
                onValueChange={() => {
                  this.switcherPressed();
                }} />
            </View>

            <View style={styles.itemContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../img/ic_img.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor, marginLeft: 15 }} />
                <Text style={[styles.modalText, { color: this.props.textColor, marginRight: 15 }]}>Chế độ bỏ hiển thị ảnh</Text>
              </View>

              <Switch
                value={this.props.hideImageMode}
                onValueChange={() => {
                  this.props.dispatch(hideImageMode(!this.props.hideImageMode));
                }} />
            </View>

          </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuBar: {
    height: 50,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5
  },
  modalText: {
    marginLeft: 10,
    fontSize: 16
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    margin: 5,
    marginTop: 20
  }
});
const mapStateToProps = state => {
  return {
    postBackground: state.readerModalReducer.postBackground,
    textColor: state.readerModalReducer.textColor,
    nightMode: state.readerModalReducer.nightMode,
    hideImageMode: state.readerModalReducer.hideImageMode,
  }
}
export default connect(mapStateToProps)(Settings);
