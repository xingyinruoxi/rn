/**
 * Created by glzc on 2017/7/11.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    PixelRatio,
	Keyboard
} from 'react-native';
import {InvestDetailStyles} from './../../../styles/projectList/InvestDetailStyles';
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

export default class InvestDetail extends Component{
	static navigationOptions = ({navigation}) => ({
		title: '输入投资金额',
		header: () => <HeaderBar navigation={navigation} noLine={true} />
	});
    constructor(props){
        super(props);
        this.data = this.props.navigation.state.params.data;
        this.state = {
            formData: this.data,
            sessionId: null,
            useId: null,
            value: '1000', //投资金额
            redEnvelope: null,
            earnMoney: 0,
            addRateEarnMoney: 0,
            isCanReduce: true,
            isCanAdd: true,
            isAgree: true,
			showKeyboardControll: false,
            type: (this.data.investItemDetailsMdl.redPacketCanUseCount < 1 && this.data.investItemDetailsMdl.interestPlusCanUseCount > 0) ? 1 : 0,
		}
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
		this.keyboardDidhideListener = Keyboard.addListener('keyboardDidHide', this.__keyboardDidHide.bind(this));

		this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
		this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
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
    componentWillMount(){
        this.setEarnMoney();
    };
    componentDidMount(){
        this.growingIO(0);
        this.getUserInfo();
        this.eventEmit = EventEmitter.addListener('checkLogin',this.getUserInfo.bind(this));
    };
    componentWillUnmount(){
        this.eventEmit.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardDidhideListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
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
                Grow.track('pg_invest_investenterprice_userbrowse',{'pg_invest_investenterprice_userbrowse':'输入出借金额页浏览用户量'});
                break;
            case 1:
                Grow.track('elbn_invest_investenterprice_confirm_click',{'elbn_invest_investenterprice_confirm_click':'确定按钮点击量'});
                break;
            case 2:
                Grow.track('pg_invest_investenterpwd_userbrowse',{'pg_invest_investenterpwd_userbrowse':'输入交易密码窗口'});
                break;
            case 3:
                Grow.track('elbn_invest_investenterprice_choosered_click',{'elbn_invest_investenterprice_choosered_click':'选择红包按钮点击量'});
                break;
            default :
                break;
        }
    };
    loadPage(routeName,params){
        routeName === 'redEnvelope' && this.growingIO(3);
        this.props.navigation.navigate(routeName,params);
    };
    changeInvestValue(v){
        if(isNaN(v) || v.indexOf('.') != -1){
            return;
        };
        this.setState({
            value: v.trim(),
            isCanAdd: true,
            isCanReduce: true,
        },this.setEarnMoney.bind(this));
    };
    calculateEarnings(rate){
        let data = this.state.formData.investItemDetailsMdl,
            money = this.state.value,
            yearRate = rate ? (rate - 0) : data.iteYearRate*100,
            repayType = data.iteRepayType === "DEBX" ? 1 : data.iteRepayType === "QMHB" ? 2 : 3,
            limitTime = data.iteRepayDate,
            fee = 0,//收益管理费暂无，为后续扩展
            earnMoney = 0;
        if(data.iteRepayInterval === "DAY"){ //按天
            earnMoney = money*yearRate*limitTime/36000;
        }else{ //按月
            switch (repayType){
                case 1:  //等额本息
                    let month_apr = (yearRate/(1-fee))/1200,
                        li = Math.pow(1+month_apr,limitTime),
                        repayment = Math.round(money*(month_apr*li)/(li-1)*100)/100;
                    for(let i=0;i<limitTime;i++){
                        let lu = Math.pow(1+month_apr,i),
                            lx = (money*month_apr-repayment)*lu+repayment,//利息
                            lx_manage = lx*fee,//利息管理费
                            a = Math.round(lx*100)/100,
                            b = Math.round(lx_manage*100)/100,
                            lx_only = Math.round((a-b)*100)/100;
                        earnMoney = earnMoney + lx_only;
                    }
                    break;
                case 2: //按月还息到期还本
                case 3: //到期还本息
                    earnMoney = money*yearRate*limitTime/1200;
                    break;
                default :
                    break;
            }
        }
        return earnMoney.toFixed(2)
    };
    setEarnMoney(){
        let earnMoney = this.calculateEarnings(),
            addRateEarnMoney = 0;
        if(this.state.redEnvelope && this.state.redEnvelope != '' && this.state.type != 0){
            addRateEarnMoney = this.calculateEarnings(this.state.redEnvelope.ticValue)
        }
        this.setState({
            earnMoney: earnMoney,
            addRateEarnMoney: addRateEarnMoney > 0 ? addRateEarnMoney : this.state.addRateEarnMoney
        });
    }
    checkedRedEnvelope(data, type){
        let addRateEarnMoney = 0;
        if(data && data !== '' && type !== 0){
            addRateEarnMoney = this.calculateEarnings(data.ticValue)
        }
        this.setState({
            redEnvelope: data,
            type: type,
            addRateEarnMoney: addRateEarnMoney,
        });
    };
    investAll(){
        let iteBorrowAmountYuan = this.state.formData.investItemDetailsMdl.iteBorrowAmount/100, //剩余可出借金额
            avaiBal = this.state.formData.investItemDetailsMdl.fufPraNowSum/100; //可用余额
        this.setState({
            value: iteBorrowAmountYuan > avaiBal ? Math.floor(avaiBal) : Math.floor(iteBorrowAmountYuan)
        },this.setEarnMoney.bind(this));
    };
    _submit(){
        this.growingIO(1);
        dismissKeyboard();
        let msg = '',topUpMoney = 0;
        if(!this.state.value || this.state.value == '' || Number(this.state.value) < this.state.formData.investItemDetailsMdl.iteBidMinYuan){
            msg = '出借金额不能为空或低于起投金额';
        }else if((this.state.formData.investItemDetailsMdl.iteBorrowAmount/100) < (this.state.value - 0)){
            msg = '您输入的出借金额大于当前剩余可出借金额';
        }else if(this.state.redEnvelope && (this.state.value - 0) < this.state.redEnvelope.ticMinInvestAmt){
            msg = '当前选择的优惠券与出借金额不匹配，请重新选择';
        }else if(this.state.formData.investItemDetailsMdl.newUserItem !== "NORMAL" && (this.state.value - 0) > this.state.formData.investItemDetailsMdl.newUserItemCapAmt){
            msg = '新手标最大出借金额不能超过'+ this.state.formData.investItemDetailsMdl.newUserItemCapAmt +'元！';
        }else if((this.state.formData.investItemDetailsMdl.fufPraNowSum/100) < this.state.value - (this.state.redEnvelope ? this.state.redEnvelope.ticValue : 0)){
            topUpMoney = this.state.value - (this.state.redEnvelope && this.state.type == 0 ? this.state.redEnvelope.ticValue : 0) - this.state.formData.investItemDetailsMdl.fufPraNowSum/100;
            msg = '余额不足，请充值：' + Math.ceil(topUpMoney) + '元';
        }else{
            this.growingIO(2);
            setTimeout(() => {this.inputTradePsw.show()});
            return;
        };
        setTimeout(() => {
            topUpMoney > 0 ? this.eAlert.show('confirm',msg,this.toTopUp.bind(this, Math.ceil(topUpMoney)), '去充值', null, false, '再想想') : this.eAlert.show('alert',msg)
        });

    };
	_keyboardDidShow(e){
		this.setState({
			showKeyboardControll: true
		})
	}
	__keyboardDidHide(){
		this.setState({
			showKeyboardControll: false
		});
	}
    reduce(){
        let msg='';
        if(this.state.value == null || this.state.value === '' ){
            msg='投资金额不能为空';
        }else if(this.state.value - 100 < this.state.formData.investItemDetailsMdl.iteBidMinYuan){
            msg='投资金额不能低于起投金额';
        }else{};
        if(msg != ''){
            this.eAlert.show('alert',msg);
            this.setState({
                isCanReduce: false,
            });
            return;
        };
        this.setState({
            value: this.state.value - 100,
            isCanAdd: true,
        },this.setEarnMoney.bind(this));
    };
    add(){
        let msg = '';
        if(this.state.formData.investItemDetailsMdl.fufPraNowSum/100 - this.state.value < 100){
            msg='余额不足，请充值';
        }else if(this.state.value > this.state.formData.investItemDetailsMdl.iteBorrowAmount/100 - 100){
            msg='出借金额不能超过剩余可出借金额';
        }else{};
        if(msg != ''){
            this.eAlert.show('alert',msg);
            this.setState({
                isCanAdd: false,
            });
            return;
        }
        this.setState({
            value: (this.state.value - 0) + 100,
            isCanReduce: true,
        },this.setEarnMoney.bind(this));
    };
    toTopUp(money){
        this.loading.show();
        Fetch.post('payment/rechargeInput',{useId: this.state.useId,sessionId: this.state.sessionId},res => {
            this.loading.hide();
            if(res.success){
                this.props.navigation.navigate('topUp',{data: this.state.userAccountData,bankData: res.body,topUpMoney: money})
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
        });
    };
    _isAgree(){
        this.setState({
            isAgree: !this.state.isAgree
        })
    };
    render(){
        if(this.state.formData) {
            let projectData=this.state.formData.investItemDetailsMdl,
                payForMoney=(this.state.redEnvelope && this.state.type === 0) ? this.state.value && this.state.value != '' ? this.state.value - this.state.redEnvelope.ticValue > 0 ? this.state.value - this.state.redEnvelope.ticValue : 0 : 0 : this.state.value  ;
            return (
                <View ref={(ref) => this.view = ref} style={InvestDetailStyles.container}>
                    <View style={{flex:1}}>
                        <ScrollView
                            style={{flex: 1}}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            <TouchableOpacity activeOpacity={1} onPress={()=>{dismissKeyboard();}}>
                                <View style={InvestDetailStyles.headContent}>
                                    <View style={[InvestDetailStyles.padding,InvestDetailStyles.flexRow,{marginTop: Util.pixel*30,backgroundColor: '#006eee'}]}>
                                        <View style={[InvestDetailStyles.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
                                            <View style={InvestDetailStyles.flexRow}>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.rateText}>{(projectData.iteYearRate * 100).toFixed(2)}</Text>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.rateSymbol}>%</Text>
                                            </View>
                                            <View>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.topText}>预期年回报率</Text>
                                            </View>
                                        </View>
                                        <View style={[InvestDetailStyles.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
                                            <View style={InvestDetailStyles.flexRow}>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.rateText}>{projectData.iteRepayDate}</Text>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.rateSymbol}>{projectData.iteRepayIntervalDesc || (projectData.iteRepayInterval === "MONTH" ? '个月' : '天')}</Text>
                                            </View>
                                            <View>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.topText}>期限</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[InvestDetailStyles.padding,{backgroundColor: '#fff'}]}>
                                    <View style={[InvestDetailStyles.flexRow,{height: Util.pixel*45,justifyContent: 'space-between'}]}>
                                        <Text allowFontScaling={false} style={InvestDetailStyles.title}>剩余可出借金额</Text>
                                        <Text allowFontScaling={false} style={InvestDetailStyles.minTitle}>{Util.numberFormat(projectData.iteBorrowAmount/100)}元</Text>
                                    </View>
                                    <View style={InvestDetailStyles.line}></View>
                                    <View style={[InvestDetailStyles.flexRow,{height: Util.pixel*45,justifyContent: 'space-between'}]}>
                                        <Text allowFontScaling={false} style={InvestDetailStyles.title}>可用余额</Text>
                                        <View style={InvestDetailStyles.flexRow}>
                                            <View style={InvestDetailStyles.flexRow}>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{color: '#025fcc'}]}>{Util.numberFormat(projectData.fufPraNowSum/100)}</Text>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.minTitle}>元</Text>
                                            </View>
                                            <TouchableOpacity activeOpacity={0.8} onPress={this.toTopUp.bind(this, null)} >
                                                <View style={[InvestDetailStyles.topUpBtn,InvestDetailStyles.flexRow]}>
                                                    <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{color: '#e94639'}]}>充值</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={[InvestDetailStyles.padding,InvestDetailStyles.inputFrameContent]}>
                                    <View style={[InvestDetailStyles.flexRow,{justifyContent: 'space-between'}]}>
                                        <View style={InvestDetailStyles.addReduceFrame}>
                                            <Image style={InvestDetailStyles.addReduceFrame} source={require('./../../../imgs/projectList/input_frame.png')} />
                                            <View style={InvestDetailStyles.addReduceFrameIn}>
                                                <View style={[InvestDetailStyles.flexRow,{justifyContent: 'space-between'}]}>
                                                    <TouchableOpacity activeOpacity={0.8} disabled={!this.state.isCanReduce} onPress={this.reduce.bind(this)}>
                                                        <View style={[InvestDetailStyles.reduceBtn,InvestDetailStyles.flexRow]}>
                                                            <View style={InvestDetailStyles.reduce}></View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={[InvestDetailStyles.flexRow,InvestDetailStyles.padding,{paddingRight: 0}]}>
                                                        <View>
                                                            <TextInput
                                                                style={[InvestDetailStyles.input,InvestDetailStyles.title]}
                                                                underlineColorAndroid="transparent"
                                                                autoCapitalize={'none'}
                                                                keyboardType={'numeric'}
                                                                value={this.state.value+''}
                                                                clearButtonMode="while-editing"
                                                                onChangeText={this.changeInvestValue.bind(this)}
                                                                maxLength={7}
                                                            />
                                                        </View>
                                                        <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{backgroundColor: 'transparent'}]}>元</Text>
                                                    </View>
                                                    <TouchableOpacity activeOpacity={0.8} disabled={!this.state.isCanAdd} onPress={this.add.bind(this)}>
                                                        <View style={[InvestDetailStyles.reduceBtn,InvestDetailStyles.flexRow]}>
                                                            <View style={[InvestDetailStyles.reduce,{backgroundColor: '#fff'}]}></View>
                                                            <View style={InvestDetailStyles.add}></View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.investAll.bind(this)}>
                                            <View style={[InvestDetailStyles.allInBtn,InvestDetailStyles.flexRow]}>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.title,{color: '#025fcb'}]}>全投</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[InvestDetailStyles.padding,InvestDetailStyles.flexRow,InvestDetailStyles.notices]}>
                                        {
                                            this.state.value ?
                                                <View style={[InvestDetailStyles.flexRow,{justifyContent: 'flex-start'},InvestDetailStyles.noticesTextPadding]}>
                                                    <Text allowFontScaling={false} style={[InvestDetailStyles.noticesText,{color: '#4a4a4a'}]}>预期收益</Text>
                                                    <Text allowFontScaling={false} style={InvestDetailStyles.noticesText}>{ ((this.state.addRateEarnMoney - 0) + (this.state.earnMoney - 0)).toFixed(2)}</Text>
                                                    <Text allowFontScaling={false} style={[InvestDetailStyles.noticesText,{color: '#4a4a4a'}]}>元</Text>
                                                    {
                                                        (this.state.type !== 0 && this.state.addRateEarnMoney > 0) ?
                                                            <View style={[InvestDetailStyles.flexRow,{justifyContent: 'flex-start'}]}>
                                                                <Text allowFontScaling={false} style={[InvestDetailStyles.noticesText,{color: '#4a4a4a'}]}>,（其中加息收益</Text>
                                                                <Text allowFontScaling={false} style={InvestDetailStyles.noticesText}>{this.state.addRateEarnMoney}</Text>
                                                                <Text allowFontScaling={false} style={[InvestDetailStyles.noticesText,{color: '#4a4a4a'}]}>元）</Text>
                                                            </View>
                                                        :
                                                            null
                                                    }
                                                </View>
                                                :
                                                null
                                        }
                                    </View>
                                </View>
                                <View style={[InvestDetailStyles.padding,{backgroundColor: '#fff'}]}>
                                    <TouchableOpacity activeOpacity={0.8} disabled={projectData.interestPlusCanUseCount < 1 && projectData.redPacketCanUseCount < 1} onPress={this.loadPage.bind(this,'coupon',{title: '选择优惠',repayDate: projectData.iteRepayDate,itemId: projectData.iteId,checkedRedEnvelope: this.checkedRedEnvelope.bind(this),type: this.state.type,ticId: this.state.redEnvelope ? this.state.redEnvelope.ticId : ''})} >
                                        <View style={[InvestDetailStyles.flexRow,{height: Util.pixel*45,justifyContent: 'space-between'}]}>
                                            <View style={InvestDetailStyles.flexRow}>
                                                <Text allowFontScaling={false} style={InvestDetailStyles.title}>我的优惠券</Text>
                                                <View style={{marginLeft: Util.pixel*6}}>
                                                    {
                                                        projectData.redPacketCanUseCount > 0 ?
                                                            <View style={[InvestDetailStyles.flexRow,InvestDetailStyles.redPacketsNum]}>
                                                                <Image source={require('./../../../imgs/projectList/redpacket_icon.png')} />
                                                                <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{color: '#e94639',marginLeft: Util.pixel*3}]}>{projectData.redPacketCanUseCount}</Text>
                                                            </View>
                                                            : null
                                                    }
                                                </View>
                                                <View style={{marginLeft: Util.pixel*6}}>
                                                    {
                                                        projectData.interestPlusCanUseCount > 0 ?
                                                            <View style={[InvestDetailStyles.flexRow,InvestDetailStyles.redPacketsNum]}>
                                                                <Image source={require('./../../../imgs/projectList/addrate_icon.png')} />
                                                                <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{color: '#e94639',marginLeft: Util.pixel*3}]}>{projectData.interestPlusCanUseCount}</Text>
                                                            </View>
                                                            : null
                                                    }
                                                </View>
                                            </View>
                                            <View style={InvestDetailStyles.flexRow}>
                                                <View>
                                                    {
                                                        (projectData.redPacketCanUseCount < 1 && projectData.interestPlusCanUseCount < 1) ?
                                                            <Text allowFontScaling={false} style={InvestDetailStyles.minTitle}>当前无可用优惠券</Text>
                                                            :
                                                            this.state.redEnvelope ?
                                                                <View style={InvestDetailStyles.flexRow}>
                                                                    <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{marginRight: Util.pixel*5}]}>{ this.state.type === 0 ? "红包抵扣" : "加息"}</Text>
                                                                    <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{color: '#e94639',marginRight: Util.pixel*5}]}>{this.state.redEnvelope.ticValue}</Text>
                                                                    <Text allowFontScaling={false} style={InvestDetailStyles.minTitle}>{ this.state.type === 0 ? "元" : "%" }</Text>
                                                                </View>
                                                                :
                                                                <Text allowFontScaling={false} style={InvestDetailStyles.minTitle}>选择</Text>
                                                    }
                                                </View>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.minTitle,{color:'#d8d8d8',marginLeft: Util.pixel*5}]}>{'>'}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.type === 1 ?
                                        <View style={[InvestDetailStyles.padding,{paddingTop: Util.pixel*10}]}>
                                            <Text allowFontScaling={false} style={{color: '#666666'}}>温馨提示：使用加息券的项目不可转让</Text>
                                        </View>
                                    :
                                        null
                                }
                            </TouchableOpacity>
							<KeyboardAvoidingView behavior='padding' contentContainerStyle={[InvestDetailStyles.keyboardControllBox,, Util.deviceId.indexOf('iPhone10') > -1 && {marginTop: Util.pixel*30}]}>
								{
									Util.isIOS && this.state.showKeyboardControll ?
										<TouchableOpacity  activeOpacity={1} onPress={() => dismissKeyboard()} style={[InvestDetailStyles.keyboardControll, Util.deviceId.indexOf('iPhone10') > -1 && {marginTop: Util.pixel*40,marginBottom: 0}]} >
											<Text allowFontScaling={false} style={InvestDetailStyles.keyboardControllText}>收起</Text>
										</TouchableOpacity>
										:
										null
								}
							</KeyboardAvoidingView>
                        </ScrollView>
                    </View>

					<KeyboardAvoidingView behavior={Util.isIOS ? 'padding' : 'height'} contentContainerStyle={[InvestDetailStyles.keyboardControllBox,]}>
						{
                            !Util.isIOS && this.state.showKeyboardControll ?
								<TouchableOpacity  activeOpacity={1} onPress={() => dismissKeyboard()}style={[InvestDetailStyles.keyboardControll,]}>
									<Text style={InvestDetailStyles.keyboardControllText}>收起</Text>
								</TouchableOpacity>
								:
								null
						}
					</KeyboardAvoidingView>
					{
						!this.state.showKeyboardControll ?
							<View style={InvestDetailStyles.footer}>
                                <View style={{marginBottom: Util.pixel*20}}>
                                    <View style={[InvestDetailStyles.flexRow]}>
                                        <TouchableOpacity activeOpacity={1} onPress={this._isAgree.bind(this)} >
                                            <View style={[InvestDetailStyles.flexRow,{height: Util.pixel*18}]}>
                                                <Image style={{marginRight: Util.pixel*5}} source={this.state.isAgree ? require('./../../../imgs/projectList/active_check_icon.png') : require('./../../../imgs/projectList/check_icon.png')} />
                                                <Text allowFontScaling={false} style={InvestDetailStyles.agreementText}>我已阅读并同意</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.invest_agreement_url},title: '借款协议(出借人)', h5Page: true})}>
                                            <View>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.agreementText,{color: '#025fcc'}]}>《借款协议(出借人)》</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.middle_agreement_url},title: '居间服务协议', h5Page: true})} >
                                            <View>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.agreementText,{color: '#025fcc'}]}>《居间服务协议》</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[InvestDetailStyles.flexRow,{marginTop: Util.pixel*5}]}>
                                        <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.e_signature_agreement_url},title: '电子签名数字证书用户申请确认函', h5Page: true})}>
                                            <View>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.agreementText,{color: '#025fcc'}]}>《电子签名数字证书用户申请确认函》</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.accredit_agreement_url},title: '授权协议', h5Page: true})} >
                                            <View>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.agreementText,{color: '#025fcc'}]}>《授权协议》</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[InvestDetailStyles.flexRow,{marginTop: Util.pixel*5}]}>
                                        <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,'webview',{source: {uri: systemInfos.risk_letter_url},title: '风险揭示书', h5Page: true})}>
                                            <View>
                                                <Text allowFontScaling={false} style={[InvestDetailStyles.agreementText,{color: '#025fcc'}]}>《风险揭示书》</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={InvestDetailStyles._submit}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={this._submit.bind(this)}
                                        disabled={!this.state.isAgree}
                                    >
                                        <View style={[InvestDetailStyles.padding]}>
                                            <View style={[InvestDetailStyles.flexRow,InvestDetailStyles._submit,{justifyContent: 'space-between'}]}>
                                                <View style={InvestDetailStyles.flexRow}>
                                                    <Text allowFontScaling={false} style={InvestDetailStyles.submitText}>本次出借实际支付</Text>
                                                    <Text allowFontScaling={false} style={[InvestDetailStyles.submitText,{color: '#e94639'}]}>{Util.numberFormat(payForMoney)}</Text>
                                                    <Text allowFontScaling={false} style={InvestDetailStyles.submitText}>元</Text>
                                                </View>
                                                <View style={[InvestDetailStyles.submitBtn,InvestDetailStyles.flexRow,!this.state.isAgree && {backgroundColor: '#9b9b9b'}]}>
                                                    <Text allowFontScaling={false} style={[InvestDetailStyles.submitText,{color: '#fff'}]}>确定</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
							:
							null
					}
                    <InputTradePsw ref={ref => this.inputTradePsw=ref} navigation={this.props.navigation} useType={0} payFor={payForMoney} root={this} />
                    <EAlert ref={(ref) => this.eAlert = ref} />
                    <Loading ref={ (ref) => this.loading = ref } />
                </View>
				
            )
        }else{
            return null
        }
    }
}
