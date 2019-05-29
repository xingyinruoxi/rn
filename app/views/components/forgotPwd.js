/**
 * Created by liuzhenli on 2017/7/6.
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
import HeaderLeftButton from './../components/headerLeftButton';
import Devices from 'react-native-device-info';
import {forgotPwdPageStyles} from './../../styles/common/fotgotPwdStyle';
import Fetch from './../../commons/fetch';
import Header from './../components/commonHeader';
import Line from './../../commons/line';
import Loading from './../components/loading';
import Button from './../components/button';
import EAlert from './../components/ealert';
import Util,{ Grow } from './../../commons/util';
var dismissKeyboard = require('dismissKeyboard')
import CloseButton from './../components/closeButton';
export default class ForGotPwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    constructor(props){
        super(props);
        this.interValID = null;
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
            disable: true
        }
    };
    componentWillMount(){
        global.forbidTransition = false;
        Util.getVerifyCode(this,Fetch);
    };
    componentWillUnmount(){
        clearInterval( this.interValID);

    };
    setFormData = (arg,val) =>{
        let formData = this.state.formData;
        formData[arg]  = val;
        this.setState({
            formData: formData
        });
    };
    checkFormData = () =>{
        let formData = this.state.formData;
        let phoneReg = /^((13[0-9])|(14[5,6,7,8])|(15[^4,\D])|(166)|(17[^29,\D])|(18[0-9])|(19[8,9]))\d{8}$/;
        phoneReg.test(formData.phone) ?
            formData.identify.replace(/\s+/,"").length > 0 ?
                this.getSmsCode()
                :
                this.eAlert.show('alert','请输入图片验证码')
            :

            this.eAlert.show('alert','请输入手机号')
    };
    getSmsCode(){
        let data = {
            checkType: '1',
            useMobile: this.state.formData.phone,
            validateCode: this.state.formData.identify,
            uuid: this.state.uuid,
        };
        this.loading.show()
        Fetch.post('user/userinfoCheck',data,(res) => {
            this.loading.hide()
            if(res.success){
                this.props.navigation.navigate('forGotPwdSubmit',{phone: this.state.formData.phone,backKey: this.props.navigation.state.key,uuid: this.state.uuid,verifyCode:this.state.formData.identify})
            }else{
                this.eAlert.show('alert',res.info,() => {
                    Util.getVerifyCode(this,Fetch)
                })
            }
        },(error) => {
            this.loading.show('netFail',"网络超时",2000)
        },20 * 1000,);
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
                
                <Header leftButton leftIcon title="找回密码"  leftTitle="取消" goBack navigation={this.props.navigation}/>
                <View style={forgotPwdPageStyles.topRemindBox}>
                    <Text allowFontScaling={false} style={forgotPwdPageStyles.topRemind}>若忘记手机号或没有通过手机号注册请去电脑端找回。</Text>
                </View>
                <View style={forgotPwdPageStyles.inputBox}>
                    <View style={[forgotPwdPageStyles.userNameBox,{paddingRight: 14 * Util.pixel}]}>
                        <View style={forgotPwdPageStyles.labelImgBox}>
                            <Image style={[forgotPwdPageStyles.labelImg,]} source={require('./../../imgs/mine/phoneImg.png')}/>
                        </View>
                        <TextInput style={forgotPwdPageStyles.input}
                                   placeholder="请输入注册的手机号码"
                                   underlineColorAndroid="transparent"
                                   onChangeText={Util.setFormData.bind(this,this,'phone')}
                                   maxLength={11}
                                   placeholderTextColor="#C5C5C5"
                                   clearButtonMode="while-editing"
                                   keyboardType="phone-pad"
                                   value={this.state.formData.phone}
                                   onFocus={() => {this.setState({activeInput:'phone'})}}/>
                        {
                            !Util.isIOS ?
                                <View style={{width: 80 * Util.pixel,alignItems:'center'}}>
                                    {
                                        !Util.isIOS && this.state.activeInput == 'phone'?  <CloseButton onPress={() => {Util.setFormData(this,'phone',"")}}/> : null
                                    }
                                </View>
                                :
                                null
                        }

                    </View>
                    <Line notFull={true}/>

                    <View style={forgotPwdPageStyles.userNameBox}>
                        <View style={forgotPwdPageStyles.labelImgBox}>
                            <Image style={forgotPwdPageStyles.labelImg} source={require('./../../imgs/mine/bianqian.png')}/>
                        </View>
                        <TextInput style={forgotPwdPageStyles.verifyCodeInput}
                                   placeholder="请输入图片验证码"
                                   underlineColorAndroid="transparent"
                                   onChangeText={Util.setFormData.bind(this,this,'identify')}
                                   maxLength={4}
                                   placeholderTextColor="#C5C5C5"
                                   clearButtonMode="while-editing"
                                   value={this.state.formData.identify}
                                   onFocus={() => {this.setState({activeInput:'identify'})}}/>
                        {
                            !Util.isIOS ?
                                <View style={{width: 40 * Util.pixel,alignItems:'center'}}>
                                    {
                                        !Util.isIOS && this.state.activeInput == 'identify'?  <CloseButton onPress={() => {Util.setFormData(this,'identify',"")}}/> : null
                                    }
                                </View>
                                :
                                null
                        }

                        <View style={forgotPwdPageStyles.verifyCodeBox}>
                            {
                                this.state.verifyCode ?
                                    <TouchableOpacity activeOpacity={0.7} onPress={Util.getVerifyCode.bind(this,this,Fetch)}>
                                        {
                                            this.state.netFailed ?
                                                <Image source={require('./../../imgs/mine/reLoad.png')}/>
                                                :
                                                <Image style={forgotPwdPageStyles.verifyCode} source={{uri: 'data:image/png;base64,'+this.state.verifyCode}}/>
                                        }
                                    </TouchableOpacity>
                                    : <ActivityIndicator size="small"/>
                            }
                        </View>
                    </View>
                    <Line notFull={true}/>

                </View>
                <View style={forgotPwdPageStyles.buttonBox}>
                    <Button buttonName="下一步" onPress={this.checkFormData.bind(this)} />
                </View>
                <Loading ref={(ref) => this.loading = ref}/>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
            </TouchableOpacity>
        );
    }
};
