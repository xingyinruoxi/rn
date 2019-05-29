/**
 * Created by liuzhenli on 2017/8/1.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    InteractionManager,
    requireNativeComponent,
    BackHandler,
    ToastAndroid
} from 'react-native';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import Util,{ Grow } from './../../../commons/util';
import Fetch from './../../../commons/fetch';
var Storage = require('./../../../commons/storage');
var StorageKeys = require('./../../../commons/storageKey');
const EventEmitter = require('RCTDeviceEventEmitter');
var GesturePwdView = requireNativeComponent('ETDGestureUnlockView');
var px = Util.pixel;
export default class GesturePwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false,
    });
    constructor(props){
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            userInfo: null,
            haveSetGesture: global.__haveSetGesture,
            remindTitle:  this.params && this.params.type && this.params.type == 'resetPwd'  ? '请绘制旧的手势密码' : '请绘制您的手势密码',
            password: '',
            option: 5,
            type: this.params && this.params.type ? this.params.type : null,
            errorTitle: null
        }
    };
    componentDidMount(){

        if(!Util.isIOS && this.state.haveSetGesture){
            this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.forbidGoBack.bind(this))
        }
        Storage.getItem(StorageKeys.eTD_GESTUREPWD).then((data) => {
            if(data && data.pwd){
                this.setState({
                    password: data.pwd,
                });
            }
        });
        console.log('deviceType',Util.deviceType)
    }
    forbidGoBack(){
        return true;
    }
    componentWillMount(){
        Storage.getItem(StorageKeys.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
        });
        
    };
    loginOtherAccount(){
        this.eAlert.show('confirm','是否使用其他账户登录',() => {
            let data = {
                sessionId: __sessionId,
                useId: this.state.userInfo.sftUserMdl.useId
            };
            this.loading.show();
            // Fetch.post('user/outLogin',data,res => {
            //     this.loading.hide();
            //     if(res.success){
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
            Storage.setItem(StorageKeys.eTD_LASTLOGINPHONE,null);
            global.forbidTransition = true;
            Storage.setItem(StorageKeys.eTD_GESTUREPWD,{hide: false});
            EventEmitter.emit('toLogin');
            // EventEmitter.emit('checkLogin');
            global.__isLogin = null;
            global.__canCheck = true;
            this.props.navigation.goBack(this.props.navigation.state.params.backKey);
            //     }else{
            //         this.eAlert.show('alert',res.info)
            //     }
            // },err => {
            //     this.loading.show('netFail','网络超时',2000)
            // },null,this);
        });
    };
    onGestureUnlockFinished(nativeEvent){
        let password = '';
        if(Util.isIOS){
            password = nativeEvent.nativeEvent.password;
        }else{
            password = nativeEvent.nativeEvent.onGestureUnlockFinished;
        }
        if(!this.state.haveSetGesture || this.state.type == 'reset'){
            this.setGesturePwd(password)
        }else{
                if(this.state.password == password){
                    if(this.state.type == 'resetPwd'){
                        this.setState({
                            errorTitle: '请绘制您的手势密码',
                            type: 'reset',
                            password: '',
                            waringColor: false,
                            remindTitle: '请绘制新的手势密码'
                        });
                    }else{
                        global.forbidTransition = false;
                        this.setState({password: ""});
                        this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
                        this.props.navigation.goBack();
						setTimeout(() => {
							this.props.navigation.state.params.toAdPage &&  this.props.navigation.state.params.toAdPage()
						},330)
                    }
                }else{
                    if(this.state.option > 1){
                        this.setState({
                            errorTitle: '手势密码错误，您还有' + (this.state.option - 1) + "次机会",
                            waringColor: true,
                            option: this.state.option - 1
                        })
                    }else{
                        this.eAlert.show('alert','手势密码错误超过五次，请重新登录',() => {this.loginOtherAccount()})
                    }
                }

        }
    };
    setGesturePwd(password){
        if(password.length >= 4){
            if(this.state.password.length == 0){
                this.setState({
                    errorTitle: '请再次确认手势密码',
                    waringColor: false,
                    password: password
                })
            }else{
                if(this.state.password == password){
                    this.setState({
                        errorTitle: '手势密码设置成功',
                        waringColor: false,
                        password: ""
                    });
                    global.__haveSetGesture = true;
                    global.forbidTransition = false;
                    this.forbidGoBackHandler &&  this.forbidGoBackHandler.remove();
                    Storage.setItem(StorageKeys.eTD_GESTUREPWD,{pwd:password,hide: false});
                    this.props.navigation.goBack();
					setTimeout(() => {
						this.props.navigation.state.params.toAdPage &&  this.props.navigation.state.params.toAdPage()
					},330)
                    if(global.__fromLaunch){
                        EventEmitter.emit('showLeading');
                        global.__fromLaunch = false;
                    }
                }else{
                    this.setState({
                        errorTitle: '两次绘制不一致，请重新绘制',
                        waringColor: true,
                        password: ""
                    })
                }
            }
        }else{
            this.setState({
                errorTitle: '手势密码至少绘制4个点，请重新绘制',
                waringColor: true
            })
        }
    };
    jumpSetGesture(){
        this.eAlert.show('confirm','您未设置手势密码，您可以到账户管理-密码管理中设置手势密码',() => {
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
            Storage.setItem(StorageKeys.eTD_GESTUREPWD,{hide:true});
            this.props.navigation.state.params.callback &&  this.props.navigation.state.params.callback();
			setTimeout(() => {
				this.props.navigation.state.params.toAdPage &&  this.props.navigation.state.params.toAdPage()
			},330)
            this.props.navigation.goBack();
            setTimeout(() => {
                global.forbidTransition = false;
                if(global.__fromLaunch){
                    EventEmitter.emit('showLeading');
                    global.__fromLaunch = false;
                }
            },200)
        })
    };
    forgotGesturePwd(){
        this.eAlert.show('confirm','重置手势密码需要重新登录账户，是否重新登录',() => {
            Storage.setItem(StorageKeys.eTD_GESTUREPWD,{hide:false});
            this.props.navigation.state.params.callback &&  this.props.navigation.state.params.callback();
            global.__resetGesturePwd = true;
            this.props.navigation.goBack();
            setTimeout(() => {global.forbidTransition = false;EventEmitter.emit('toLogin');},200)
        })
    }
    render() {
        let params = this.props.navigation.state.params;
        return (
            <View style={FingerPrintStyle.container}>
                <View style={FingerPrintStyle.content}>
                    <View  style={FingerPrintStyle.gesturePwdViewTitle}>
                        <View style={FingerPrintStyle.topButtonBox}>
                            {
                                params && params.type && params.type == 'resetPwd' ?

                                    <TouchableOpacity activeOpacity={0.7} style={FingerPrintStyle.topButtonLeft} onPress={() => { this.forbidGoBackHandler && this.forbidGoBackHandler.remove();global.forbidTransition = false;this.props.navigation.goBack();}}>
                                        <Text allowFontScaling={false} style={FingerPrintStyle.topButtonTitle}>取消</Text>
                                    </TouchableOpacity>
                                    :
                                     null
                            }
                            {
                                global.__haveSetGesture ? null
                                    :
                                    <TouchableOpacity activeOpacity={0.7} style={FingerPrintStyle.topButton} onPress={this.jumpSetGesture.bind(this)}>
                                        <Text allowFontScaling={false} style={FingerPrintStyle.topButtonTitle}>11跳过</Text>
                                    </TouchableOpacity>
                            }

                        </View>
					<View style={FingerPrintStyle.topLogoBox}>
						<View style={FingerPrintStyle.logoBox}>
							<Image source={require('./../../../imgs/mine/logo-.png')}/>
						</View>
						<Text allowFontScaling={false} style={FingerPrintStyle.welcomeTitle}>欢dd迎您,{this.state.userInfo ? this.state.userInfo.sftUserMdl.useLoginName : ''}</Text>

					</View>
                    </View>
                    <View style={[FingerPrintStyle.waringBox]}>
                        <Text allowFontScaling={false} style={[FingerPrintStyle.waring]}>{this.state.errorTitle}</Text>
                    </View>
                    <View style={FingerPrintStyle.gesturePwdViewBox}>
                        <GesturePwdView style={FingerPrintStyle.gesturePwdViewBox} onChange={this.onGestureUnlockFinished.bind(this)} onGestureUnlockFinished={this.onGestureUnlockFinished.bind(this)}/>
                    </View>
                </View>

                <View style={FingerPrintStyle.bottomButtonBox}>
                    {
                        this.state.haveSetGesture ?
                            <View style={FingerPrintStyle.bottomSubButtonBox}>
                                <TouchableOpacity style={FingerPrintStyle.bottomButton} onPress={this.forgotGesturePwd.bind(this)}>
                                    <Text allowFontScaling={false} style={FingerPrintStyle.bottomButtonBoxTitle}>忘记手势密码</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={FingerPrintStyle.bottomButton} onPress={this.loginOtherAccount.bind(this)}>
                                    <Text allowFontScaling={false} style={FingerPrintStyle.bottomButtonBoxTitle}>切换到其他账号</Text>
                                </TouchableOpacity>
                            </View>

                            :
                            null
                    }
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
        backgroundColor:'#fff'
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
        height: 90 * px,
        width: Util.size.width,
        justifyContent:"flex-start",
        alignItems:'center',

    },
    bottomButtonBoxTitle:{
        color:'#888889',
        fontSize: Util.commonFontSize(15)
    },
    bottomButton:{
        height: 50 *  px,
        justifyContent:"center",
        width: 120 * px,
        alignItems:'center'
    },
    buttonFingerTitle:{
        color:'#fff',
        fontSize: Util.commonFontSize(14),
        marginTop: 10 *  px,
    },
    gesturePwdViewBox:{
        height: Util.isIOS ?  Util.deviceType == '5' || Util.deviceType == '5s'? Util.size.width - 50 * px :  Util.size.width - 30 * px : Util.size.width -60,
        width: Util.isIOS ?  Util.deviceType == '5' || Util.deviceType == '5s'? Util.size.width - 90 * px:Util.size.width - 110 * px: Util.size.width - 30,
        backgroundColor:"#fff",
		padding: 0,
    },
    gesturePwdViewTitle:{
        flex:1,
        width: Util.size.width,
    },
    topButtonBox:{
        height: 60 * px,
        width: Util.size.width,
        alignItems:'flex-end',
        justifyContent:'center',
        paddingTop: 20 * px,
    },
    topButton:{
        height: 40 * px,
        width: 100 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    topButtonTitle:{
        color:'#888889',
        fontSize: Util.commonFontSize(16)
    },
    topLogoBox:{
        minHeight: 80 * px,
        alignItems:'center',
        justifyContent:'flex-start',
    },
    logoBox:{
        height: 75 * px,
        width: 75 * px,

        alignItems:'center',
        justifyContent:'center',

    },
    welcomeTitle:{
        fontSize: Util.commonFontSize(14),
        color:'#888889',
        marginTop: 10 * px,
    },
    bottomSubButtonBox:{
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'flex-start',
        width: Util.size.width,
    },
    topButtonLeft:{
        alignSelf: 'flex-start',
        marginLeft: 14 * px,
    },
    reminder:{
        color:'#fff',
        fontSize: Util.commonFontSize(18),
        backgroundColor:'transparent',

    },
    waring:{
        color:'#888889',
        fontSize: Util.commonFontSize(15),
    },
    waringBox:{
        marginBottom: Util.deviceType == '5' || Util.deviceType == '5s'? 10 * px : 0,
    }
});