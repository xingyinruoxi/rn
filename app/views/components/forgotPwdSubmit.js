/**
 * Created by liuzhenli on 2017/8/25.
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
import {forgotPwdPageStyles} from './../../styles/common/fotgotPwdStyle';
import Fetch from './../../commons/fetch';
import Header from './../components/commonHeader';
import Line from './../../commons/line';
import VLine from './../../commons/vLine';
import Loading from './../components/loading';
import Button from './../components/button';
import EAlert from './../components/ealert';
import Util,{ Grow } from './../../commons/util';
var dismissKeyboard = require('dismissKeyboard')
import CloseButton from './../components/closeButton';
export default class ForGotPwdSubmit extends Component {
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
                smsCode: ''
            },
            getSmsCodeTitle: '发送验证码',
            getSmsCodeStatus: 1,
            disable: true,
            haveGetMsg: false
        }
    };
    componentDidMount(){
        this.getSmsCode();
    }
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
            formData.smsCode.replace(/\s+/,"").length > 0 ?
                this.checkMobileCode()
                :
                this.eAlert.show('alert','请输入验证码')
    };
    checkMobileCode(){
        let data = {
            mobileNo: this.props.navigation.state.params.phone,
            code: this.state.formData.smsCode
        }
        Fetch.post('user/checkSmsCode',data,res => {
            console.log('res',res)
            if(res.success){
                this.props.navigation.navigate('setNewTradPwd',{phone: this.props.navigation.state.params.phone,type:'loginPwd',backKey: this.props.navigation.state.params.backKey})
            }else{
                this.setState({
                    showError: res.info
                })
            }
        },error => {

        },null,this)
    };
    getSmsCode(){
        if(this.state.getSmsCodeStatus){
            this.setState({
                getSmsCodeStatus: 0
            });
            let data = {
                messageType: '1',
                useMobile: this.props.navigation.state.params.phone,
                identify: this.props.navigation.state.params.verifyCode,
                uuid: this.props.navigation.state.params.uuid,
            };
            this.loading.show()
            Fetch.post('user/sendMessageIdentify',data,(res) => {
                this.loading.hide()
                if(res.success){
                    clearInterval( this.interValID);
                    this.interValID = Util.timer(this,60);
                    this.setState({
                        haveGetMsg: true,
                        showError:`短信验证码已发送至${this.props.navigation.state.params.phone.replace(/(\d{3})\d+(\d{4})/,'$1****$2')}的手机`
                    })
                }else{
                    this.setState({
                        showError:res.info,
                        getSmsCodeStatus: 1
                    })
                }
            },(error) => {
                this.setState({
                    getSmsCodeStatus: 1
                });
                this.loading.show('netFail',"网络超时",2000)
            },20 * 1000);

        }
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

                    <Header leftButton leftIcon title="找回密码"  goBack navigation={this.props.navigation}/>
                    <View style={forgotPwdPageStyles.inputBox}>
                        <View style={[forgotPwdPageStyles.userNameBox,]}>
                            <View style={forgotPwdPageStyles.labelImgBox}>
                                <Image style={[forgotPwdPageStyles.labelImg,]} source={require('./../../imgs/mine/phoneImg.png')}/>
                            </View>
                            <TextInput style={forgotPwdPageStyles.input}
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
                            <VLine height={20} width={2} color="#025FCB"/>
                            <View style={forgotPwdPageStyles.smsCodeBox}>
                                <TouchableOpacity activeOpacity={0.7} onPress={this.getSmsCode.bind(this)}style={[forgotPwdPageStyles.getSmsButton]} >
                                    <Text allowFontScaling={false} style={forgotPwdPageStyles.getSmsButtonTitle}>{
                                        this.state.getSmsCodeTitle
                                    }</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                        <Line notFull={true}/>
                        <View style={forgotPwdPageStyles.showErrorBox}>
                                <Text allowFontScaling={false} style={forgotPwdPageStyles.showErrorTitle}>{this.state.showError}</Text>
                        </View>

                    </View>
                    <View style={forgotPwdPageStyles.buttonBox}>
                        <Button buttonName="下一步" onPress={this.checkFormData} />
                    </View>
                    <Loading ref={(ref) => this.loading = ref}/>
                    <EAlert ref={(ref) => this.eAlert = ref}/>
                </View>
            </TouchableOpacity>
        );
    }
};