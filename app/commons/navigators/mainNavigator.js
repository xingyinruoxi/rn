/**
 * eTongDai React Native App
 * This define view change routers
 * We use react navigator component to implement our UI routers
 * @John
 */

import React from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';
import Util from './../../commons/util';
import {I18nManager} from 'react-native';

import {homePage, listPage, minePage, morePage} from './navigationOptions';//tabBottom中子标签配置项
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

/* tabBottom页入口 */
import Home from './../../views/home/home';//首页
import List from './../../views/projectList/projectList';//项目列表
import Mine from './../../views/mine/mine';//我的账户
import More from './../../views/more/more';//更多

/*登录注册页面*/
import Login from './../../views/components/login';//登录
import ForGotPwd from './../../views/components/forgotPwd';//找回密码第一步（输入注册的手机号码）
import ForGotPwdSubmit from './../../views/components/forgotPwdSubmit';//找回密码第二步（输入短信验证码）
import Register from './../../views/components/register';//注册第一步（输入手机号码）
import CertifyAndSetPwd from './../../views/components/certifyAndSetPwd';//验证并设置密码（注册第二步）
import RegisterResult from './../../views/components/registerResult';//注册结果
// import FindPwd from './../../views/components/findPwd';//此页面未用到

/* 更多页面中的子页面 */
import MessageCenter from './../../views/more/component/messageCenter';//消息中心
import MyMessage from './../../views/more/component/MyMessage';//我的消息（嵌入消息中心）
import FeedBack from './../../views/more/component/feedback';//问题反馈
import ContactsSelectView from './../../views/more/contactsSelect';//邀请好友

/*项目列表页面中的子页面*/
import InvestDetail from './../../views/projectList/component/investDetail';//输入出借金额
import RiskDetail from './../../views/projectList/component/riskDetail';
//import RedEnvelope from './../../views/projectList/component/redEnvelope';
import InvsafState from './../../views/projectList/component/invsafState';
import ProjectSliderTwo from './../../views/projectList/component/projectSlideTwo';//更多信息
import Coupon from './../../views/projectList/component/coupon';     //投资选择优惠券
import ProjectInfo from './../../views/projectList/projectInfo';//项目详情

/*我的账户中的子页面*/
import AccountManage from './../../views/mine/accountManage';//账户管理
import RedPacket from './../../views/mine/redPacket';//我的红包
import RepayCalender from './../../views/mine/repayCalender';
import AutoBid from './../../views/mine/autoBid';//自动投标设置
import StockAccount from './../../views/mine/stockAccount';
import CheckRule from './../../views/mine/checkRule';
import AssetDetail from './../../views/mine/assetDetail';//总资产明细
import TopUp from './../../views/mine/topUp';//充值
import TopUpNotes from './../../views/mine/topUpNotes';//充值记录
import Withdraw from './../../views/mine/withdraw';//提现
import WithdrawSubmit from './../../views/mine/withdrawSubmit';
import WithdrawNotes from './../../views/mine/withdrawNotes';
import MyInvestment from './../../views/mine/myInvestment';
import TopUpResult from './../../views/mine/topUpResult';
import PhoneCertify from './../../views/mine/setting/phoneCertify';
import ResetPhone from './../../views/mine/setting/resetPhone';
import BindBankCard from './../../views/mine/setting/bindBankCard';
import CreateRealNameAccount from './../../views/mine/setting/createRealNameAccount';
import ResetLoginPwd from './../../views/mine/setting/resetLoginPwd';
import ResetTradePwd from './../../views/mine/setting/resetTradePwd';
import FundNotes from './../../views/mine/fundNotes';
import FundDetail from './../../views/mine/fundDetail';
import WithdrawResult from './../../views/mine/withdrawResult';
import WebViewWithBridge from './../../views/components/webViewWithBridge';
import InvestmentDetail from './../../views/mine/investmentDetail';
import AutoBidResult from './../../views/mine/autoBidResult';
import SetTradePwdResult from './../../views/mine/setTradePwdResult';
import ResetPhoneSubmit from './../../views/mine/setting/resetPhoneSubmit';
import ResetPhoneResult from './../../views/mine/setting/resetPhoneResult';
import FingerPrint from './../../views/mine/setting/fingerPrint';
import RepaymentItem from './../../views/mine/repaymentItem';
import GesturePwd from './../../views/mine/setting/gesturePwd';
import PasswordManager from './../../views/mine/passwordManager';//账户管理
import LimitExplain from './../../views/mine/setting/limitExplain';//绑卡限额列表
import MyBankCard from './../../views/mine/setting/myBankCard';//我的银行卡
import RiskAssess from './../../views/mine/setting/riskAssess';//修改交易密码
import ResetPwdByPhone from './../../views/mine/setting/resetTradePwdByPhone';
import SetNewTradPwd from './../../views/mine/setting/setNewTradPwd';//设置新的密码
import AutoBidAgreement from './../../views/mine/autoBidAgreement';//自动投标规则
import BindPhone from './../../views/mine/setting/bindPhone';//绑定手机号
import InvestmentCalendarView from './../../views/mine/investmentCalendar';//回款日历
import BindPhoneResult from './../../views/mine/setting/bindPhoneResult';//绑定新手机
import Tickets from './../../views/mine/tickets';//我的加息券
import AddressManger from '../../views/mine/address/addressManager';//地址管理
import AddNewAddress from './../../views/mine/address/addNewAddress'//添加新地址

