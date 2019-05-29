/**
 * Created by liuzhenli on 2017/7/17.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    StatusBar,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    ActivityIndicator,
    Modal,
    Animated
} from 'react-native';
import {bindBankCard} from './../../../styles/mine/stockAccountStyle';

var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
var Fetch = require('./../../../commons/fetch');
import Util, {Grow} from './../../../commons/util';
import Line from './../../../commons/line';
import VLine from './../../../commons/vLine';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import Button from './../../components/button';
import RightIcon from './../../components/rightIcon';
import MineHeader from '../../components/commonHeader';

var dismissKeyboard = require('dismissKeyboard');
const EventEmitter = require('RCTDeviceEventEmitter');
import SinglePicker from './../../components/picker';

export default class BindBankCard extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.interValID = null;
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false,
            active: 'bank',
            verifyCode: null,
            getSmsCodeTitle: '获取验证码',
            getSmsCodeStatus: 1,
            selected: true,
            banks: [],
            bankCode: '',
            selectedBank: '请选择',
            createAccountSuccess: false,
            setPwdSuccess: false,
            formData: {
                phone: '',
                identify: '',
                bankNum: '',
                smsCode: '',
                useName: '',
                bankName: ''
            },
            userAccountInfo: null,
            activeInput: '',
            province: null,
            countrySide: null,
            pcId: null,
            showModal: false,
            provincesList: null,
            showSureModal: false,
            scale: new Animated.Value(0),
            areaCode: '',
            options: [],
            defaultPickerData: null
        }
    };

    componentWillMount() {
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo,
            });
        });
        Storage.getItem(StorageKey.eTD_CITYARR).then((data) => {
            if (data) {
                this.setState({
                    provincesList: data
                })
            }
        })
    };

    componentDidMount() {
        Grow.track('pg_my_bind_userbrowse', {'pg_my_bind_userbrowse': '绑定银行卡页面浏览用户量'});
        let data = this.props.navigation.state.params && this.props.navigation.state.params.data ? this.props.navigation.state.params.data : null;
        data && data.user && this.setFormData('useName', data.user.useName);
        data && data.user && this.setFormData('phone', data.user.useMobilePhones);
        this.getCountryData();
    };

    componentWillUnmount() {
        clearInterval(this.interValID)
    };

    createPicker(data, type) {
        this.setState({
            options: data,
            type: type,
            showModal: true
        }, () => {
            this.singlePicker.show()
        });

    };

    selectedData(data) {
        let type = this.state.type;
        if (type == 'city') {
            for (let i = 0; i < this.state.provincesList.length; i++) {
                if (this.state.provincesList[i].pcName == data.value) {
                    this.setState({countrySide: this.state.provincesList[i].cityArea[0].pcName})
                }
            }
            this.setState({province: data.value})
        } else {
            this.setState({countrySide: data.value})
        }

    }

    getProvince(type) {
        if (this.state.provincesList) {
            if (!this.state.province) {
                this.setState({
                    province: this.state.provincesList[0].pcName,
                    countrySide: this.state.provincesList[0].cityArea[0].pcName,
                    defaultPickerData: this.state.provincesList[0].cityArea[0].pcName
                })
            }
            let data = [];
            this.state.provincesList.map((item, index) => {
                data.push({key: item.pcName, value: item.pcName})
            });
            setTimeout(() => {
                this.createPicker(data, type)
            }, 100)

        }
    };

    getCountry(type) {

        if (this.state.province) {
            let data = [];
            let countryArr = [];
            for (let i = 0; i < this.state.provincesList.length; i++) {
                if (this.state.provincesList[i].pcName == this.state.province) {
                    countryArr = this.state.provincesList[i].cityArea
                    this.setState({
                        defaultPickerData: this.state.provincesList[i].cityArea[0].pcName
                    })
                }
            }
            countryArr.map((item, index) => {
                data.push({key: item.pcName, value: item.pcName})
            });
            setTimeout(() => {
                this.createPicker(data, type)
            }, 100)
        }
    };

    setFormData(arg, val) {
        let formData = this.state.formData;
        formData[arg] = val;
        this.setState({
            formData: formData
        });
        if (arg == 'bankNum' && (this.state.formData.bankNum.replace(/\s+/, "").length == 19)) {
            this.checkBankInfo()
        } else if (this.state.formData.bankNum.replace(/\s+/, "").length < 16) {
            this.setState({
                bankAccountInfo: null
            })
        }
    };

    getCountryData() {
        Fetch.post('withdrawal/getProvince', {}, res => {
            if (res.success) {
                this.setState({
                    provincesList: res.body.provincesList
                });
                Storage.setItem(StorageKey.eTD_CITYARR, res.body.provincesList);
            }
        }, error => {

        })
    };

    checkBankInfo(showModal) {
        if (this.state.formData.bankNum.replace(/\s+/, "").length >= 16) {
            Fetch.post('withdrawal/getBankInfo', {bankAccount: this.state.formData.bankNum}, res => {
                console.log('getBKAccountInfo', res)
                if (res.success) {
                    this.setState({
                        bankAccountInfo: res.body
                    });
                    this.setFormData('bankName', res.body.etdBankNum)
                    if (showModal) {
                        this.sureBindCard();
                    }
                } else {
                    this.setState({
                        bankAccountInfo: null
                    });
                    this.setFormData('bankName', "")
                    this.eAlert.show('alert', res.info)
                }
            }, error => {

            }, null, this)
        } else {
            this.eAlert.show('alert', '卡号输入错误，请检查您的卡号');
        }
    };

    checkFormData() {
        Grow.track('elbn_my_bind_confirm_click', {'elbn_my_bind_confirm_click': '提交按钮点击量'});
        let formData = this.state.formData;
        console.log('form', formData)
        formData.useName.replace(/\s+/, '').length > 0 ?
            formData.bankNum.replace(/\s+/, '').length >= 16 ?
                this.state.province && this.state.countrySide ?
                    this.checkBankCardStatus()
                    :
                    this.eAlert.show('alert', '请选择开户城市')
                :
                formData.bankNum.replace(/\s+/, '').length == 0 ?
                    this.eAlert.show('alert', '请输入您的卡号')
                    :
                    this.eAlert.show('alert', '卡号输入错误，请检查您的卡号')
            :
            this.eAlert.show('alert', '请输入持卡人姓名')
    };

    checkBankCardStatus() {
        if (this.state.bankAccountInfo) {
            this.sureBindCard()
        } else {
            this.checkBankInfo(true)
        }
    }

    sureBindCard() {
        this.setState({showSureModal: true})
        setTimeout(() => {
            Animated.spring(this.state.scale, {
                toValue: 1,
                duration: 10,
                tension: 30,
                friction: 4
            }).start();
        });
    };

    toBind() {
        dismissKeyboard();

        let areaCode = '';
        let province = this.state.province;
        let countrySide = this.state.countrySide;
        this.state.provincesList && this.state.provincesList.map((item, index) => {
            if (item.pcName == province) {
                for (let i = 0; i < item.cityArea.length; i++) {
                    if (item.cityArea[i].pcName == countrySide) {
                        areaCode = item.cityArea[i].pcId
                    }
                }
            }
        });
        setTimeout(() => {
            this.setState({showSureModal: false, scale: new Animated.Value(0)})
            let data = {
                sessionId: __sessionId,
                useId: this.state.userInfo.sftUserMdl.useId,
                bankNumber: this.state.formData.bankNum,
                bankName: this.state.formData.bankName,
                areaCode: areaCode,
            };
            this.loading.show();
            Fetch.post('user/newbindBankCardForWithdrawal', data, res => {
                console.log('res', res);
                this.loading.hide();
                if (res.success) {
                    EventEmitter.emit('getStatus');
                    this.props.navigation.navigate('ResetPhoneResult', {
                        type: 'bindCard',
                        status: 'success',
                        backKey: this.props.navigation.state.key
                    })
                } else {
                    this.eAlert.show('alert', res.info)
                }
            }, error => {
                this.loading.show('netFail', '网络超时', 2000)
            }, 30 * 1000, this, Util.getVerifyCode.bind(this, this, Fetch))
        });


    };

    toLimitExplain() {
        this.props.navigation.navigate('webViewWithBridge', {
            url: 'https://m2.etongdai.com/payment/bankListPage',
            title: '绑卡限额列表'
        })
        // this.props.navigation.navigate('webViewWithBridge',{url:'https://m.etongdai.com/payment/bankListPage',title:'绑卡限额列表'})
    };

    render() {
        let params = this.props.navigation.state.params ? this.props.navigation.state.params.data : null;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
                this.singlePicker.hide();
                dismissKeyboard();
                this.setState({showModal: false})
            }} style={bindBankCard.container}>
                <MineHeader
                    title={this.state.accountData ? this.state.accountData.bindBankState == '1' ? '我的银行卡' : '绑定银行卡' : '绑定银行卡'}
                    leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={bindBankCard.contentBox}>
                    <View style={bindBankCard.topRemindBox}>
                        <Text allowFontScaling={false} style={bindBankCard.topRemindTitle}>提示：为了您的交易安全，不可绑定信用卡</Text>
                    </View>
                    <View style={bindBankCard.userNameBox}>
                        <View style={bindBankCard.labelImgBox}>
                            <Image style={bindBankCard.labelImg}
                                   source={require('./../../../imgs/mine/NameAccount.png')}/>
                            <Text allowFontScaling={false} style={bindBankCard.labelText}>持卡人</Text>
                        </View>
                        {
                            params && params.user && params.user.useName ?
                                <Text allowFontScaling={false}
                                      style={bindBankCard.input}>{params.user.useName.replace(/(\S{1})\S+/, '$1**')}</Text>
                                :
                                <TextInput style={[bindBankCard.input]}
                                           placeholder="请输入持卡人姓名"
                                           onChangeText={this.setFormData.bind(this, 'useName')}
                                           placeholderTextColor="#9d9d9d"
                                           underlineColorAndroid="transparent"
                                           clearButtonMode="while-editing"
                                           maxLength={19}
                                           value={this.state.formData.useName}
                                           onFocus={() => {
                                               this.setState({activeInput: 'useName'})
                                           }}
                                />
                        }

                    </View>
                    <Line notFull={true}/>
                    <View style={bindBankCard.userNameBox}>
                        <View style={bindBankCard.labelImgBox}>
                            <Image style={bindBankCard.labelImg}
                                   source={require('./../../../imgs/mine/bankCardAccount.png')}/>
                            <Text allowFontScaling={false} style={bindBankCard.labelText}>银行卡号</Text>
                        </View>
                        <TextInput style={[bindBankCard.input]}
                                   placeholder="请输入银行卡号"
                                   onChangeText={this.setFormData.bind(this, 'bankNum')}
                                   placeholderTextColor="#9d9d9d"
                                   underlineColorAndroid="transparent"
                                   clearButtonMode="while-editing"
                                   maxLength={19}
                                   keyboardType="numeric"
                                   value={this.state.formData.bankNum}
                                   onBlur={() => {
                                       this.checkBankInfo()
                                   }}
                                   onFocus={() => {
                                       this.setState({activeInput: 'bankNum'})
                                   }}
                        />
                    </View>
                    {
                        this.state.bankAccountInfo && this.state.formData.bankNum.replace(/\s+/, "").length >= 11 ?
                            <View style={bindBankCard.bankInfoBox}>
                                <Line notFull={true}/>
                                <View style={[bindBankCard.userNameBox, {}]}>
                                    <Text allowFontScaling={false}
                                          style={[bindBankCard.labelText, bindBankCard.bankSelectedTitle]}>{this.state.bankAccountInfo.bankName}</Text>
                                    <Text allowFontScaling={false}
                                          style={bindBankCard.limitTitle}>单笔限额5万元，单日限额30万元</Text>
                                </View>
                            </View>
                            :
                            null
                    }

                    <Line notFull={true}/>
                    <View style={bindBankCard.userNameBox}>
                        <View style={bindBankCard.labelImgBox}>
                            <Image style={bindBankCard.labelImg}
                                   source={require('./../../../imgs/mine/accountCity.png')}/>
                            <Text allowFontScaling={false} style={bindBankCard.labelText}>开户城市</Text>
                        </View>
                        <View style={bindBankCard.provience}>
                            <TouchableOpacity activeOpacity={0.7} style={[bindBankCard.cityBox]}
                                              onPress={this.getProvince.bind(this, 'city')}>
                                <Text allowFontScaling={false} style={bindBankCard.cityName}
                                      numberOfLines={1}>{this.state.province || '省/市'}</Text>
                                <View style={bindBankCard.selectButton}>
                                    <View style={bindBankCard.selectButtonTop}/>
                                    <View style={[bindBankCard.selectButtonTop, {transform: [{rotate: '135deg'}],}]}/>

                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7}
                                              style={[bindBankCard.cityBox, bindBankCard.countryBox]}
                                              onPress={this.getCountry.bind(this, 'country')}>
                                <Text allowFontScaling={false} style={[bindBankCard.countryName]}
                                      numberOfLines={1}>{this.state.countrySide || '市/区/县'}</Text>
                                <View style={bindBankCard.selectButton}>
                                    <View style={bindBankCard.selectButtonTop}/>
                                    <View style={[bindBankCard.selectButtonTop, {transform: [{rotate: '135deg'}],}]}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={bindBankCard.buttonBox}>
                        <Button buttonName="提交" onPress={this.checkFormData.bind(this)}/>
                    </View>
                </View>
                {
                    this.state.showModal && <TouchableOpacity activeOpacity={1} onPress={() => {
                        this.singlePicker.hide();
                        this.setState({showModal: false,})
                    }} style={[bindBankCard.modal]}/>

                }
                <Modal visible={this.state.showSureModal}
                       transparent={true}
                       animationType='fade'
                       onRequestClose={() => {
                       }}>
                    <View style={bindBankCard.m_container}>
                        <Animated.View style={[bindBankCard.m_contentBox, {transform: [{scale: this.state.scale}]}]}>
                            <View style={[bindBankCard.m_titleBox]}>
                                <Text allowFontScaling={false} style={[bindBankCard.m_title]}>银行卡信息确认</Text>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                    this.setState({showSureModal: false, scale: new Animated.Value(0)})
                                }} style={[bindBankCard.m_titleImgBox]}>
                                    <Image source={require('./../../../imgs/mine/deleteButton.png')}/>
                                </TouchableOpacity>
                            </View>
                            <View style={[bindBankCard.m_contentSubBox]}>
                                <View style={[bindBankCard.m_content]}>
                                    <Text allowFontScaling={false}
                                          style={[bindBankCard.m_contentText]}>姓名：{this.state.formData.useName}</Text>
                                </View>
                                <View style={[bindBankCard.m_content]}>
                                    <Text allowFontScaling={false}
                                          style={[bindBankCard.m_contentText]}>银行卡号：{this.state.formData.bankNum}</Text>
                                </View>
                                <View style={[bindBankCard.m_contentCity]}>
                                    <Text allowFontScaling={false} style={[bindBankCard.m_contentText]}>开户城市：</Text>
                                    <Text allowFontScaling={false}
                                          style={[bindBankCard.m_contentText]}>{this.state.province + this.state.countrySide}</Text>
                                </View>
                            </View>
                            <View style={[bindBankCard.m_remindBox]}>
                                <Text allowFontScaling={false}
                                      style={[bindBankCard.m_remindTitle]}>注意：绑定后此卡将成为您提现的银行卡</Text>
                            </View>
                            <Button buttonName="确认绑定" width={240} onPress={this.toBind.bind(this)}/>
                        </Animated.View>
                    </View>
                </Modal>
                <SinglePicker
                    lang="zh-CN"
                    defaultSelectedValue={this.state.defaultPickerData}
                    ref={ref => this.singlePicker = ref}
                    onConfirm={(option) => {
                        this.setState({showModal: false})
                        this.selectedData(option)
                    }}
                    onCancel={() => {
                        this.setState({showModal: false})
                    }}
                    onSelect={(option) => {
                        this.selectedData(option)
                    }}
                    options={this.state.options}
                >
                </SinglePicker>
                <Loading ref={(ref) => this.loading = ref}/>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </TouchableOpacity>
        );
    }
}
