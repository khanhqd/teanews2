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
        source: "tinmoi24.vn",
        color: 'rgb(221, 85, 85)'
    },
    {
        name: 'giải trí',
        link: 'http://tinmoi24.vn/giai-tri/2',
        source: "tinmoi24.vn",
        color: 'rgb(105, 151, 200)'
    },
    {
        name: 'thể thao',
        link: 'http://tinmoi24.vn/the-thao/3',
        source: "tinmoi24.vn",
        color: 'rgb(105, 151, 200)'
    },
    {
        name: 'Kinh doanh',
        link: 'http://tinmoi24.vn/kinh-te/4',
        source: "tinmoi24.vn",
        color: 'rgb(245, 228, 113)'
    },
    {
        name: 'Pháp luật',
        link: 'http://tinmoi24.vn/phap-luat/5',
        source: "tinmoi24.vn",
        color: 'rgb(134, 134, 134)'
    },
    {
        name: 'Xe',
        link: 'http://tinmoi24.vn/xe/15',
        source: "tinmoi24.vn",
        color: 'rgb(2, 5, 17)'
    },
    {
        name: 'Khoa học',
        link: 'http://tinmoi24.vn/cong-nghe/6',
        source: "tinmoi24.vn",
        color: 'rgb(187, 67, 198)'
    },
    {
        name: 'Sức khoẻ',
        link: 'http://tinmoi24.vn/suc-khoe/10',
        source: "tinmoi24.vn",
        color: 'rgb(77, 205, 174)'
    },
]
import { connect } from 'react-redux';
import { addCate, replaceListCate, reload } from '../actions';

class Category extends Component {
    constructor() {
        super();
        state = {
            listCate: []
        }
    }
    componentWillMount() {
        this._get('listCate')
    }
    _get = async (key) => {
        try {
            var value = await AsyncStorage.getItem(key);
            if (value !== null) {
                switch (key) {
                    case 'listCate':
                        this.props.dispatch(replaceListCate(JSON.parse(value)))
                        break;
                }
            }
        } catch (error) { alert(error) }
    };
    _set = async (key, value) => {
        try { await AsyncStorage.setItem(key, value); }
        catch (error) { console.log(error.message) }
    };
    renderItem() {
        // alert(JSON.stringify(this.state.listCate))
        return Item.map(function (item, index) {
            return (
                <RenderItem
                    listCate={this.state.listCate}
                    key={index}
                    item={item}
                />
            )
        })
    }
    saveCate() {
        console.log(this.props.listCate)
        this._set('listCate', JSON.stringify(this.props.listCate));
        this.props.navigation.goBack();
        setTimeout(() => { this.props.dispatch(reload(true)) }, 100)
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{height: 20, width: width, backgroundColor: 'black'}}>
                </View>
                <StatusBar
                  barStyle="light-content"
                />
                <Image
                source={require('../../img/background.jpg')}
                style={{width: width, height: height, position: 'absolute'}}/>

                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', marginTop: 20, backgroundColor: 'transparent'}}>WHAT INTERESTS YOU?
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderItem()}
                </ScrollView>
                <TouchableOpacity onPress={() => this.saveCate()} style={styles.loginButton}>
                  <View style={{ backgroundColor: '#4a90e2', height: 40, width: width*0.8, marginBottom: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                     <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Save</Text>
                  </View>
                </TouchableOpacity>
                <View style={{position: 'absolute', bottom: 17, right: width*0.1}} onTouchStart={()=>{this.props.navigation.goBack()}}>
                  <Text style={{fontStyle: 'italic', color: 'white', backgroundColor:'transparent'}}>Skip
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
        textColor: state.readerModalReducer.textColor
    }
}
export default connect(mapStateToProps)(Category);