import WebViewCom from './../Webview';//webview 嵌入h5
import DevelopPage from './../../views/home/developPage';

const BottomTabNavigator = TabNavigator({
        home: {screen: Home, navigationOptions: homePage},
        list: {screen: List, navigationOptions: listPage},
        mine: {screen: Mine, navigationOptions: minePage},
        more: {screen: More, navigationOptions: morePage},
    },
    {
        initialRouteName: 'home',
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        lazy: true,
        backBehavior: false,
        tabBarOptions: {
            activeTintColor: '#025FCB', //label and icon color of the active tab,
            activeBackgroundColor: "#f7f7f7", //background color of the active tab
            inactiveTintColor: "#9b9b9b",
            inactiveBackgroundColor: "#f7f7f7",
            lazyLoad: false,
            backBehavior: true,
            //labelStyle:[{fontSize: Util.pixel * 10},!Util.isIOS && { marginTop: Util.pixel*3,marginBottom: Util.pixel*3 }], //tab title style
            style: {
                backgroundColor: "#f7f7f7",
                height: Util.pixel * 50,
                justifyContent: 'center',
                paddingBottom: Util.isIOS ? Util.pixel * 3 : 0
            }, //tabBottom style
            //follow options just for Android
            showIcon: true,
            showLabel: true,
            scrollEnabled: false,
            tabStyle: [{height: Util.pixel * 47, alignItems: 'center'}, {
                paddingBottom: Util.pixel * 2,
                paddingTop: 3,
            }], //tab style
            upperCaseLabel: false,
            pressColor: null,
            pressOpacity: 1,
            indicatorStyle: {height: 1, backgroundColor: "rgba(245,245,245,1)"},
            iconStyle: {width: Util.pixel * 26, height: Util.pixel * 26}
        },
    });

//源码 + 自定义 初始化跳转动画
function forInitial(props: NavigationSceneRendererProps) {
    const {navigation, scene} = props;
    const focused = navigation.state.index === scene.index;
    const opacity = focused ? 1 : 0;
    // If not focused, move the scene far away.
    const translate = focused ? 0 : 1000000;
    return {
        opacity,
        transform: [{translateX: translate}, {translateY: translate}],
    };
}

//源码 + 自定义
function forHorizontal(props: NavigationSceneRendererProps, pastOpacity) {
    const {layout, position, scene} = props;
    if (!layout.isMeasured) {
        return forInitial(props);
    }
    const index = scene.index;
    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const outputRange = I18nManager.isRTL ? ([-width, 0, width * 0.3]: Array<number>) : ([width, 0, width * -0.3]: Array<number>);
    // Add [index - 1, index - 0.99] to the interpolated opacity for screen transition.
    // This makes the screen's shadow to disappear smoothly.
    const translateY = 0;
    const translateX = position.interpolate({
        inputRange,
        outputRange,
    });
    const opacity = position.interpolate({
        inputRange: ([
            index - 1,
            index - 0.99,
            index,
            index + 0.99,
            index + 1,
        ]: Array<number>),
        outputRange: ([0, 1, 1, 0.85, 0]: Array<number>),
    });
    if (pastOpacity) {
        return {
            opacity,
        };
    } else {
        return {
            opacity,
            transform: [{translateX}, {translateY}],
        };
    }

}

//源码 + 自定义
function forVertical(props: NavigationSceneRendererProps) {
    const {layout, position, scene} = props;
    if (!layout.isMeasured) {
        return forInitial(props);
    }
    const index = scene.index;
    const height = layout.initHeight;
    const opacity = position.interpolate({
        inputRange: ([
            index - 1,
            index - 0.99,
            index,
            index + 0.99,
            index + 1,
        ]: Array<number>),
        outputRange: ([0, 1, 1, 0.85, 0]: Array<number>),
    });

    const translateX = 0;
    const translateY = position.interpolate({
        inputRange: ([index - 1, index, index + 1]: Array<number>),
        outputRange: ([height, 0, 0]: Array<number>),
    });
    return {
        opacity,
        transform: [{translateX}, {translateY}],
    };
}

