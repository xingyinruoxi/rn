/**
 * Created by liuzhenli on 2017/7/13.
 */
import React, { Component } from 'react';
import {
    TextInput,
    Text,
    View,
    ActivityIndicator,
    StatusBar,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Button from './../components/button';
import Line from './../../commons/line';
import Fetch from './../../commons/fetch';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import EAlert from './../components/ealert';
import CloseButton from './../components/closeButton';
import MineHeader from '../components/commonHeader';
import VLine from './../../commons/vLine';
import Loading from './../components/loading';
import {withdrawSubmitPageStyle} from './../../styles/mine/withdrawSubmitStyle';
import Util,{ Grow }  from './../../commons/util';
var dismissKeyboard = require('dismissKeyboard');
export default class WithdrawSubmit extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.interValID = null;
        this.state = {
            isRefreshing: false,
            userInfo: null,
            getSmsCodeTitle: '发送验证码',
            getSmsCodeStatus: 1,
            actualWithdrawalAmount: this.props.navigation.state.params.data.withdrawFee,
            withdrawalAmount:  this.props.navigation.state.params.data.withdrawLimit,
            verifyCode: null,
            formData:{
                tradePwd:'',
                smsCode: '',
            },
            haveGetSms: false,
            visible: false,
            showBottomBox: false
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            console.log('userInfo',userInfo)
            setTimeout(() => {this.getSmsCode()})
        });
    };
    componentWillUnmount(){
        clearInterval(this.interValID)
    };
		componentDidMount(){
				Grow.track('pg_my_userbrowseconfirm_userbrowse',{'pg_my_userbrowseconfirm_userbrowse':'信息确认页浏览用户量'})
		}
    setFormData(arg,val){
        let formData = this.state.formData;
        formData[arg] = val;
        this.setState({
            formData: formData
        })
    };
    checkFormData = () =>{
        let formData = this.state.formData;
            formData.smsCode.replace(/\s+/,"").length > 0 ?
                formData.tradePwd.replace(/\s+/,"").length > 0 ?
                this.toSubmit()
                    :
                this.eAlert.show('alert','请输入支付密码')
            :
            this.eAlert.show('alert','请输入验证码')
    };
    getSmsCode(){
        if(this.state.getSmsCodeStatus){
            this.setState({
                getSmsCodeStatus: 0
            });
            this.loading.show();
            let data = {
                sessionId: __sessionId,
                useId: this.state.userInfo.sftUserMdl.useId,
                messageType:'1',
                useMobile: this.state.userInfo.sftUserMdl.useMobilePhones
            };
            console.log('data',data);
            Fetch.post('user/sendMessageIdentify',data,(res) => {
                console.log('sendMessageIdentify',res);
                
                this.loading.hide();
                if(res.success){
                    this.setState({
                        haveGetSms: true,
                        smsCodeInfo: res,
                    });
                    clearInterval(this.interValId);
                    this.interValID = Util.timer(this,60);
                }else{
                    this.setState({
                        getSmsCodeStatus: 1
                    });
                    this.eAlert.show('alert',res.info);
                }
            },(error) => {
                this.setState({
                    getSmsCodeStatus: 1
                });
                this.loading.show('netFail','网络超时',2000)
            },20 * 1000,this);
        }
    };
    toSubmit(){
        this.setState({
            verifyCode: null
        });
        let data = {
            actualWithdrawalAmount: parseFloat(this.state.actualWithdrawalAmount),
            sessionId: __sessionId,
            useId: this.state.userInfo.sftUserMdl.useId,
            withdrawalAmount: parseFloat(this.state.withdrawalAmount),
            password: Util.Encode(this.state.formData.tradePwd),
            smsCode: this.state.formData.smsCode
        };
        console.log('data',data)
        this.loading.show();
        Fetch.post('withdrawal/completeWithoutRsa',data,(res) => {
            console.log('withdrawal',res);
            this.loading.hide();
            if(res.success){
                this.props.navigation.navigate('withdrawResult',{status:'success',data: res.body})
            }else{
                this.eAlert.show('alert',res.info);
            }
        },(error) => {
            this.loading.show('netFail','网络超时',2000)
        },null,this,Util.getVerifyCode.bind(this,this,Fetch))
    };
    changeVisible(){
        this.setState({
            visible: !this.state.visible
        })
    }
    forgotTradePwd(){
        this.props.navigation.navigate('resetPwdByPhone',{userInfo: this.state.userInfo.sftUserMdl,backKey: this.props.navigation.state.key})
    };
    toInvesment(){
        global.forbidTransition = true;
        this.props.navigation.navigate('list');
        setTimeout(() => {global.forbidTransition = false;})
    }
    render() {
        let withDrawData = this.props.navigation.state.params.data;
        return (
            <TouchableOpacity activeOpacity={1} style={withdrawSubmitPageStyle.container}onPress={() => {dismissKeyboard();this.setState({activeInput: ''})}}>
                <View style={withdrawSubmitPageStyle.container}>
                    <MineHeader title="信息确认" leftButton leftIcon goBack root={this} navigation={this.props.navigation}/>
                    <ScrollView style={withdrawSubmitPageStyle.dataBox}>
                        <View style={withdrawSubmitPageStyle.bankBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.topTitle}>余额继续出借可获得更多收益</Text>
                        </View>
                        <Line notFull={true}/>
                        <View style={withdrawSubmitPageStyle.bankBox}>
                            <View style={withdrawSubmitPageStyle.bankNameBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.titleLabel}>提现金额</Text>
                            </View>
                            <View style={withdrawSubmitPageStyle.bankNoBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.bankNo}>{withDrawData ? Util.thousandBitSeparator(parseFloat(withDrawData.withdrawLimit).toFixed(2)): ""}元</Text>
                            </View>
                        </View>
                        <Line notFull={true}/>
                        <View style={withdrawSubmitPageStyle.bankBox}>
                            <View style={withdrawSubmitPageStyle.bankNameBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.titleLabel}>提现手续费</Text>
                            </View>
                            <View style={withdrawSubmitPageStyle.bankNoBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.handlingFee}>-{withDrawData ? Util.thousandBitSeparator(parseFloat(withDrawData.handlingFee).toFixed(2)) : ""}元</Text>
                            </View>
                        </View>
                        <Line notFull={true}/>
                        <View style={withdrawSubmitPageStyle.bankBox}>
                            <View style={withdrawSubmitPageStyle.bankNameBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.titleLabel}>实际到账金额</Text>
                            </View>
                            <View style={withdrawSubmitPageStyle.bankNoBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.bankNo}>{withDrawData ? Util.thousandBitSeparator(parseFloat(withDrawData.withdrawFee).toFixed(2)) : ""}元</Text>
                            </View>
                        </View>
                        <Line notFull={true}/>
                        <TouchableOpacity style={[withdrawSubmitPageStyle.bankBox]} activeOpacity={0.75}onPress={this.changeVisible.bind(this)}>
                            <View style={[withdrawSubmitPageStyle.bankSubSubBox]}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.handlingFeeRules}>手续费规则</Text>
                                {
                                    this.state.visible ?
                                        <Image source={require('./../../imgs/mine/down.png')}/>
                                    :
                                        <Image source={require('./../../imgs/mine/top.png')}/>

                                }
                            </View>
                        </TouchableOpacity>
                        {
                            this.state.visible ?
                                <View style={[withdrawSubmitPageStyle.bankBox]}>
                                    <View style={[withdrawSubmitPageStyle.withdrawRulesBox,]}>
																			<Line notFull={true}/>
																			<Text allowFontScaling={false} style={withdrawSubmitPageStyle.handlingFeeContent}>提现说明：</Text>
																			<Text allowFontScaling={false} style={withdrawSubmitPageStyle.handlingFeeContent}>{this.props.navigation.state.params.rule.withdrawDesc.split("<br>")[0]}{this.props.navigation.state.params.rule.withdrawDesc.split("<br>")[1]}</Text>
																			<Text allowFontScaling={false} style={withdrawSubmitPageStyle.handlingFeeContent}>{this.props.navigation.state.params.rule.withdrawDesc.split("<br>")[2]}{this.props.navigation.state.params.rule.withdrawDesc.split("<br>")[3]}</Text>
																	</View>
                                </View>
                                :
                                null
                        }

                        <View style={[withdrawSubmitPageStyle.bankBox,{marginTop: 10 * Util.pixel}]}>
                            <View style={[withdrawSubmitPageStyle.labelImgBox,]}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.titleLabel}>验证码</Text>
                            </View>
                            <View style={withdrawSubmitPageStyle.bankSubBox}>
                                <View style={[withdrawSubmitPageStyle.verifyCodeInputBox,]}>
                                    <TextInput style={withdrawSubmitPageStyle.verifyCodeInput}
                                               placeholder="请输入短信验证码"
                                               underlineColorAndroid="transparent"
                                               onChangeText={this.setFormData.bind(this,'smsCode')}
                                               maxLength={6}
                                               placeholderTextColor="#C5C5C5"
                                               clearButtonMode="while-editing"
                                               value={this.state.formData.smsCode}
                                               onFocus={() => {this.setState({activeInput:'smsCode'})}}/>
                                    <View style={{width: 20 * Util.pixel,backgroundColor:'transparent'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'smsCode'?  <CloseButton onPress={() => {this.setFormData('smsCode',"")}}/> : null
                                        }
                                    </View>

                                </View>
                                <VLine color="#025FCC"/>
                                <View style={withdrawSubmitPageStyle.verifyCodeBox}>
                                    <TouchableOpacity activeOpacity={0.7}style={[withdrawSubmitPageStyle.getSmsButton,]} onPress={this.getSmsCode.bind(this)}>
                                        <Text allowFontScaling={false} style={withdrawSubmitPageStyle.getSmsButtonTitle}>{
                                            this.state.getSmsCodeTitle
                                        }</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                            <View style={withdrawSubmitPageStyle.mesRemind}>
                                {
                                    this.state.haveGetSms ?
                                        <Text allowFontScaling={false} style={withdrawSubmitPageStyle.mesRemindText}>已向您{this.state.userInfo.sftUserMdl.useMobilePhones.replace(/(\d{3})\d+(\d{4})/, "$1****$2")}的手机发送验证码</Text>
                                        : null
                                }
                            </View>
                        <View style={[withdrawSubmitPageStyle.bankBox,{marginTop: 10 * Util.pixel}]}>
                            <View style={withdrawSubmitPageStyle.labelImgBox}>
                                <Text allowFontScaling={false} style={withdrawSubmitPageStyle.titleLabel}>支付密码</Text>
                            </View>
                            <View style={[withdrawSubmitPageStyle.verifyCodeInputBox,{ flex:1,}]}>
                                <TextInput style={withdrawSubmitPageStyle.verifyCodeInput}
                                           placeholder="请输入支付密码"
                                           underlineColorAndroid="transparent"
                                           onChangeText={this.setFormData.bind(this,'tradePwd')}
                                           placeholderTextColor="#C5C5C5"
                                           clearButtonMode="while-editing"
                                           password={true}
                                           secureTextEntry={true}
                                           value={this.state.formData.tradePwd}
                                           onBlur={() => this.setState({showBottomBox: false})}
                                           onFocus={() => {this.setState({activeInput:'tradePwd',showBottomBox: true})}}/>
                                <View style={{width: 30 * Util.pixel,backgroundColor:'transparent'}}>
                                    {
                                        !Util.isIOS && this.state.activeInput == 'tradePwd'?  <CloseButton onPress={() => {this.setFormData('tradePwd',"")}}/> : null
                                    }
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={withdrawSubmitPageStyle.forgetRemind} onPress={() => this.forgotTradePwd()}>
                            <Text allowFontScaling={false} style={withdrawSubmitPageStyle.forgetRemindText}>忘记交易密码了？去找回</Text>
                        </TouchableOpacity>
                        <View style={withdrawSubmitPageStyle.buttonBox}>
                            <Button buttonName="确认提现" width={150} onPress={this.checkFormData}/>
                            <Button buttonName="继续出借" width={150} onPress={this.toInvesment.bind(this)} color="#f6f7fa" textColor="#025FCB" borderColor="#025FCB"/>
                        </View>
                        {
                            this.state.showBottomBox ?
                                <View style={{height: 200}}/>
                                :
                                null
                        }
                    </ScrollView>
                    <EAlert ref={(ref) => this.eAlert = ref}/>
                    <Loading ref={(ref) => this.loading = ref}/>
                </View>
            </TouchableOpacity>

        );
    }
}









