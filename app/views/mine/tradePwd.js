/**
 * Created by liuzhenli on 2017/7/24.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    StatusBar,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import {manageAccountPageStyle} from '../../styles/mine/createStockAccountStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import Line from './../../commons/line';
import Loading from './../components/loading';
import Util,{ Grow } from './../../commons/util';
var  Fetch = require('./../../commons/fetch') ;
import Button from './../components/button';
var Gbk = require('./../../commons/gbk');
export default class TradePwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.interValID = null;
        this.state = {
            userInfo: null,
            verifyCode: null,
            getSmsCodeTitle: '获取验证码',
            getSmsCodeStatus: 1,
            formData: {
                phone: '',
                identify: ''
            }
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo,
            });
            Util.setFormData(this,'phone',userInfo.sftUserMdl.useMobile)
        });

    };
    componentWillUnmount(){
        clearInterval(this.interValId);
    };
    componentDidMount(){
        Util.getVerifyCode(this,Fetch);
    };
    checkPhone(){
        let _this = this.props.root;
        let phone = this.state.formData.phone;
        let identify = this.state.formData.identify;
        let phoneReg = /^((13[0-9])|(14[5,6,7,8])|(15[^4,\D])|(166)|(17[^29,\D])|(18[0-9])|(19[8,9]))\d{8}$/;
        phone.trim().length > 0 ?
            phoneReg.test(_this.state.formData.phone) ?
                identify.trim().length > 0 ?
                    this.getSmsCode()
                    :
                    _this.eAlert.show('alert','请输入图形验证码')
                :
                _this.eAlert.show('alert','您输入的手机号码错误，请重新输入')
            :
            _this.eAlert.show('alert','请输入手机号')
    };
    getSmsCode(){
        let _this = this.props.root;
            if(this.state.formData.identify.length > 0 ){
                if(this.state.getSmsCodeStatus){
                    this.setState({
                        getSmsCodeStatus: 0
                    });
                    _this.loading.show();
                    let data = {
                        identify: this.state.formData.identify,
                        bizCode: 'UP',
                        uuid: this.state.uuid,
                        sessionId: __sessionId,
                        useId: this.state.userInfo.sftUserMdl.useId,
                        useMobile: this.state.userInfo.sftUserMdl.useMobile
                    };
                    console.log('data',data);
                    Fetch.post('sms/login/sendUserMobileSms',data,(res) => {
                        console.log('smsCode',res);
                        _this.loading.hide();
                        if(res.success){
                            this.setState({
                                haveGetSms: true,
                                smsCodeInfo: res,
                            });
                            clearInterval(this.interValId);
                            this.interValId = Util.timer(this);
                            _this.eAlert.show('alert','验证短信已发送至手机'+ this.state.userInfo.sftUserMdl.useMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"))
                        }else{
                            this.setState({
                                getSmsCodeStatus: 1
                            });
                            _this.eAlert.show('alert',res.info,Util.getVerifyCode.bind(this,this,Fetch));
                        }
                    },(error) => {
                        this.setState({
                            getSmsCodeStatus: 1
                        });
						this.loading && this.loading.show('netFail','网络超时',2000)
                    },20 * 1000,this);

                }
            }else{

                _this.eAlert.show('alert',"请输入图形验证码");
            }

        

    };
    setTradePwd(){
        let _this = this.props.root;
        let formData = this.state.formData;
        let data = {
            sessionId: __sessionId,
            useId: this.state.userInfo.sftUserMdl.useId,
            identify: formData.smsCode
        };
        console.log('data',data);
        formData.identify.length > 0 ?
            formData.smsCode.length > 0 ?
                Fetch.post('user/hsAccountPassword',data,res =>{
                    console.log('hsAccountPassword',res);
                    if(res.success){
                        let requestString = [];
                        for(let i in res.body.postParm){
                            requestString.push(Gbk.encode(i)+ "=" +  Gbk.encode(res.body.postParm[i]))
                        }
                        this.props.navigation.navigate('webViewWithBridge',{
                            url: res.body.requestUrl,
                            method: 'POST',
                            body:requestString.join('&'),
                            callback: Util.getVerifyCode.bind(this,this,Fetch),
                            data: res.body.postParm,
                            type: 'setTradePwd',
                            title: '交易密码设置',
                            backKey: this.props.navigation.state.key,
                            loadingState: true
                        });
                    }else{
                        _this.eAlert.show('alert',res.info,Util.getVerifyCode.bind(this,this,Fetch));
                    }
                },error => {
					this.loading && this.loading.show('netFail','网络超时',2000)
                },20 * 1000,this)
                :
                _this.eAlert.show('alert','请输入短信验证码')
            :
            _this.eAlert.show('alert','请输入图片验证码')
    };
    render() {
        return (
            <View style={manageAccountPageStyle.container}>
                <View style={manageAccountPageStyle.setPwdInputBox}>
                    <View style={manageAccountPageStyle.inputBox}>
                        <View style={manageAccountPageStyle.userNameBox}>
                            <View style={manageAccountPageStyle.labelImgBox}>
                                <Image style={manageAccountPageStyle.labelImg} source={require('./../../imgs/mine/head.png')}/>
                            </View>
                            <Text allowFontScaling={false} style={manageAccountPageStyle.input}>
                                {
                                    this.state.formData.phone.replace(/(\d{3})\d{4}(\d{4})/,"$1****$2")
                                }
                            </Text>
                        </View>
                        <Line notFull={true}/>

                        <View style={manageAccountPageStyle.userNameBox}>
                            <View style={manageAccountPageStyle.labelImgBox}>
                                <Image style={manageAccountPageStyle.labelImg} source={require('./../../imgs/mine/bianqian.png')}/>
                            </View>
                            <View style={manageAccountPageStyle.verifyCodeInputBox}>
                                <TextInput style={manageAccountPageStyle.verifyCodeInput}
                                           placeholder="请输入验证码"
                                           onChangeText={Util.setFormData.bind(this,this,'identify')}
                                           maxLength={4}
                                           underlineColorAndroid="transparent"
                                           placeholderTextColor="#C5C5C5"
                                           clearButtonMode="while-editing"/>
                            </View>
                            <View style={manageAccountPageStyle.verifyCodeBox}>
                                {
                                    this.state.verifyCode ?
                                        <TouchableOpacity activeOpacity={0.7} onPress={Util.getVerifyCode.bind(this,this,Fetch)}>
                                            {
                                                this.state.netFailed ?
                                                    <Image source={require('./../../imgs/mine/reLoad.png')}/>
                                                    :
                                                    <Image style={manageAccountPageStyle.verifyCode}source={{uri: 'data:image/png;base64,'+this.state.verifyCode}}/>

                                            }

                                        </TouchableOpacity>
                                        : <ActivityIndicator size="small"/>
                                }
                            </View>
                        </View>
                        <Line notFull={true}/>
                        <View style={manageAccountPageStyle.userNameBox}>
                            <View style={manageAccountPageStyle.labelImgBox}>
                                <Image style={manageAccountPageStyle.labelImg} source={require('./../../imgs/mine/bianqian.png')}/>
                            </View>
                            <TextInput style={manageAccountPageStyle.smsCodeInput}
                                       placeholder="请输入短信验证码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'smsCode')}
                                       maxLength={6}
                                       placeholderTextColor="#C5C5C5"
                                       clearButtonMode="while-editing"/>

                            <View style={manageAccountPageStyle.smsCodeBox}>
                                <TouchableOpacity activeOpacity={0.7}style={[manageAccountPageStyle.getSmsButton,this.state.getSmsCodeStatus == 0 ? {backgroundColor:'#989898'} : null]} onPress={this.checkPhone.bind(this)}>
                                    <Text allowFontScaling={false} style={manageAccountPageStyle.getSmsButtonTitle}>{
                                        this.state.getSmsCodeTitle
                                    }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Line notFull={true}/>
                    </View>
                    <View style={manageAccountPageStyle.buttonBox}>
                        <Button buttonName="下一步" onPress={this.setTradePwd.bind(this)} />
                    </View>
                </View>
                <Loading ref={ref => this.loading = ref}/>
            </View>
        );
    }
}