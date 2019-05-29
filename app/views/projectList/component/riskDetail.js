/**
 * Created by glzc on 2017/7/11.
 */
import React,{Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    NativeModules,
} from 'react-native';
import {RiskDetailStyles} from './../../../styles/projectList/riskDetailStyles';
import HeaderBar from './../../../commons/headerBar';
import Fetch from './../../../commons/fetch';
import Util,{Grow} from './../../../commons/util';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import InputTradePsw from './inputTradePsw';
const Storage = require('./../../../commons/storage');
const StorageKeys = require('./../../../commons/storageKey');
const EventEmitter = require('RCTDeviceEventEmitter');
const dismissKeyboard = require('dismissKeyboard');
const {systemInfos} = require('./../../../commons/config');
export default class RiskDetail extends Component{
    static navigationOptions = ({navigation}) => ({
        title: '信息确认',
        header: () => <HeaderBar navigation={navigation} noLine={true} />
    });
    constructor(props){
        super(props);
        this.state = {
            verifyCode: null,
            sessionId: null,
            useId: null,
            formData: this.props.navigation.state.params.data,
            isAgree: true,
        }
    };
    componentWillMount(){

    };
    componentDidMount(){
        this.growingIO(0);
        this.getUserInfo();
        this.eventEmit = EventEmitter.addListener('checkLogin',this.getUserInfo.bind(this));
    };
    componentWillUnmount(){
        this.eventEmit.remove();
    };
    getUserInfo(){
        if(this.view){
            Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
                if(res){
                    this.setState({
                        sessionId: res.sessionId,
                        useId: res.sftUserMdl.useId
                    });
                }
            });
        }
    };
    growingIO(n){
        switch (n){
            case 0:
                Grow.track('pg_invest_transferenterprice_userbrowse',{'pg_invest_transferenterprice_userbrowse':'确定承接金额页面浏览用户量'});
                break;
            case 1:
                Grow.track('elbn_invest_transferenterprice_confirm_click',{'elbn_invest_transferenterprice_confirm_click':'确认按钮点击量'});
                break;
            case 2:
                Grow.track('pg_invest_transferenterpwd_userbrowse',{'pg_invest_transferenterpwd_userbrowse':'输入交易密码弹窗'});
                break;
            default :
                break;
        }
    };
    loadPage(routeName,params){
        this.props.navigation.navigate(routeName,params);
    };
    _submit(){
        this.growingIO(1);
        let msg='',topUpMoney = 0;
        if(this.state.formData.pptClaimExtendMdl.claTransSumYuan > this.state.formData.pptItemExtendMdl.fufPraNowSumYuan){
            topUpMoney = Math.ceil((this.state.formData.pptClaimExtendMdl.claTransSumYuan - this.state.formData.pptItemExtendMdl.fufPraNowSumYuan))
            msg='余额不足，请充值：' + topUpMoney + '元';
        }else{
            this.growingIO(2);
            this.inputTradePsw.show();
            return;
        }
        topUpMoney > 0 ? this.eAlert.show('confirm',msg,this.toTopUp.bind(this), '去充值', null, false, '再想想') : this.eAlert.show('alert',msg);
    };
    toTopUp(){
        let money = Math.ceil((this.state.formData.pptClaimExtendMdl.claTransSumYuan - this.state.formData.pptItemExtendMdl.fufPraNowSumYuan))
        this.loading.show();
        Fetch.post('payment/rechargeInput',{useId: this.state.useId,sessionId: this.state.sessionId},res => {
            this.loading.hide();
            if(res.success){
                this.props.navigation.navigate('topUp',{data: this.state.userAccountData,bankData: res.body,topUpMoney: money > 0 ? money : null})
            }else{
                if(res.info && res.info.indexOf('实名认证') >= 0){
                    this.eAlert.show('alert',res.info,() => {
                        this.props.navigation.navigate('createRealNameAccount',{haveCertify: false})
                    })
                }else if(res.info && res.info.indexOf('绑定银行卡') >= 0){
                    this.eAlert.show('alert',res.info,() => {
                        this.props.navigation.navigate('bindBankCard',{data: res.body.user})
                    })
                }
            }
        },err => {
            this.loading.hide();
        })
    };
    _isAgree(){
        this.setState({
            isAgree: !this.state.isAgree
        })
    };
    render(){
        if(this.state.formData){
            let item = this.state.formData;
            return (
                <View ref={(ref) => this.view = ref} style={RiskDetailStyles.container}>
                    <View style={{flex: 1}}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            >
                            <TouchableOpacity activeOpacity={1} onPress={()=>{dismissKeyboard();}}>
                                <View style={RiskDetailStyles.headContent}>
                                    <View style={[RiskDetailStyles.padding,RiskDetailStyles.flexRow,{marginTop: Util.pixel*30,backgroundColor: '#006eee'}]}>
                                        <View style={[RiskDetailStyles.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
                                            <View style={RiskDetailStyles.flexRow}>
                                                <Text allowFontScaling={false} style={RiskDetailStyles.rateText}>{(item.pptClaimExtendMdl.iteYearRate * 100).toFixed(2)}</Text>
                                                <Text allowFontScaling={false} style={RiskDetailStyles.rateSymbol}>%</Text>
                                            </View>
                                            <View>
                                                <Text allowFontScaling={false} style={RiskDetailStyles.topText}>原始预期年回报率</Text>
                                            </View>
                                        </View>
                                        <View style={[RiskDetailStyles.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
                                            <View style={RiskDetailStyles.flexRow}>
                                                <Text allowFontScaling={false} style={RiskDetailStyles.rateText}>{item.pptClaimExtendMdl.surplusTotalNo}</Text>
                                                <Text allowFontScaling={false} style={RiskDetailStyles.rateSymbol}>{item.pptClaimExtendMdl.iteRepayIntervalName}</Text>
                                            </View>
                                            <View>
                                                <Text allowFontScaling={false} style={RiskDetailStyles.topText}>剩余期限</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[RiskDetailStyles.padding,{backgroundColor: '#fff'}]}>
                                    <View style={[RiskDetailStyles.flexRow,{height: Util.pixel*45,justifyContent: 'space-between'}]}>
                                        <Text allowFontScaling={false} style={RiskDetailStyles.title}>转让价格</Text>
                                        <Text allowFontScaling={false} style={RiskDetailStyles.minTitle}>{Util.numberFormat(item.pptClaimExtendMdl.claTransSumYuan)}元</Text>
                                    </View>
                                    <View style={RiskDetailStyles.line}></View>
                                    <View style={[RiskDetailStyles.flexRow,{height: Util.pixel*45,justifyContent: 'space-between'}]}>
                                        <Text allowFontScaling={false} style={RiskDetailStyles.title}>可用余额</Text>
                                        <View style={RiskDetailStyles.flexRow}>
                                            <View style={RiskDetailStyles.flexRow}>
                                                <Text allowFontScaling={false} style={[RiskDetailStyles.minTitle,{color: '#025fcc'}]}>{Util.numberFormat(item.pptItemExtendMdl.fufPraNowSumYuan)}</Text>
                                                <Text allowFontScaling={false} style={RiskDetailStyles.minTitle}>元</Text>
                                            </View>
                                            <TouchableOpacity activeOpacity={0.8} onPress={this.toTopUp.bind(this, null)} >
                                                <View style={[RiskDetailStyles.topUpBtn,RiskDetailStyles.flexRow]}>
                                                    <Text allowFontScaling={false} style={[RiskDetailStyles.minTitle,{color: '#e94639'}]}>充值</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={RiskDetailStyles.line}></View>
                                    <View style={[RiskDetailStyles.flexRow,{height: Util.pixel*45,justifyContent: 'space-between'}]}>
                                        <Text allowFontScaling={false} style={RiskDetailStyles.title}>预期投资回报</Text>
                                        <View style={RiskDetailStyles.flexRow}>
                                            <Text allowFontScaling={false} style={[RiskDetailStyles.minTitle,{color:'#e94639'}]}>{Util.numberFormat(item.expectedNetIncome)}</Text>
                                            <Text allowFontScaling={false} style={RiskDetailStyles.minTitle}>元</Text>
                                        </View>
                                    </View>
                                    <View style={RiskDetailStyles.line}></View>
                                    <View style={[RiskDetailStyles.flexRow,{height: Util.pixel*45,justifyContent: 'space-between'}]}>
                                        <Text allowFontScaling={false} style={RiskDetailStyles.title}>项目到期日</Text>
                                        <Text allowFontScaling={false} style={RiskDetailStyles.minTitle}>{Util.getDate(item.pptItemExtendMdl.iteRepayDeadline)}</Text>
                                    </View>
                                </View>
                                <View style={[RiskDetailStyles.flexRow,{marginTop: Util.pixel*17}]}>
                                    <Text allowFontScaling={false} style={[RiskDetailStyles.notice]}>预期收益不包含折让金部分</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={RiskDetailStyles.footer}>
                        <View style={{marginBottom: Util.pixel*20}}>
                            <View style={[RiskDetailStyles.flexRow]}>
                                <TouchableOpacity activeOpacity={1} onPress={this._isAgree.bind(this)}>
                                    <View style={RiskDetailStyles.flexRow}>
                                        <Image style={{marginRight: Util.pixel*5}} source={this.state.isAgree ? require('./../../../imgs/projectList/active_check_icon.png') : require('./../../../imgs/projectList/check_icon.png')} />
                                        <Text allowFontScaling={false} style={RiskDetailStyles.agreementText}>我已阅读并同意</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.transfer_agreement_url},title: '转让协议(投资人)', h5Page: true})} >
                                    <View>
                                        <Text allowFontScaling={false} style={[RiskDetailStyles.agreementText,{color: '#025fcc'}]}>《转让协议(投资人)》</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.middle_agreement_url},title: '居间服务协议', h5Page: true})} >
                                    <View>
                                        <Text allowFontScaling={false} style={[RiskDetailStyles.agreementText,{color: '#025fcc'}]}>《居间服务协议》</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[RiskDetailStyles.flexRow,{marginTop: Util.pixel*5}]}>
                                <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.e_signature_agreement_url},title: '电子签名数字证书用户申请确认函', h5Page: true})}>
                                    <View>
                                        <Text allowFontScaling={false} style={[RiskDetailStyles.agreementText,{color: '#025fcc'}]}>《电子签名数字证书用户申请确认函》</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.accredit_agreement_url},title: '授权协议', h5Page: true})} >
                                    <View>
                                        <Text allowFontScaling={false} style={[RiskDetailStyles.agreementText,{color: '#025fcc'}]}>《授权协议》</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[RiskDetailStyles.flexRow,{marginTop: Util.pixel*5}]}>
                                <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.risk_letter_url},title: '风险揭示书', h5Page: true})}>
                                    <View>
                                        <Text allowFontScaling={false} style={[RiskDetailStyles.agreementText,{color: '#025fcc'}]}>《风险揭示书》</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={RiskDetailStyles._submit}>
                            <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={this._submit.bind(this)}
                            disabled={!this.state.isAgree}
                            >
                                <View style={[RiskDetailStyles.padding]}>
                                    <View style={[RiskDetailStyles.flexRow,RiskDetailStyles._submit,{justifyContent: 'space-between'}]}>
                                        <View style={RiskDetailStyles.flexRow}>
                                            <Text allowFontScaling={false} style={RiskDetailStyles.submitText}>本次承接实际支付</Text>
                                            <Text allowFontScaling={false} style={[RiskDetailStyles.submitText,{color: '#e94639'}]}>{Util.numberFormat(item.pptClaimExtendMdl.claTransSumYuan)}</Text>
                                            <Text allowFontScaling={false} style={RiskDetailStyles.submitText}>元</Text>
                                        </View>
                                        <View style={[RiskDetailStyles.submitBtn,RiskDetailStyles.flexRow,!this.state.isAgree && {backgroundColor: '#9b9b9b'}]}>
                                            <Text allowFontScaling={false} style={[RiskDetailStyles._submitText,{color: '#fff'}]}>确定</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <InputTradePsw ref={ref => this.inputTradePsw=ref} root={this} navigation={this.props.navigation} useType={1} payFor={item.pptClaimExtendMdl.claTransSumYuan} />
                    <EAlert ref={(ref) => this.eAlert = ref} />
                    <Loading ref={(ref) => this.loading=ref}  />
                </View>
            )
        }else{
            return null
        }
    }
}