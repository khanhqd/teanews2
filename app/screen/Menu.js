import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    Alert,
    AsyncStorage
} from 'react-native';
const { height, width } = Dimensions.get('window');
import { loadListData, replaceBookmark, replaceListCate, reload } from '../actions';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

class SideMenu extends Component {
    constructor(props) {
      super(props);
      this.state={
        listCate: []
      }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: this.props.postBackground, paddingTop: 20 }}>
                <View style={styles.item} onTouchStart={() => { this.props.navigation.navigate('DrawerClose') }}>
                    <Image source={require('../../img/ic_night_list_b.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
                    <Text style={{ marginLeft: 15, fontFamily: 'AlNile-Bold', color: this.props.textColor }}>TEANEWS</Text>
                </View>
                <View style={styles.item} onTouchStart={() => { this.props.navigation.navigate('DrawerClose') }}>
                    <Image source={require('../../img/ic_night_today.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Today</Text>
                </View>
                <TouchableOpacity style={styles.item} onPress={() => { this.props.navigation.navigate('Bookmark_Screen') }}>
                    <Image source={require('../../img/ic_night_bookmark.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }}/>
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Bookmark</Text>
                </TouchableOpacity >
                <TouchableOpacity style={styles.item} onPress={() => { this.props.navigation.navigate('Recent_Screen') }}>
                    <Image source={require('../../img/ic_night_recent.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }}/>
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Recent</Text>
                </TouchableOpacity>
                <View style={styles.item} onTouchStart={() => {this.props.navigation.navigate('Category_Screen') }}>
                    <Image source={require('../../img/ic_night_quanlyCM.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor }} />
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Quản lý CM</Text>
                </View >
                <View style={styles.item} onTouchStart={() => {
                    Alert.alert(
                        'Lưu ý',
                        'Hệ thống sẽ xóa hết dữ liệu bookmark, category, lưu offline của bạn',
                        [
                            { text: 'Hủy' },
                            {
                                text: 'Xóa', onPress: () => {
                                    AsyncStorage.removeItem("listBookmark");
                                    // AsyncStorage.removeItem("listCate");
                                    // this.props.dispatch(loadListData([]))
                                    this.props.dispatch(replaceBookmark([]));
                                }
                            }
                        ])
                }}>
                    <Image source={require('../../img/ic_night_delCache.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Xoá cache</Text>
                </View >
                <View style={styles.item} onTouchStart={() => {this.props.navigation.navigate('Settings_Screen') }}>
                    <Image source={require('../../img/ic_night_setting.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Setting</Text>
                </View >
            </View >
        )
    }
}

// <View style={styles.item}>
//     <Image source={require('../../img/ic_night_logout.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
//     <Text style={{ marginLeft: 15, color: this.props.textColor }}>Logout</Text>
// </View >
const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        paddingLeft: 22
    },
    item2: {
        paddingLeft: 15,
        height: 50,
        flex: 1,
        paddingRight: 15,
        justifyContent: 'center'
    }
});
const mapStateToProps = state => {
    return {
        postBackground: state.readerModalReducer.postBackground,
        textColor: state.readerModalReducer.textColor,
        listCate: state.listCateReducer.list,
        fullList: state.listCateReducer.fullList
    }
}
export default connect(mapStateToProps)(SideMenu);
