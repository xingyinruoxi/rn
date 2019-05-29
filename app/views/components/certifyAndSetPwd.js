/**
 * Created by liuzhenli on 2017/8/23.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Animated,
	KeyboardAvoidingView,
    NativeModules,
} from 'react-native';
import {phoneCertifyPageStyle} from '../../styles/mine/setting/phoneCertifyStyle';
var Storage = require('./../../commons/storage');
var StorageKeys = require('./../../commons/storageKey');
import MineHeader from './../../views/components/commonHeader';
import CloseButton from './../../views/components/closeButton';
import Button from './../../views/components/button';
import EAlert from './../../views/components/ealert';
import Loading from './../../views/components/loading';
import Util,{ Grow }  from './../../commons/util';
import Line from './../../commons/line';
import VLine from './../../commons/vLine';
import Fetch from './../../commons/fetch';
var dismissKeyboard = require('dismissKeyboard');
const EventEmitter = require('RCTDeviceEventEmitter');
import JPushModule from 'jpush-react-native';
export default class CertifyAndSerPwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.interValID = null;
        this.state = {
            userInfo: null,
            verifyCode: null,
            getSmsCodeStatus: 1,
            getSmsCodeTitle:"发送验证码",
            uuid: '',
            haveGotSmsCode: false,
            formData:{
                pwd: '',
                smsCode: '',
                identify: ''
            },
            hidePwd: true,
            showError: false,
            phone: this.props.navigation.state.params.phone,
            scale: new Animated.Value(0),
            showModal: false,
			getMesg: false,
			countLimit: 3,
        }
		this.setFormData = this.setFormData.bind(this);
    };
    componentWillMount(){
        Storage.getItem(StorageKeys.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });
    };
	getSmsCountLimit() {
		Fetch.post('user/getSmsCountLimit',{},(res) => {
			console.log('getSmsCountLimit', res);
			if(res.success){
				this.setState({
					countLimit: res.body
				})
			}
		}, (error) => {

		})
	}
    componentDidMount(){
				Grow.track('pg_my_reg_vercode_userbrowse',{'pg_my_reg_vercode_userbrowse':'验证并设置密码页浏览用户量'})
        this.interValID = Util.timer(this,60);
				this.getSmsCountLimit();
    }
    componentWillUnmount(){
        clearInterval(this.interValID);
    }
    getSmsCode(flag){
		let data = flag ? {
			useMobile: this.props.navigation.state.params.phone,
			messageType: '0',
			uuid: this.state.uuid,
			identify: this.state.formData.identify
		}: {
			useMobile: this.props.navigation.state.params.phone,
			messageType: '0'
		};
        if(this.state.getSmsCodeStatus){
            this.setState({
                getSmsCodeStatus: 0,
				getMesg: false,
				showModal: false
            });
            this.loading.show();
            Fetch.post('user/sendMessageIdentify',data,(res) => {
				console.log('sendMessageIdentify',res)
                this.loading.hide();
                if(res.success){
                    clearInterval(this.interValID);
                    this.interValID = Util.timer(this,60);
                }else{
                    this.setState({
                        getSmsCodeStatus: 1
                    });
					if(res.body >= (this.state.countLimit-1) || res.code == '401'){
						this.showModal(flag)
					}else{
						this.eAlert.show('alert',res.info)
					}
                }
            },(error) => {
                this.setState({
                    getSmsCodeStatus: 1
                });
                this.loading.show('netFail','网络超时',2000);
            },20 * 1000,this);
        }
    };
    checkFormData(){
				Grow.track('elbn_my_reg_vercode_next_click',{'elbn_my_reg_vercode_next_click': "注册验证并设置下一步按钮点击量"})
        let formData = this.state.formData;
        formData.smsCode.length > 0 ?
             formData.pwd.length >= 6 ?
                this.toRegister()
                :
                this.setState({showError: '登录密码长度为6-16位字母数字混合'})
            :
            this.setState({showError: '请输入短信验证码'})
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
    toRegister() {
        this.setState({
            reminderTitle: null,
            showModal: false,
            scale: new Animated.Value(0),
            errorTime: 0,
        });
        let data = Util.isIOS ? {
            identify: this.state.formData.smsCode,
            useLoginPswd: this.state.formData.pwd,
            useMobile: this.props.navigation.state.params.phone,
            idfa: NativeModules.ETDDevice.idfaString,
            idfv: NativeModules.ETDDevice.idfvString
        } : {
            identify: this.state.formData.smsCode,
            useLoginPswd: this.state.formData.pwd,
            useMobile: this.props.navigation.state.params.phone,
            build_serial: NativeModules.ETDDevice.uuid,
            friendId: this.props.navigation.state.params.friendID
        };
        console.log('userinfoWithoutRsa',data)
        this.loading.show();
        Fetch.post('user/userinfoWithoutRsa',data,(res) => {
            this.loading.hide();
            if(res.success){
				console.log('userinfoWithoutRsa',res);
				Grow.setCS1Value(res.body.sftUserMdl.useId.toString(),'userId');
				this.getToken(res.body.sftUserMdl.useId,res.body.sessionId)
                global.__isLogin = res.body;
                global.__sessionId = res.body.sessionId;
                global.__useId = res.body.sftUserMdl.useId;
                Storage.setItem(StorageKeys.eTD_USERINFO,res.body).then(() => { EventEmitter.emit('getUserInfo');EventEmitter.emit('getUserInfoToken')});
                Storage.setItem(StorageKeys.eTD_PRESESSIONID,res.body.sessionId);
                Storage.setItem(StorageKeys.eTD_USEID,res.body.sftUserMdl.useId);
                Storage.setItem(StorageKeys.eTD_LASTLOGINPHONE,res.body.sftUserMdl.useMobilePhones);
                this.props.navigation.navigate('RegisterResult',{status: 'success'})
                JPushModule.setAlias(res.body.sftUserMdl.useId.toString(),() => {});
                JPushModule.getRegistrationID((registerId) => {
                    global.__registerId = registerId;
                    Util.registerJPush(res.body.sftUserMdl.useId,Fetch);
                });
            }else{
               this.setState({
                   showError: res.info,
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
    }
    nextStep(){
		let formData = this.state.formData;
		if(this.state.getMesg){
			formData.identify.length > 0 ?
				this.getSmsCode(true)
				:
				this.setState({
					showError: '请输入验证码'
				})
		}else{
			Grow.track('elbn_my_reg_verifycode_next_click',{'elbn_my_reg_verifycode_next_click':'下一步按钮点击量'});
			formData.identify.length > 0 ?
				this.userInfoCheck()
				:
				this.setState({
					showError: '请输入验证码'
				})
		}

    }
	setFormData(arg,val){
		let formData = this.state.formData;
		formData[arg]  = val;
		this.setState({
			formData: formData,
			waringText: null
		}, () => {console.log('this.state.',this.state)});
	};
    showModal(mesg){
		if(mesg){
			this.setState({
				getMesg: true
			})
		}
        Util.setFormData(this,'identify',"");
        Util.getVerifyCode(this,Fetch);
		Grow.track('pg_my_reg_verifycode',{'pg_my_reg_verifycode':'验证码提示弹窗'});
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
    userInfoCheck(){
        let data = {
            useMobile: this.state.phone,
            checkType:'0',
            validateCode: this.state.formData.identify,
            uuid: this.state.uuid
        };
        console.log('data',data);
        this.loading.show();
        Fetch.post('user/userinfoCheck',data,res => {
            console.log('userinfoCheck',res)
            this.loading.hide();
            if(res.success){
                this.setState({
                    showModal: false,
                    scale: new Animated.Value(0)
                });
				this.getSmsCode(true)
            }else{
                this.eAlert.show('alert',res.info)
            }
        },error => {

        })
    }
		reGetSmsCode(){
			Grow.track('elbn_my_reg_vercode_resend_click',{'elbn_my_reg_vercode_resend_click': '注册重新发送按钮点击量'})
			Util.getVerifyCode(Fetch)
		}
	hideVerifyCodeModal () {
		this.setState({showModal: false,scale: new Animated.Value(0),waringText: null})
	}
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard()}}style={phoneCertifyPageStyle.container}>
                <MineHeader title="验证并设置密码" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={phoneCertifyPageStyle.contentBox}>
                    <View style={phoneCertifyPageStyle.contentSubBox}>
                        <View style={phoneCertifyPageStyle.remindTitleBox}>
                            <Text allowFontScaling={false} style={phoneCertifyPageStyle.remindTitle}>{'已发送验证码至' + this.props.navigation.state.params.phone}</Text>
                        </View>

                        <View style={phoneCertifyPageStyle.userNameBox}>
                            <View style={phoneCertifyPageStyle.labelImgBox}>
                                <Image style={phoneCertifyPageStyle.labelImg} source={require('./../../imgs/mine/smgImg.png')}/>
                            </View>
                            <TextInput style={[phoneCertifyPageStyle.smsCodeInput,]}
                                       placeholder="请输入短信验证码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={this.setFormData.bind(this,'smsCode')}
                                       maxLength={6}
                                       placeholderTextColor="#888889"
                                       clearButtonMode="while-editing"
                                       value={this.state.formData.smsCode}
                                       onFocus={() => {this.setState({activeInput:'smsCode'})}}/>
                            {
                                !Util.isIOS ?
                                    <View style={{width: 50 * Util.pixel,alignItems:'center'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'smsCode'?  <CloseButton onPress={() => {Util.setFormData(this,'smsCode',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }
                            <VLine color="#025FCB" height={15} width={2}/>
                            <View style={phoneCertifyPageStyle.smsCodeBox}>
                                <TouchableOpacity activeOpacity={0.7} onPress={this.getSmsCode.bind(this,true)}style={[phoneCertifyPageStyle.getSmsButton]} >
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.getSmsButtonTitle}>{
                                        this.state.getSmsCodeTitle
                                    }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Line notFull={true}/>
                        <View style={[phoneCertifyPageStyle.userNameBox,,{marginTop: Util.pixel * 20 }]}>
                            <View style={phoneCertifyPageStyle.labelImgBox}>
                                <Image style={phoneCertifyPageStyle.labelImg} source={require('./../../imgs/mine/lock.png')}/>
                            </View>
                            <TextInput style={phoneCertifyPageStyle.smsCodeInput}
                                       placeholder="登录密码为6-16位字母数字混合"
                                       onChangeText={Util.setFormData.bind(this,this,'pwd')}
                                       maxLength={16}
                                       underlineColorAndroid="transparent"
                                       password={this.state.hidePwd}
                                       value={this.state.formData.pwd}
                                       secureTextEntry={this.state.hidePwd}
                                       placeholderTextColor="#888889"
                                       clearButtonMode="while-editing"
                                       onFocus={() => {this.setState({activeInput: 'pwd'})}}/>

                            {
                                !Util.isIOS ?
                                    <View style={{width: 30 * Util.pixel,alignItems:'center'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'pwd'?  <CloseButton onPress={() => {Util.setFormData(this,'pwd',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }
                            <TouchableOpacity style={phoneCertifyPageStyle.hidePwdImg} onPress={this.setHidePwd.bind(this)}>
                                {
                                    this.state.hidePwd ?
                                        <Image source={require('./../../imgs/mine/hideEye.png')}/>
                                        :
                                        <Image source={require('./../../imgs/mine/openEye.png')}/>
                                }

                            </TouchableOpacity>
                        </View>
                        <Line notFull={true}/>
                    </View>
                    <View style={phoneCertifyPageStyle.errorRemindTitleBox}>
                        {
                            this.state.showError ?
                                <Text allowFontScaling={false} style={phoneCertifyPageStyle.errorRemindTitle}>{this.state.showError}</Text>
                                :
                                null
                        }
                    </View>
                    <View style={phoneCertifyPageStyle.submitButtonBox}>
                        <Button buttonName="下一步" onPress={this.checkFormData.bind(this)}/>
                    </View>

                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
                {
                    this.state.showModal ?
                        <TouchableOpacity activeOpacity={1}  style={phoneCertifyPageStyle.m_Container} onPress={() => {dismissKeyboard()}}>
							<KeyboardAvoidingView behavior="padding">
								<Animated.View style={[phoneCertifyPageStyle.m_ContentBox,{transform:[{scale: this.state.scale}]}]}>
									<View style={phoneCertifyPageStyle.m_TitleBox}>
										<Text allowFontScaling={false} style={phoneCertifyPageStyle.m_Title}>提示</Text>
									</View>
									<Text allowFontScaling={false} style={phoneCertifyPageStyle.m_RemindTitle}>输入图片验证码方可{this.state.getMesg ? '重新获取' : '进行下一步'}</Text>
									<View style={phoneCertifyPageStyle.m_Content}>
										<View style={phoneCertifyPageStyle.m_InputBox}>
											<TextInput style={phoneCertifyPageStyle.m_IndentifyInput}
													   placeholder="请输入图片验证码"
													   onChangeText={Util.setFormData.bind(this,this,'identify')}
													   maxLength={4}
													   underlineColorAndroid="transparent"
													   value={this.state.formData.identify}
													   placeholderTextColor="#888889"
													   clearButtonMode="while-editing"
													   onFocus={() => {this.setState({activeInput: 'identify'})}}/>

											<TouchableOpacity  activeOpacity={0.7} onPress={() => this.reGetSmsCode(Fetch)}style={phoneCertifyPageStyle.m_VerifyCodeBox}>
												{
													this.state.verifyCode ?
														<Image style={phoneCertifyPageStyle.m_VerifyCode}source={{uri: 'data:image/png;base64,' + this.state.verifyCode}}/>
														:
														<ActivityIndicator
															size="small"
															color="gray"
														/>
												}
											</TouchableOpacity>

										</View>
										<View style={phoneCertifyPageStyle.m_ShowErrorBox}>
											<Text allowFontScaling={false} style={phoneCertifyPageStyle.m_ShowErrorText}>{this.state.showError}</Text>
										</View>
									</View>
									<View style={phoneCertifyPageStyle.m_ButtonBox}>
										<Button buttonName="下一步" width={240} onPress={this.nextStep.bind(this)}/>
									</View>
									<TouchableOpacity style={phoneCertifyPageStyle.sureImg}activeOpacity={0.75} onPress={() => this.hideVerifyCodeModal()}>
										<Image source={require('./../../imgs/commons/sureDelete.png')}/>
									</TouchableOpacity>
								</Animated.View>
							</KeyboardAvoidingView>
                        </TouchableOpacity>
                        :
                        null
                }
            </TouchableOpacity>
        );
    }
}