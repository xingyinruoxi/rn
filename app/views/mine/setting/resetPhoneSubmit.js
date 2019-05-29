/**
 * Created by liuzhenli on 2017/7/25.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Linking
} from 'react-native';
import HeaderLeftButton from './../../components/headerLeftButton';
import {forgotPwdPageStyles} from './../../../styles/common/fotgotPwdStyle';
import Fetch from './../../../commons/fetch';
import Header from './../../components/commonHeader';
import Line from './../../../commons/line';
import VLine from './../../../commons/vLine';
import Loading from './../../components/loading';
import Button from './../../components/button';
import EAlert from './../../components/ealert';
import Util,{ Grow } from './../../../commons/util';
var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
var dismissKeyboard = require('dismissKeyboard');
import CloseButton from './../../components/closeButton';
export default class ResetPhoneSubmit extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    constructor(props){
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            verifyCode: null,
            uuid: '',
            formData:{
                identify:'',
                phone: '',
                smsCode: ''
            },
            getSmsCodeTitle: '发送验证码',
            getSmsCodeStatus: 1,
            disable: true,
            userInfo: null,
            showError: null,
            phone: this.props.navigation.state.params.phone
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
        });
    };
    componentWillUnmount(){
        clearInterval(this.interValID);
    };
    setFormData = (arg,val) =>{
        let formData = this.state.formData;
        formData[arg]  = val;
        this.setState({
            formData: formData
        });
    };
    checkPhone(){
        let phone = this.state.formData.phone;
        let phoneReg = /^((13[0-9])|(14[5,6,7,8])|(15[^4,\D])|(166)|(17[^29,\D])|(18[0-9])|(19[8,9]))\d{8}$/;
            phoneReg.test(phone) ?
                this.getSmsCode()
                :
                this.eAlert.show('alert','请输入正确的手机号')
    };
    checkFormData = () =>{
        let formData = this.state.formData;
        let phone = this.state.formData.phone;
        let phoneReg = /^((13[0-9])|(14[5,6,7,8])|(15[^4,\D])|(166)|(17[^29,\D])|(18[0-9])|(19[8,9]))\d{8}$/;
        phoneReg.test(phone) ?
            formData.smsCode.replace(/\s+/,"").length > 0 ?
                this.resetPhone()
                :
                this.eAlert.show('alert','请输入短信验证码')
            :
            this.eAlert.show('alert','请输入手机号')

    };
    getSmsCode(){
        if(this.state.getSmsCodeStatus){
            this.setState({
                getSmsCodeStatus: 0
            });
            let data = {
                messageType:"3",
                useMobile: this.state.formData.phone,
            };
            Fetch.post('user/sendMessageIdentify',data,(res) => {
                console.log('mobileCode',res)
                if(res.success){
                    this.setState({
                        showError: '短信验证码已发送，请注意查收'
                    });
                    clearInterval(this.interValID);
                    this.interValID =  Util.timer(this);
                }else{
                    this.setState({
                        getSmsCodeStatus: 1
                    });
                    this.eAlert.show('alert',res.info);
                }
            },(error) => {
                this.setState({
                    getSmsCodeStatus: 1
                });
				this.loading && this.loading.show('netFail','网络超时',2000)
            },null,this);

        }
    };
    resetPhone(){
        let data =  {
            sessionId: __sessionId,
            useId: __useId,
            identify: this.state.formData.smsCode,
            useMobile: this.state.formData.phone,
            authType: "2",
            oldMobile: this.state.phone
        };
        this.loading.show();
        Fetch.post('user/authMobileNo',data,(res) => {
            console.log('authMobileNo',res)
            this.loading.hide();
            if(res.success){
                if(res.body.autId){
                    
                    this.props.navigation.navigate('ResetPhoneResult',{status:'success',type:'resetPhone',backKey: this.props.navigation.state.params.backKey})
                }else{
                    this.props.navigation.navigate('ResetPhoneResult',{status:'fail',type:'resetPhone',backKey: this.props.navigation.state.params.backKey})
                }
            }else{
                this.eAlert.show('alert',res.info)
            }
        },(error) => {
			this.loading && this.loading.show('netFail','网络超时',2000)
        },30 * 1000,this)
    };
    render() {
        return (
            <TouchableOpacity style={{flex: 1}}activeOpacity={1} onPress={() => {dismissKeyboard()}}>
                <View style={forgotPwdPageStyles.container}>
                    {
                        Util.isIOS ?
                            <StatusBar barStyle="light-content"/>
                            :
                            null
                    }

                    <Header leftButton leftIcon title="绑定新手机"  goBack navigation={this.props.navigation}/>
                    <View style={forgotPwdPageStyles.inputBox}>
                        <View style={forgotPwdPageStyles.userNameBox}>
                            <View style={[forgotPwdPageStyles.labelImgBox,]}>
                                <Image  source={require('./../../../imgs/mine/phoneImg.png')}/>
                            </View>
                            <TextInput style={forgotPwdPageStyles.input}
                                       placeholder="请输入新绑定的手机号码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'phone')}
                                       maxLength={11}
                                       keyboardType="numeric"
                                       placeholderTextColor="#C5C5C5"
                                       clearButtonMode="while-editing"
                                       value={this.state.formData.phone}
                                       onFocus={() => {this.setState({activeInput:'phone'})}}/>
                            {
                                !Util.isIOS ?
                                    <View style={{width: 70 * Util.pixel,alignItems:'center'}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'phone'?  <CloseButton onPress={() => {this.setFormData('phone',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }

                        </View>
                        <Line notFull={true}/>
                        <View style={forgotPwdPageStyles.userNameBox}>
                            <View style={forgotPwdPageStyles.labelImgBox}>
                                <Image style={forgotPwdPageStyles.labelImg} source={require('./../../../imgs/mine/smgImg.png')}/>
                            </View>
                            <TextInput style={[forgotPwdPageStyles.smsCodeInput]}
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
                                    <View style={{width: 60 * Util.pixel}}>
                                        {
                                            !Util.isIOS && this.state.activeInput == 'smsCode'?  <CloseButton onPress={() => {this.setFormData('smsCode',"")}}/> : null
                                        }
                                    </View>
                                    :
                                    null
                            }

                            <View style={forgotPwdPageStyles.smsCodeBox}>
                                <VLine height={20} color="#025FCB" width={2}/>
                                <TouchableOpacity activeOpacity={0.7}style={[forgotPwdPageStyles.getSmsButton]} onPress={this.checkPhone.bind(this)}>
                                    <Text allowFontScaling={false} style={forgotPwdPageStyles.getSmsButtonTitle}>{
                                        this.state.getSmsCodeTitle
                                    }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Line notFull={true}/>

                    </View>
                    <View style={forgotPwdPageStyles.errorRemindTitleBox}>
                        <Text allowFontScaling={false} style={forgotPwdPageStyles.errorRemindTitle}>{this.state.showError}</Text>
                    </View>
                    <View style={forgotPwdPageStyles.buttonBox}>
                        <Button buttonName="确认绑定" onPress={this.checkFormData} />
                    </View>
                    <Loading ref={(ref) => this.loading = ref}/>
                    <EAlert ref={(ref) => this.eAlert = ref}/>
                </View>
            </TouchableOpacity>
        );
    }
};