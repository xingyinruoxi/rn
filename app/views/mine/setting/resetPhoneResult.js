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
import {topUpResultPageStyle} from './../../../styles/mine/topUpResultStyle';
import { NavigationActions } from 'react-navigation';
import EAlert from './../../components/ealert';
import Button from './../../components/button';
import MineHeader from '../../components/commonHeader';
import Util,{ Grow } from './../../../commons/util';
var Fetch = require('./../../../commons/fetch');
var EventEmitter = require('RCTDeviceEventEmitter');
export default class ResetPhoneResult extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false
    });
    constructor(props){
        super(props);
        this._onPress = this._onPress.bind(this)
    };
    componentWillMount(){

    };
		componentDidMount(){
			if(this.props.navigation.state.params.type == 'bindCard' && this.props.navigation.state.params.status == 'success'){
					Grow.track('pg_my_bindok_userbrowse',{'pg_my_bindok_userbrowse':'绑卡成功页面浏览用户量'})
			}else{

			}
		}
    _onPress(){
        EventEmitter.emit('getStatus');
        setTimeout(() => EventEmitter.emit('getUserInfo'))
        this.props.navigation.goBack(this.props.navigation.state.params.backKey);
    };
    toTopUp(){
			Grow.track('elbn_my_bindok_gorecharge_click',{'elbn_my_bindok_gorecharge_click':'去充值按钮点击量'})
        let data = {
            sessionId: __sessionId,
            useId:  __useId
        };
        Fetch.post('payment/rechargeInput',data,(res) => {
            if(res.success){
                this.props.navigation.navigate('topUp',{bankData: res.body,backKey:this.props.navigation.state.params.backKey})
            }
        },(error) => {
            this.loading &&  this.loading.show('loading','网络超时',2000)
        },null,this,this.toTopUp.bind(this))
    }
    buttonHandler(){
			Grow.track('elbn_my_bind_gomyaccount_click',{'elbn_my_bind_gomyaccount_click':'我的账户按钮点击量'})
        EventEmitter.emit('getStatus');
        setTimeout(() => EventEmitter.emit('getUserInfo'))

        global.forbidTransition = true;
        this.props.navigation.navigate('mine');
        setTimeout(() => {global.forbidTransition = false;})
    };
    render() {
        console.log('this.props.navitateion',this.props.navigation)
        let status = this.props.navigation.state.params.status;
        let type = this.props.navigation.state.params.type;
        return (
            <View style={topUpResultPageStyle.container}>
                <MineHeader title={type == 'resetLoginPwd' ? '修改登录密码' :  type == 'bindCard' ? "成功绑定银行卡" : "修改手机号"}  navigation={this.props.navigation}/>
                {
                    type == 'resetLoginPwd' ?
                        <View style={topUpResultPageStyle.contentBox}>
                            <View style={[topUpResultPageStyle.contentTopBox,{paddingHorizontal: 14 * Util.pixel}]}>
                                <View style={topUpResultPageStyle.contentImgBox}>
                                    {
                                        status == 'success' ?
                                            <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/successImg.png')}/>
                                            :
                                            status == 'handling' ?
                                                <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/commons/loading_icon.png')}/>
                                                :
                                                <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/failImg.png')}/>
                                    }

                                </View>
                                {
                                    status == 'success' ?
                                        <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNum,{textAlign:"center"}]}>登录密码修改成功！ 为保障账户的安全，请牢记您的新密码</Text>
                                        :
                                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>很抱歉，登录密码修改失败！</Text>
                                }

                            </View>
                            <View style={topUpResultPageStyle.buttonBox}>
                                <Button buttonName="确认" onPress={this._onPress}/>
                            </View>
                        </View>
                    :
                    type == 'bindCard' ?
                        <View style={topUpResultPageStyle.contentBox}>
                            <View style={topUpResultPageStyle.contentTopBox}>
                                <View style={topUpResultPageStyle.contentImgBox}>
                                    {
                                        status == 'success' ?
                                            <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/successImg.png')}/>
                                            :
                                            status == 'handling' ?
                                                <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/commons/loading_icon.png')}/>
                                                :
                                                <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/failImg.png')}/>
                                    }

                                </View>
                                {
                                    status == 'success' ?
                                        <Text allowFontScaling={false} style={[topUpResultPageStyle.bindCard,]}>恭喜您，成功绑定银行卡！</Text>
                                        :
                                        <Text allowFontScaling={false} style={topUpResultPageStyle.bindCard}>很抱歉，绑定银行卡失败！</Text>
                                }

                            </View>
                            <View style={topUpResultPageStyle.buttonBox}>
                                <Button buttonName="去充值" width={150} onPress={this.toTopUp.bind(this)}/>
                                <Button buttonName="我的账户" width={150} borderColor='#025FCB' color="#fff" textColor='#025FCB'onPress={() => this.props.navigation.goBack(this.props.navigation.state.params.backKey)}/>
                            </View>
                        </View>
                    :
                    <View style={topUpResultPageStyle.contentBox}>
                        <View style={topUpResultPageStyle.contentTopBox}>
                            <View style={topUpResultPageStyle.contentImgBox}>
                                {
                                    status == 'success' ?
                                        <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/successImg.png')}/>
                                        :
                                        status == 'handling' ?
                                            <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/commons/loading_icon.png')}/>
                                            :
                                            <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/failImg.png')}/>
                                }

                            </View>
                            {
                                status == 'success' ?
                                    <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>手机号码修改成功，请重新登录！</Text>
                                    :
                                    status == 'fail' ?
                                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>手机号码修改失败，您可以再次修改或稍后再试</Text>
                                        :
                                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>银行系统正在处理中...</Text>
                            }
                        </View>
                        {
                            status == 'fail'  ?

                                    <View style={topUpResultPageStyle.buttonBox}>
                                        <Button buttonName="再次修改" width={150} onPress={() => this.props.navigation.goBack()}/>
                                        <Button buttonName="我的账户" width={150} borderColor='#025FCB' color="#fff" textColor='#025FCB'onPress={() => this.buttonHandler()}/>
                                    </View>
                                    :
                                    <View style={topUpResultPageStyle.buttonBox}>
                                        <Button buttonName="完成" onPress={this._onPress}/>
                                    </View>
                        }

                    </View>
                }

                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}