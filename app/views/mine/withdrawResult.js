/**
 * Created by liuzhenli on 2017/7/19.
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
    BackHandler
} from 'react-native';
import {topUpResultPageStyle} from './../../styles/mine/topUpResultStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import Util,{ Grow } from './../../commons/util';
var Fetch = require('./../../commons/fetch');
const {systemInfos} = require('./../../commons/config');
import { NavigationActions } from 'react-navigation';
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import Button from './../components/button';
export default class WithdrawResult extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false,
            withDrawRequest: null,
            status: this.props.navigation.state.params.status
        };

    };
    componentWillUnmount(){

    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            setTimeout(() => {
                // this.getRequest()
            })
        });
    };
    componentDidMount(){
			if(this.props.navigation.state.params.status == 'success'){

					Grow.track('pg_my_withdrawok_userbrowse',{'pg_my_withdrawok_userbrowse':'提现成功页浏览用户量'})

			}else{
				
				Grow.track('pg_my_withdrawfail_userbrowse',{'pg_my_withdrawfail_userbrowse':'提现失败页浏览用户量'})

			}
        if(!Util.isIOS){
            this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.forbidGoBack);
        }

    }
    removeHandler(){
        if(!Util.isIOS){
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
        }
    };
    forbidGoBack(){
        return true;
    };
    toAnotherPage(routeName){
        global.forbidTransition = true;
        this.removeHandler();
        if(routeName == 'mine' || routeName == 'list'){
            const resetAction = NavigationActions.navigate({
                routeName: 'tab',
                params: {},
                action: NavigationActions.navigate({ routeName: routeName})
            });
            this.props.navigation.dispatch(resetAction);
        }else if(routeName == 'withdrawNotes'){
            this.props.navigation.navigate(routeName,{backKey: this.props.navigation.state.params.backKey})
        }else{
            this.props.navigation.state.params && this.props.navigation.state.params.callback && this.props.navigation.state.params.callback();
            this.props.navigation.goBack(this.props.navigation.state.params.backKey);
        }
        setTimeout(() => {global.forbidTransition = false},100)
    }
    render() {
        let data = this.props.navigation.state.params.data;
        let status = this.props.navigation.state.params.status;
        return (
            <View style={topUpResultPageStyle.container}>
                <MineHeader title="提现"  navigation={this.props.navigation}/>
                <View style={topUpResultPageStyle.contentBox}>
                    <View style={topUpResultPageStyle.contentTopBox}>
                        <View style={topUpResultPageStyle.contentImgBox}>
                            {
                                status == 'success' ?
                                    <Image style={topUpResultPageStyle.contentImg}source={require('./../../imgs/mine/successImg.png')}/>
                                    :
                                    <Image style={topUpResultPageStyle.contentImg}source={require('./../../imgs/mine/failImg.png')}/>
                            }

                        </View>
                        {
                            status == 'success' ?
                                    <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>提现金额：{data && data.withdrawalAmount || 0}元</Text>
                                :
                                status == 'fail' ?
                                    <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>很抱歉，提现失败</Text>
                                    :
                                    null
                        }
                        <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNum,topUpResultPageStyle.actualWithdrawalAmount]}>
                            {
                                status == 'success' ?
                                    '恭喜提现申请成功到账金额：' + (data && data.actualWithdrawalAmount || 0) + '元'
                                    :
                                    null
                            }
                        </Text>
                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>{this.state.dinfabain ? '订单编号：' :''}</Text>
                    </View>
                    <View style={topUpResultPageStyle.buttonBox}>
                        {
                            status == 'fail' ?
                                <Button buttonName="重新提现" width={150} onPress={() => {Grow.track('elbn_my_withdrawfail_again_click',{'elbn_my_withdrawfail_again_click':'重新提现按钮点击量'});this.toAnotherPage()}}/>
                                :
                                null
                        }
                        <Button buttonName="我的账户" width={150} color='#f6f7fa' textColor='#025FCB' borderColor='#025FCB' onPress={() => {Grow.track('elbn_my_withdrawfail_myaccount_click',{'elbn_my_withdrawfail_myaccount_click':'我的账户按钮点击量'});this.toAnotherPage('mine')}}/>
                    </View>
                    {
                        status == 'success' ?
                            <View style={topUpResultPageStyle.bottomRemindBox}>
                                <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>提现说明：</Text>
                                <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>1.工作日17:00之前申请的提现，当日处理。</Text>
                                <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>2.工作日17点以后申请的提现，下一个工作日处理。</Text>
                                <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>3.周末及法定节假日申请的提现，将在上班后第一个工作日处理。</Text>
                                <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNumber,{color:'#025FCB',textAlign:'center',marginTop: 10 * Util.pixel}]}>注：由于付款操作涉及第三方支付及银行，提现时间以实际到账时间为准</Text>
                            </View>
                            :
                            <View style={[topUpResultPageStyle.bottomRemindBox,topUpResultPageStyle.bottomServiceBox,]}>
                                <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNumberService]}>如果您需要客服的帮助</Text>
                                <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNumberService]}>请拨打<Text allowFontScaling={false} style={{color:'#025FCB'}}>{systemInfos.customer_service_tel_num}</Text></Text>
                            </View>
                    }

                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}