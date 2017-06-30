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
import { loadListData, replaceBookmark } from '../actions';
import { connect } from 'react-redux';

class SideMenu extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.item} onTouchStart={() => { this.props.navigation.navigate('DrawerClose') }}>
                    <Image source={require('../../img/LeftMenu/ic_list_b.png')} style={{height:24 , width:24}} />
                    <Text style={{ marginLeft: 15, fontFamily: 'AlNile-Bold' }}>TEANEWS</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/ic_today.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Today</Text>
                </View>
                <TouchableOpacity style={styles.item} onPress={() => { this.props.navigation.navigate('Bookmark_Screen') }}>
                    <Image source={require('../../img/ic_bookmark.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Bookmark</Text>
                </TouchableOpacity >
                <TouchableOpacity style={styles.item} onPress={() => { this.props.navigation.navigate('Recent_Screen') }}>
                    <Image source={require('../../img/ic_recent.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Recent</Text>
                </TouchableOpacity>
                <View style={styles.item} onTouchStart={() => { this.props.navigation.navigate('Category_Screen') }}>
                    <Image source={require('../../img/ic_chuyenmuc.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Chuyên mục</Text>
                </View >
                <View style={styles.item}>
                    <Image source={require('../../img/ic_quanlyCM.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Quản lý CM</Text>
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
                    <Image source={require('../../img/ic_delCache.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Xoá cache</Text>
                </View >
                <View style={styles.item}>
                    <Image source={require('../../img/ic_setting.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Setting</Text>
                </View >
                <View style={styles.item}>
                    <Image source={require('../../img/ic_logout.png')} style={{height:24 , width:24}}/>
                    <Text style={{ marginLeft: 15 }}>Logout</Text>
                </View >
            </View >
        )
    }
}
const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height:50,
        marginLeft:22
    }
});

export default connect()(SideMenu);
