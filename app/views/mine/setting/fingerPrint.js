/**
 * Created by liuzhenli on 2017/7/26.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    StatusBar,
    Image,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import TouchID from './../touchid/index';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import Util,{ Grow } from './../../../commons/util';
import Fetch from './../../../commons/fetch';
var Storage = require('./../../../commons/storage');
var StorageKeys = require('./../../../commons/storageKey');
const EventEmitter = require('RCTDeviceEventEmitter');
export default class FingerPrint extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false,

    });
    constructor(props){
        super(props);
        this.state = {
            userInfo: null,
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKeys.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
        });
    };
    componentDidMount(){
		// setTimeout(() => {
			this.openTouch();
		// },500)
    }
    openTouch(){
        TouchID.isSupported().then((support) => {
            TouchID.authenticate('通过Home键验证指纹','提示').then((data) => {
                global.forbidTransition = false;
                this.props.navigation.goBack();

				setTimeout(() => {
					this.props.navigation.state.params && this.props.navigation.state.params.toAdPage &&  this.props.navigation.state.params.toAdPage()
				},330)
            }).catch(error => {
                if (error.name == "LAErrorAuthenticationFailed") {
                    this.eAlert.show('alert','指纹不匹配')
                }else if(error.name == 'LAErrorUserCancel'){

                }else{
                    this.eAlert.show("alert", '您尚未设置Touch ID,请在手机中"设置"-"Touch ID与密码"中添加指纹')
                }
            })
        }).catch(error => {
            this.eAlert.show("alert", '您尚未设置Touch ID,请在手机中"设置"-"Touch ID与密码"中添加指纹')
        })
    }
    loginOtherAccount(){

        let data = {
            sessionId: __sessionId,
            useId: this.state.userInfo.sftUserMdl.useId
        };
        this.loading.show();
        Fetch.post('user/outLogin',data,res => {
            this.loading.hide();
            if(res.success){
                Storage.removeItem(StorageKeys.eTD_USERINFO);
                EventEmitter.emit('toLogin');
                EventEmitter.emit('checkLogin');
                global.__isLogin = null;
                global.forbidTransition = true;
                this.props.navigation.goBack();
            }else{
                this.eAlert.show('alert',res.info)
            }
        },err => {
            this.loading.show('netFail','网络超时',2000)
        },null,this);
    };
    render() {
        return (
            <View style={FingerPrintStyle.container}>
                <View style={FingerPrintStyle.content}>
                    <TouchableOpacity style={FingerPrintStyle.contentBox}activeOpacity={1} onPress={this.openTouch.bind(this)}>
                        <Image source={require('./../../../imgs/mine/fingerPrint.png')}/>
                        <Text allowFontScaling={false} style={FingerPrintStyle.buttonFingerTitle}>点击进行指纹解锁</Text>
                    </TouchableOpacity>
                </View>
                <View style={FingerPrintStyle.bottomButtonBox}>
                    <TouchableOpacity style={FingerPrintStyle.bottomButton} onPress={this.loginOtherAccount.bind(this)}>
                        <Text allowFontScaling={false} style={FingerPrintStyle.bottomButtonBoxTitle}>登录其他账号</Text>
                    </TouchableOpacity>
                </View>
                <EAlert ref={ref => this.eAlert = ref}/>
                <Loading ref={ref => this.loading = ref}/>
            </View>
        );
    }
}
const FingerPrintStyle = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#025FCB'
    },
    content:{
        flex:1,
        justifyContent:"center",
        alignItems:'center',
    },
    contentBox:{
        justifyContent:"center",
        alignItems:'center',
    },
    bottomButtonBox:{
        height: 80 * Util.pixel,
        width: Util.size.width,
        justifyContent:"center",
        alignItems:'center',
    },
    bottomButtonBoxTitle:{
        color:'#fff',
        fontSize: Util.commonFontSize(14)
    },
    bottomButton:{
        height: 30 *  Util.pixel,
        justifyContent:"center",
        paddingHorizontal: 20 * Util.pixel,
    },
    buttonFingerTitle:{
        color:'#fff',
        fontSize: Util.commonFontSize(14),
        marginTop: 10 *  Util.pixel,
    }
});