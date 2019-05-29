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
import HeaderLeftButton from './../components/headerLeftButton';
import {findPwdPageStyles} from './../../styles/common/findPwdStyle';
import Fetch from './../../commons/fetch';
import Header from './../components/commonHeader';
import Line from './../../commons/line';
import Loading from './../components/loading';
import Button from './../components/button';
import EAlert from './../components/ealert';
import Util,{ Grow } from './../../commons/util';
var dismissKeyboard = require('dismissKeyboard')
export default class ForGotPwd extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.interValID = null;
        this.state = {
            verifyCode: null,
            formData:{
                newPwd:'',
                reNewPwd: '',
            },
        }
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
                formData.newPwd.trim().length == 0 ?
                    this.eAlert.show('','请输6-16位新密码')
                    :
                    formData.reNewPwd.trim().length == 0 ?
                        formData.reNewPwd.trim() ==  formData.newPwd.trim() ?
                            this.eAlert.show('','两次密码输入不一致')
                            :
                        this.eAlert.show('','请再次输入新密码')
                        :
                    this.checkMobileCode()
    };
    checkMobileCode = () => {
        let data =  {
                mobileNo:this.props.navigation.state.params.phone,
                newLoginPwd: this.state.formData.newPwd,
                secLoginPwd: this.state.formData.reNewPwd,
                uCode:this.props.navigation.state.params.uCode
        };
        this.loading.show();
        Fetch.post('user/forgetPwdWithoutRsa',data,(res) => {
						console.log('forgetPwdWithoutRsa----------',res)
            this.loading.hide();
            if(res.success){
                if(res.code == '000'){
                    this.props.navigation.navigate('ResetPhoneResult',{type:'resetLoginPwd',backKey: this.props.navigation.state.params.backKey,status: 'success'})

                }else{
                    this.props.navigation.navigate('ResetPhoneResult',{type:'resetLoginPwd',backKey: this.props.navigation.state.params.backKey,status: 'fail'})
                }
            }else{
                this.loading.show('netFail',"网络超时",2000)
            }
        },(error) => {

        },20 * 1000)
    };
    render() {
        console.log(this.props.navigation.state)
        return (
            <TouchableOpacity style={{flex: 1}}activeOpacity={1} onPress={() => {dismissKeyboard()}}>
                <View style={findPwdPageStyles.container}>
                    {
                        Util.isIOS ?
                            <StatusBar barStyle="light-content"/>
                            :null
                    }
                    
                    <Header leftButton leftIcon title="设置新密码"  goBack root={this} navigation={this.props.navigation}/>
                    <View style={findPwdPageStyles.inputBox}>
                        <View style={findPwdPageStyles.userNameBox}>
                            <View style={findPwdPageStyles.labelImgBox}>
                                <Image style={findPwdPageStyles.labelImg} source={require('./../../imgs/mine/head.png')}/>
                            </View>
                            <TextInput style={findPwdPageStyles.input}
                                       placeholder="请输入6-16位数字，字母组合新登录密码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'newPwd')}
                                       maxLength={11}
                                       secureTextEntry={true}
                                       placeholderTextColor="#C5C5C5"
                                       clearButtonMode="while-editing"
                                       password={true}/>

                        </View>
                        <Line/>
                        <View style={findPwdPageStyles.userNameBox}>
                            <View style={findPwdPageStyles.labelImgBox}>
                                <Image style={findPwdPageStyles.labelImg} source={require('./../../imgs/mine/head.png')}/>
                            </View>
                            <TextInput style={findPwdPageStyles.input}
                                       placeholder="请再次输入您的新密码"
                                       underlineColorAndroid="transparent"
                                       onChangeText={Util.setFormData.bind(this,this,'reNewPwd')}
                                       maxLength={11}
                                       secureTextEntry={true}
                                       placeholderTextColor="#C5C5C5"
                                       clearButtonMode="while-editing"
                                       password={true}/>

                        </View>
                    </View>
                    <Line notFull={true}/>
                    <View style={findPwdPageStyles.buttonBox}>
                        <Button buttonName="提交" onPress={this.checkFormData} />
                    </View>
                </View>

                <Loading ref={(ref) => this.loading = ref}/>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </TouchableOpacity>
        );
    }
};