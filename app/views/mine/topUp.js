/**
 * Created by liuzhenli on 2017/7/12.
 */
import React, { Component, } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    StatusBar,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Animated,
    Keyboard,
    BackHandler,
    Alert,
	Platform
} from 'react-native';
import {withdrawPageStyle} from './../../styles/mine/withdrawStyle';
import Line from './../../commons/line';
import Fetch from './../../commons/fetch';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import RightIcon from './../components/rightIcon';
import EAlert from './../components/ealert';
import CloseButton from './../components/closeButton';
import MineHeader from '../components/commonHeader';
import Loading from './../components/loading';
import Util,{ Grow }  from './../../commons/util';
var dismissKeyboard = require('dismissKeyboard');
var EventEmitter = require('RCTDeviceEventEmitter');
import Config from './../../commons/config';
import MarqueeLabel from './../components/marquee';
this.timeStart = 0;
this.timeEnd = 0;
export default class TopUp extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.interValID = null;
        let bundlingFlag = this.props.navigation.state.params && this.props.navigation.state.params.bankData.bundlingFlag;
        this.state = {
            userInfo: null,
            accountInfo: null,
            getSmsCodeTitle: '获取验证码',
            getSmsCodeStatus: 1,
            verifyCode: null,
            haveGetSms: false,
            smsCodeInfo: null,
            scale: new Animated.Value(0),
            showModal: false,
            remindTitle: null,
            bundlingFlag:  bundlingFlag ? bundlingFlag : 0,
            assetData: null,
            bankData: this.props.navigation.state.params.bankData,
            showError: false,
            formData:{
                payAmt: (this.props.navigation.state.params.topUpMoney && this.props.navigation.state.params.topUpMoney+'') || '',
                verifyCode: '',
                smsCode: '',
                cardNo:'',
                phoneNo:'',
            },
            cardNoInput: false,
            bankAccountInfo: null,
            bankCode: null,
            showLimit: false,
            buttonDisable: false,
            showKeyboardControll: false,
						showNotice: false,
						height: new Animated.Value(25),
						notice: null,
        };
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
         this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        	this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.__keyboardDidHide.bind(this));
         this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.__keyboardWillHide.bind(this));
    };
	componentDidMount(){
		if(this.state.bundlingFlag == '1'){
			Grow.track('pg_my_recharge2_userbrowse',{'pg_my_recharge2_userbrowse':'充值页面浏览量(已绑卡)'})
		}else{
			Grow.track('pg_my_recharge1_userbrowse',{'pg_my_recharge1_userbrowse':'充值页面浏览量'})
		}
	}
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
        });
				this.setPhoneNumber();
        this.getAccountData();
        this.getCardBindStatus();
		this._getNotice();
    };
	setPhoneNumber(phone) {
		let params = this.props.navigation.state.params;
		console.log('params', params)
		if(phone){
			this.setFormData('phoneNo', phone)
		}else{
			if(params && params.bankData.userMobile){
				this.setFormData('phoneNo',params.bankData.userMobile)
			}
		}

	}
    componentWillUnmount(){
        clearInterval(this.interValID);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
    }
    setFormData(arg,val){
        let formData = this.state.formData;
        if(arg == 'payAmt'){
            // if(this.state.bankAccountInfo && parseFloat(val) > this.state.bankAccountInfo.singleLimit){
            //     formData[arg] = val.replace(/\./,"");
            //     this.setState({
            //         showError: '充值额度超过单笔最高限制额度',
            //         buttonDisable: true
            //     })
            // }else{
            //     formData[arg] = val.replace(/\./,"");
            // }
					if(formData[arg] && formData[arg].indexOf('.') != -1 && val.split('.').length > 1){
						if(val.split('.')[1].length > 2){
							formData[arg] = val.split('.')[0] +"."+ val.split('.')[1].substring(0,2);
						}else{
							formData[arg] = val.split('.')[0] +"."+ val.split('.')[1].replace(/\./,"");
						}
					}else{
						formData[arg] = val;
					}
        }else{
						formData[arg] = val.replace(/\./,"");
        }
        if(this.state.bankAccountInfo && parseFloat(formData.payAmt) > this.state.bankAccountInfo.singleLimit){
            this.setState({
                showError: '充值额度超过单笔最高限制额度',
                buttonDisable: true
            })
        }else{
            this.setState({
                showError: null,
                buttonDisable: false
            })
        }
        this.setState({
            formData: formData,
            remindTitle: null
        });

        if(arg == 'cardNo' && this.state.formData.cardNo && (this.state.formData.cardNo.replace(/\s+/,'').length == 19)){
            this.checkBankInfo()
        }else if(this.state.formData.cardNo && this.state.formData.cardNo.replace(/\s+/,'').length < 16){
            this.setState({
                bankAccountInfo: null,
                showLimit: false
            })
        }
    }
    getAccountData(){
        let data = {
            sessionId:  __sessionId,
            useId: __useId
        };
        Fetch.post('userCenter/claim',data,(res) => {
            this.setState({ isRefreshing: false });
            if(res.success){
                this.setState({
                    assetData: res.body
                })
            }
        },(error) => {
						this.loading && this.loading.show('netFail','网络超时',2000)
        },null,this)
    }
    getCardBindStatus(){
        let data = {
            sessionId: __sessionId,
            useId:  __useId
        };
				console.log('this.props.navigation-----------', this.props.navigation.state.params.bankData)
				if(this.props.navigation.state.params.bankData && this.props.navigation.state.params.bankData.userBankcard && this.props.navigation.state.params.bankData.userBankcard.length){
					this.setFormData('cardNo',this.props.navigation.state.params.bankData.userBankcard);
					this.checkBankInfo()
				}else{
					Fetch.post('payment/rechargeInput',data,(res) => {
						console.log('payment/rechargeInput',res)
						if(res.success){
							this.setState({
								bankData: res.body,
								showLimit: true
							});
							res.body.bankCardNum && this.setFormData('cardNo',res.body.bankCardNum);
							if(res.body.bankCardNum && res.body.bankCardNum.length > 0){
								this.checkBankInfo()
							}
						}else{
							this.eAlert.show('alert',res.info)
						}
					},(error) => {
						this.loading &&  this.loading.show('loading','网络超时',2000)
					},null,this,this.getCardBindStatus.bind(this))
				}

    };
    fghjkcheckPayAmt = () =>{
			if(this.state.bundlingFlag == '1'){
				Grow.track('elbn_my_recharge2_gorecharge_click',{'elbn_my_recharge2_gorecharge_click':'立即充值按钮点击量(已绑卡)'})
			}else{
				Grow.track('elbn_my_recharge1_gorecharge_click',{'elbn_my_recharge1_gorecharge_click':'立即充值按钮点击量'})
			}
			if(this.state.showLimit){
				if(!this.state.buttonDisable){
					let formData = this.state.formData;
					let phoneReg = /^((13[0-9])|(14[5,6,7,8])|(15[^4,\D])|(166)|(17[^29,\D])|(18[0-9])|(19[8,9]))\d{8}$/;
					if(this.state.bundlingFlag == '1'){
						formData.cardNo && formData.cardNo.replace(/\s+/g,"").length >= 16 ?
							(parseFloat(formData.payAmt) >= 100) ?
								phoneReg.test(formData.phoneNo) ?
									this.getRequestID()
									:
									this.setState({ showError: '请输入正确的手机号' })
								:
								this.setState({ showError: '充值金额不能小于100元' })
							:
							formData.cardNo && formData.cardNo.replace(/\s+/g,"").length == 0 ?
								this.eAlert.show('alert',"请输入银行卡号")
								:
								this.eAlert.show('alert',"卡号输入错误，请检查您的卡号");
					}else{
						formData.cardNo && formData.cardNo.replace(/\s+/g,"").length >= 16 ?
							phoneReg.test(formData.phoneNo) ?
								(parseFloat(formData.payAmt) >= 100) ?
									this.checkBankCardStatus()
									:
									this.eAlert.show('alert',"充值金额不能小于100元")
								:
								this.eAlert.show('alert',"请输入正确的手机号")
							:
							formData.cardNo && formData.cardNo.replace(/\s+/g,"").length == 0 ?
								this.eAlert.show('alert',"请输入银行卡号")
								:
								this.eAlert.show('alert',"卡号输入错误，请检查您的卡号");
					}
				}
			}else{
					this.eAlert.show('alert','请输入正确的银行卡号')
			}
    };
		checkBankCardStatus(){
			if(this.state.showLimit){
				this.getRequestID()
			}else{
				this.checkBankInfo(true)
			}
		}
    getRequestID(){
			Grow.track('getRequestID_start',{'userId':``})
				let data = {
						sessionId: __sessionId,
						useId: __useId,
						channel: 'fengfu',
						payAmt: this.state.formData.payAmt,
						charge: 0,
						realAmt: this.state.formData.payAmt,
						mobileOperateSystem: Platform.OS,
						appVersion: Config.appVersion,
						mobilModel: Util.getModel
				};
			this.loading.show();
			Fetch.post('payment/complete',data,res => {
				this.loading.hide();
				if(res.success){
						Grow.track('getRequestID_success',{'userId':`${__useId}`})
						this.setState({
							getRequestIDData: res.body
						});
						res.body.bankList.map((item,index) => {
							if(item.bankName == res.body.bacName){
								this.setState({
									bankCode: item.bankCode,
								});
								!this.state.cardNoInput && res.body.bankCardNum && Util.setFormData(this,'cardNo',res.body.bankCardNum);
							}
						});
						setTimeout(() => {
							Grow.track('before_getSmsCode',{'userId':`${__useId}`});
							this.getSmsCode()
						},0);
				}else{
					this.eAlert.show('alert',res.info);
				}
			},error => {
				this.loading && this.loading.show('netFail','网络超时',2000);
			},30 * 1000,this)

    };

    checkSmsCode(){
			if(this.state.bundlingFlag == "1"){
				Grow.track('elbn_my_recharge2confirm_confirm_click',{'elbn_my_recharge2confirm_confirm_click':'确认按钮点击量(已绑卡)'})
			}else{
				Grow.track('elbn_my_recharge1confirm_confirm_click',{'elbn_my_recharge1confirm_confirm_click':'确认按钮点击量'})
			}
        let formData = this.state.formData;
        formData.smsCode.replace(/\s+/,"").length  == 6 ?
            this.submitData()
            :
        this.setState({
            remindTitle: '请输入6位短信验证码'
        })
    }
    checkBankInfo(getRequestid){
		Fetch.post('withdrawal/getBankInfo',{bankAccount: this.state.formData.cardNo},res => {
			if(res.success){
				this.setState({
					bankAccountInfo: res.body,
					showLimit: true
				});
				if(getRequestid){
					this.getRequestID()
				}
			}else{
				this.setState({
					showLimit: false,
				});
				this.eAlert.show('alert',res.info)
			}
		},error => {

		},null,this)

    };
    submitData(){
        dismissKeyboard();
        this.hideModal();
        this.setState({
            haveGetSms: false,
        });
        let getRequestIDData = this.state.getRequestIDData;
        let data = {
            sessionId: __sessionId,
            useId: this.state.userInfo.sftUserMdl.useId,
            channelVal: getRequestIDData.channelVal,
            requestId: getRequestIDData.requestId,
            bankAccount: this.state.formData.cardNo,
            idNumber: this.state.userInfo.sftUserMdl.useIdentityNum,
            name: this.state.userInfo.sftUserMdl.useName,
            mobilePhone: this.state.formData.phoneNo,
            bankCode:this.state.bankAccountInfo ? this.state.bankAccountInfo.bankCode : this.state.bankCode,
            randomCode: this.state.formData.smsCode,
            tradeId: this.state.smsCodeInfo.tradeId,
            randomValidateId: this.state.smsCodeInfo.randomValidateId
        };
		Fetch.getLog(`https://etrace.etongdai.com?methodName=submitData_start&userId=${__useId}&time=${Date.now()}`,(res) => {},(error) => {})
        this.loading.show();
        Fetch.post('payment/quikComplete',data,(res) => {
            console.log('quikComplete',res)
            this.loading.hide();
            this.setFormData('smsCode','')
            if(res.success){
				Fetch.getLog(`https://etrace.etongdai.com?methodName=submitData_success&userId=${__useId}&time=${Date.now()}`,(res) => {},(error) => {})
				clearInterval(this.interValID);
				this.setState({
					getSmsCodeStatus: 1,
					getSmsCodeTitle: '获取验证码',
				});
				EventEmitter.emit('getUserInfo');
				this.setFormData("payAmt","");
				this.hardwarePressHandler && this.hardwarePressHandler.remove();
				this.setPhoneNumber(data.mobileModel)
				this.props.navigation.navigate('topUpResult',{data: res.body,status:'success',payAmt:this.state.formData.payAmt});
            }else{
				if(res.code && res.code == 'ytd0001'){
					this.eAlert.show('alert','充值结果处理中，请查看充值记录或查看账户可用余额',() => {
						this.props.navigation.navigate('topUpNotes');
					});
					clearInterval(this.interValID);
					this.setState({
						getSmsCodeStatus: 1,
						getSmsCodeTitle: '获取验证码',
					});
				}else if(res.code && res.code == 'errorCode'){
						this.setPhoneNumber()
						this.eAlert.show('alert',res.info.indexOf('<br/>') != -1 ? res.info.replace('<br/>',"\n") : res.info,() => {this.showModal()})

				 }else if(res.body && res.body.recId){
						clearInterval(this.interValID);
						this.setPhoneNumber()
						this.setState({
							getSmsCodeStatus: 1,
							getSmsCodeTitle: '获取验证码',
						});
						this.eAlert.show('alert',res.info.indexOf('<br/>') != -1 ? res.info.replace('<br/>',"\n") : res.info,() => {this.props.navigation.navigate('topUpResult',{data: res.body,status:'fail',bindingFlag: this.state.bundlingFlag})});

				 }else{
						clearInterval(this.interValID);
						this.setPhoneNumber()
						this.setState({
							getSmsCodeStatus: 1,
							getSmsCodeTitle: '获取验证码',
						});
						 this.eAlert.show('alert',(res.info.indexOf('<br/>') != -1 ? res.info.replace('<br/>',"\n") : res.info) || '网络异常，请稍后再试！',() => {this.props.navigation.navigate('topUpResult',{data: res.body,status:'fail'})});
				 }
            }
        },(error) => {
			clearInterval(this.interValID);
			this.setState({
				getSmsCodeStatus: 1,
				getSmsCodeTitle: '获取验证码',
			});
            this.loading.show('netFail','网络超时',2000)
        },20 * 1000,this);
    }
    getSmsCode(type){
				if(type == 'reSend'){
					if(this.state.bundlingFlag){
						Grow.track('elbn_my_recharge2confirm_resend_click',{'elbn_my_recharge2confirm_resend_click':'重新发送按钮点击量(已绑定)'})
					}else{
						Grow.track('elbn_my_recharge1confirm_resend_click',{'elbn_my_recharge1confirm_resend_click':'重新发送按钮点击量'})
					}
				}
        if(this.state.getSmsCodeStatus == 1) {
					Grow.track('getSmsCode_start',{'userId':`${__useId}`});
            this.setState({
                getSmsCodeStatus: 0
            });
            let getRequestIDData = this.state.getRequestIDData;
            dismissKeyboard();
            let data = {
                sessionId: __sessionId,
                useId:this.state.userInfo.sftUserMdl.useId,
                channelVal: getRequestIDData.channelVal,
                requestId: getRequestIDData.requestId,
                bankAccount: this.state.formData.cardNo,
                idNumber: this.state.userInfo.sftUserMdl.useIdentityNum,
                name: this.state.userInfo.sftUserMdl.useName,
                mobilePhone: this.state.formData.phoneNo,
                bankCode:this.state.bankAccountInfo ? this.state.bankAccountInfo.bankCode : this.state.bankCode,
            };
            this.loading.show();
            Fetch.post('payment/getMessageCode',data,(res) => {
                console.log('getMessageCode',res)
                this.loading.hide();
                if(res.randomValidateId && res.randomValidateId.length > 0){
										Fetch.getLog(`https://etrace.etongdai.com?methodName=getSmsCode_success&userId=${__useId}&time=${Date.now()}`,(res) => {},(error) => {})
										Grow.track('getSmsCode_success',{'userId':`${__useId}`});
                    this.setState({
                        haveGetSms: true,
                        smsCodeInfo: res,
                    });
                    clearInterval(this.interValID);
                    this.interValID = Util.timer(this, 60);
                    this.showModal();
                    if(!Util.isIOS){
                        this.hardwarePressHandler = BackHandler.addEventListener('hardwarePress',this.hardwarePress.bind(this))
                    }
                }else{
									this.setState({
										getSmsCodeStatus: 1
									});
					// this.setFormData('cardNo',"")
                   this.eAlert.show('alert',res.info.indexOf('<br/>') != -1 ? res.info.replace('<br/>',"\n") : res.info);
									 Fetch.getLog(`https://etrace.etongdai.com?methodName=getSmsCode_error&userId=${__useId}&time=${Date.now()}`,(res) => {},(error) => {})
												}
										},(error) => {
												this.setState({
														getSmsCodeStatus: 1
												});
								this.loading && this.loading.show('netFail','网络超时',2000);
								Fetch.getLog(`https://etrace.etongdai.com?methodName=getSmsCode_timeout&userId=${__useId}&time=${Date.now()}`,(res) => {},(error) => {})
            },20 * 1000,this,);
        }
    };
		hardwarePress(){
			return true
		}
    showModal(){
			if(this.state.bundlingFlag){
				Grow.track('pg_my_recharge2confirm_userbrose',{'pg_my_recharge2confirm_userbrose':'充值确认弹窗(已绑卡)'})
			}else{
				Grow.track('pg_my_recharge1confirm_userbrose',{'pg_my_recharge1confirm_userbrose':'充值确认弹窗'})
			}
        this.setState({showModal: true});
        setTimeout(() => {
            Animated.spring(this.state.scale,{
                toValue: 1,
                duration: 10,
                tension: 30,
                friction: 4
            }).start();
        });
    };
    hideModal(flag){
        if(flag){
            this.hardwarePressHandler && this.hardwarePressHandler.remove()
        }
        Animated.spring(this.state.scale,{
            toValue: 0,
            duration: 10,
            tension: 10,
            friction: 4
        }).start();
        setTimeout(() => {
            this.setState({
                showModal: false,
                scale: new Animated.Value(0),
            });
        });
    };
    rightButtonCallback(){
        dismissKeyboard()
        this.state.bundlingFlag == '1' ?
            this.props.navigation.navigate('topUpNotes')
            :
            this.checkLimit()
    }
    checkLimit(){
        // this.props.navigation.navigate('webViewWithBridge',{url:'https://m.nowpre.etongdai.org/payment/bankListPage',title:'充值限额列表'})
        this.props.navigation.navigate('webViewWithBridge',{url:Config.systemInfos.topUp_limit,title:'充值限额列表'})
    }
    _keyboardDidShow(e){
        this.setState({
            showKeyboardControll: true
        })
        if(!Util.isIOS && this.state.activeInput != "cardNo"){
            this.scrollView && this.scrollView.scrollToEnd({ animated: true})
        }
    }
    _keyboardWillShow(e){
        this.setState({
            showKeyboardControll: true
        })

    }
    __keyboardDidHide(){
        this.setState({
            active: false,
            showKeyboardControll: false
        });

    }
    __keyboardWillHide(){
        this.setState({
            showKeyboardControll: false
        });
			this.verifyCodeInput && this.verifyCodeInput.blur();
			if(this.state.activeInput != "cardNo"){
				this.scrollView && this.scrollView.scrollTo({x:0,y: 0})
			}
    }
	_getNotice(){
		Fetch.post('more/getCmsRechargeNoticeData', {}, (res) => {
			if(res){
				let data = JSON.parse(res);
				this.setState({
					notice: data[0].desc
				})
			}
		}, () => {})
	}
	closeNotice() {
		Animated.timing(this.state.height,{
			toValue: 0,
			duration: 330
		}).start(() => {
			this.setState({
				showNotice: false
			})
		})
	}
	viewOnLayout(event) {
		console.log('event', event)
	}
    render() {
        let bankData = this.state.bankData;
        let assetData = this.state.assetData;
        let bankAccountInfo = this.state.bankAccountInfo;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard();this.setState({activeInput: ''})}} style={withdrawPageStyle.container}>
                <View style={{flex:1}}>
								<MineHeader title="充值"
														leftButton
														leftIcon
														goBack
														backKey={this.props.navigation.state.params && this.props.navigation.state.params.backKey ? this.props.navigation.state.params.backKey : false}
														rightButton={ this.state.bundlingFlag == '1' ? '充值记录' : '银行限额'}
														topUpHistory
														root={this}
														rightButtonCallback={this.rightButtonCallback.bind(this)}
														navigation={this.props.navigation}/>


					<View style={{flex:1}}>
						{
							this.state.notice && this.state.notice.length ?
								<Animated.View style={[withdrawPageStyle.topSwiper,{height: this.state.height}]}>
									<View style={withdrawPageStyle.wrapper} >
										<MarqueeLabel duration={28000} text={this.state.notice} textStyle={{fontSize: 13, color: '#FF894A'}} />
									</View>
									<TouchableOpacity style={withdrawPageStyle.closeButton}
													  onPress={() => this.closeNotice()}>
										<Image source={require('./../../imgs/mine/topUPcloseButton.png')}/>
									</TouchableOpacity>
								</Animated.View>
							: null
						}
						{
							this.state.bundlingFlag == '1' ?
								<ScrollView style={withdrawPageStyle.contentBox} ref={(ref) => this.scrollView = ref}>
									<View style={withdrawPageStyle.bankAccountBox}>

										<Image style={withdrawPageStyle.cardBg} source={require('./../../imgs/mine/bankCardBg.png')}>
											<View style={withdrawPageStyle.cardTitleBox}>
												<View style={withdrawPageStyle.cardType}>
													{
														this.state.cardNoInput ?
															<Text allowFontScaling={false}  style={withdrawPageStyle.cardTypeTitle}>{this.state.bankAccountInfo && this.state.bankAccountInfo.bankName}</Text>
															:
															<Text allowFontScaling={false}  style={withdrawPageStyle.cardTypeTitle} >{bankData ?  bankData.bacName : "--"}</Text>

													}
												</View>

												<TouchableOpacity onPress={() => {
															this.setFormData('cardNo',"");
															this.setState({cardNoInput:true,bankAccountInfo:null});
															setTimeout(() => this.cardNoInput && this.cardNoInput.focus())
													}} style={withdrawPageStyle.cardNoEdit}>
													<Image style={withdrawPageStyle.cardNoEditImg}source={require('./../../imgs/mine/editButton.png')}/>
												</TouchableOpacity>

											</View>
											<View style={withdrawPageStyle.cardNoBox}>
												{
													this.state.cardNoInput ?
														<TextInput style={withdrawPageStyle.cardNoInput}
																   ref={ref => this.cardNoInput = ref}
																   placeholder="请重新输入银行卡号"
																   underlineColorAndroid="transparent"
																   onChangeText={this.setFormData.bind(this,'cardNo')}
																   placeholderTextColor="#FFFFFF"
																   clearButtonMode="while-editing"
																   keyboardType="numeric"
																   maxLength={19}
																   value={this.state.formData.cardNo}
																   onBlur={() => this.checkBankInfo()}
																   onFocus={() => {this.setState({activeInput: 'cardNo'});}}
														/>
														:
														<Text allowFontScaling={false} style={withdrawPageStyle.cardNo} onPress={() => {this.setFormData('cardNo',"");this.setState({cardNoInput:true,bankAccountInfo:null})}}>{bankData ? bankData.bankCardNum.replace(/(\d{4})\S+(\d{4})/, "$1 **** **** $2") : ''}</Text>
												}

											</View>
											{
												this.state.showLimit && bankAccountInfo ?
													<View style={[withdrawPageStyle.cardInfoBox,{paddingLeft: 0}]}>
														<Text allowFontScaling={false} style={withdrawPageStyle.limitRemind}>单笔限额{bankAccountInfo && Util.thousandBitSeparator(bankAccountInfo.singleLimit,true).split('.')[0]}元，单日限额{bankAccountInfo && Util.thousandBitSeparator(bankAccountInfo.dayLimit).split('.')[0]}元</Text>
													</View>
													:
													null
											}

										</Image>
									</View>
									<View style={withdrawPageStyle.checkLimit}>
										<TouchableOpacity activeOpacity={0.75} style={withdrawPageStyle.checkLimitBox} onPress={this.checkLimit.bind(this)}>
											<Text allowFontScaling={false} style={withdrawPageStyle.checkLimitTitle}>银行限额查询</Text>
											<RightIcon right height={40}/>
										</TouchableOpacity>
									</View>
									<View style={withdrawPageStyle.dataBox}>
										<Image source={require('./../../imgs/mine/itemBg.png')} style={withdrawPageStyle.bankBox}>
											<View style={withdrawPageStyle.bankNameBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.titleLabel}>可用余额：</Text>
											</View>
											<View style={withdrawPageStyle.bankNoBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.bankNum}>{assetData ? Util.thousandBitSeparator(assetData.vaildMoney.toFixed(2)): ""}元</Text>
											</View>
										</Image>
										<Image source={require('./../../imgs/mine/itemBg.png')} style={withdrawPageStyle.bankBox}>
											<View style={withdrawPageStyle.bankNameBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.titleLabel}>充值金额：</Text>
											</View>
											<View style={[withdrawPageStyle.moneyInput,{flexDirection:'row',alignItems:'center'}]}>
												<TextInput style={withdrawPageStyle.input}
														   placeholder="请输入充值金额"
														   underlineColorAndroid="transparent"
														   onChangeText={this.setFormData.bind(this,'payAmt')}
														   placeholderTextColor="#9B9B9B"
														   clearButtonMode="while-editing"
														   keyboardType="numeric"
														   value={this.state.formData.payAmt}
														   onFocus={() => {this.setState({activeInput: 'payAmt'})}}
												/>
												{
													!Util.isIOS ?
														<View style={{width: 40 * Util.pixel,alignItems:'center'}}>
															{
																!Util.isIOS && this.state.activeInput == 'payAmt'?  <CloseButton onPress={() => {Util.setFormData(this,'payAmt',"")}}/> : null
															}
														</View>
														:
														null
												}
												<Text allowFontScaling={false} style={withdrawPageStyle.inputText}>元</Text>

											</View>

										</Image>
										<Image source={require('./../../imgs/mine/itemBg.png')} style={withdrawPageStyle.bankBox}>
											<View style={withdrawPageStyle.bankNameBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.titleLabel}>手机号码：</Text>
											</View>
											<View style={[withdrawPageStyle.moneyInput,{flexDirection:'row',alignItems:'center'}]}>
												<TextInput style={withdrawPageStyle.input}
														   placeholder="请输入银行预留手机号"
														   underlineColorAndroid="transparent"
														   onChangeText={this.setFormData.bind(this,'phoneNo')}
														   placeholderTextColor="#9B9B9B"
														   clearButtonMode="while-editing"
														   keyboardType="numeric"
														   maxLength={11}
														   value={this.state.formData.phoneNo}
														   onFocus={() => {
																		this.scrollView && this.scrollView.scrollTo({x:0,y: 45})
																		this.setState({activeInput: 'phoneNo'}
																)}}
												/>
												{
													!Util.isIOS ?
														<View style={{width: 40 * Util.pixel,alignItems:'center'}}>
															{
																!Util.isIOS && this.state.activeInput == 'phoneNo'?  <CloseButton onPress={() => {Util.setFormData(this,'phoneNo',"")}}/> : null
															}
														</View>
														:
														null
												}
											</View>

										</Image>
										<View style={[withdrawPageStyle.bankBox,{height: 25,backgroundColor: 'transparent'}]}>
											<View style={withdrawPageStyle.bankNameBox}/>
											<View style={[withdrawPageStyle.moneyInput,{backgroundColor: 'transparent'}]}>
												<Text allowFontScaling={false} style={[withdrawPageStyle.input,{backgroundColor: 'transparent',color: 'red',fontSize: 12,lineHeight: 25}]}>{ this.state.showError }</Text>
											</View>
										</View>
									</View>

								</ScrollView>
								:
								<ScrollView style={{flex:1}}>
									<View style={withdrawPageStyle.nb_contentBox}>
										<View style={[withdrawPageStyle.nb_itemBox, (this.state.height > 0 && this.state.notice) && {alignItems: 'flex-end'}]}>
											<Text allowFontScaling={false} style={withdrawPageStyle.nb_topRemindTitle}>仅可使用本人名下的借记卡</Text>
										</View>
										<Line/>
										<View style={withdrawPageStyle.nb_itemBox}>
											<View style={withdrawPageStyle.nb_itemTitleBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.nb_itemTitle}>银行卡号</Text>
											</View>
											<View style={[withdrawPageStyle.nb_cardNoInputBox,!this.state.bankAccountInfo && {borderBottomWidth:0}]}>
												<TextInput style={withdrawPageStyle.nb_input}
														   placeholder="请输入银行卡号"
														   underlineColorAndroid="transparent"
														   ref={ref => this.cardNoInput = ref}
														   onChangeText={this.setFormData.bind(this,'cardNo')}
														   maxLength={19}
														   placeholderTextColor="#C5C5C5"
														   clearButtonMode="while-editing"
														   keyboardType="numeric"
														   value={this.state.formData.cardNo}
														   onBlur={() => this.checkBankInfo()}
														   onFocus={() => {this.setState({activeInput: 'cardNo'})}}
												/>
											</View>
										</View>
										{
											this.state.bankAccountInfo ?
												<View style={[withdrawPageStyle.nb_itemBox,{justifyContent: 'flex-start',}]}>
													<Text allowFontScaling={false} style={withdrawPageStyle.nb_centerRemindTitle}>{this.state.bankAccountInfo && this.state.bankAccountInfo.bankName}单笔最高{this.state.bankAccountInfo && this.state.bankAccountInfo.singleLimit}元，单日最高{this.state.bankAccountInfo && this.state.bankAccountInfo.dayLimit}元</Text>
												</View>
												: null
										}
										<Line/>
										<View style={withdrawPageStyle.nb_itemBox}>
											<View style={withdrawPageStyle.nb_itemTitleBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.nb_itemTitle}>手机号码</Text>
											</View>
											<View style={withdrawPageStyle.nb_InputBox}>
												<TextInput style={withdrawPageStyle.nb_input}
														   placeholder="请输入银行预留手机号"
														   underlineColorAndroid="transparent"
														   onChangeText={this.setFormData.bind(this,'phoneNo')}
														   maxLength={11}
														   placeholderTextColor="#C5C5C5"
														   clearButtonMode="while-editing"
														   keyboardType="numeric"
														   value={this.state.formData.phoneNo}
														   onFocus={() => {this.setState({activeInput: 'phoneNo'})}}
												/>
											</View>
										</View>
										<Line/>
										<View style={withdrawPageStyle.nb_itemBox}>
											<View style={withdrawPageStyle.nb_itemTitleBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.nb_itemTitle}>可用余额</Text>
											</View>
											<View style={withdrawPageStyle.nb_InputBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.nb_itemTitle}>{assetData ? Util.thousandBitSeparator(assetData.vaildMoney.toFixed(2)): ""}元</Text>
											</View>
										</View>
										<Line/>
										<View style={withdrawPageStyle.nb_itemBox}>
											<View style={withdrawPageStyle.nb_itemTitleBox}>
												<Text allowFontScaling={false} style={withdrawPageStyle.nb_itemTitle}>充值金额</Text>
											</View>
											<View style={withdrawPageStyle.nb_InputBox}>
												<TextInput style={withdrawPageStyle.nb_input}
														   placeholder="最低充值金额100元"
														   underlineColorAndroid="transparent"
														   onChangeText={this.setFormData.bind(this,'payAmt')}
														   placeholderTextColor="#C5C5C5"
														   clearButtonMode="while-editing"
														   keyboardType="numeric"
														   value={this.state.formData.payAmt}
														   onFocus={() => {this.setState({activeInput: 'payAmt'})}}
												/>
											</View>
										</View>
										<View style={withdrawPageStyle.topReminderBox}>
											<Text style={withdrawPageStyle.topReminder}>充值时会对银行卡做验证，因此请确保使用您本人的银行卡并确保银行卡号、手机号、身份证、姓名与银行预留的一致</Text>
										</View>
									</View>
								</ScrollView>
						}
					</View>
					 <KeyboardAvoidingView behavior={Util.isIOS ? 'padding' : 'height'} contentContainerStyle={withdrawPageStyle.keyboardControllBox}>
							{
									this.state.showKeyboardControll ?
											<TouchableOpacity  activeOpacity={1} onPress={() => dismissKeyboard()} style={withdrawPageStyle.keyboardControll}>
													<Text style={withdrawPageStyle.keyboardControllText}>收起</Text>
											</TouchableOpacity>
									 :
									null
							}
					</KeyboardAvoidingView>
					<EAlert ref={(ref) => this.eAlert = ref}/>
					<Loading ref={(ref) => this.loading = ref}/>
					{
						!this.state.showKeyboardControll ?
							<View style={withdrawPageStyle.buttonBoxouter}>
								<View style={[withdrawPageStyle.bigReminder]}>
									<Text style={withdrawPageStyle.bigReminderText}>需要大额充值？请前往电脑端（www.etongdai.com) 选择网银充值</Text>
								</View>
								<TouchableOpacity activeOpacity={0.75} style={[withdrawPageStyle.buttonBox,this.state.buttonDisable && {backgroundColor:'#ccc'}]} onPress={this.checkPayAmt.bind(this)}>
									<Text allowFontScaling={false} style={withdrawPageStyle.buttonText}>立即充值</Text>
								</TouchableOpacity>
							</View>
							:
							null
					}
                </View>
                    {
                        this.state.showModal ?
                            <View activeOpacity={1} style={[withdrawPageStyle.m_Container,!Util.isIOS && this.state.active && { justifyContent: 'flex-end',}]} >
                                <Animated.View style={[withdrawPageStyle.m_Content,{transform:[{scale: this.state.scale}]}]}>
                                    <View style={withdrawPageStyle.m_TopTitleBox} >
                                        <Text allowFontScaling={false} style={withdrawPageStyle.m_TopTitle}>充值确认</Text>
                                    </View>
                                    <View style={withdrawPageStyle.m_TopMoneyTitleBox} >
                                        <Text allowFontScaling={false} style={withdrawPageStyle.m_TopMoneyTitle}>本次充值金额{Util.thousandBitSeparator(parseFloat(this.state.formData.payAmt).toFixed(2))}元</Text>
                                    </View>
                                    <View style={withdrawPageStyle.m_TopMessageTitleBox} >
                                        <Text allowFontScaling={false} style={withdrawPageStyle.m_TopMessageTitle}>短信验证码已发送至您的手机，请注意查收{this.state.formData.phoneNo.replace(/(\d{3})\d+(\d{4})/,"$1****$2")}</Text>
                                    </View>

                                    <View style={withdrawPageStyle.m_msgInputBox}>
                                        <View style={withdrawPageStyle.m_msgInputSubBox}>
                                            <TextInput style={[withdrawPageStyle.input,{backgroundColor: 'transparent'}]}
                                                       placeholder="请输入短信验证码"
                                                       underlineColorAndroid="transparent"
                                                       onChangeText={this.setFormData.bind(this,'smsCode')}
                                                       maxLength={6}
                                                       placeholderTextColor="#9B9B9B"
                                                       clearButtonMode="while-editing"
                                                       keyboardType="numeric"
                                                       value={this.state.formData.smsCode}
                                                       onBlur={() => {this.setState({activeInput: 'smsCode',active: false})}}
                                                       onFocus={() => {this.setState({activeInput: 'smsCode',active: true})}}
                                                       ref={ref => this.verifyCodeInput = ref}
                                            />
                                            {
                                                !Util.isIOS && this.state.activeInput == 'smsCode'?  <CloseButton onPress={() => {this.setFormData('smsCode',"")}}/> : null
                                            }

                                        </View>
                                        <TouchableOpacity activeOpacity={0.7} style={[withdrawPageStyle.m_msgInputButtonBox,!this.state.getSmsCodeStatus && {backgroundColor:"#ccc"}]} onPress={this.getSmsCode.bind(this,'reSend')}>
                                            <Text allowFontScaling={false} style={withdrawPageStyle.m_msgInputButtonTitle}>{this.state.getSmsCodeTitle}</Text>
                                        </TouchableOpacity>
                                </View>
                                <View style={withdrawPageStyle.m_msgRemindBox}>
                                    <Text allowFontScaling={false} style={withdrawPageStyle.m_msgRemindBoxTitle}>{this.state.remindTitle}</Text>
                                </View>
                                <View style={withdrawPageStyle.m_buttonBox}>
                                    <TouchableOpacity style={withdrawPageStyle.m_sureButton} onPress={this.checkSmsCode.bind(this)}>
                                        <Text allowFontScaling={false} style={withdrawPageStyle.m_sureButtonText}>确定</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={withdrawPageStyle.m_cancelButton} onPress={() => {this.state.bundlingFlag ? Grow.track('elbn_my_recharge2confirm_cancel_click',{'elbn_my_recharge2confirm_cancel_click':'取消按钮点击量(已绑定)'}) : Grow.track('elbn_my_recharge1confirm_cancel_click',{'elbn_my_recharge1confirm_cancel_click':'取消按钮点击量'});this.state.getSmsCodeStatus && this.hideModal(true)}}>
                                        <Text allowFontScaling={false} style={[withdrawPageStyle.m_cancelButtonText,!this.state.getSmsCodeStatus && {color:"#ccc"}]}>取消</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                            </View>
                            :
                            null
                    }
                    
            </TouchableOpacity>
        );
    }
}
