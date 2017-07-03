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
        isDropDown: false,
        animationIn: true,
        listCate: []
      }
      this._get("listCate");
    }
    _get = async (key) => {
        try {
            var value = await AsyncStorage.getItem(key);
              this.setState({
                listCate: JSON.parse(value)
              })
            console.log(this.state.listCate)
        } catch (error) { alert(error) }
    };
    componentWillReceiveProps(props) {
      if(props.listCate != this.state.listCate) {
        this._get("listCate");
      }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: this.props.postBackground }}>
                <View style={styles.item} onTouchStart={() => { this.props.navigation.navigate('DrawerClose') }}>
                    <Image source={require('../../img/ic_night_list_b.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
                    <Text style={{ marginLeft: 15, fontFamily: 'AlNile-Bold', color: this.props.textColor }}>TEANEWS</Text>
                </View>
                <View style={styles.item}>
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
                <View style={[styles.item,{backgroundColor: this.state.isDropDown ? '#d8d8d8' : this.props.postBackground}]} onTouchStart={() => {this.setState({isDropDown: true, animationIn: true}) }}>
                    <Image source={require('../../img/ic_night_chuyenmuc.png')} style={{ height: 24, width: 24, tintColor: this.props.textColor }} />
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Chuyên mục</Text>
                </View >
                <View style={styles.item} onTouchStart={() => {this.props.navigation.navigate('Category_Screen',{ listCate: this.state.listCate }) }}>
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
                <View style={styles.item}>
                    <Image source={require('../../img/ic_night_setting.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Setting</Text>
                </View >
                <View style={styles.item}>
                    <Image source={require('../../img/ic_night_logout.png')} style={{ height: 24, width: 24 , tintColor:this.props.textColor }} />
                    <Text style={{ marginLeft: 15, color: this.props.textColor }}>Logout</Text>
                </View >

                {this.state.isDropDown && (this.state.listCate.length !=0) &&
                  <TouchableOpacity onPress={()=>this.setState({animationIn:false})} style={{width: width, height: height, position: 'absolute'}}>
                    <Animatable.View animation={this.state.animationIn ? "fadeInLeft" : "fadeOutLeft"}
                    onAnimationEnd={()=>{
                      if(!this.state.animationIn) {
                        this.setState({isDropDown: false})
                      }
                    }}
                    duration={200}
                    style={{position: 'absolute', left: 190, top: 200, backgroundColor: this.props.postBackground, shadowOpacity: 0.2, borderRadius: 5}}>
                      <TouchableOpacity style={styles.item2} onPress={() => {
                        this.setState({animationIn:false})
                        this.props.dispatch(replaceListCate(this.state.listCate))
                        this.props.dispatch(reload(true))
                        this.props.navigation.navigate('DrawerClose')
                      }}>
                        <Text style={{ color: this.props.textColor }}>Tất cả</Text>
                      </TouchableOpacity>
                      {this.state.listCate.map((data,index) => {
                        return (
                          <TouchableOpacity style={styles.item2} key={index} onPress={() => {
                            this.setState({animationIn:false})
                            this.props.dispatch(replaceListCate([data]))
                            this.props.dispatch(reload(true))
                            this.props.navigation.navigate('DrawerClose')
                          }}>
                            <Text style={{ color: this.props.textColor }}>{data.name}</Text>
                          </TouchableOpacity>
                        )
                      })}
                    </Animatable.View>
                  </TouchableOpacity>
                }
            </View >
        )
    }
    }
const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        height: 50,
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
    }
}
export default connect(mapStateToProps)(SideMenu);
