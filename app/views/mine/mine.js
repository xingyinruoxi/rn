/**
 * eTongDai React Native App
 * This is mine view
 * @John
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    FlatList,
    Modal,
} from 'react-native';

import {minePageStyle} from './../../styles/mine/mineStyle';
import VLine from './../../commons/vLine';
import Line from './../../commons/line';
import Util from './../../commons/util';
import RightIcon from './../components/rightIcon';
import Fetch from './../../commons/fetch';

var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import util, {Grow} from './../../commons/util';
import EAlert from './../components/ealert';
import Loading from './../components/loading';

var EventEmitter = require('RCTDeviceEventEmitter');


export default class Mine extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false,
            singleClick: false,
            haveMessage: false,
            showData: false,
            newMessageNum: 0,
            showLeading: false,
            step: 1,
            jiaxiCount: null,
            showWithdrawModal:false,//提现拦截
        };

        EventEmitter.addListener('getUserInfo', () => {
            this.setUserInfo();
        });

        EventEmitter.addListener('getStatus', this.getStatus.bind(this))
        EventEmitter.addListener('getNotReadMsg', this.getNotReadMsg.bind(this))

    };

    componentWillMount() {
        Storage.getItem(StorageKey.eTD_CLAIM).then((data) => {
            if (data && (global.__preUseId && global.__preUseId == __useId)) {
                this.setState({
                    userAccountData: data
                })
            }
        });
    };

    componentDidMount() {
        console.log(3456,this.props);
        console.log('util.deviceType', util.deviceType)
        Grow.track('pg_my_userbrowse', {'pg_my_userbrowse': "我的账户页面"});
        if (__scenes.length == 1) {
            this.setState({
                showLeading: global.__firstComeMine
            });
        }
        Storage.getItem(StorageKey.eTD_HIDEACCOUNTINFO).then((data) => {
            if (data != null) {
                this.setState({
                    showData: data
                });
            } else {
                this.setState({
                    showData: true
                });
            }
        });
        this.setUserInfo();
        setTimeout(() => {
            this.getNotReadMsg();
        })
    };

    getTickcount() {
        let body = {
            useId: __useId,
            sessionId: __sessionId,
        };
        Fetch.post('ticket/count', {...body, type: 0,}, res => {
            // console.log('gettickcount',res)
            if (res && res.success) {
                this.setState({
                    tickCount: res.body
                })
            } else {
                this.setState({
                    tickCount: null,
                });
            }
        }, err => {

        }, null);

        Fetch.post('ticket/count', {...body, type: 1,}, res => {
            console.log('gettickcount', res)
            if (res && res.success) {
                this.setState({
                    jiaxiCount: res.body,
                })
            }
        }, err => {
            this.loading && this.loading.show('netFail', '网络超时', 2000);
        }, null);

    };

    getStatus() {
        let data = {
            sessionId: __sessionId,
            useId: __useId
        };
        Fetch.post('userCenter/checkuserstatus', data, res => {
            console.log('checkuserstatus', res);
            if (res.success) {
                this.setState({
                    userInfo: {sftUserMdl: res.body.extend}
                });
                Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
                    userInfo.sftUserMdl = res.body.extend;
                    Storage.setItem(StorageKey.eTD_USERINFO, userInfo)
                }).then(() => EventEmitter.emit('getUserInfo'))
            }
        }, error => {

        }, null, this)
    }

    setUserInfo() {
        this.getTickcount();
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            setTimeout(() => {
                this.getNotReadMsg(userInfo);
            }, 500);
            setTimeout(() => this.getUserInfo())
        });
    };

    _onRefresh() {
        this.loading.show('loading', '加载中...');
        this.getUserInfo();
    };

    getUserInfo(userInfo) {
        userInfo && this.setState({userInfo: userInfo});
        let data = {
            sessionId: __sessionId,
            useId: __useId,
        };
        Fetch.post('userCenter/claim', data, (res) => {
            console.log('claim', res);
            this.loading.hide();
            this.setState({isRefreshing: false});
            if (res.success) {
                this.setState({
                    userAccountData: res.body
                });
                Storage.setItem(StorageKey.eTD_CLAIM, res.body)
            } else {
                if (res.code) {
                    global.__isLogin = null;
                }
            }
        }, (error) => {
            Storage.getItem(StorageKey.eTD_CLAIM).then((data) => {
                if (data && (__preUseId && __preUseId == __useId)) {
                    this.setState({
                        userAccountData: data
                    })
                }
            });
            this.loading && this.loading.show('netFail', '网络超时', 2000)
        }, null, this, this.getUserInfo.bind(this))
    };

    toInvestmentCalendarView() {
        Grow.track('elbn_my_calender_click', {'elbn_my_calender_click': "回款日历按钮点击量"});
        Grow.track('elbn_my_repaymentcalender_click', {'elbn_my_repaymentcalender_click': "回款日历按钮点击量"});
        this.props.navigation.navigate('investmentCalendar');
    };

    getNotReadMsg() {
        let data = {
            useId: __useId,
            sessionId: __sessionId,
        };
        Fetch.post('more/noreadmsg', data, res => {
            console.log('Mine more/noreadmsg', res);
            if (res && res.success && res.body) {
                this.setState({
                    newMessageNum: res.body.notReadMsg
                })
            } else {
                this.setState({
                    newMessageNum: 0
                })
            }
        }, err => {
            this.loading && this.loading.show('netFail', '网络超时', 2000)
        }, null);
    };

    getCardBindStatus(type) {
        if (type == 'withdraw') {
            Grow.track('elbn_my_withdraw_click', {'elbn_my_withdraw_click': "提现按钮点击量"});
        } else {
            Grow.track('elbn_my_recharge_click', {'elbn_my_recharge_click': "充值按钮点击量"});
        }
        let url = type == 'withdraw' ? 'withdrawal/apply' : 'payment/rechargeInput';
        this.loading && this.loading.show();
        let data = {
            sessionId: __sessionId,
            useId: __useId
        };
        Fetch.post(url, data, (res) => {
            console.log('getCardBindStatus', res);
            this.loading.hide();
            if (res.success) {
                if (type == 'withdraw') {
                    // this.props.navigation.navigate(type, {data: res.body})
                    this.setState({

                    })
                    console.log(3456,res.body);
                } else {
                    this.props.navigation.navigate(type, {data: this.state.userAccountData, bankData: res.body})
                }
            } else {
                if (res.info && res.info.indexOf('实名认证') >= 0) {
                    this.eAlert.show('alert', res.info, () => {
                        this.props.navigation.navigate('createRealNameAccount', {haveCertify: false, register: false})
                    })
                } else if (res.info && res.info.indexOf('绑定银行卡') >= 0) {
                    this.eAlert.show('alert', res.info, () => {
                        this.props.navigation.navigate('bindBankCard', {data: res.body.user})
                    })
                } else {
                    this.eAlert.show('alert', res.info)
                }
            }
        }, (error) => {
            this.loading && this.loading.show('loading', '网络超时', 2000)
        }, null, this, this.getCardBindStatus.bind(this))

    };

    setShowHideData() {
        let showData = this.state.showData;
        this.setState({
            showData: !showData
        });
        Storage.setItem(StorageKey.eTD_HIDEACCOUNTINFO, !showData)
    };

    componentWillReceiveProps(nextProps) {

    }


    _listEmptyComponent() {
        return (
            <View style={minePageStyle.scrollView}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    Grow.track('elbn_my_assetdetail_click', {'elbn_my_assetdetail_click': "总资产明细按钮点击量"});
                    this.props.navigation.navigate('assetDetail', {accountData: this.state.userAccountData})
                }}>
                    <View style={minePageStyle.userInfoBox}>
                        <View style={minePageStyle.userHeaderBox}>
                            <TouchableOpacity activeOpacity={0.7} style={minePageStyle.userHeader} onPress={() => {
                                this.props.navigation.navigate('accountManage')
                            }}>
                                <Image source={require('./../../imgs/mine/headerImg.png')}/>
                            </TouchableOpacity>
                            <View style={minePageStyle.infoBox}>
                                <View style={minePageStyle.realNameBox}>
                                    <View style={minePageStyle.infoBoxPhoneBox}>
                                        {
                                            this.state.userInfo && this.state.userInfo.sftUserMdl.useAuthRealName == '1' ?
                                                <Text allowFontScaling={false} style={minePageStyle.infoBoxPhoneName}
                                                      onPress={() => {
                                                          this.props.navigation.navigate('accountManage')
                                                      }}>{this.state.userInfo && this.state.userInfo.sftUserMdl.useName.replace(/(\S{1})\S+/, '$1**')}</Text>
                                                :
                                                <Text allowFontScaling={false} style={minePageStyle.infoBoxPhoneName}
                                                      onPress={() => this.props.navigation.navigate('createRealNameAccount', {haveCertify: false})}>未实名</Text>

                                        }
                                        <TouchableOpacity activeOpacity={0.7} style={minePageStyle.eyeBox}
                                                          onPress={this.setShowHideData.bind(this)}>
                                            {
                                                this.state.showData ?
                                                    <Image source={require('./../../imgs/mine/openEyeWhite.png')}/>
                                                    :
                                                    <Image source={require('./../../imgs/mine/hideEyeWhite.png')}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    this.state.userInfo && this.state.userInfo.sftUserMdl.useAuthRealName == '1' && (this.state.userInfo.authBackCard == '2' || this.state.userInfo.sftUserMdl.authBackCard == '2') ?
                                        <TouchableOpacity acitveOpacity={1} onPress={() => {
                                            this.props.navigation.navigate('accountManage')
                                        }} style={minePageStyle.phoneBox}>
                                            <Text allowFontScaling={false}
                                                  style={minePageStyle.infoBoxPhone}>{this.state.userInfo && this.state.userInfo.sftUserMdl.useMobilePhones.replace(/(\d{3})\d+(\d{4})/, '$1****$2')}</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity acitveOpacity={1} onPress={() => {
                                            this.props.navigation.navigate('accountManage')
                                        }} style={minePageStyle.infoBoxSafeBox}>
                                            <Text allowFontScaling={false}
                                                  style={minePageStyle.infoBoxSafe}>提升安全等级</Text>
                                        </TouchableOpacity>
                                }

                            </View>
                        </View>
                    </View>
                    <View style={minePageStyle.leftMoneyBox}>
                        <TouchableOpacity activeOpacity={1}
                                          onPress={() => {
                                              Grow.track('elbn_my_totalassets_click', {'elbn_my_totalassets_click': "账户总资产点击量"});
                                              this.props.navigation.navigate('assetDetail', {accountData: this.state.userAccountData})
                                          }}
                                          style={minePageStyle.totalProfitBox}>
                            <Text allowFontScaling={false} style={minePageStyle.totalProfitNum} numberOfLines={1}>
                                {this.state.showData ? this.state.hideAccountInfo ? "****" : this.state.userAccountData ? util.thousandBitSeparator(this.state.userAccountData.accountMoney.toFixed(2)) : '0.00' : '****'}
                            </Text>
                            <Text allowFontScaling={false}
                                  style={[minePageStyle.totalProfitNum, minePageStyle.totalProfitTitle]}>
                                账户总资产(元)
                            </Text>
                        </TouchableOpacity>
                        <VLine height={40}/>
                        <TouchableOpacity style={minePageStyle.totalProfitBox}
                                          activeOpacity={1}
                                          onPress={() => {
                                              Grow.track('elbn_my_totalassets_click', {'elbn_my_totalassets_click': "已获得收益"});
                                              this.props.navigation.navigate('assetDetail', {accountData: this.state.userAccountData})
                                          }}
                        >
                            <Text allowFontScaling={false} style={minePageStyle.totalProfitNum} numberOfLines={1}>
                                {this.state.showData ? this.state.hideAccountInfo ? "****" : this.state.userAccountData ? util.thousandBitSeparator(this.state.userAccountData.sy.toFixed(2)) : '0.00' : "****"}
                            </Text>
                            <Text allowFontScaling={false}
                                  style={[minePageStyle.totalProfitNum, minePageStyle.totalProfitTitle]}>
                                已获得收益(元)
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={minePageStyle.leftMoney}>
                        <View style={[minePageStyle.totalProfitBox, minePageStyle.leftMoneyNumBox]}>
                            <Text allowFontScaling={false}
                                  style={[minePageStyle.totalProfitNum, minePageStyle.leftMoneyNum]} numberOfLines={1}>
                                {this.state.showData ? this.state.hideAccountInfo ? "****" : this.state.userAccountData ? util.thousandBitSeparator(this.state.userAccountData.vaildMoney.toFixed(2)) : '0.00' : '****'}
                            </Text>
                            <Text allowFontScaling={false} style={[minePageStyle.totalProfitTitle]}>
                                可用余额(元)
                            </Text>
                        </View>
                        <View style={minePageStyle.topupButtonBox}>
                            <TouchableOpacity activeOpacity={0.75} style={minePageStyle.withdrawButton}
                                              onPress={this.getCardBindStatus.bind(this, 'withdraw')}>
                                <Text allowFontScaling={false} style={minePageStyle.withdrawButtonText}>提现</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.75} style={minePageStyle.topUpButton}
                                              onPress={this.getCardBindStatus.bind(this, 'topUp')}>
                                <Text allowFontScaling={false} style={minePageStyle.topUpButtonText}>充值</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={minePageStyle.menuBox}
                                  onPress={this.toInvestmentCalendarView.bind(this)}>
                    <View style={minePageStyle.menuBoxTop}>
                        <View style={minePageStyle.menuItem}>
                            <Image style={minePageStyle.menuLogo} source={require('./../../imgs/mine/calendar.png')}/>
                            <Text allowFontScaling={false} style={minePageStyle.menuListTitle}>回款日历</Text>
                            <View style={minePageStyle.rightButton}>
                                <RightIcon right/>
                            </View>
                        </View>
                    </View>
                    <View style={minePageStyle.menuBoxBottom}>
                        <View style={minePageStyle.leftBox}>
                            <Text allowFontScaling={false} style={minePageStyle.calendarTitle}>
                                待收收益(元)
                            </Text>
                            <Text allowFontScaling={false} style={minePageStyle.calendarNum} numberOfLines={1}>
                                {this.state.hideAccountInfo ? "****" : this.state.userAccountData ? util.thousandBitSeparator(this.state.userAccountData.rescPlanInte.toFixed(2)) : '0.00'}
                            </Text>
                        </View>
                        <View style={minePageStyle.leftBox} onPress={() => {
                            this.props.navigation.navigate('fundNotes')
                        }}>
                            <Text allowFontScaling={false} style={minePageStyle.calendarTitle}>
                                待收本金(元)
                            </Text>
                            <Text allowFontScaling={false} style={minePageStyle.calendarNum} numberOfLines={1}>
                                {this.state.hideAccountInfo ? "****" : this.state.userAccountData ? util.thousandBitSeparator(this.state.userAccountData.rescPlanPrin.toFixed(2)) : '0.00'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={minePageStyle.menuListBox}>
                    <TouchableOpacity activeOpacity={0.7} style={minePageStyle.menuItem}
                                      onPress={() => {
                                          Grow.track('elbn_my_myinvest_click', {'elbn_my_myinvest_click': "我的出借按钮点击量"});
                                          this.props.navigation.navigate('myInvestment')
                                      }
                                      }>
                        <Image style={minePageStyle.menuLogo} source={require('./../../imgs/mine/investment.png')}/>
                        <Text allowFontScaling={false} style={minePageStyle.menuListTitle}>我的出借</Text>
                        <View style={minePageStyle.rightButton}>
                            <RightIcon right/>
                        </View>
                    </TouchableOpacity>
                    <Line notFull={true}/>
                    <TouchableOpacity activeOpacity={0.7} style={minePageStyle.menuItem}
                                      onPress={() => {
                                          Grow.track('elbn_my_moneyrecord_click', {'elbn_my_moneyrecord_click': "资金记录按钮点击量"});
                                          Grow.track('elbn_my_fundrecord_click', {'elbn_my_fundrecord_click': "资金记录按钮点击量"});
                                          this.props.navigation.navigate('fundNotes')
                                      }}
                    >
                        <Image style={minePageStyle.menuLogo} source={require('./../../imgs/mine/fundNotes.png')}/>
                        <Text allowFontScaling={false} style={[minePageStyle.menuListTitle, {}]}>资金记录</Text>
                        <View style={minePageStyle.rightButton}>
                            <RightIcon right/>
                        </View>
                    </TouchableOpacity>
                    <Line notFull={true}/>
                    <TouchableOpacity activeOpacity={0.7} style={minePageStyle.menuItem} onPress={() => {
                        Grow.track('elbn_my_myred_click', {'elbn_my_myred_click': "我的红包按钮点击量"});
                        this.props.navigation.navigate('redPacket')
                    }}>
                        <Image style={[minePageStyle.menuLogo]} source={require('./../../imgs/mine/redPacked.png')}/>
                        <View>
                            <Text allowFontScaling={false} style={minePageStyle.menuListTitle}>我的红包</Text>
                            {
                                this.state.tickCount ? <View style={minePageStyle.redCircl}/> : null
                            }
                        </View>
                        <View style={minePageStyle.rightButton}>
                            <RightIcon right/>
                        </View>

                    </TouchableOpacity>
                    <Line notFull={true}/>

                    <TouchableOpacity activeOpacity={0.7} style={minePageStyle.menuItem}
                                      onPress={() => {
                                          Grow.track('elbn_my_mycoupon_click', {'elbn_my_mycoupon_click': "我的加息券"});
                                          this.props.navigation.navigate('tickets')
                                      }
                                      }>
                        <Image style={[minePageStyle.menuLogo]} source={require('./../../imgs/mine/jiaxiquan.png')}/>
                        <View>
                            <Text allowFontScaling={false} style={minePageStyle.menuListTitle}>我的加息券</Text>
                            {
                                this.state.jiaxiCount ? <View style={minePageStyle.redCircl}/> : null
                            }
                        </View>
                        <View style={minePageStyle.rightButton}>
                            <RightIcon right/>
                        </View>

                    </TouchableOpacity>

                    <Line notFull={true}/>
                    <TouchableOpacity activeOpacity={0.7} style={minePageStyle.menuItem}
                                      onPress={() => {
                                          Grow.track('elbn_my_mytransfer_click', {'elbn_my_mytransfer_click': "债权转让按钮点击量"});
                                          this.props.navigation.navigate('myInvestment', {transfer: true})
                                      }
                                      }>
                        <Image style={minePageStyle.menuLogo}
                               source={require('./../../imgs/mine/investmentTransfer.png')}/>
                        <Text allowFontScaling={false} style={minePageStyle.menuListTitle}>债权转让</Text>
                        <View style={minePageStyle.rightButton}>
                            <RightIcon right/>
                        </View>
                    </TouchableOpacity>
                    <Line notFull={true}/>
                    <TouchableOpacity activeOpacity={0.7} style={minePageStyle.menuItem} onPress={() => {
                        Grow.track('elbn_my_autoinvest_click', {'elbn_my_autoinvest_click': "自动投标按钮点击量"});
                        this.props.navigation.navigate('autoBid')
                    }}>
                        <Image style={minePageStyle.menuLogo} source={require('./../../imgs/mine/autoBid.png')}/>
                        <Text allowFontScaling={false} style={minePageStyle.menuListTitle}>自动投标</Text>
                        <View style={minePageStyle.rightButton}>
                            <RightIcon right/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    readMessage() {
        Grow.track('elbn_my_messagecenter_click', {'elbn_my_messagecenter_click': "消息中心按钮点击量"});
        // this.setState({
        //     newMessageNum: 0
        // });
        this.props.navigation.navigate('messageCenter', {title: '消息中心', newMessageNum: this.state.newMessageNum})
    }

    hideLeading() {
        if (this.state.step < 4) {
            this.setState({
                step: this.state.step + 1
            })
        } else {
            this.setState({
                showLeading: false
            });
            global.__firstComeMine = false;
            Storage.setItem(StorageKey.eTD_FIRSTCOMEMINE, true)
        }
    }

    render() {

        return (
            <View style={minePageStyle.container}>
                {
                    util.isIOS ?
                        <StatusBar barStyle="light-content"/>
                        :
                        null
                }
                <View style={minePageStyle.header}>
                    <View style={minePageStyle.headerContent}>
                        <TouchableOpacity activeOpacity={0.7} style={minePageStyle.messageControlLeft}
                                          onPress={this.readMessage.bind(this)}>
                            {
                                this.state.newMessageNum > 0 ?
                                    <Image source={require('./../../imgs/mine/haveMessage.png')}/>
                                    :
                                    <Image source={require('./../../imgs/mine/message.png')}/>
                            }

                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={minePageStyle.messageControl} onPress={() => {
                            Grow.track('elbn_my_accountmanage_click', {'elbn_my_accountmanage_click': "账户管理按钮点击量"});
                            this.props.navigation.navigate('accountManage')
                        }}>
                            <Image source={require('./../../imgs/mine/setting.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList data={[]}
                          renderItem={() => {
                          }}
                          onRefresh={this._onRefresh.bind(this)}
                          refreshing={false}
                          ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>

                <Modal
                    visible={this.state.showWithdrawModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => {
                    }}
                >
                    <View
                        style={minePageStyle.l_content}
                    >
                        <View style={{height:200,backgroundColor:'#fff',width:'90%',borderRadius:10,overflow:'hidden'}}>
                            <Text>56789dsfd0-=</Text>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.showLeading ?
                        <Modal visible={this.state.showLeading}
                               animationType="fade"
                               transparent={true}
                               onRequestClose={() => {
                               }}
                        >
                            <View style={minePageStyle.l_content}>
                                {this.state.step == 1 && <Image
                                    style={[minePageStyle.l_justRegiste, (Util.deviceType == '5' || Util.deviceType == '5s') && {
                                        height: 220 * Util.pixel / 550 * 380,
                                        width: 220 * Util.pixel
                                    }]} source={require('./../../imgs/commons/leading/withTop.png')}/>}
                                {this.state.step == 2 && <Image
                                    style={[minePageStyle.l_justRegiste2, (Util.deviceType == '5' || Util.deviceType == '5s') && {
                                        height: 280 * Util.pixel / 620 * 354,
                                        width: 280 * Util.pixel
                                    }]} source={require('./../../imgs/commons/leading/calender.png')}/>}
                                {this.state.step == 3 && <Image
                                    style={[minePageStyle.l_justRegiste3, (Util.deviceType == '5' || Util.deviceType == '5s') && {
                                        height: 280 * Util.pixel / 670 * 280,
                                        width: 280 * Util.pixel
                                    }]} source={require('./../../imgs/commons/leading/IWinvestment.png')}/>}
                                {this.state.step == 4 && <Image
                                    style={[minePageStyle.l_justRegiste4, (Util.deviceType == '5' || Util.deviceType == '5s') && {
                                        height: 300 * Util.pixel / 670 * 276,
                                        width: 300 * Util.pixel
                                    }]} source={require('./../../imgs/commons/leading/fundNote.png')}/>}
                                <TouchableOpacity activeOpacity={0.7} style={[minePageStyle.iKnow]}
                                                  onPress={this.hideLeading.bind(this)}>
                                    <Image style={[(Util.deviceType == '5' || Util.deviceType == '5s') && {
                                        height: 90 * Util.pixel / 242 * 100,
                                        width: 90 * Util.pixel
                                    }]} source={require('./../../imgs/commons/leading/IKnow.png')}/>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        :
                        null
                }
            </View>
        );
    }
}