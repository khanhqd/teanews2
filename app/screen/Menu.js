import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image
} from 'react-native';
export default class SideMenu extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.item}>
                    <Image source={require('../../img/navicon_menu@2x.png')} />
                    <Text>TEANEWS</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/calendar-page-empty.png')} />
                    <Text>Today</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/bookmark.png')} />
                    <Text>Bookmark</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/passage-of-time.png')} />
                    <Text>Recent</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/icon.png')} />
                    <Text>Chuyên mục</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/folder.png')} />
                    <Text>Quản lý CM</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/garbage.png')} />
                    <Text>Xoá cache</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/settings.png')} />
                    <Text>Setting</Text>
                </View>
                <View style={styles.item}>
                    <Image source={require('../../img/LeftMenu/logout.png')} />
                    <Text>Logout</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin:30
    }
})
