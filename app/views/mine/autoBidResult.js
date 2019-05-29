/**
 * Created by liuzhenli on 2017/7/24.
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
import { NavigationActions } from 'react-navigation';
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';

export default class AutoBidResult extends Component {
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
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });

    };
    forbidGoBack(){
        return true;
    };
    removeHandler(){
        if(!Util.isIOS){
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
        }
    };
    toTab(){
        global.forbidTransition = true;
        this.removeHandler()
        const resetAction = NavigationActions.navigate({
            routeName: 'tab',
            params: {},
            action: NavigationActions.navigate({ routeName: 'mine'})
        });

        this.props.navigation.dispatch(resetAction);
        setTimeout(() => {global.forbidTransition = false},100)
    };
    componentDidMount(){
        if(!Util.isIOS){
            this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.forbidGoBack);
        }
    }
    render() {
        let status = this.props.navigation.state.params.status;
        return (
            <View style={topUpResultPageStyle.container}>
                <MineHeader title="个人自动投标"  navigation={this.props.navigation}/>
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
                                    '您已成功开启自动投标！'
                                    :
                                    '很抱歉，自动投标开启失败！'
                            }</Text>
                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>{
                            status == 'success' ?
                                '有了投标器，您要做的就是坐等投资回报啦！'
                                :
                                '如果您多次出现次错误，请联系客服'

                        }</Text>
                    </View>
                    <View style={topUpResultPageStyle.buttonBox}>
                        <TouchableOpacity activeOpacity={0.7} style={topUpResultPageStyle.button} onPress={() => {this.removeHandler();this.props.navigation.goBack(this.props.navigation.state.params.backKey);this.props.navigation.state.params && this.props.navigation.state.params.callback && this.props.navigation.state.params.callback()}}>
                            <Text allowFontScaling={false} style={topUpResultPageStyle.buttonTitle}>{
                                status == 'success' ?
                                    "查看设置"
                                    :
                                    '重新设置'
                            }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={[topUpResultPageStyle.button,topUpResultPageStyle.buttonRight]} onPress={() => {this.removeHandler();status == 'fail' ? this.toTab() : this.props.navigation.navigate('topUp')}}>
                            <Text allowFontScaling={false} style={[topUpResultPageStyle.buttonTitle,topUpResultPageStyle.buttonTitleRight]}>{
                                status == 'success' ?
                                    "我要充值"
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