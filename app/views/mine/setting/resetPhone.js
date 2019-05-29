/**
 * Created by liuzhenli on 2017/7/14.
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
import {phoneCertifyPageStyle} from '../../../styles/mine/setting/phoneCertifyStyle';
var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
import MineHeader from './../../components/commonHeader';
import CloseButton from './../../components/closeButton';
import Button from './../../components/button';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import Util,{ Grow }  from './../../../commons/util';
import Line from './../../../commons/line';
import VLine from './../../../commons/vLine';
import Fetch from './../../../commons/fetch';
var dismissKeyboard = require('dismissKeyboard');
export default class PhoneCertify extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.interValID = null;
        this.state = {
            userInfo: null,
            verifyCode: null,
            getSmsCodeStatus: 1,
            getSmsCodeTitle:"60s后重新发送",
            uuid: '',
            haveGotSmsCode: false,
            formData:{
                identify: '',
                smsCode: ''
            },
            showError: null,
            phone: this.props.navigation.state.params.phone
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
        this.getSmsCode()

    };
    componentWillUnmount(){
        clearInterval(this.InterValID)
    }
    getVerifyCode (){
        this.setState({
            verifyCode: null
        });
        let data = {
            appVersion:'3.0.0',
            terminalType:2
        }
        Fetch.post('system/identify',data,(res) => {
            console.log('res',res);
            if(res && res.success){
                this.setState({
                    verifyCode: res.body.indentify,
                    uuid: res.body.uuid
                });
            }
        },(error) => {
			this.loading && this.loading.show('netFail','网络超时',2000)
        },null,this)
    };
    checkFormData(){
        let formData = this.state.formData;
            formData.smsCode.length > 0?
                this.submitData()
                :
                this.setState({showError: '请输入验证码'})
    };
    getSmsCode(){
        if(this.state.getSmsCodeStatus){
            this.setState({
                getSmsCodeStatus: 0,
            });
            let data = {
                messageType: '1',
                sessionId: __sessionId,
                useMobile: this.state.phone
            };
			this.loading && this.loading.show();
            Fetch.post('user/sendMessageIdentify',data,res => {
                console.log('sendMessageIdentify',res)
                this.loading.hide();
                if(res.success){
                    clearInterval(this.InterValID)
                    this.InterValID = Util.timer(this,60);
                }else{
                    this.setState({
                        getSmsCodeStatus: 1
                    });
                    this.eAlert.show('alert',res.info)
                }
            },error => {
                this.setState({
                    getSmsCodeStatus: 1,
                })
            },null,this)
        }
    };
    submitData(){
        let data = {
            sessionId: __sessionId,
            useId: __useId,
            mobileNo: this.state.phone,
            identify: this.state.formData.smsCode
        };
        this.loading.show();
        console.log('data',data);
        Fetch.post('user/forgetDealPwdVild',data,res => {
            console.log('user/checkSmsCode',res)
            this.loading.hide();
            if(res.code){
                this.setState({
                    showError: res.info
                })
            }else if(res.success){
                this.props.navigation.navigate('ResetPhoneSubmit',{phone: this.state.phone,backKey: this.props.navigation.state.params.backKey})
            }
        },error => {
            this.loading.show('netFail','网络超时',2000)
        },null,this)
};
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard()}}style={phoneCertifyPageStyle.container}>
                <MineHeader title="验证原手机号码" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={phoneCertifyPageStyle.contentBox}>
                    <View style={phoneCertifyPageStyle.contentSubBox}>
                        <View style={phoneCertifyPageStyle.remindTitleBox}>
                            <Text allowFontScaling={false} style={phoneCertifyPageStyle.remindTitle}>{'短信验证码已发送至' + this.state.phone.replace(/(\d{3})\d{4}(\d{4})/,"$1****$2") + '的手机请注意查收'}</Text>
                        </View>

                        <View style={phoneCertifyPageStyle.userNameBox}>
                            <View style={phoneCertifyPageStyle.labelImgBox}>
                                <Image style={phoneCertifyPageStyle.labelImg} source={require('./../../../imgs/mine/smgImg.png')}/>
                            </View>
                            <TextInput style={[phoneCertifyPageStyle.smsCodeInput,{width: Util.isIOS ? Util.size.width - 160 : Util.size.width - 200}]}
                                       placeholder="请输入短信验证码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'smsCode')}
                                       maxLength={6}
                                       placeholderTextColor="#C5C5C5"
                                       clearButtonMode="while-editing"
                                       value={this.state.formData.smsCode}
                                       onFocus={() => {this.setState({activeInput:'smsCode'})}}/>
                            {
                                !Util.isIOS ?
                                    <View style={{width: 40 * Util.pixel,alignItems:'center'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'smsCode'?  <CloseButton onPress={() => {Util.setFormData(this,'smsCode',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }
                            <VLine color="#025FCB" height={15} width={2}/>
                            <View style={phoneCertifyPageStyle.smsCodeBox}>
                                <TouchableOpacity activeOpacity={0.7}style={[phoneCertifyPageStyle.getSmsButton]} onPress={this.getSmsCode.bind(this)}>
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.getSmsButtonTitle}>{
                                        this.state.getSmsCodeTitle
                                    }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={phoneCertifyPageStyle.errorRemindTitleBox}>
                        <Text allowFontScaling={false} style={phoneCertifyPageStyle.errorRemindTitle}>{this.state.showError}</Text>
                    </View>
                    
                    <View style={phoneCertifyPageStyle.submitButtonBox}>
                        <Button buttonName="下一步" onPress={this.checkFormData.bind(this)}/>
                    </View>

                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </TouchableOpacity>
        );
    }
}