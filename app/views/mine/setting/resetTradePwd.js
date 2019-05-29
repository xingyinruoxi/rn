/**
 * Created by liuzhenli on 2017/7/17.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    StatusBar,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {resetTradePwdPageStyle} from './../../../styles/mine/setting/resetTradePwdStyle';
var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
import Util,{ Grow } from './../../../commons/util';
var Line = require('./../../../commons/line');
var Fetch = require('./../../../commons/fetch');
import EAlert from './../../components/ealert';
import CloseButton from './../../components/closeButton';
import Loading from './../../components/loading';
import Button from './../../components/button';
import MineHeader from './../../components/commonHeader';
var dismissKeyboard = require('dismissKeyboard');
export default class ResetTradePwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    constructor(props){
        super(props);
        this.interValID = null;
        this.state = {
            getSmsCodeTitle: '获取验证码',
            getSmsCodeStatus: 1,
            userInfo: this.props.navigation.state.params.userInfo,
            verifyCode: null,
            uuid:'',
            haveGotSmsCode: false,
            formData:{
                oldPwd: '',
                newPwd: '',
                secNewPwd: ''
            },
            showError: false,
            errorTitle: '',
            phone: this.props.navigation.state.params.userInfo.useMobilePhones
        }
    };
    componentDidMount(){

    };
    componentWillUnmount(){
        clearInterval(this.InterValID)
    }
    checkFormData = () =>{
        let formData = this.state.formData;
        formData.oldPwd.replace(/\s+/,'').length > 0 ?
                formData.newPwd.replace(/\s+/,'').length > 0 ?
                    formData.secNewPwd.replace(/\s+/,'').length > 0 ?
                        this.submitData()
                    :
                    this.setState({
                        errorTitle:'请再次输入新密码',
                        showError: true
                    })
                :
                this.setState({
                    errorTitle:'请输入新密码',
                    showError: true
                })
            :
        this.setState({
            errorTitle:'请输入原始登录密码',
            showError: true
        })
    };
    submitData(){
        let data = {
            sessionId: __sessionId,
            useId: this.state.userInfo.useId,
            oldDealPwd: Util.Encode(this.state.formData.oldPwd),
            newDealPwd: this.state.formData.newPwd,
            secDealPwd: this.state.formData.secNewPwd,
        };
        this.loading.show();
        Fetch.post('user/updateUseDealPswdWithoutRsa',data,res => {
            console.log('user/updateUseDealPswdWithoutRsa',res)
            this.loading.hide();
            if(res.code){
                this.eAlert.show('alert',res.info)
            }else if(res.success){
                this.eAlert.show('alert',"交易密码修改成功",() => this.props.navigation.goBack());
            }
        },error => {
            this.loading.show('netFail','网络超时',2000)
        },null,this)
    };
    forgotTradePwd(){
        this.props.navigation.navigate('resetPwdByPhone',{userInfo: this.state.userInfo,backKey: this.props.navigation.state.key})
    };
    render() {
        let userInfo = this.state.userInfo ? this.state.userInfo.sftUserMdl : null
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard();this.setState({activeInput:''})}}style={resetTradePwdPageStyle.container}>
                <MineHeader title="修改交易密码" leftButton leftIcon goBack callback={this.props.navigation.state.params ? this.props.navigation.state.params.callback : null}backKey={this.props.navigation.state.params ? this.props.navigation.state.params.backKey : null}navigation={this.props.navigation}/>
                <View style={resetTradePwdPageStyle.contentBox}>
                    <View style={resetTradePwdPageStyle.userNameBox}>
                        <View style={resetTradePwdPageStyle.labelImgBox}>
                            <Image style={resetTradePwdPageStyle.labelImg} source={require('./../../../imgs/mine/lock.png')}/>
                        </View>
                        <TextInput style={resetTradePwdPageStyle.cardIDCodeInput}
                                   placeholder="请输入原始交易密码"
                                   underlineColorAndroid="transparent"
                                   onChangeText={Util.setFormData.bind(this,this,'oldPwd')}
                                   placeholderTextColor="#888889"
                                   clearButtonMode="while-editing"
                                   maxLength={16}
                                   password={true}
                                   secureTextEntry={true}

                                   value={this.state.formData.oldPwd}
                                   onFocus={() => {this.setState({activeInput: 'oldPwd'})}}
                        />
                        {
                            !Util.isIOS && this.state.activeInput == 'cardID'?  <CloseButton onPress={() => {Util.setFormData(this,'cardID',"")}}/> : null
                        }
                    </View>
                    <Line/>
                    <View style={resetTradePwdPageStyle.userNameBox}>
                        <View style={resetTradePwdPageStyle.labelImgBox}>
                            <Image style={resetTradePwdPageStyle.labelImg} source={require('./../../../imgs/mine/lock.png')}/>
                        </View>
                        <TextInput style={resetTradePwdPageStyle.cardIDCodeInput}
                                   placeholder="请输入新密码，6-16位包含字母数字"
                                   underlineColorAndroid="transparent"
                                   onChangeText={Util.setFormData.bind(this,this,'newPwd')}
                                   placeholderTextColor="#888889"
                                   clearButtonMode="while-editing"
                                   maxLength={16}
                                   password={true}
                                   secureTextEntry={true}

                                   value={this.state.formData.newPwd}
                                   onFocus={() => {this.setState({activeInput: 'newPwd'})}}
                        />
                        {
                            !Util.isIOS && this.state.activeInput == 'cardID'?  <CloseButton onPress={() => {Util.setFormData(this,'cardID',"")}}/> : null
                        }
                    </View>
                    <Line/>
                    <View style={resetTradePwdPageStyle.userNameBox}>
                        <View style={resetTradePwdPageStyle.labelImgBox}>
                            <Image style={resetTradePwdPageStyle.labelImg} source={require('./../../../imgs/mine/lock.png')}/>
                        </View>
                        <TextInput style={resetTradePwdPageStyle.cardIDCodeInput}
                                   placeholder="再次输入新密码"
                                   underlineColorAndroid="transparent"
                                   onChangeText={Util.setFormData.bind(this,this,'secNewPwd')}
                                   placeholderTextColor="#888889"
                                   clearButtonMode="while-editing"
                                   maxLength={16}
                                   password={true}
                                   secureTextEntry={true}
                                   
                                   value={this.state.formData.secNewPwd}
                                   onFocus={() => {this.setState({activeInput: 'secNewPwd'})}}
                        />
                        {
                            !Util.isIOS && this.state.activeInput == 'cardID'?  <CloseButton onPress={() => {Util.setFormData(this,'cardID',"")}}/> : null
                        }
                    </View>
                    <Line/>
                    <View style={resetTradePwdPageStyle.forgetBox}>
                        <Text allowFontScaling={false} style={resetTradePwdPageStyle.forgetTitle} onPress={() => this.forgotTradePwd()}>我忘记了交易密码</Text>
                    </View>
                    <View style={resetTradePwdPageStyle.submitButtonBox}>
                        <Button buttonName="下一步" onPress={this.checkFormData}/>
                    </View>
                    <View style={resetTradePwdPageStyle.bottomRemindBox}>
                        {
                            this.state.showError ?
                                <Text allowFontScaling={false} style={resetTradePwdPageStyle.remindTitle}>{this.state.errorTitle}</Text>
                                :
                                null
                        }
                    </View>
                </View>
               
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </TouchableOpacity>
        );
    }
}