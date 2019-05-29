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
    Linking,
    ScrollView,
    NativeModules,
	Modal,
	KeyboardAvoidingView,
	Animated
} from 'react-native';
import HeaderLeftButton from './../components/headerLeftButton';
import {registerPageStyles} from './../../styles/common/registerPageStyle';
import {loginPageStyles} from './../../styles/common/loginPageStyle';
const EventEmitter = require('RCTDeviceEventEmitter');
import Fetch from './../../commons/fetch';
import Line from './../../commons/line';
import VLine from './../../commons/vLine';
import Loading from './../components/loading';
import Button from './../components/button';
import EAlert from './../components/ealert';
import Header from './../components/commonHeader';
import Util,{ Grow }  from './../../commons/util';
import DeviceInfo from 'react-native-device-info';
var Storage = require('./../../commons/storage');
var StorageKeys = require('./../../commons/storageKey');
var Config = require('./../../commons/config');
var dismissKeyboard = require('dismissKeyboard');
import CloseButton from './../components/closeButton';
import { NavigationActions } from 'react-navigation';
export default class Register extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        headerStyle:registerPageStyles.headerStyle,
        headerLeft: <HeaderLeftButton navigation={navigation} goBack/>,
        title: '注册',
        headerTitleStyle:registerPageStyles.headerTitleStyle
    });
    constructor(props){
        super(props);
        this.interValID = null;
        this.navigation = this.props.navigation;
        this.state = {
            verifyCode: null,
            uuid: null,
            formData:{
                identify: null,
                phone: '',
                useLoginPswd: '',
                smsCode: null,
				verifyCode: null
            },
            getSmsCodeTitle: '获取验证码',
            getSmsCodeStatus: 1,
            disable: true,
            selected: true,
            showError: false,
            friendID: null,
			scale: new Animated.Value(0),
			showVerify: false,
			waringText: null,
			countLimit: 3,
			fromLaunch: false
        };
		this.setFormData = this.setFormData.bind(this);
    };
    componentWillMount(){
        if(this.props.navigation.state.params && !this.props.navigation.state.params.fromHome){
            global.forbidTransitionWithRegiser = false;
        }
		if(this.props.navigation.state.params && this.props.navigation.state.params.fromLaunch){
			this.setState({
				fromLaunch: true
			})
		}
    };
    componentWillUnmount(){
        clearInterval(this.interValID);
    };
    setFormData(arg,val){
        let formData = this.state.formData;
        formData[arg]  = val;
        this.setState({
            formData: formData,
			waringText: null
        });
    };
    checkFormData(){
		Grow.track('elbn_my_reg_next_click',{'elbn_my_reg_next_click':'注册页面下一步按钮点击'})
        let phoneReg = /^((13[0-9])|(14[5,6,7,8])|(15[^4,\D])|(166)|(17[^29,\D])|(18[0-9])|(19[8,9]))\d{8}$/;
        phoneReg.test(this.state.formData.phone) ?
            this.getSmsCode()
             :
             this.setState({
                 showError: '请输入正确的手机号'
             })
    };
    componentDidMount(){
		Grow.track('pg_my_reg_userbrowse',{'pg_my_reg_userbrowse':'注册页面浏览用户量'});
        if(!Util.isIOS){
            NativeModules.ETDThirdService.getFriendId((data) => {
                this.setState({
                    friendID: data
                })
            })
        }
		this.getSmsCountLimit();
    };

	getSmsCountLimit() {
		Fetch.post('user/getSmsCountLimit',{},(res) => {
			if(res.success){
				this.setState({
					countLimit: res.body
				})
			}
		}, (error) => {

		})
	}

    getSmsCode(flag){
        if(this.state.getSmsCodeStatus){
            this.setState({
                getSmsCodeStatus: 0,
            });
            this.loading.show();
            let data = flag ? {
                useMobile: this.state.formData.phone,
                messageType: '0',
				uuid: this.state.uuid,
				identify: this.state.formData.identify
            }: {
				useMobile: this.state.formData.phone,
				messageType: '0'
			};
            Fetch.post('user/sendMessageIdentify',data,(res) => {
                this.setFormData('identify',"");
                this.loading.hide();
                if(res.success){
					this.saveMobile();
                    clearInterval(this.InterValID);
                    this.InterValID = Util.timer(this,60);
                    this.props.navigation.navigate('certifyAndSetPwd',{phone: this.state.formData.phone,friendID: this.state.friendID})
                    this.setState({
                        showError: null
                    })
                }else{
					dismissKeyboard()
                    this.setState({
                        showError: res.info,
                        getSmsCodeStatus: 1
                    });
					console.log('res',res)
					if(!res.info ){
						if(res.body >= (this.state.countLimit - 1)){
							this.shoeVerifyCodeModal();
						}
					}
                }
            },(error) => {
                this.setState({
                    getSmsCodeStatus: 1
                });

                this.loading.show('netFail','网络超时',2000);
            },20 * 1000,this);
		}else{
			this.eAlert.show('alert',`请${this.state.getSmsCodeTitle}`)
		}
    };
	componentWillUnmount () {
		clearInterval(this.InterValID)
	}
    saveMobile(){
		Fetch.post('user/saveMobile',{mobile: this.state.formData.phone},res => {
		},error => {

		})
	}
    changeSelectedAr = () => {
        this.setState({
            selected: !this.state.selected
        })
    };
    toRegisterAr(){
        dismissKeyboard();
        this.props.navigation.navigate('webViewWithBridge',{title:'用户服务协议',url:Config.systemInfos.registration_agreement_content_url,})
    }
    toLogin(){
			Grow.track('elbn_my_reg_golog_click',{'elbn_my_reg_golog_click':'已有账号去登录按钮点击量'});
        if((this.props.navigation.state.params && this.props.navigation.state.params.fromHome) || global.__fromLaunch ){
            global.forbidTransitionWithRegiser = true;
            this.props.navigation.navigate('login',{fromRegister: true,backKey: this.props.navigation.state.key,fromLaunch: this.state.fromLaunch});
        }else{
            this.props.navigation.goBack()
        }

    };
	checkVerifyCode () {
		Grow.track('elbn_my_reg_graphicvercode_next_click',{'elbn_my_reg_graphicvercode_next_click':'注册图形验证码内下一步按钮（点击量'})
		let formData = this.state.formData;
		if(formData.identify && formData.identify.length == 4){
			this.hideVerifyCodeModal();
			this.getSmsCode(true)
		}else{
			this.setState({showError: '请输入正确验证码'})
		}
	}
	shoeVerifyCodeModal () {
		Util.getVerifyCode(this,Fetch);
		this.setState({showVerify: true}, () => {
			Animated.spring(this.state.scale,{
				toValue: 1,
				duration: 10,
				tension: 30,
				friction: 4
			}).start();
		})
	}
	hideVerifyCodeModal () {
		this.setState({showVerify: false,scale: new Animated.Value(0),waringText: null})
	}
	resetTab(){
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({ routeName: 'tab'})
			],
		});
	}
    render() {
        let useLoginName = this.state.formData.phone;
        return (
        <TouchableOpacity style={{flex: 1}}activeOpacity={1} onPress={() => {dismissKeyboard();this.setState({activeInput:''})}}>
            <View style={registerPageStyles.container}>
                {
                    Util.isIOS ?
                        <StatusBar barStyle="light-content"/>
                        :
                        null
                }
                
                <Header leftButton leftIcon title="注册"  callback={() => {this.props.navigation.goBack(); setTimeout(() => { global.forbidTransitionWithRegiser = false;})}} navigation={this.props.navigation}/>
                <ScrollView scrollEnabled={false} style={registerPageStyles.scrollViewContainer} keyboardShouldPersistTaps='always'>
                    <View style={registerPageStyles.bannerBox}>
                        <Image source={require('./../../imgs/mine/newLogo.png')}/>
                    </View>
                    <View style={registerPageStyles.inputBox}>
                        <View style={[registerPageStyles.userNameBox]}>
                            <View style={registerPageStyles.labelImgBox}>
                                <Image style={registerPageStyles.labelImg} source={require('./../../imgs/mine/phoneImg.png')}/>
                            </View>
                            <TextInput style={registerPageStyles.input}
                                       placeholder="输入手机号码注册"
                                       onChangeText={Util.setFormData.bind(this,this,'phone')}
                                       placeholderTextColor="#888889"
                                       value={this.state.formData.phone}
                                       underlineColorAndroid="transparent"
                                       maxLength={11}
                                       clearButtonMode="while-editing"
                                       onFocus={() => {this.setState({activeInput: 'phone'})}}
                            />
                            {
                                !Util.isIOS ?
                                    <View style={{width: 60 * Util.pixel,alignItems:'center'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'useLoginName'?  <CloseButton onPress={() => {Util.setFormData(this,'useLoginName',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }
                        </View>
                        <Line/>
                    </View>
                    <View style={registerPageStyles.remindsBox}>
                        {
                            this.state.showError &&  <Text allowFontScaling={false} style={registerPageStyles.remindsText}>{this.state.showError}</Text>

                        }
                    </View>
                    <View style={registerPageStyles.buttonBox}>
                        <Button buttonName="下一步" onPress={this.checkFormData.bind(this)}/>
                        <View style={registerPageStyles.buttonSubBox}>
                            <Button buttonName="已有账号去登录" color="#F2F2F2" textColor="#888889" borderColor="#9B9B9B" onPress={this.toLogin.bind(this)}/>
                        </View>
                        <View style={registerPageStyles.forgotPwdBox}>
                            <Text allowFontScaling={false} style={registerPageStyles.forgotPwdTitle} >点击下一步，即表示您已阅读并同意<Text allowFontScaling={false} style={{color:'#025FCB'}} onPress={this.toRegisterAr.bind(this)}>《用户服务协议》</Text></Text>
                        </View>
                    </View>
                </ScrollView>
                <Loading ref={(ref) => this.loading = ref}/>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
			<Modal visible={this.state.showVerify}
					transparent={true}
					animationType="fade"
				   	onRequestClose={() => {}}
					>
				<TouchableOpacity activeOpacity={1}  onPress={() => dismissKeyboard()}style={loginPageStyles.m_Container}>
					<KeyboardAvoidingView behavior="padding">
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
											   value={this.state.formData.identify}
											   underlineColorAndroid="transparent"
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
								<Button buttonName="下一步" width={240} onPress={this.checkVerifyCode.bind(this)}/>
							</View>
							<TouchableOpacity style={registerPageStyles.sureImg}activeOpacity={0.75} onPress={() => this.hideVerifyCodeModal()}>
								<Image source={require('./../../imgs/commons/sureDelete.png')}/>
							</TouchableOpacity>
						</Animated.View>
					</KeyboardAvoidingView>
				</TouchableOpacity>
			</Modal>
        </TouchableOpacity>
        );
    }
};