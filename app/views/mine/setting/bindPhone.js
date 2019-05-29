/**
 * Created by liuzhenli on 2017/12/14.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Header from './../../components/commonHeader';
import {bindPhoneStyle} from './../../../styles/mine/setting/bindPhoneStyle';
import Line from './../../../commons/line';
import Util from './../../../commons/util';
import Fetch from './../../../commons/fetch';
import Button from './../../components/button';
import VLine from './../../../commons/vLine';
import Loading from './../../components/loading';
import EAlert from './../../components/ealert';
var EventEmitter = require('RCTDeviceEventEmitter');
let dismissKeyboard = require('dismissKeyboard');
export default class BindPhone extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      verifyCode: null,
      uuid: null,
      getSmsCodeTitle: '获取验证码',
      getSmsCodeStatus: 1,
      reminderTitle: null,
      formData: {
        phone: null,
        identify: '',
        smsCode: ''
      },
      warning: false
    }
    this.getSmsCode = this.getSmsCode.bind(this)
  }
  componentDidMount() {
    Util.getVerifyCode(this,Fetch);
  }
  setFormData(arg, val) {
    let formData = this.state.formData;
    formData[arg] = val.replace(/\s/,'');
    this.setState({
      formData: formData,
      warning: false
    })
  }
  checkForm(submitCheck) {
    let formData = this.state.formData;
    let phoneReg = /^((13[0-9])|(14[5,6,7,8])|(15[^4,\D])|(166)|(17[^29,\D])|(18[0-9])|(19[8,9]))\d{8}$/
    if(!phoneReg.test(formData.phone)){
      this.eAlert.show('alert','请输入正确的手机号');
      return
    }
    if(formData.identify.length < 4){
      this.eAlert.show('alert','请输入正确的图片验证码');
      return
    }
    if(!submitCheck) {
      this.getSmsCode();
      return
    }
    if(!formData.smsCode.length){
      this.eAlert.show('alert','请输入正确的短信验证码');
      return
    }
    this.submit();
  }
  getSmsCode(flag) {
    if(this.state.getSmsCodeStatus){
      this.setState({
        getSmsCodeStatus: 0,
      });
      let data = {
        useMobile: this.state.formData.phone,
        messageType: '0',
        uuid: this.state.uuid,
        identify: this.state.formData.identify
      }
      this.loading.show();
      Fetch.post('user/sendMessageIdentify',data,(res) => {
        this.loading.hide();
        if(res.success){
          this.setState({
            reminderTitle: '短信验证码已发送，请注意查收'
          })
          clearInterval(this.interValID);
          this.interValID = Util.timer(this,60);
        }else{
          Util.getVerifyCode(this,Fetch)
          this.setState({
            getSmsCodeStatus: 1,
            reminderTitle: res.info,
            warning: true
          });
        }
      },(error) => {
        Util.getVerifyCode(this,Fetch)
        this.setState({
          getSmsCodeStatus: 1
        });
        this.loading.show('netFail','网络超时',2000);
      },20 * 1000,this);
    }
  }
  componentWillUnmount(){
    clearInterval(this.interValID);
  }
  getVerifyCode() {

  }
  submit() {
    let data = {
      useMobile: this.state.formData.phone,
      identify: this.state.formData.smsCode,
      useId: __useId,
      authType: '1',
      sessionId: __sessionId,
    };
    this.loading.show();
    Fetch.post('user/authMobileNo',data, (res) => {
      this.loading.hide();
      if(res.success){
        if(res.body.autId){
          this.props.navigation.navigate('bindPhoneResult',{status:'success',backKey: this.props.navigation.state.key});
          EventEmitter.emit('getStatus');
        }else{
          this.eAlert.show('alert','绑定失败')
        }
      } else{
        this.eAlert.show('alert',res.info)
      }
    }, () => {

    })
  }
  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => dismissKeyboard()}style={bindPhoneStyle.container}>
        <Header title="绑定手机号" leftButton leftIcon goBack navigation={this.props.navigation}/>
        <View style={bindPhoneStyle.contentBox}>
          <View style={bindPhoneStyle.topReminderBox}>
            <Text  style={bindPhoneStyle.topReminderText}>手机号将成为您交易过程中的重要凭证</Text>
          </View>
          <View style={bindPhoneStyle.itemBox}>
            <View style={bindPhoneStyle.itemBoxLeft}>
              <Image source={require('./../../../imgs/mine/bindPhone/b_phone.png')}/>
            </View>
            <View style={bindPhoneStyle.itemBoxCenter}>
              <View style={bindPhoneStyle.inputBox}>
                <TextInput style={bindPhoneStyle.input}
                           placeholder="请输入新绑定的手机号"
                           clearButtonMode="while-editing"
                           maxLength={11}
                           onChangeText={this.setFormData.bind(this,'phone')}/>
              </View>
            </View>
          </View>
          <Line/>
          <View style={bindPhoneStyle.itemBox}>
            <View style={bindPhoneStyle.itemBoxLeft}>
              <Image source={require('./../../../imgs/mine/bindPhone/b_img.png')}/>
            </View>
            <View style={bindPhoneStyle.itemBoxCenter}>
              <View style={bindPhoneStyle.inputBox}>
                <TextInput style={bindPhoneStyle.input}
                           placeholder="请输入图片验证码"
                           clearButtonMode="while-editing"
                           maxLength={4}
                           onChangeText={this.setFormData.bind(this,'identify')}/>
              </View>
            </View>
            <View style={bindPhoneStyle.itemBoxRight}>
              <TouchableOpacity onPress={() => Util.getVerifyCode(this,Fetch)}style={bindPhoneStyle.verifyCodeBox}>
                {
                  this.state.verifyCode ?
                    <Image style={bindPhoneStyle.verifyCodeImg}source={{uri:'data:image/png;base64,' + this.state.verifyCode}}/>
                    :
                    <ActivityIndicator size="small"/>
                }
              </TouchableOpacity>
            </View>
          </View>
          <Line/>
          <View style={bindPhoneStyle.itemBox}>
            <View style={bindPhoneStyle.itemBoxLeft}>
              <Image source={require('./../../../imgs/mine/bindPhone/b_sms.png')}/>
            </View>
            <View style={bindPhoneStyle.itemBoxCenter}>
              <View style={bindPhoneStyle.inputBox}>
                <TextInput style={bindPhoneStyle.input}
                           placeholder="请输入短信验证码"
                           clearButtonMode="while-editing"
                           maxLength={646}
                           onChangeText={this.setFormData.bind(this,'smsCode')}/>
              </View>
            </View>
            <View style={bindPhoneStyle.itemBoxRight}>
              <View style={bindPhoneStyle.itemBoxRightButtonBox}>
                <VLine color="#025FCB" width={2}/>
                <TouchableOpacity activeOpacity={0.75} onPress={() =>this.checkForm()}style={bindPhoneStyle.itemBoxRightButton}>
                  <Text style={bindPhoneStyle.itemBoxRightButtonName}>{this.state.getSmsCodeTitle}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Line/>
          <View style={bindPhoneStyle.bottomReminderBox}>
            <Text  style={[bindPhoneStyle.bottomReminder,this.state.warning && {color: 'red'}]}>{this.state.reminderTitle}</Text>
          </View>
          <View style={bindPhoneStyle.buttonBox}>

          </View>
          <Button buttonName="确认绑定" onPress={()=> this.checkForm(true)}/>
        </View>
        <Loading ref={loading => this.loading = loading}/>
        <EAlert ref={alert => this.eAlert = alert}/>
      </TouchableOpacity>
    )
  }
}