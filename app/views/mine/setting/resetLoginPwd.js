/**
 * Created by liuzhenli on 2017/7/17.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator
} from 'react-native';
import {resetPwdPageStyle} from '../../../styles/mine/setting/phoneCertifyStyle';
var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
import MineHeader from './../../components/commonHeader';
import Button from './../../components/button';
import EAlert from './../../components/ealert';
import CloseButton from './../../components/closeButton';
import Loading from './../../components/loading';
import Util ,{ Grow } from './../../../commons/util';
import Line from './../../../commons/line';
import Fetch from './../../../commons/fetch';
var dismissKeyboard = require('dismissKeyboard')
export default class ResetLoginPwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            userInfo: null,
            verifyCode: null,
            getSmsCodeStatus: 1,
            getSmsCodeTitle:"发送验证码",
            uuid: '',
            haveGotSmsCode: false,
            formData:{
                initPwd: '',
                newPwd: '',
                reNewPwd: ''
            },
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });
    };
    checkFormData(){
        let formData = this.state.formData;
        formData.initPwd.length > 0 ?
            formData.initPwd.length >= 6 ?
                formData.newPwd.length > 0?
                    formData.newPwd.length >= 6 ?
                        formData.reNewPwd.length > 0?
                            formData.reNewPwd.length >= 6 ?
                                formData.reNewPwd == formData.newPwd ?
                                    this.submitData()
                                :
                                this.eAlert.show('alert',"两次密码输入不一致")
                            :
                            this.eAlert.show('alert',"请输入6-16位密码")
                        :
                        this.eAlert.show('alert',"请重新输入新密码")
                    :
                    this.eAlert.show('alert',"请输入6-16位密码")
                :
                this.eAlert.show('alert',"请输入新密码")
            :
            this.eAlert.show('alert',"请输入6-16位密码")
        :
        this.eAlert.show('alert',"请输入当前密码")
    };
    submitData(){
        let data = {
            newLoginPwd: this.state.formData.newPwd,
            oldLoginPwd: Util.Encode(this.state.formData.initPwd),
            secLoginPwd: this.state.formData.reNewPwd,
            useId: __useId,
            sessionId: __sessionId,
        };
        this.loading.show();
        Fetch.post('user/newUpdateUseLoginPswdWithoutRsa',data,res => {
            console.log('newUpdateUseLoginPswdWithoutRsa',res)
            this.loading.hide();
            if(res.success){
                if(res.code == '000'){
                    this.props.navigation.navigate('ResetPhoneResult',{type:'resetLoginPwd',backKey: this.props.navigation.state.params.backKey,status: 'fail'})
                }else{
                    this.props.navigation.navigate('ResetPhoneResult',{type:'resetLoginPwd',backKey: this.props.navigation.state.params.backKey,status: 'success'})
                }
            }else if(res.code){
                this.eAlert.show('alert',res.info)
            }
        },res => {
            this.loading.show('netFail','网络超时',2000)
        },null,this)
    };
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard();this.setState({activeInput:''})}}style={resetPwdPageStyle.container}>
                <MineHeader title="修改登录密码" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={resetPwdPageStyle.contentBox}>
                    <View style={resetPwdPageStyle.contentSubBox}>
                        <View style={resetPwdPageStyle.userNameBox}>
                            <View style={resetPwdPageStyle.labelImgBox}>
                                <Image style={resetPwdPageStyle.labelImg} source={require('./../../../imgs/mine/lock.png')}/>
                            </View>
                            <TextInput style={resetPwdPageStyle.verifyCodeInput}
                                       placeholder="请输入原始登录密码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'initPwd')}
                                       password={true}
                                       secureTextEntry={true}
                                       placeholderTextColor="#888889"
                                       clearButtonMode="while-editing"
                                       value={this.state.formData.initPwd}
                                       onFocus={() => {this.setState({activeInput: 'initPwd'})}}
                            />
                            {
                                !Util.isIOS && this.state.activeInput == 'initPwd'?  <CloseButton onPress={() => {Util.setFormData(this,'initPwd',"")}}/> : null
                            }
                        </View>
                        <Line full/>
                        <View style={resetPwdPageStyle.userNameBox}>
                            <View style={resetPwdPageStyle.labelImgBox}>
                                <Image style={resetPwdPageStyle.labelImg} source={require('./../../../imgs/mine/lock.png')}/>
                            </View>
                            <TextInput style={resetPwdPageStyle.verifyCodeInput}
                                       placeholder="请输入新密码，6-16位包含字母数字"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'newPwd')}
                                       password={true}
                                       secureTextEntry={true}
                                       placeholderTextColor="#888889"
                                       clearButtonMode="while-editing"
                                       value={this.state.formData.newPwd}
                                       onFocus={() => {this.setState({activeInput: 'newPwd'})}}
                            />
                            {
                                !Util.isIOS && this.state.activeInput == 'newPwd'?  <CloseButton onPress={() => {Util.setFormData(this,'newPwd',"")}}/> : null
                            }
                        </View>
                        <Line full/>
                        <View style={resetPwdPageStyle.userNameBox}>
                            <View style={resetPwdPageStyle.labelImgBox}>
                                <Image style={resetPwdPageStyle.labelImg} source={require('./../../../imgs/mine/lock.png')}/>
                            </View>
                            <TextInput style={resetPwdPageStyle.verifyCodeInput}
                                       placeholder="再次输入新密码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'reNewPwd')}
                                       password={true}
                                       secureTextEntry={true}
                                       placeholderTextColor="#888889"
                                       clearButtonMode="while-editing"
                                       value={this.state.formData.reNewPwd}
                                       onFocus={() => {this.setState({activeInput: 'reNewPwd'})}}
                            />
                            {
                                !Util.isIOS && this.state.activeInput == 'reNewPwd'?  <CloseButton onPress={() => {Util.setFormData(this,'reNewPwd',"")}}/> : null
                            }
                        </View>
                        <Line full/>
                    </View>

                    <View style={resetPwdPageStyle.submitButtonBox}>
                        <Button buttonName="完成" onPress={this.checkFormData.bind(this)}/>
                    </View>

                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </TouchableOpacity>
        );
    }
}