/**
 * Created by liuzhenli on 2017/8/28.
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
var VLine = require('./../../../commons/vLine');
var Fetch = require('./../../../commons/fetch');
var Gbk = require('./../../../commons/gbk');
import EAlert from './../../components/ealert';
import CloseButton from './../../components/closeButton';
import Loading from './../../components/loading';
import Button from './../../components/button';
import MineHeader from './../../components/commonHeader';
var dismissKeyboard = require('dismissKeyboard');
export default class SetNewPwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    constructor(props){
        super(props);
        this.interValID = null;
        this.state = {
            getSmsCodeTitle: '发送短信验证码',
            getSmsCodeStatus: 1,
            userInfo: this.props.navigation.state.params.userInfo,
            verifyCode: null,
            uuid:'',
            haveGotSmsCode: false,
            formData:{
                secPwd: '',
                newPwd:'',
            },
            showError: false,
            errorTitle: ''
        }
    };
    checkFormData(){
        let formData = this.state.formData;
        formData.newPwd.replace(/\s+/,'').length >= 6 ?
            formData.secPwd.replace(/\s+/,'').length >= 6 ?
                formData.secPwd.replace(/\s+/,'') == formData.newPwd.replace(/\s+/,'') ?
                this.submitData()
                    :
                    this.eAlert.show('alert','两次密码输入不一致')
                :
                this.eAlert.show('alert','请再次输入密码')
            :
            this.eAlert.show('alert','请输入密码')

    };
    submitData(){
        let data = this.props.navigation.state.params.type ? {
            mobileNo: this.props.navigation.state.params.phone,
            newLoginPwd: this.state.formData.newPwd,
            secLoginPwd: this.state.formData.newPwd
        } : {
            sessionId: __sessionId,
            useId: __useId,
            mobileNo: this.state.userInfo.useMobilePhones,
            newDealPwd: this.state.formData.newPwd,
            secDealPwd: this.state.formData.newPwd,
            identify: this.props.navigation.state.params.identify
        };
        this.loading.show();
        console.log('data',data);
        let url = this.props.navigation.state.params.type ? "forgetUseLoginPwdWithoutRsa" : 'forgetUseDealPwdWithoutRsa'
        Fetch.post('user/'+ url ,data,res => {
            console.log('user/checkSmsCode',res)
            this.loading.hide();
            if(res.code){
                this.eAlert.show('alert',res.info)
            }else if(res.success){
                this.eAlert.show('alert',"密码修改成功",() => this.props.navigation.goBack(this.props.navigation.state.params.backKey))
            }
        },error => {
            this.loading.show('netFail','网络超时',2000)
        },null,this)
    };
    render() {
        let params = this.props.navigation.state.params;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard();this.setState({activeInput:''})}}style={resetTradePwdPageStyle.container}>
                <MineHeader title={"设置新的密码"} leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={resetTradePwdPageStyle.contentBox}>
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
                    </View>
                    <Line/>
                    <View style={resetTradePwdPageStyle.userNameBox}>
                        <View style={resetTradePwdPageStyle.labelImgBox}>
                            <Image style={resetTradePwdPageStyle.labelImg} source={require('./../../../imgs/mine/lock.png')}/>
                        </View>
                        <TextInput style={resetTradePwdPageStyle.cardIDCodeInput}
                                   placeholder="再次输入新密码"
                                   underlineColorAndroid="transparent"
                                   onChangeText={Util.setFormData.bind(this,this,'secPwd')}
                                   placeholderTextColor="#888889"
                                   clearButtonMode="while-editing"
                                   maxLength={16}
                                   password={true}
                                   secureTextEntry={true}
                                   value={this.state.formData.secPwd}
                                   onFocus={() => {this.setState({activeInput: 'secPwd'})}}
                        />
                    </View>
                    <Line/>
                    <View style={resetTradePwdPageStyle.submitButtonBox}>
                        <Button buttonName="下一步" onPress={this.checkFormData.bind(this)}/>
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