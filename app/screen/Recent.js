import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    ListView,
    AsyncStorage
} from 'react-native'
const { height, width } = Dimensions.get('window')
import { connect } from 'react-redux';

import { SwipeActionView } from 'react-native-action-view';
import { replaceRecent } from '../actions';

class Recent extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        }
    }
    componentWillMount() {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.listRecent)
      });
    }
    _set = async (key, value) => {
        try { await AsyncStorage.setItem(key, value); }
        catch (error) { console.log(error.message) }
    };
    // componentWillMount() {
    //     this._get('listCate')
    // }
    // _get = async (key) => {
    //     try {
    //         var value = await AsyncStorage.getItem(key);
    //         if (value !== null) {
    //             switch (key) {
    //                 case 'listCate':
    //                     this.props.dispatch(replaceListCate(JSON.parse(value)))
    //                     break;
    //             }
    //         }
    //     } catch (error) { alert(error) }
    // };
    // _set = async (key, value) => {
    //     try { await AsyncStorage.setItem(key, value); }
    //     catch (error) { console.log(error.message) }
    // };
    // renderItem() {
    //     // alert(JSON.stringify(this.state.listCate))
    //     return Item.map(function (item, index) {
    //         return (
    //             <RenderItem
    //                 listCate={this.state.listCate}
    //                 key={index}
    //                 item={item}
    //             />
    //         )
    //     })
    // }
    removeRecent(row, sectionID, rowID) {
        listRecent = this.props.listRecent;
        listRecent.splice(rowID, 1);
        this.props.dispatch(replaceRecent(listRecent));
        setTimeout(() => {
            AsyncStorage.setItem("listRecent" , JSON.stringify(listRecent))
            //this._set('listRecent', JSON.stringify(listRecent))
            this.setState({
                dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }).cloneWithRows(listRecent)
            });
        }, 100)
    }
    renderRow(row, sectionID, rowID) {
        return (
            <SwipeActionView
                rightExpansionSettings={{ buttonIndex: 0 }}
                rightButtons={[{ title: " Remove ", color: '#4a90e2', callback: () => { this.removeRecent(row, sectionID, rowID); } }]}>
                <TouchableOpacity onPress={() => {
                    console.log(row);
                    this.props.navigation.navigate('RecentReading_Screen', { row: row })
                }}>

                    <View style={{ width: width, height: 160, padding: 15, paddingTop: 10 }}>
                        <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={{ fontFamily: "Lora-Bold", fontWeight: 'bold', fontSize: 15 }}>{row.title}
                        </Text>
                        <Text style={{ marginBottom: 5, fontSize: 13, color: 'grey' }}>Vnexpress.net
                </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ height: 80, width: 80 }}>
                                <Image
                                    style={{ width: 80, height: 80 }}
                                    source={{ uri: row.thumb }}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                    style={{ height: 55 }}>{row.des}
                                </Text>
                                <View style={[styles.cateContainer, { backgroundColor: row.cateColor }]}>
                                    <Text style={styles.textCate}>{row.cate}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </TouchableOpacity>
            </SwipeActionView>
        )
    }
    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.props.postBackground }]}>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={{ height: 20, width: width, backgroundColor: 'black' }}>
                </View>
                <View style={[styles.menuBar, { backgroundColor: this.props.postBackground }]}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <Image source={require('../../img/ic_back@3x.png')} style={{ marginLeft: 20, height: 25, width: 25, tintColor: this.props.textColor }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 19, marginLeft: 20, fontWeight: 'bold', color: this.props.textColor }}>RECENT</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                    renderRow={this.renderRow.bind(this)}
                />
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
        alignItems: 'center'
    },
    cateContainer: {
        borderRadius: 3,
        width: 100,
    },
    textCate: {
        color: "white",
        textAlign: "center",
        fontSize: 12,
        margin: 5,
        borderRadius: 4,
    },
})
const mapStateToProps = state => {
    return {
        postBackground: state.readerModalReducer.postBackground,
        textColor: state.readerModalReducer.textColor,
        listRecent: state.bookmarkReducer.listRecent
    }
}
export default connect(mapStateToProps)(Recent);
