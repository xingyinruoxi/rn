/**
 * Created by liuzhenli on 2017/7/6.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Modal,
    BackHandler,
    Animated
} from 'react-native';
import Button from './../components/button';
import {NavigationActions} from 'react-navigation';
import {loginPageStyles} from './../../styles/common/loginPageStyle';
import Fetch from './../../commons/fetch';
import Line from './../../commons/line';
import Loading from './../components/loading';
import EAlert from './../components/ealert';
import Header from './../components/commonHeader';
var Storage = require('./../../commons/storage');
var StorageKeys = require('./../../commons/storageKey');
import Util,{ Grow } from './../../commons/util';
var dismissKeyboard = require('dismissKeyboard');
var EventEmitter = require('RCTDeviceEventEmitter');
import CloseButton from './../components/closeButton';
import JPushModule from 'jpush-react-native';

export default class Login extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false
    });
    constructor(props){
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            verifyCode:null,
            uuid: '',
            lastLoginPhone: false,
            dispatch: this.props.navigation.state.params && this.props.navigation.state.params.dispatch ? true : 'goBack',
            formData:{
                useLoginName: '',
                useLoginPswd: '',
                identify: ''
            },
            showError: false,
            hidePwd: true,
            errorTime: 0,
            scale: new Animated.Value(0),
			fromLaunch: false
        };

    };
		componentDidMount(){
			if(this.props.navigation.state.params && this.props.navigation.state.params.fromLaunch){
				this.setState({
					fromLaunch: true
				})
			}
			if(!Util.isIOS){
				this.backHandler = BackHandler.addEventListener('forbidGoBack',this.noBack.bind(this));
			}
		}
    removeHandler(){
			
			this.backHandler && this.backHandler.remove();
    }
    noBack(){
			  
        this.removeHandler();
        if(this.state.dispatch != 'goBack') {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'tab'})
                ],
            });
            Storage.removeItem(StorageKeys.eTD_USERINFO).then(()=> {
                global.__isLogin = null;
                this.props.navigation.dispatch(resetAction)
            });
        }
				// else{
				// 	Storage.removeItem(StorageKeys.eTD_USERINFO).then(()=> {
				// 		global.__isLogin = null;
				// 	});
				// }
    };
    goHome(){
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'tab'})
            ],
        });
        this.props.navigation.dispatch(resetAction)
    };
    componentWillUnmount(){
        if(!Util.isIOS){
            BackHandler.removeEventListener('noBack',this.noBack);
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKeys.eTD_LASTLOGINPHONE).then((phone) => {
            if(phone){
                this.setState({
                    lastLoginPhone: phone
                });
                this.setFormData('useLoginName',phone)
            }
        })
    };
    setFormData = (arg,val) =>{
        let formData = this.state.formData;
        formData[arg]  = val;
        this.setState({
            formData: formData
        });
    };
    checkFormData = () =>{
        let formData = this.state.formData;
        formData.useLoginName.trim().length == 0 ?
            this.eAlert.show('alert','请输入您用户名')
            :
            formData.useLoginPswd.trim().length == 0 ?
                this.eAlert.show('alert','请输入密码')
                :
           this.toLogin()
    };
    showModal(){
        Util.setFormData(this,'identify',"");
        Util.getVerifyCode(this,Fetch);
        this.setState({
            showModal: true
        });
        setTimeout(() => {
            Animated.spring(this.state.scale,{
                toValue: 1,
                duration: 10,
                tension: 30,
                friction: 4
            }).start();
        });
    }
    hideModal(){
        Util.setFormData(this,'identify',"");
        this.setState({
            showModal: false,
            scale: new Animated.Value(0),
        });
    }
    nextStep(){
        let formData = this.state.formData;
        formData.identify.length > 0 ?
            this.toLogin()
            :
            this.setState({
                showError: '请输入验证码'
            })
    }
    toLogin () {
        dismissKeyboard();
        this.setState({
            reminderTitle: null,
            showModal: false,
            scale: new Animated.Value(0),
            errorTime: 0,
        });
        let data = {
            identify: this.state.formData.identify,
            uuid: this.state.uuid,
            useLoginName:this.state.formData.useLoginName,
            useLoginPswd:Util.Encode(this.state.formData.useLoginPswd),
            // useLoginPswd:this.state.formData.useLoginPswd,
            //useLoginName: 'liyongpu',
            //useLoginPswd: '111aaa',
        };
        this.loading.show('loading','正在登录');
				console.log('data',data)
        Fetch.post('user/loginWithoutRsa',data,(res) => {
            console.log('loginWithoutRsa',res)
            this.loading.hide();
            if(res.success){
                // 修复欢迎页登录后进入首页显示新手引导的问题（已修复）
								this.backHandler && this.backHandler.remove();
                global.__firstComeHome = false;
                Storage.setItem(StorageKeys.eTD_FIRSTCOMEHOME,true);

                if(res.body.smsErrorNum){
                    return ;
                }
                //当用户登录时判断是否是同一账号，如果是同一账号便继续使用之前的解锁密码，如果不是同一账号则提示用户设置解锁密码
                Storage.getItem(StorageKeys.eTD_PREUSEID).then((data) => {
                    if(data != res.body.sftUserMdl.useId ||  global.__resetGesturePwd){
                        global.__resetGesturePwd = false;
                        global.__canCheck = true;
                        Storage.setItem(StorageKeys.eTD_FINGUERPRINT,false);
                        Storage.setItem(StorageKeys.eTD_GESTUREPWD,{hide: false});
                    }
                }).then(() => {
                    Storage.setItem(StorageKeys.eTD_PREUSEID,res.body.sftUserMdl.useId.toString());
                });
                global.__isLogin = res.body;
                global.__sessionId = res.body.sessionId;
                global.__useId = res.body.sftUserMdl.useId;
                Storage.setItem(StorageKeys.eTD_USERINFO,res.body).then(() => { this.getToken(__useId,__sessionId);EventEmitter.emit('getUserInfo')});
                Storage.setItem(StorageKeys.eTD_PRESESSIONID,res.body.sessionId);
                Storage.setItem(StorageKeys.eTD_USEID,res.body.sftUserMdl.useId);
                Storage.setItem(StorageKeys.eTD_LASTLOGINPHONE,res.body.sftUserMdl.useMobilePhones);

                //因为回调可能用到sessionID 因此延时处理回调
                this.loading.show('loading','登录成功',300,() => {
                    if(this.props.navigation.state.params && this.props.navigation.state.params.goHome){
                        this.goHome();
                    };
                    if(this.props.navigation.state.params && (this.props.navigation.state.params.fromRegister)){
                        this.props.navigation.goBack(this.props.navigation.state.params.backKey);
                    }else{
                        this.props.navigation.goBack();
                    }
                        EventEmitter.emit('checkFingerPwd');
                        this.props.navigation.state.params && this.props.navigation.state.params.callback && this.props.navigation.state.params.callback(res.body);
                        JPushModule.setAlias(res.body.sftUserMdl.useId.toString(),() => {});
                        JPushModule.getRegistrationID((registerId) => {
														console.log('registerID', registerId)
                            global.__registerId = registerId;
                            Util.registerJPush(res.body.sftUserMdl.useId,Fetch);
                        });
                        global.forbidTransition = false;
                });
                var etdThirdService = require('react-native').NativeModules.ETDThirdService;
                etdThirdService.setUserID(res.body.sftUserMdl.useId.toString());

            }else{

				this.setState({
					showError: res.info,
					errorTime: res.body
				});

            }
        },(error) => {
            this.loading.show('netFail','网络超时',2000);
        },20 * 1000,this)
    };
    setHidePwd(){
        this.setState({
            hidePwd: !this.state.hidePwd
        })
    };
    toRegister(){
		 Grow.track('elbn_my_log_goreg_click',{'elbn_my_log_goreg_click':'没有账号去注册按钮点击量'});
        this.setState({
            showError: null
        });
        global.forbidTransition = true;
		if(this.props.navigation.state.params && this.props.navigation.state.params.fromRegister){
			this.props.navigation.goBack();
			return
		}
        this.navigation.navigate('register',{fromLaunch: this.state.fromLaunch});
        setTimeout(() => {global.forbidTransition = false})
    };
    getToken(useId,sessionId){
        Fetch.post('user/getJwtToken',{useId: useId,sessionId: sessionId},res => {
            if(res && res.success){
                Storage.getItem(StorageKeys.eTD_USERINFO).then(info => {
                    info['user_token'] = res.body;
                    Storage.setItem(StorageKeys.eTD_USERINFO,info);
                });
            }else{
                console.log('user/getJwtToken',res);
            }
        },err => {});
    };
    render() {
        let useLoginName = this.state.formData.useLoginName;
        return (
            <TouchableOpacity style={{flex: 1}}activeOpacity={1} onPress={() => {dismissKeyboard();this.setState({activeInput: ''})}}>
                <View style={loginPageStyles.container}>
                    {
                        Util.isIOS ?
                            <StatusBar barStyle="light-content"/>
                            :
                            null
                    }
                    <Header leftButton leftIcon dispatch={this.state.dispatch} title="登录" type='login'navigation={this.props.navigation}/>
                    <View style={loginPageStyles.logoBox}>
                        <Image source={require('./../../imgs/mine/newLogo.png')}/>
                    </View>
                    <View style={loginPageStyles.inputBox}>
                        <View style={[loginPageStyles.userNameBox]}>
                            <View style={loginPageStyles.labelImgBox}>
                                <Image style={loginPageStyles.labelImg} source={require('./../../imgs/mine/head.png')}/>
                            </View>
                            <TextInput style={[loginPageStyles.input]}
                                       placeholder="用户名/手机号/邮箱"
                                       onChangeText={Util.setFormData.bind(this,this,'useLoginName')}
                                       placeholderTextColor="#888889"
                                       value={this.state.lastLoginPhone ==  useLoginName ? useLoginName.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : useLoginName}
                                       underlineColorAndroid="transparent"
									   										returnKeyType="go"
                                       clearButtonMode="while-editing"
									   										returnKeyLabel="确定"
                                       onFocus={() => {this.setState({activeInput: 'useLoginName'})}}
                            />
                            {
                                !Util.isIOS ?
                                    <View style={{width: 45 * Util.pixel,alignItems:'center'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'useLoginName'?  <CloseButton onPress={() => {Util.setFormData(this,'useLoginName',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }
                            <View style={[loginPageStyles.hidePwdImgSpace]}/>

                        </View>
                        <Line/>
                        <View style={[loginPageStyles.userNameBox,,{marginTop: Util.pixel * 20 }]}>
                            <View style={loginPageStyles.labelImgBox}>
                                <Image style={loginPageStyles.labelImg} source={require('./../../imgs/mine/lock.png')}/>
                            </View>
                            <TextInput style={loginPageStyles.input}
                                       placeholder="登录密码"
                                       onChangeText={Util.setFormData.bind(this,this,'useLoginPswd')}
                                       maxLength={16}
                                       underlineColorAndroid="transparent"
                                       password={this.state.hidePwd}
                                       value={this.state.formData.useLoginPswd}
                                       secureTextEntry={this.state.hidePwd}
                                       placeholderTextColor="#888889"
                                       clearButtonMode="while-editing"
                                       onFocus={() => {this.setState({activeInput: 'useLoginPswd'})}}/>

                            {
                                !Util.isIOS ?
                                    <View style={{width: 60 * Util.pixel,alignItems:'center'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'useLoginPswd'?  <CloseButton onPress={() => {Util.setFormData(this,'useLoginPswd',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }
                            <TouchableOpacity style={loginPageStyles.hidePwdImg} onPress={this.setHidePwd.bind(this)}>
                                {
                                    this.state.hidePwd ?
                                        <Image source={require('./../../imgs/mine/hideEye.png')}/>
                                        :
                                        <Image source={require('./../../imgs/mine/openEye.png')}/>
                                }

                            </TouchableOpacity>
                        </View>
                        <Line/>
                    </View>
                    <View style={loginPageStyles.remindsBox}>
                        {
                            this.state.showError &&  <Text allowFontScaling={false} style={loginPageStyles.remindsText}>{this.state.showError}</Text>

                        }

                    </View>
                    <View style={loginPageStyles.buttonBox}>
                        <Button buttonName="登录" onPress={this.checkFormData}/>
                        <View style={loginPageStyles.buttonSubBox}>
                            <Button buttonName="没有账号去注册" color="#F2F2F2" textColor="#888889" borderColor="#9B9B9B" onPress={this.toRegister.bind(this)}/>
                        </View>
                        <View style={loginPageStyles.forgotPwdBox}>
                            <Text allowFontScaling={false} style={loginPageStyles.forgotPwdTitle} onPress={() => {global.forbidTransition = false;this.navigation.navigate('forgotPwd')}}>忘记密码了？</Text>
                        </View>
                    </View>
                    <Loading ref={(ref) => this.loading = ref}/>
                    <EAlert ref={(ref) => this.eAlert = ref}/>
                </View>
                {
                    this.state.showModal ?
                        <TouchableOpacity activeOpacity={1}  style={loginPageStyles.m_Container}>
                            <Animated.View style={[loginPageStyles.m_ContentBox,{transform:[{scale: this.state.scale}]}]}>
                                <View style={loginPageStyles.m_TitleBox}>
                                    <Text allowFontScaling={false} style={loginPageStyles.m_Title}>提示</Text>
                                </View>
                                <Text allowFontScaling={false} style={loginPageStyles.m_RemindTitle}>输入图片验证码方可进入下一步</Text>
                                <View style={loginPageStyles.m_Content}>
                                    <View style={loginPageStyles.m_InputBox}>
                                        <TextInput style={loginPageStyles.m_IndentifyInput}
                                                   placeholder="请输入图片验证码"
                                                   onChangeText={Util.setFormData.bind(this,this,'identify')}
                                                   maxLength={4}
                                                   underlineColorAndroid="transparent"
                                                   value={this.state.formData.identify}
                                                   placeholderTextColor="#888889"
                                                   clearButtonMode="while-editing"
                                                   onFocus={() => {this.setState({activeInput: 'identify'})}}/>

                                        <TouchableOpacity  activeOpacity={0.7} onPress={() => Util.getVerifyCode(this,Fetch)}style={loginPageStyles.m_VerifyCodeBox}>
                                            {
                                                this.state.verifyCode ?
                                                    <Image style={loginPageStyles.m_VerifyCode}source={{uri: 'data:image/png;base64,' + this.state.verifyCode}}/>
                                                    :
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="gray"
                                                    />
                                            }
                                        </TouchableOpacity>

                                    </View>
                                    <View style={loginPageStyles.m_ShowErrorBox}>
                                        <Text allowFontScaling={false} style={loginPageStyles.m_ShowErrorText}>{this.state.showError}</Text>
                                    </View>
                                </View>
                                <View style={loginPageStyles.m_ButtonBox}>
                                    <Button buttonName="下一步" width={240} onPress={this.nextStep.bind(this)}/>
                                </View>
                            </Animated.View>
                        </TouchableOpacity>
                        :
                        null
                }
            </TouchableOpacity>

        );
    }
};
