/**
 * Created by liuzhenli on 2017/7/25.
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
const EventEmitter = require('RCTDeviceEventEmitter');
import Button from './../components/button';
export default class RegisterResult extends Component {
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
    componentDidMount(){
			if(this.props.navigation.state.params.status == 'success'){
				Grow.track('pg_my_regok_userbrowse',{'pg_my_regok_userbrowse':'注册成功页面浏览用户量'})
			}
        if(!Util.isIOS){
            this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.forbidGoBack);
        }
    };
    removeHandler(){
        if(!Util.isIOS){
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
        }
    }
    forbidGoBack(){
        return true;
    }
    callback(){
        if(!Util.isIOS) {
            this.removeHandler();
        }
        global.forbidTransition = true;
        this.props.navigation.navigate('home');
        setTimeout(() => {global.forbidTransition = false,EventEmitter.emit('checkFingerPwd')},100)
    };
    render() {
        let status = this.props.navigation.state.params.status;
        return (
            <View style={topUpResultPageStyle.container}>
                <MineHeader title="注册成功"  rightButton closePage navigation={this.props.navigation} callback={this.callback.bind(this)}/>
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
                                    '恭喜您注册成功！'
                                    :
                                    '很抱歉，注册失败！'
                            }</Text>
                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumber}>{
                            status == 'success' ?
                                '完成实名认证才能进行出借操作'
                                :
                                ''

                        }</Text>
                    </View>
                    <View style={topUpResultPageStyle.buttonBox}>
                        <Button buttonName="去完成实名注册" onPress={() => { Grow.track('elbn_my_regok_goverify_click',{'elbn_my_regok_goverify_click':'去实名认证按钮点击量'});this.removeHandler(); this.props.navigation.navigate('createRealNameAccount',{register: true,haveCertify:false})}}/>
                    </View>
                    <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNumber]}>了解易通贷，<Text style={{color:'#025FCB'}} onPress={() => {Grow.track('elbn_my_regok_visit_click',{'elbn_my_regok_visit_click':'了解易通贷，先逛逛按钮点击量'});this.callback()}}>先逛逛</Text></Text>
                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}