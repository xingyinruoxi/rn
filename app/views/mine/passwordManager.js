/**
 * Created by liuzhenli on 2017/8/18.
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
    Alert,
    InteractionManager
} from 'react-native';
import {accountManagePageStyle} from './../../styles/mine/accountManagePageStyle';
import Line from './../../commons/line';
import RightIcon from './../components/rightIcon';
var Storage = require('./../../commons/storage');
var Fetch = require('./../../commons/fetch');
var StorageKey = require('./../../commons/storageKey');
import util,{ Grow } from './../../commons/util';
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import Switch from 'react-native-switch-pro'
import Loading from './../components/loading';
import TouchID from './touchid/index';
const EventEmitter = require('RCTDeviceEventEmitter');
export default class PasswordMessage extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: this.props.navigation.state.params.userInfo,
            userAccountData: null,
            hideAccountInfo: false,
            figurePrint: false,
            gesturePwd: global.__haveSetGesture,
            receiveJpush: true,
            bankStatus: null,
        };
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_FINGUERPRINT).then((figurePrint) => {
            if(figurePrint){
                this.setState({
                    figurePrint: figurePrint
                })
            }
        })
    };
    routePage(routeName,params){
        this.props.navigation.navigate(routeName,params)
    };
    figurePrint(){
        if(!this.state.figurePrint){
            TouchID.isSupported().then((support) => {
                TouchID.authenticate('通过Home键验证指纹','提示').then((data) => {
                    Storage.setItem(StorageKey.eTD_FINGUERPRINT,true);
                    this.setState({
                        figurePrint: true
                    });
                }).catch(error => {
                    this.setState({
                        figurePrint: false
                    });
                    Storage.setItem(StorageKey.eTD_FINGUERPRINT,false)
                    if (error.name == "LAErrorAuthenticationFailed") {
                        this.eAlert.show('alert','指纹不匹配')
                    } else if(error.name == 'LAErrorUserCancel'){
                        return;
                    }else{
                        this.eAlert.show("alert", '您尚未设置Touch ID,请在手机中"设置"-"Touch ID与密码"中添加指纹',() => {this.setState({figurePrint: false})})
                    }
                })
            }).catch(error => {
                this.eAlert.show("alert", '您尚未设置Touch ID,请在手机中"设置"-"Touch ID与密码"中添加指纹',() => {this.setState({figurePrint: false})})
            })
        }else{
            Storage.setItem(StorageKey.eTD_FINGUERPRINT,false)
            this.setState({
                figurePrint: false
            })
        }

    };
    resetTradePwd(){
        this.props.navigation.navigate('resetTradePwd',{userInfo: this.state.userInfo})
    };
    setGesture(){
        Storage.getItem(StorageKey.eTD_GESTUREPWD).then((data) => {
            if(data && data.pwd){
                this.setState({
                    gesturePwd: !this.state.gesturePwd
                });
                setTimeout(() => {global.__haveSetGesture = this.state.gesturePwd},100)
                data.hide = !data.hide;
                Storage.setItem(StorageKey.eTD_GESTUREPWD,data)
            }else{
                global.forbidTransition = true;
                console.log('backKey: this.props.navigation.state.params.backKey',this.props.navigation.state.params.backKey)
                this.props.navigation.navigate('GesturePwd',{callback: () => {this.setState({ gesturePwd: false })},backKey: this.props.navigation.state.params.backKey });
                this.setState({
                    gesturePwd: true
                })
            }
        });
    };
    render(){
        let userInfo = this.state.userInfo;
        return (
            <View style={accountManagePageStyle.container}>
                <MineHeader title="账户管理" leftButton leftIcon goBack root={this} navigation={this.props.navigation}/>
                <View style={accountManagePageStyle.userInfoBox}>
                    <View style={accountManagePageStyle.accountBox}>
                        <TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={this.routePage.bind(this,'resetLoginPwd',{backKey: this.props.navigation.state.key})}>
                            <View style={[accountManagePageStyle.labelTextBox]}>
                                <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>修改登录密码</Text>

                            </View>
                            <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                <RightIcon color="#9D9D9D"/>
                            </View>

                        </TouchableOpacity>
                        <Line notFull={true}/>
                        <TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={this.resetTradePwd.bind(this)}>
                            <View style={[accountManagePageStyle.labelTextBox]}>
                                <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>修改交易密码</Text>
                            </View>
                            <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                <RightIcon color="#9D9D9D"/>
                            </View>

                        </TouchableOpacity>
                        <Line notFull={true}/>
                        {
                            util.isIOS ?
                                <View>
                                    <TouchableOpacity activeOpacity={1} style={accountManagePageStyle.itemBox}>
                                        <View style={[accountManagePageStyle.labelTextBox]}>
                                            <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>指纹解锁</Text>
                                        </View>
                                        <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                            <Switch  value={this.state.figurePrint} width={50} height={25} onSyncPress={this.figurePrint.bind(this,'figurePrint')}/>
                                        </View>

                                    </TouchableOpacity>
                                    <Line notFull={true}/>
                                </View>
                                :
                                null
                        }


                        <TouchableOpacity activeOpacity={1} style={accountManagePageStyle.itemBox}  >
                            <View style={[accountManagePageStyle.labelTextBox]}>
                                <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>手势解锁</Text>
                            </View>
                            <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                <Switch  value={this.state.gesturePwd} width={50} height={25}onSyncPress={this.setGesture.bind(this)}/>
                            </View>

                        </TouchableOpacity>

                        {
                            this.state.gesturePwd ?
                                <View>
                                    <Line notFull={true}/>
                                    <TouchableOpacity activeOpacity={1} style={accountManagePageStyle.itemBox} onPress={() => {global.forbidTransition = true;this.props.navigation.navigate('GesturePwd',{type: 'resetPwd',backKey:this.props.navigation.state.params.backKey})}}>

                                        <View style={[accountManagePageStyle.labelTextBox]}>
                                            <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>修改手势密码</Text>
                                        </View>
                                        <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                            <RightIcon color="#9D9D9D"/>
                                        </View>

                                    </TouchableOpacity>
                                </View>

                                :
                                null

                        }
                    </View>

                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </View>
        );
    }
}