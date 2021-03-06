import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    AsyncStorage
} from 'react-native'
var Toast = require('react-native-toast');
import { connect } from 'react-redux';
import { addCate, replaceListCate, saveListCate } from '../actions';
const {height, width} = Dimensions.get('window');
import { firebaseApp } from '../app';

class RenderItem extends Component {
    constructor(props) {
      super(props);
      this.state={
        selected: false,
        loading: false
      };
      this.tracker = firebaseApp.database().ref('tracker/categorySelected')
    }
    componentWillMount() {
      let list = this.props.fullList;
      for(var i=0; i<list.length; i++) {
        if (list[i].link == this.props.item.link) {
          this.setState({ selected: true })
          break;
        }
      }
    }

    saveCateToAsync() {
      if (!this.state.loading) {
        this.setState({ loading: true })
          let list = this.props.fullList;
          if(this.state.selected == true) {
              //delete from Async
              for (var i = list.length - 1; i>=0; i--) {
                if (list[i].name == this.props.item.name) {
                  list.splice(i,1);
                  Toast.show('Đã loại khỏi danh sách')
                }
              }
              this.props.dispatch(saveListCate(list))
              this.setState({ selected: false, loading: false })
              this.tracker.child(this.props.item.name).transaction(function(view) {
                return view - 1
              })
          } else {
            var cateInfo = {
              name: this.props.item.name,
              link: this.props.item.link,
              color: this.props.item.color,
              source: this.props.item.source
            }
            list.push(cateInfo)
            this.props.dispatch(saveListCate(list))
            this.setState({ selected: true, loading: false })
            Toast.show('Đã lưu vào danh mục yêu thích')
            this.tracker.child(this.props.item.name).transaction(function(view) {
              return view + 1
            })
          }
    }
  }
    render() {
        return (
                <TouchableOpacity onPress={()=>this.saveCateToAsync()} >
                    <View style={styles.item}  >
                        <Text style={{fontSize: 15, color: this.state.selected ? '#f8e71c' : 'white', backgroundColor: 'transparent', fontWeight: 'bold'}}>{this.props.item.name.toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>

        )
    }
}
const styles = StyleSheet.create({
    item: {
      height: 40,
      width: width/2,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 15,
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
export default connect(mapStateToProps)(RenderItem);
