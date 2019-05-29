/**
 * Created by liuzhenli on 2017/8/28.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import {resetTradePwdPageStyle} from './../../../styles/mine/setting/resetTradePwdStyle';

var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
import Util, {Grow} from './../../../commons/util';

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
export default class ResetTradePwd extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });

    constructor(props) {
        super(props);
        this.interValID = null;
        this.state = {
            getSmsCodeTitle: '发送短信验证码',
            getSmsCodeStatus: 1,
            userInfo: this.props.navigation.state.params.userInfo,
            verifyCode: null,
            uuid: '',
            haveGotSmsCode: false,
            formData: {
                smsCode: '',
            },
            showError: false,
            errorTitle: ''
        }
        console.log('this.state.userInof', this.state.userInfo)
    };

    componentDidMount() {
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo.sftUserMdl
            });
            setTimeout(() => {
                this.getSmsCode()
            })
        });

    };

    componentWillUnmount() {
        clearInterval(this.InterValID)
    }

    getSmsCode() {
        if (this.state.getSmsCodeStatus) {
            this.setState({
                getSmsCodeStatus: 0
            });
            let data = {
                useMobile: this.state.userInfo.useMobilePhones,
                messageType: '2',
                sessionId: __sessionId,
                useLoginName: this.state.userInfo.useLoginName
            };
            this.loading && this.loading.show();
            Fetch.post('user/sendMessageIdentify', data, (res) => {
                this.loading.hide();
                console.log('sendMessageIdentify', res)
                if (res.success) {
                    this.setState({
                        haveGotSmsCode: true
                    });
                    clearInterval(this.InterValID)
                    this.InterValID = Util.timer(this);
                } else {
                    this.setState({
                        getSmsCodeStatus: 1
                    });
                    this.eAlert.show('alert', res.info);
                }
            }, (error) => {
                this.setState({
                    getSmsCodeStatus: 1
                });
                this.loading && this.loading.show('netFail', '网络超时', 2000)
            }, null, this);

        }
    };

    checkFormData = () => {
        let formData = this.state.formData;
        formData.smsCode.replace(/\s+/, '').length > 0 ?
            this.submitData()
            :
            this.eAlert.show('alert', '请输入验证码')

    };

    submitData() {
        let data = {
            sessionId: __sessionId,
            useId: this.state.userInfo.useId,
            mobileNo: this.state.userInfo.useMobilePhones,
            identify: this.state.formData.smsCode
        };
        this.loading && this.loading.show();
        console.log('data', data);
        Fetch.post('user/forgetDealPwdVild', data, res => {
            console.log('user/checkSmsCode', res)
            this.loading.hide();
            if (res.code) {
                this.eAlert.show('alert', res.info)
            } else if (res.success) {
                this.props.navigation.navigate('setNewTradPwd', {
                    backKey: this.props.navigation.state.params.backKey || this.props.navigation.state.key,
                    userInfo: this.state.userInfo,
                    identify: this.state.formData.smsCode
                })
            }
        }, error => {
            this.loading && this.loading.show('netFail', '网络超时', 2000)
        }, null, this)
    };

    render() {
        let userInfo = this.state.userInfo;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
                dismissKeyboard();
                this.setState({activeInput: ''})
            }} style={resetTradePwdPageStyle.container}>
                <MineHeader title="修改交易密码" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={resetTradePwdPageStyle.contentBox}>
                    <View style={resetTradePwdPageStyle.userNameBox}>
                        <View style={resetTradePwdPageStyle.labelImgBox}>
                            <Image style={resetTradePwdPageStyle.labelImg}
                                   source={require('./../../../imgs/mine/lock.png')}/>
                            <Text allowFontScaling={false} style={resetTradePwdPageStyle.labelText}>已认证的手机</Text>
                        </View>
                        <Text allowFontScaling={false}
                              style={resetTradePwdPageStyle.labelText}>{userInfo && userInfo.useMobilePhones ? userInfo.useMobilePhones.replace(/(\d{3})\d+(\d{4})/, '$1****$2') : "--"}</Text>
                    </View>
                    <Line/>
                    <View style={resetTradePwdPageStyle.userNameBox}>
                        <View style={resetTradePwdPageStyle.labelImgBox}>
                            <Image style={resetTradePwdPageStyle.labelImg}
                                   source={require('./../../../imgs/mine/lock.png')}/>
                        </View>
                        <TextInput style={resetTradePwdPageStyle.cardIDCodeInput}
                                   placeholder="请输入短信验证码"
                                   underlineColorAndroid="transparent"
                                   onChangeText={Util.setFormData.bind(this, this, 'smsCode')}
                                   placeholderTextColor="#888889"
                                   clearButtonMode="while-editing"
                                   maxLength={6}
                                   keyboardType="email-address"
                                   value={this.state.formData.smsCode}
                                   onFocus={() => {
                                       this.setState({activeInput: 'smsCode'})
                                   }}
                        />

                        {
                            !Util.isIOS ?
                                <View style={{width: 30 * Util.pixel}}>
                                    {
                                        !Util.isIOS && this.state.activeInput == 'smsCode' ?
                                            <CloseButton onPress={() => {
                                                Util.setFormData(this, 'smsCode', "")
                                            }}/> : null
                                    }
                                </View>
                                :
                                null
                        }
                        <VLine height={20} width={2} color="#025FCB"/>
                        <View style={resetTradePwdPageStyle.verifyCodeBox}>
                            <TouchableOpacity activeOpacity={0.7} style={[resetTradePwdPageStyle.getSmsButton]}
                                              onPress={this.getSmsCode.bind(this)}>
                                <Text allowFontScaling={false} style={resetTradePwdPageStyle.getSmsButtonTitle}>{
                                    this.state.getSmsCodeTitle
                                }</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <Line/>
                    <View style={resetTradePwdPageStyle.remindBox}>
                        {
                            userInfo ?
                                <Text allowFontScaling={false}
                                      style={resetTradePwdPageStyle.remindText}>验证码已发送至手机{userInfo.useMobilePhones.replace(/(\d{3})\d+(\d{4})/, '$1****$2')}</Text>
                                :
                                null
                        }

                    </View>
                    <View style={resetTradePwdPageStyle.submitButtonBox}>
                        <Button buttonName="下一步" onPress={this.checkFormData}/>
                    </View>
                    <View style={resetTradePwdPageStyle.bottomRemindBox}>
                        {
                            this.state.showError ?
                                <Text allowFontScaling={false}
                                      style={resetTradePwdPageStyle.remindTitle}>{this.state.errorTitle}</Text>
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