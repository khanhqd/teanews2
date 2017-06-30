Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/FitImage.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}





var propTypes=_extends({},
_reactNative.Image.propTypes,{
indicator:_react.PropTypes.bool,
indicatorColor:_react.PropTypes.string,
indicatorSize:_react.PropTypes.oneOfType([
_react.PropTypes.oneOf(['small','large']),
_react.PropTypes.number]),

originalHeight:_react.PropTypes.number,
originalWidth:_react.PropTypes.number});


var styles=_reactNative.StyleSheet.create({
container:{
alignItems:'center',
justifyContent:'center'}});var



FitImage=function(_Image){_inherits(FitImage,_Image);
function FitImage(props){_classCallCheck(this,FitImage);var _this=_possibleConstructorReturn(this,(FitImage.__proto__||Object.getPrototypeOf(FitImage)).call(this,
props));

_this.style=_reactNative.StyleSheet.flatten(props.style);

if(_this.style){
var size=[_this.style.width,_this.style.height];

if(size.filter(function(e){return e;}).length===1){
throw new Error('Props error: size props must be present '+
'none or both of width and height.');
}
}

var originalSize=[props.originalWidth,props.originalHeight];
if(originalSize.filter(function(e){return e;}).length===1){
throw new Error('Props error: originalSize props must be present '+
'none or both of originalWidth and originalHeight.');
}

_this.isFirstLoad=true;

_this.state={
height:0,
isLoading:false,
layoutWidth:undefined,
originalWidth:undefined,
originalHeight:undefined};


_this.getHeight=_this.getHeight.bind(_this);
_this.getOriginalHeight=_this.getOriginalHeight.bind(_this);
_this.getOriginalWidth=_this.getOriginalWidth.bind(_this);
_this.getRatio=_this.getRatio.bind(_this);
_this.getStyle=_this.getStyle.bind(_this);
_this.onLoad=_this.onLoad.bind(_this);
_this.onLoadStart=_this.onLoadStart.bind(_this);
_this.renderChildren=_this.renderChildren.bind(_this);
_this.resize=_this.resize.bind(_this);
_this.setStateSize=_this.setStateSize.bind(_this);return _this;
}_createClass(FitImage,[{key:'componentDidMount',value:function componentDidMount()

{
if(this.props.originalWidth&&this.props.originalHeight)return;
if(!this.props.source.uri)return;

this.mounted=true;
this.refreshStateSize();
}},{key:'componentWillUnmount',value:function componentWillUnmount()

{
this.mounted=false;
}},{key:'onLoad',value:function onLoad()

{
this.setState({isLoading:false});
this.refreshStateSize();

if(typeof this.props.onLoad==='function'){
this.props.onLoad();
}
}},{key:'onLoadStart',value:function onLoadStart()

{
if(this.isFirstLoad){
this.setState({isLoading:true});
this.isFirstLoad=false;
}
}},{key:'getHeight',value:function getHeight(

layoutWidth){
if(this.style&&this.style.height){
return this.style.height;
}

return this.getOriginalHeight()*this.getRatio(layoutWidth);
}},{key:'getOriginalHeight',value:function getOriginalHeight()

{
return this.props.originalHeight||this.state.originalHeight;
}},{key:'getOriginalWidth',value:function getOriginalWidth()

{
return this.props.originalWidth||this.state.originalWidth;
}},{key:'getRatio',value:function getRatio(

width){
var layoutWidth=width||this.state.layoutWidth;

return layoutWidth/this.getOriginalWidth();
}},{key:'getStyle',value:function getStyle()

{
if(this.style&&this.style.width){
return{width:this.style.width};
}
return{flexGrow:1};
}},{key:'resize',value:function resize(

event){var
width=event.nativeEvent.layout.width;
var height=this.getHeight(width);

this.setState({
height:height,
layoutWidth:width});

}},{key:'refreshStateSize',value:function refreshStateSize()

{var _this2=this;
_reactNative.Image.getSize(this.props.source.uri,function(originalWidth,originalHeight){
if(!_this2.mounted){
return;
}

_this2.setStateSize(originalWidth,originalHeight);
});
}},{key:'setStateSize',value:function setStateSize(

originalWidth,originalHeight){
var height=this.state.layoutWidth/originalWidth;

this.setState({
height:height,
originalHeight:originalHeight,
originalWidth:originalWidth});

}},{key:'renderChildren',value:function renderChildren()

{
if(this.state.isLoading&&this.props.indicator!==false){
return(
_react2.default.createElement(_reactNative.ActivityIndicator,{
color:this.props.indicatorColor,
size:this.props.indicatorSize,__source:{fileName:_jsxFileName,lineNumber:160}}));


}

return this.props.children;
}},{key:'render',value:function render()

{
return(
_react2.default.createElement(_reactNative.Image,_extends({},
this.props,{
onLayout:this.resize,
onLoad:this.onLoad,
onLoadStart:this.onLoadStart,
source:this.props.source,
style:[
this.style,
this.getStyle(),
{height:this.state.height},
styles.container],__source:{fileName:_jsxFileName,lineNumber:172}}),


this.renderChildren()));


}}]);return FitImage;}(_reactNative.Image);


FitImage.propTypes=propTypes;exports.default=

FitImage;