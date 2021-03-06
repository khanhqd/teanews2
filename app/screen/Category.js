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
    StatusBar
} from 'react-native'
import RenderItem from '../common/RenderItem.js'
const { height, width } = Dimensions.get('window')
const Item = [
    {
        name: 'Thời sự',
        link: 'http://tinmoi24.vn/thoi-su/1',
        color: 'rgb(221, 85, 85)'
    },
    {
        name: 'Giải trí',
        link: 'http://tinmoi24.vn/giai-tri/2',
        color: 'rgb(105, 151, 200)'
    },
    {
        name: 'Thể thao',
        link: 'http://tinmoi24.vn/the-thao/3',
        color: 'rgb(105, 151, 200)'
    },

    {
        name: 'Kinh Tế',
        link: 'http://tinmoi24.vn/kinh-te/4',
        color: 'rgb(228, 158, 21)'
    },
    {
        name: 'Pháp luật',
        link: 'http://tinmoi24.vn/phap-luat/5',
        color: 'rgb(134, 134, 134)'
    },
    {
        name: 'Công nghệ',
        link: 'http://tinmoi24.vn/cong-nghe/6',
        color: 'rgb(187, 67, 198)'
    },
    {
        name: 'Game',
        link: 'http://tinmoi24.vn/game/7',
        color: 'rgb(106, 90, 205)'
    },
    {
        name: 'Giáo Dục',
        link: 'http://tinmoi24.vn/giao-duc/8',
        color: 'rgb(231, 131, 106)'
    },
    {
        name: 'Tâm Sự',
        link: 'http://tinmoi24.vn/tam-su/9',
        color: 'rgb(203, 223, 255)'
    },
    {
        name: 'Sức khoẻ',
        link: 'http://tinmoi24.vn/suc-khoe/10',
        color: 'rgb(77, 205, 174)'
    },
    {
        name: 'Khám Phá',
        link: 'http://tinmoi24.vn/kham-pha/13',
        color: 'rgb(231, 131, 224)'
    },

    {
        name: 'Cẩm Nang',
        link: 'http://tinmoi24.vn/cam-nang/14',
        color: 'rgb(139, 200, 106)'
    },
    {
        name: 'Xe',
        link: 'http://tinmoi24.vn/xe/15',
        color: 'rgb(2, 5, 17)'
    },
    {
        name: 'Cộng Đồng',
        link: 'http://tinmoi24.vn/cong-dong/16',
        color: 'rgb(245, 82, 82)'
    },
]
import { connect } from 'react-redux';
import { addCate, replaceListCate, reload } from '../actions';

class Category extends Component {
    constructor(props) {
        super(props);
    }
    _set = async (key, value) => {
        try { await AsyncStorage.setItem(key, value); }
        catch (error) { console.log(error.message) }
    };
    // componentWillMount() {
    //   if (this.props.listCate.length == 0) {
    //     this._set('listCate', JSON.stringify(Item));
    //     this._set('fullListCate', JSON.stringify(Item));
    //     this.props.dispatch(replaceListCate(Item))
    //   }
    // }
    saveCate() {
        this._set('listCate', JSON.stringify(this.props.fullList));
        this._set('fullListCate', JSON.stringify(this.props.fullList));
        this.props.dispatch(replaceListCate(this.props.fullList));
        this.props.navigation.goBack();
        setTimeout(() => { this.props.dispatch(reload(true)) }, 100)
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 20, width: width, backgroundColor: 'black' }}>
                </View>
                <StatusBar
                    barStyle="light-content"
                />
                <Image
                    source={require('../../img/background.jpg')}
                    style={{ width: width, height: height, position: 'absolute' }} />

                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginTop: 20, backgroundColor: 'transparent' }}>CHUYÊN MỤC BẠN QUAN TÂM?
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {Item.map((item, index) => {
                        return (
                            <RenderItem
                                key={index}
                                item={item}
                            />
                        )
                    })}
                </ScrollView>
                <TouchableOpacity onPress={() => this.saveCate()} style={styles.loginButton}>
                    <View style={{ backgroundColor: '#4a90e2', height: 40, width: width * 0.8, marginBottom: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Lưu</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ position: 'absolute', bottom: 17, right: width * 0.1 }} onTouchStart={() => { this.props.navigation.goBack() }}>
                    <Text style={{ fontStyle: 'italic', color: 'white', backgroundColor: 'transparent' }}>Bỏ qua
                  </Text>
                </View>
            </View>
        )
    }
}
// <View style={styles.smallContainer}>
//     <View style={[styles.loginButton, { backgroundColor: 'white' }]}>
//         <Text>Login with Google+</Text>
//     </View>
//     <View style={[styles.loginButton, { backgroundColor: 'white' }]}>
//         <Text>Login with Facebook</Text>
//     </View>
// </View>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    smallContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    category: {
        height: 30,
        width: (width - 100),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10
    },
    loginButton: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },

})
const mapStateToProps = state => {
    return {
        listCate: state.listCateReducer.list,
        postBackground: state.readerModalReducer.postBackground,
        textColor: state.readerModalReducer.textColor,
        fullList: state.listCateReducer.fullList
    }
}
export default connect(mapStateToProps)(Category);
