/**
 * Created by liuzhenli on 2017/7/11.
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
    InteractionManager,
    NativeModules
} from 'react-native';
import {accountManagePageStyle} from './../../styles/mine/accountManagePageStyle';
import Line from './../../commons/line';
import RightIcon from './../components/rightIcon';
var Storage = require('./../../commons/storage');
import util,{Grow} from './../../commons/util';
var Fetch = require('./../../commons/fetch');
var StorageKey = require('./../../commons/storageKey');
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import Switch from 'react-native-switch-pro'
import Loading from './../components/loading';
import Button from './../components/button';
const EventEmitter = require('RCTDeviceEventEmitter');
const {systemInfos} = require('./../../commons/config');
export default class AccountManage extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false,
            figurePrint: false,
            gesturePwd: global.__haveSetGesture,
            receiveJpush: true,
            bankStatus: null,
            userAccount: null,
            evaData: null,
            receiveJPush: true
        };
        EventEmitter.addListener('getStatus',this.getStatus.bind(this))
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            setTimeout(() => { this.getStatus() })
        });
        Storage.getItem(StorageKey.eTD_FINGUERPRINT).then((figurePrint) => {
            if(figurePrint){
                this.setState({
                    figurePrint: figurePrint
                })
            }
        })
    };
    componentDidMount(){
        this.getEvaResult();
        if(util.isIOS){
            NativeModules.ETDDevice.isCurrentUserNotificationEnable((status) => {
                this.setState({
                    receiveJPush: status
                });
            })
        }
    };
    getStatus(){
        let data = {
            sessionId: __sessionId,
            useId: __useId
        };
        Fetch.post('userCenter/checkuserstatus',data,res => {
            console.log('checkuserstatus',res);
            if(res.success){
                this.setState({
                    userInfo: res.body.extend
                });
                Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
                    userInfo.sftUserMdl = res.body.extend;
                    Storage.setItem(StorageKey.eTD_USERINFO,userInfo)
                }).then(() => EventEmitter.emit('getUserInfo'))
            }
        },error => {

        },null,this)
    }
    getEvaResult(){
        Fetch.post('userCenter/getcodelist',{},res => {
            console.log('getcodelist',res)
            if(res.success){
                this.setState({
                    evaData: res.body.riskTypeDictList
                })
            }
        },error => {

        },null,this)
    }
    setSwitch =(arg,val) => {
        if(arg == 'receiveJpush' && this.state.receiveJpush){
            this.eAlert.show('alert','请在iPhone的"设置"-"通知"中进行修改',() => {this.setState({receiveJpush: true,})});
        }else{
            console.log(val);
            this.setState((state) => {
                state[arg] = val;
                return state;
            });
        }

    };
    resetTradePwd(){
        this.props.navigation.navigate('resetTradePwd')
    };
    realNameAccount(){
        if(this.state.userInfo.useAuthRealName == '1'){
            this.props.navigation.navigate('createRealNameAccount',{haveCertify: true,userInfo:this.state.userInfo})
        }else{
            this.props.navigation.navigate('createRealNameAccount',{haveCertify: false,userInfo: this.state.userInfo,toMine: true})
        }
        
    };
    bindBankCard(userInfo){
        if(userInfo && userInfo.useAuthRealName == '1'){
            if(this.state.userInfo.bacNo){
                this.props.navigation.navigate('myBankCard',{bankNo: this.state.userInfo.bacNo})
            }else{
                console.log('bindBankCard bindBankCard',this.state.userInfo)
                this.props.navigation.navigate('bindBankCard',{data:{user:this.state.userInfo}})
            }
        }else{
            this.eAlert.show('alert','您还未进行实名认证，请先进行实名认证',() => {
               this.realNameAccount();
            })
        }

    };
    phoneCertify(){
        if(this.state.userInfo.useAuthMp == '1'){
            this.props.navigation.navigate('phoneCertify',{backKey: this.props.navigation.state.key,phone: this.state.userInfo.useMobilePhones})
        }else{
            this.props.navigation.navigate('bindPhone',{backKey: this.props.navigation.state.key})
        }
    };
    outLogin(){
        let data = {
            sessionId: __sessionId,
            useId: __useId
        };
        this.loading.show();
        Fetch.post('user/outLogin',data,res => {
            this.loading.hide();
            if(res && res.success){
                this.removeLoginInfo();
            }else{
                this.eAlert.show('alert',res.info);
            }
        },err => {
            this.loading.show('netFail',"网络错误",2000);
        },null,this);
    };
    removeLoginInfo(){
        global.forbidTransition = true;
        this.props.navigation.navigate('login',{dispatch: true,callback: this.getStatus.bind(this),goHome:true});
        Storage.removeItem(StorageKey.eTD_USERINFO);
    };
    getRisk(){
       this.props.navigation.navigate('webViewWithBridge',{title:'风险测评',url:systemInfos.risk_measurement_url})
    }
    render(){
        let userInfo = this.state.userInfo && this.state.userInfo;
        let evaType = '';
        if(this.state.evaData && userInfo && userInfo.evaResult){
            this.state.evaData.map((item,index) => {
                if(item.dicKey == userInfo.evaResult){
                    evaType = item.dicValue
                }
            })
        }
        return (
            <View style={accountManagePageStyle.container}>
                <MineHeader title="账户管理" leftButton leftIcon goBack color='#006EEE' root={this} navigation={this.props.navigation}/>
                    <ScrollView style={accountManagePageStyle.userInfoBox}>
                        <View style={accountManagePageStyle.headerImgBox}>
                            <View style={accountManagePageStyle.headerImg}>
                                <Image source={require('./../../imgs/mine/accountManagerHeader.png')}/>
                            </View>
                        </View>
                        <View style={accountManagePageStyle.accountBox}>
                            <TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={this.realNameAccount.bind(this)}>
                                <View style={[accountManagePageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>实名认证</Text>
                                </View>
                                <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelTextRight}>{
                                        userInfo && userInfo.useAuthRealName == '1' ?
                                                "已认证"
                                            : '未认证'
                                    }</Text>
                                    <RightIcon color="#9D9D9D"/>
                                </View>

                            </TouchableOpacity>
                            <Line notFull={true}/>
                            <TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={this.phoneCertify.bind(this)}>
                                <View style={[accountManagePageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>手机号码</Text>

                                </View>
                                <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelTextRight}>{
                                        userInfo && userInfo.useAuthMp == '1' ?
                                            "已认证"
                                            : "去认证"
                                    }</Text>
                                    <RightIcon color="#9D9D9D"/>
                                </View>

                            </TouchableOpacity>
                            <Line notFull={true}/>

                            <TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={this.bindBankCard.bind(this,userInfo)}>
                                <View style={[accountManagePageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>银行卡</Text>
                                </View>
                                <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelTextRight}>{
                                        userInfo && userInfo.bacNo ?
                                            "尾号(" + userInfo.bacNo.substring(userInfo.bacNo.length - 4) + ")"
                                            :
                                            '去绑定'
                                    }</Text>
                                    <RightIcon color="#9D9D9D"/>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={accountManagePageStyle.accountBox}>

                            <TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={() => this.props.navigation.navigate('passwordManager',{userInfo: this.state.userInfo,backKey: this.props.navigation.state.key})}>
                                <View style={[accountManagePageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>密码管理</Text>
                                </View>
                                <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                    <RightIcon color="#9D9D9D"/>
                                </View>

                            </TouchableOpacity>
                            <Line notFull={true}/>
													{
														!this.state.address ?
															<View>
																<TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={() => this.props.navigation.navigate('addressManger',{userInfo: this.state.userInfo,backKey: this.props.navigation.state.key})}>
																	<View style={[accountManagePageStyle.labelTextBox]}>
																		<Text allowFontScaling={false} style={accountManagePageStyle.labelText}>地址管理</Text>
																	</View>
																	<View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
																		<RightIcon color="#9D9D9D"/>
																	</View>
																</TouchableOpacity>
																<Line notFull={true}/>
															</View>
															: null
													}

                            <TouchableOpacity activeOpacity={0.7} style={accountManagePageStyle.itemBox} onPress={this.getRisk.bind(this)}>
                                <View style={[accountManagePageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>风险评测</Text>
                                </View>
                                <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={accountManagePageStyle.labelTextRight}>
                                        {
                                            userInfo && userInfo.authEvaluating == '1' ?
                                                evaType
                                                :
                                                '去测评'
                                        }
                                    </Text>
                                    <RightIcon color="#9D9D9D"/>
                                </View>

                            </TouchableOpacity>
                            <Line notFull={true}/>
                            {
                                util.isIOS ?
                                    <TouchableOpacity activeOpacity={1} style={accountManagePageStyle.itemBox}>
                                        <View style={[accountManagePageStyle.labelTextBox]}>
                                            <Text allowFontScaling={false} style={accountManagePageStyle.labelText}>接收推送</Text>
                                        </View>
                                        <View style={[accountManagePageStyle.labelTextBox,accountManagePageStyle.labelTextBoxRight]}>
                                            <Switch  value={this.state.receiveJPush}  width={50} height={25}onSyncPress={this.setSwitch.bind(this,'receiveJpush')}/>
                                        </View>

                                    </TouchableOpacity>
                                    :
                                    null
                            }
                        </View>
                        <View style={accountManagePageStyle.buttonBox}>
                            <Button buttonName="退出登录" onPress={this.outLogin.bind(this)}/>
                        </View>

                    </ScrollView>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </View>
        );
    }
}
