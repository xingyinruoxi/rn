/**
 * Created by liuzhenli on 2017/7/21.
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
import { NavigationActions } from 'react-navigation';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import Util,{ Grow } from './../../commons/util';
export default class SetTradePwdResult extends Component {
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
            hideAccountInfo: false
        };
    };
    componentWillUnmount(){
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });

    };
    toInvestment(routeName){
        global.forbidTransition = true;
        const resetAction = NavigationActions.navigate({
            routeName: 'tab',
            params: {},
            action: NavigationActions.navigate({ routeName: routeName})
        });
        this.props.navigation.dispatch(resetAction);
        setTimeout(() => {global.forbidTransition = false},100)
    };
    render() {
        let status = this.props.navigation.state.params.status;
        return (
            <View style={topUpResultPageStyle.container}>
                <MineHeader title={status == 'success' ?"交易密码设置成功":'交易密码设置失败'}  navigation={this.props.navigation}/>
                <View style={topUpResultPageStyle.contentBox}>
                    <View style={topUpResultPageStyle.contentTopBox}>
                        <View style={topUpResultPageStyle.contentImgBox}>
                            {
                                status == 'success' ?
                                    <Image source={require('./../../imgs/commons/success_icon.png')}/>
                                    :
                                    <Image source={require('./../../imgs/commons/fail_icon.png')}/>
                            }
                        </View>
                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>
                            {
                                status == 'success' ?
                                    '恭喜您，交易密码设置成功！'
                                    :
                                    '很抱歉，交易密码设置失败！'
                            }</Text>
                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>{
                            status == 'success' ?
                                '交易密码在投标、借款、提现等资金交易中使用'
                                :
                                '如果您多次出现次错误，请联系客服'

                        }</Text>
                    </View>
                    <View style={topUpResultPageStyle.buttonBox}>
                        <TouchableOpacity activeOpacity={0.7} style={topUpResultPageStyle.button} onPress={() => {status =='success' ? this.toInvestment('list') : null}}>
                            <Text allowFontScaling={false} style={topUpResultPageStyle.buttonTitle}>{
                                status == 'success' ?
                                    "我要投资"
                                    :
                                    '重新设置'
                            }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={[topUpResultPageStyle.button,topUpResultPageStyle.buttonRight]} onPress={() => {status =='success' ? this.toInvestment('mine') : null}}>
                            <Text allowFontScaling={false} style={[topUpResultPageStyle.buttonTitle,topUpResultPageStyle.buttonTitleRight]}>{
                                status == 'success' ?
                                    "我的账户"
                                    :
                                    "我的账户"
                            }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}