export default MainNavigator = StackNavigator({
    tab: {screen: BottomTabNavigator, navigationOptions: {gesturesEnabled: false}},
    projectInfo: {screen: ProjectInfo,},
    login: {screen: Login,},
    forgotPwd: {screen: ForGotPwd,},
    register: {screen: Register,},
    webview: {screen: WebViewCom,},
    redPacket: {screen: RedPacket},
    accountManage: {screen: AccountManage},
    repayCalender: {screen: RepayCalender},
    feedBack: {screen: FeedBack},
    autoBid: {screen: AutoBid},
    stockAccount: {screen: StockAccount},
    checkRule: {screen: CheckRule},
    assetDetail: {screen: AssetDetail},
    topUp: {screen: TopUp},
    topUpNotes: {screen: TopUpNotes},
    withdraw: {screen: Withdraw},
    withdrawSubmit: {screen: WithdrawSubmit},
    withdrawNotes: {screen: WithdrawNotes},
    myInvestment: {screen: MyInvestment},
    topUpResult: {screen: TopUpResult},
    phoneCertify: {screen: PhoneCertify},
    resetPhone: {screen: ResetPhone},
    messageCenter: {screen: MessageCenter},
    myMessage: {screen: MyMessage},
    investDetail: {screen: InvestDetail},
    riskDetail: {screen: RiskDetail},
    //redEnvelope: {screen: RedEnvelope},
    contactsSelect: {screen: ContactsSelectView},
    investmentCalendar: {screen: InvestmentCalendarView},
    createRealNameAccount: {screen: CreateRealNameAccount},
    bindBankCard: {screen: BindBankCard},
    resetLoginPwd: {screen: ResetLoginPwd},
    resetTradePwd: {screen: ResetTradePwd},
    fundNotes: {screen: FundNotes},
    fundDetail: {screen: FundDetail},
    invsafState: {screen: InvsafState, navigationOptions: {gesturesEnabled: false}},
    withdrawResult: {screen: WithdrawResult},
    webViewWithBridge: {screen: WebViewWithBridge},
    investmentDetail: {screen: InvestmentDetail},
    autoBidResult: {screen: AutoBidResult},
    setTradePwdResult: {screen: SetTradePwdResult},
    // findPwd: {screen: FindPwd},
    ResetPhoneSubmit: {screen: ResetPhoneSubmit},
    ResetPhoneResult: {screen: ResetPhoneResult},
    RegisterResult: {screen: RegisterResult},
    fingerPrint: {screen: FingerPrint},
    RepaymentItem: {screen: RepaymentItem},
    projectSliderTwo: {screen: ProjectSliderTwo},
    GesturePwd: {screen: GesturePwd},
    passwordManager: {screen: PasswordManager},
    limitExplain: {screen: LimitExplain},
    myBankCard: {screen: MyBankCard},
    riskAssess: {screen: RiskAssess},
    certifyAndSetPwd: {screen: CertifyAndSetPwd},
    forGotPwdSubmit: {screen: ForGotPwdSubmit},
    resetPwdByPhone: {screen: ResetPwdByPhone},
    setNewTradPwd: {screen: SetNewTradPwd},
    autoBidAgreement: {screen: AutoBidAgreement},
    bindPhone: {screen: BindPhone},
    bindPhoneResult: {screen: BindPhoneResult},
    developPage: {screen: DevelopPage},
    tickets: {screen: Tickets},
    coupon: {screen: Coupon},
    addressManger: {
        screen: AddressManger,

    },
    addNewAddress: {
        screen: AddNewAddress
    }
}, {
    mode: 'card',
    headerMode: 'screen',
    cardStyle: {
        paddingBottom: Util.deviceId.indexOf('iPhone10') != -1 ? 34 * Util.pixel : 0,
        backgroundColor: '#F6F6F6'
    },
    transitionConfig: () => {
        return {
            // Define scene interpolation, eq. custom transition
            screenInterpolator: (sceneProps) => {
                global.__scenes = sceneProps.scenes;
                //登录页面和手势解锁在IOS上和Android上的 从下到上的slide是不同的效果
                if ((sceneProps.scene.route.routeName == 'login' && !global.forbidTransitionWithRegiser) || sceneProps.scene.route.routeName == 'GesturePwd' || (sceneProps.scene.route.routeName != 'login' && global.forbidTransitionWithRegiser)) {
                    if (Util.isIOS) {
                        return forVertical(sceneProps);
                    } else {
                        return CardStackStyleInterpolator.forFadeFromBottomAndroid(sceneProps)
                    }
                } else if (sceneProps.scene.route.routeName == 'register') {
                    return forHorizontal(sceneProps)
                } else if ((sceneProps.scene.route.routeName == 'tab') || global.forbidTransition) {
                    if (Util.isIOS) {
                        return forVertical(sceneProps);
                    } else {
                        return forHorizontal(sceneProps, true)
                    }
                } else {
                    return forHorizontal(sceneProps)
                }

            }
        }
    }
});

Util.getStateForAction(MainNavigator);