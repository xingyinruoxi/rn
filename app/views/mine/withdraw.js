/**
 * Created by liuzhenli on 2017/7/13.
 */
import React, { Component } from 'react';
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
    Animated,
    Keyboard,
	KeyboardAvoidingView
} from 'react-native';
import {withdrawPageStyle} from './../../styles/mine/withdrawStyle';
import Line from './../../commons/line';
import Fetch from './../../commons/fetch';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import Config from './../../commons/config';
import Util,{ Grow } from './../../commons/util';
import RightIcon from './../components/rightIcon';
import EAlert from './../components/ealert';
import CloseButton from './../components/closeButton';
import MineHeader from '../components/commonHeader';
import Loading from './../components/loading';
var dismissKeyboard = require('dismissKeyboard');
export default class WithDraw extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            userInfo: null,
            accountInfo: this.props.navigation.state.params.accountInfo,
            getSmsCodeTitle: '发送验证码',
            verifyCode: null,
            withdrawFee: 0.00,
            formData:{
                withdrawLimit: '',
            },
            buttonName: '计算到账金额',
            bankData: this.props.navigation.state.params.data,
            singleUpLimit: this.props.navigation.state.params.data.singleUpLimit,
            singleLowLimit: this.props.navigation.state.params.data.singleLowLimit,
			showKeyboardControll: false
		};
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
		this.keyboardDidHideShowListener = Keyboard.addListener('keyboardDidHide', this.__keyboardDidHide.bind(this));

		this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

	};
	keyboardWillShow(){
		Util.isIOS && this.setState({
			showKeyboardControll: true
		});
	}
	keyboardWillHide() {
		Util.isIOS && this.setState({
			showKeyboardControll: false
		});
	}
    componentWillUnmount(){
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideShowListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
		componentDidMount(){
			Grow.track('pg_my_withdraw_userbrowse',{'pg_my_withdraw_userbrowse':'提现页面浏览用户量'});
		}
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
        });
    };
    setFormData(arg,val){
        let formData = this.state.formData;
        if(formData[arg] && formData[arg].indexOf('.') != -1 && val.split('.').length > 1){
            if(val.split('.')[1].length > 2){
                formData[arg] = val.split('.')[0] +"."+ val.split('.')[1].substring(0,2);
            }else{
                formData[arg] = val.split('.')[0] +"."+ val.split('.')[1].replace(/\./,"");
            }
        }else{
            formData[arg] = val;
        }
        this.setState({
            formData: formData,
            haveCalculate: false,
        });
    };
    checkForm = () =>{
			Grow.track('elbn_my_withdraw_confirm_click',{'elbn_my_withdraw_confirm_click':'确认提现按钮点击量'});
        let formData = this.state.formData;
            formData.withdrawLimit.length > 0 ?
                this.state.bankData.mdl.withdrawSumYuan  >=  parseFloat(formData.withdrawLimit) ?
                    parseFloat(formData.withdrawLimit) >= this.state.singleLowLimit ?
                        parseFloat(formData.withdrawLimit) <= this.state.singleUpLimit ?
                            this.calculateFee():
                        this.eAlert.show('alert',`单笔最高提现额度${this.state.singleUpLimit/10000}万`)
                        :
                    this.eAlert.show('alert',`最小提现金额${this.state.singleLowLimit}元，请重新输入`)
                :
                this.eAlert.show('alert',`可提现余额不足`)
            :
            this.eAlert.show('alert',`请输入提现金额`)
    }
    toWithDrawSubmit(data){
        this.props.navigation.navigate('withdrawSubmit',{data:data,rule: this.props.navigation.state.params.data});
        this.setFormData('withdrawLimit',"")
    }
    calculateFee(){
        let data = {
            money: this.state.formData.withdrawLimit
        };
        this.loading.show();
        Fetch.post('withdrawal/applyFee',data,(res) => {
            console.log('applyFee',res)
            this.loading && this.loading.hide();
            if(res && res.success){
                this.setState({
                    haveCalculate: true,
                    withdrawData: res.body,
                });
                res.body['withdrawLimit'] = this.state.formData.withdrawLimit;
                this.toWithDrawSubmit(res.body);
            }else{
                this.eAlert.show('alert',res.info,() => {this.setFormData('withdrawLimit','');this.setState({withdrawFee: 0.00})})
            }
        },(error) => {
            this.loading && this.loading.show('netFail','网络超时',2000)
        },null,this)
    }
    checkBankLimit(){
        this.props.navigation.navigate('webViewWithBridge',{url:Config.systemInfos.topUp_limit,title:'充值限额列表'})
    }
    _keyboardDidShow(e){
		this.setState({
			showKeyboardControll: true
		});
        if(!Util.isIOS){
            this.scrollView.scrollToEnd({ animated: true})
        }
    }

	__keyboardDidHide(e) {
		this.setState({
			showKeyboardControll: false
		});
	}
    render() {
        let bankData = this.state.bankData;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard();this.setState({activeInput: ''})}} style={withdrawPageStyle.container}>
                <MineHeader title="提现" leftButton leftIcon goBack rightButton="提现记录" withdraw root={this}
                            rightButtonCallback={() => {this.props.navigation.navigate('withdrawNotes')}}
                            navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    <ScrollView ref={(ref) => this.scrollView = ref}style={withdrawPageStyle.contentBox}>
                            <View style={withdrawPageStyle.bankAccountBox}>
                                <Image style={withdrawPageStyle.cardBg} source={require('./../../imgs/mine/bankCardBg.png')}>
                                    <View style={withdrawPageStyle.cardTitleBox}>
                                        <View style={withdrawPageStyle.cardType}>
                                            <Text allowFontScaling={false}  style={withdrawPageStyle.cardTypeTitle}>{bankData ?  bankData.mdl.bacBankName : "--"}</Text>
                                        </View>
                                    </View>
                                    <View style={withdrawPageStyle.cardNoBox}>
                                        <Text allowFontScaling={false} style={withdrawPageStyle.cardNo}>{bankData ? bankData.mdl.bacNo.replace(/(\d{4})\S+(\d{4})/, "$1 **** **** $2") : ''}</Text>
                                    </View>
                                    <View style={[withdrawPageStyle.cardInfoBox,{paddingLeft: 0}]}>
                                        <Text allowFontScaling={false} style={withdrawPageStyle.limitRemind}>银行限额：单笔5万，单日30万</Text>
                                    </View>
                                </Image>
                            </View>

                            <View style={[withdrawPageStyle.dataBox,{marginBottom: 0,marginTop: 20}]}>
															<Image source={require('./../../imgs/mine/itemBg.png')} style={withdrawPageStyle.bankBox}>
                                    <View style={withdrawPageStyle.bankNameBox}>
                                        <Text allowFontScaling={false} style={withdrawPageStyle.titleLabel}>可提现额度：</Text>
                                    </View>
                                    <View style={withdrawPageStyle.bankNoBox}>
                                        <Text allowFontScaling={false} style={withdrawPageStyle.bankNum}>{bankData ? Util.thousandBitSeparator(bankData.mdl.withdrawSumYuan.toFixed(2)): ""}元</Text>
                                    </View>
															</Image>
													  </View>
														<View style={withdrawPageStyle.dataBox}>
															<Image source={require('./../../imgs/mine/itemBg.png')} style={withdrawPageStyle.bankBox}>
                                    <View style={withdrawPageStyle.bankNameBox}>
                                        <Text allowFontScaling={false} style={withdrawPageStyle.titleLabel}>提现金额：</Text>
                                    </View>
                                    <View style={[withdrawPageStyle.moneyInput,{flexDirection:'row',alignItems:'center'}]}>
                                        <TextInput style={withdrawPageStyle.input}
                                                   placeholder="请输入提现金额"
                                                   underlineColorAndroid="transparent"
                                                   onChangeText={this.setFormData.bind(this,'withdrawLimit')}
                                                   maxLength={11}
                                                   placeholderTextColor="#9B9B9B"
                                                   clearButtonMode="while-editing"
                                                   keyboardType="numeric"
                                                   value={this.state.formData.withdrawLimit}
                                                   onFocus={() => {this.setState({activeInput: 'withdrawLimit'})}}
                                        />
                                        {
                                            !Util.isIOS ?
                                                <View style={{width: 40 * Util.pixel,alignItems:'center'}}>
                                                    {
                                                        !Util.isIOS && this.state.activeInput == 'withdrawLimit'?  <CloseButton onPress={() => {Util.setFormData(this,'withdrawLimit',"")}}/> : null
                                                    }
                                                </View>
                                                :
                                                null
                                        }
                                        <Text allowFontScaling={false} style={withdrawPageStyle.inputText}>元</Text>
                                    </View>
                                </Image>
                                <View style={withdrawPageStyle.limitTextBox}>
                                    <Text allowFontScaling={false} style={withdrawPageStyle.limitTextBoxText}>单笔提现金额上限为{bankData ? bankData.singleUpLimit/10000 : '--'}万</Text>
                                </View>
                            </View>
                            <View style={withdrawPageStyle.withdrawRemind}>
                            </View>
                    </ScrollView>



                </View>
				<KeyboardAvoidingView behavior={Util.isIOS ? 'padding' : 'height'} contentContainerStyle={withdrawPageStyle.keyboardControllBox}>
					{
						this.state.showKeyboardControll ?
							<TouchableOpacity activeOpacity={1} onPress={() => dismissKeyboard()} style={withdrawPageStyle.keyboardControll}>
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
							<Text allowFontScaling={false} style={withdrawPageStyle.withdrawRemindText}>注：由于付款操作涉及第三方支付和银行，提现时间以实际到账时间为准</Text>
						</View>
						<TouchableOpacity activeOpacity={0.75} style={withdrawPageStyle.buttonBox} onPress={this.checkForm}>
							<Text allowFontScaling={false} style={withdrawPageStyle.buttonText}>确认</Text>
						</TouchableOpacity>
					</View>
						:
						null
				}

            </TouchableOpacity>
        );
    }
}