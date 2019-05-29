/**
 * Created by glzc on 2017/7/7.
 */
import React,{Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Util from './util';
import Line from './line';
const dismissKeyboard = require('dismissKeyboard');
const EventEmitter = require('RCTDeviceEventEmitter');

export default class HeaderBar extends Component{
    constructor(props){
        super(props);
    };
    componentDidMount(){
    };
    leftCallback(){
        this.props.navigation.state.params.leftCallback();
        this.props.navigation.goBack();
    };
    back(key){
			EventEmitter.emit('getNotReadMsg')
        dismissKeyboard();
        this.props.canGoBack ? this.props.root.refs.webview.goBack() : this.props.navigation.state.params.leftCallback ? this.leftCallback() : this.props.navigation.goBack(key);
    };
    render(){
        if(this.props.mainHeader){
            return (
                <View>
                    <View style={[HeaderBarStyles.header,{justifyContent: 'center'},this.props.headerBar && {backgroundColor: '#ffffff'}]}>
                        <Text allowFontScaling={false} style={[HeaderBarStyles.text,this.props.headerBar && {color: '#3F3A39'}]}>{this.props.title}</Text>
                    </View>
                    {
                        this.props.noLine ? null : <Line full={true} />
                    }
                </View>
            )
        }else{
            return (
                <View>
                    <View style={[HeaderBarStyles.header,(this.props.navigation.state.params.headerBar || this.props.headerBar) && {backgroundColor: '#ffffff'}]}>
                        <TouchableOpacity style={HeaderBarStyles.left} activeOpacity={0.8} onPress={this.back.bind(this,'')}>
                            {
                                (this.props.noBack || this.props.navigation.state.params.noBack) ? null : <View style={HeaderBarStyles.buttonImg} />
                            }
                            <Text allowFontScaling={false} style={[HeaderBarStyles.leftText,(this.props.navigation.state.params.headerBar || this.props.headerBar) && {color: '#2ea7e0'}]}>{this.props.leftText || this.props.navigation.state.params.leftText || null}</Text>
                        </TouchableOpacity>
                        <Text allowFontScaling={false} style={[HeaderBarStyles.text,HeaderBarStyles.title,(this.props.navigation.state.params.headerBar || this.props.headerBar) && {color: '#000'}]} numberOfLines={1}>{this.props.title || this.props.navigation.state.params.title}</Text>
                        <TouchableOpacity style={HeaderBarStyles.right} activeOpacity={0.8} onPress={this.props.navigation.state.params.rightCallBack || this.props.rightCallBack}>
                            <View>
                                <Text allowFontScaling={false} style={[HeaderBarStyles.rightText,(this.props.navigation.state.params.headerBar || this.props.headerBar) && {color: '#2ea7e0'}]}>{this.props.rightText || this.props.navigation.state.params.rightText}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        this.props.noLine || this.props.navigation.state.params.noLine ? null : <Line full={true} />
                    }
                </View>
            )
        }
    }
};

const HeaderBarStyles = StyleSheet.create({
    header:{
        height: Util.isIOS ? Util.deviceId.indexOf('iPhone10') != -1 ? Util.pixel*88 : Util.pixel*64 : Util.pixel*44,
        paddingTop: Util.isIOS ? Util.deviceId.indexOf('iPhone10') != -1 ? 44 * Util.pixel :Util.pixel*20 : 0,
        backgroundColor: '#006eee',
        paddingLeft: Util.pixel*10,
        paddingRight: Util.pixel*10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    left: {
        width: Util.pixel*80,
        height: Util.pixel*44,
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftText: {
        color: '#ffffff',
        fontSize: Util.commonFontSize(15),
        marginLeft: Util.pixel*5
    },
    icon: {
        width: Util.pixel*12,
        height:Util.pixel*21
    },
    text: {
        color: '#ffffff',
        fontSize: Util.commonFontSize(17)
    },
    title: {
        width: Util.size.width - 200,
        paddingRight: Util.pixel*3,
        textAlign: 'center',
    },
    rightText: {
        color: '#ffffff',
        fontSize: Util.commonFontSize(15),
    },
    right: {
        width: Util.pixel*80,
        height: Util.pixel*44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    buttonImg:{
        height: Util.pixel*15,
        width:  Util.pixel*15,
        borderTopWidth: Util.deviceId.indexOf('iPhone10') > -1 ? Util.pixel*2 : Util.pixel*1.5,
        borderLeftWidth: Util.deviceId.indexOf('iPhone10') > -1 ? Util.pixel*2 : Util.pixel*1.5,
        borderColor:"#fff",
        transform:[{
            rotate: '-45deg',
        },{translateX: 10},{translateY: Util.isIOS ? 5 : 10}]
    },
});