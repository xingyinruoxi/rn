/**
 * eTongDai React Native App
 * This is more view
 * @John
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    Clipboard,
    Linking,
    PixelRatio,
    StatusBar
} from 'react-native';
import {MoreStyles} from './../../styles/more/moreStyle';
import Btn from './component/Button';
import ListItem from './component/ListItem';
import Fetch from './../../commons/fetch';
import Util, {Grow} from './../../commons/util';
import EAlert from './../components/ealert';
import Loading from './../components/loading';
import InviteFriends from './../home/component/inviteFriends';

const EventEmitter = require('RCTDeviceEventEmitter');
const StorageKeys = require('./../../commons/storageKey');
const Storage = require('./../../commons/storage');
import XHeader from './../components/xHeader';
import Line from './../../commons/line';

const {systemInfos, appVersion, appAndroidVersion, url} = require('./../../commons/config');
export default class More extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionId: null,
            useId: null,
            shareInfos: null,
            newMessageNoticesNum: 0, //网站公告
            newMessageNum: 0,  //站内消息
            userPhone: null,  //用户手机号
            isLogin: false,
            statusBar: 'default'
        };
        EventEmitter.addListener('changeStatusBar', (data) => {
            if (this.view) {
                //console.log('=======more', data)
                this.setState({
                    statusBar: data
                })
            }
        });
    };

    componentWillMount() {

    };

    componentDidMount() {
        this.getUserInfo();
        EventEmitter.addListener('moreCheckLogin', this.getUserInfo.bind(this));
    };

    growingIO(n) {
        switch (n) {
            case 0:
                Grow.track('pg_other_userbrowse', {'pg_other_userbrowse': '更多页浏览用户量'});   //更多页浏览用户量
                break;
            case 1:
                Grow.track('elbn_other_helpcenter_click', {'elbn_other_helpcenter_click': '帮助中心按钮点击量'});   //帮助中心按钮点击量
                break;
            case 2:
                Grow.track('elbn_other_feedback_click', {'elbn_other_feedback_click': '问题反馈按钮点击量'});   //问题反馈按钮点击量
                break;
            case 3:
                Grow.track('elbn_other_aboutus_click', {'elbn_other_aboutus_click': '关于我们按钮点击量'});   //关于我们按钮点击量
                break;
            case 4:
                Grow.track('elbn_other_invite_click', {'elbn_other_invite_click': '邀请好友按钮点击量'});   //邀请好友按钮点击量
                break;
            case 5:
                Grow.track('elbn_other_messagecenter_click', {'elbn_other_messagecenter_click': '消息中心按钮点击量'});   //消息中心按钮点击量
                break;
            case 6:
                Grow.track('elbn_other_wechat_click', {'elbn_other_wechat_click': '官方微信按钮点击量'});   //官方微信按钮点击量
                break;
            case 7:
                Grow.track('elbn_other_hotline_click', {'elbn_other_hotline_click': '客服电话按钮点击量'});   //客服电话按钮点击量
                break;
            case 8:
                Grow.track('elbn_other_webchat_click', {'elbn_other_webchat_click': '在线客服按钮点击量'});   //在线客服按钮点击量
                break;
            default :
                break;
        }
    }

    getUserInfo(callback) {
        if (this.view) {
            this.growingIO(0);
            Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
                if (res) {
                    this.setState({
                        sessionId: res.sessionId,
                        useId: res.sftUserMdl.useId,
                        userPhone: res.sftUserMdl.useMobilePhones,
                        isLogin: true,
                    }, () => {
                        this.getNotReadMsgNum();
                    });
                } else {
                    this.setState({
                        sessionId: null,
                        isLogin: false,
                    })
                }
            });
        }
    };

    getNotReadMsgNum() {
        let data = {
            useId: this.state.useId,
            sessionId: this.state.sessionId,
        };
        Fetch.post('more/noreadmsg', data, res => {
            //console.log('more/getNotRedMsg ====',res);
            if (res && res.success) {
                this.setState({
                    newMessageNum: res.body.notReadMsg
                });
            } else {
                this.setState({
                    newMessageNum: 0,
                });
            }
        }, err => {
            this.loading && this.loading.show('netFail', '网络超时', 2000);
        })
    };

    loadPage(routeName, props) {
        if (routeName === 'webview') {
            if (props && props.noSpace) {
                this.growingIO(1);
            } else if (props && props.OnlineWebchat) {
                this.growingIO(8);
            } else {
                this.growingIO(3);
            }
        }
        routeName === 'feedBack' && this.growingIO(2);
        routeName === 'messageCenter' && this.growingIO(5);
        this.props.navigation.navigate(routeName, props);
    };

    outLogin() {
        let data = {
            sessionId: this.state.sessionId,
            useId: this.state.useId
        };
        this.loading.show();
        Fetch.post('user/outLogin', data, res => {
            this.loading.hide();
            if (res && res.success) {
                this.removeLoginInfo();
            } else {
                this.eAlert.show('alert', res.info, this.removeLoginInfo.bind(this));
            }
        }, err => {
            this.loading.show('netFail', "网络错误", 2000);
        }, null, this);
    };

    removeLoginInfo() {
        Storage.removeItem(StorageKeys.eTD_USERINFO);
        global.forbidTransition = true;
        this.setState({
            isLogin: false
        }, this.loadPage.bind(this, 'login', {dispatch: false, goHome: true}));
    };

    signOut() {
        this.eAlert.show('confirm', '确定要退出登录？', this.outLogin.bind(this));
    };

    openWechat() {
        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                return Linking.openURL('weixin://');
            } else {
                console.log('Don\'t konw how to open URI:');
            }
        });
    };

    focusOnWechat() {
        this.growingIO(6);
        Clipboard.setString('etdzixun');
        this.eAlert.show('confirm', '已复制微信公众号,\n打开微信-通讯录-粘贴公众号', this.openWechat, '去关注');
    };

    takePhone() {
        Linking.canOpenURL('tel:' + systemInfos.customer_service_tel_num).then(supported => {
            if (supported) {
                return Linking.openURL('tel:' + systemInfos.customer_service_tel_num);
            } else {
                console.log('Don\'t know how to open URI: "tel:' + systemInfos.customer_service_tel_num + '"')
            }
        });
    };

    callService() {
        this.growingIO(7);
        this.eAlert.show('confirm', '客服咨询时间：8:00 - 20:00，\n客服电话' + systemInfos.customer_service_tel_num + '，是否拨打', this.takePhone);
    };

    inviteFriend() {
        this.growingIO(4);
        this.loading.show();
        Fetch.post('more/getSysCurrTime', {}, res => {
            this.loading.hide();
            if (res && res.success) {
                if (res.body) {
                    this.props.navigation.navigate('webview', {
                        source: {uri: url.activeServer + 'static/invite/index.html?rct=true'},
                        title: '邀请新人有钱赚',
                        h5Page: false
                    })
                } else {
                    this.inviteFriends.showModal();
                }
            }
        }, err => {
            this.loading.hide();
        });
    };

    render() {
        return (
            <View ref={ref => this.view = ref} style={MoreStyles.container}>
                {
                    Util.isIOS ?
                        <StatusBar barStyle={this.state.statusBar}/>
                        :
                        null
                }
                <XHeader/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={MoreStyles.banner}>
                        <Image source={require('../../imgs/more/logo.png')}/>
                    </View>
                    <View style={MoreStyles.space}>
                        <ListItem title='帮助中心' rightText={false} callBack={this.loadPage.bind(this, 'webview', {
                            title: '帮助中心',
                            source: {uri: systemInfos.help_center_url},
                            noSpace: true
                        })}/>
                        <ListItem title='当前版本' rightText={Util.isIOS ? appVersion : appAndroidVersion}/>
                        <ListItem title='问题反馈' rightText={false}
                                  callBack={this.loadPage.bind(this, 'feedBack', {title: '我要反馈'})}/>
                        <ListItem title='关于我们' rightText={false} callBack={this.loadPage.bind(this, 'webview', {
                            title: '关于我们',
                            source: {uri: systemInfos.about_us_url},
                            h5Page: true
                        })}/>
                        {
                            this.state.isLogin ?
                                <ListItem title='邀请好友' rightText={false} callBack={this.inviteFriend.bind(this)}/>
                                : null
                        }
                        {
                            this.state.isLogin ?
                                <ListItem title='消息中心'
                                          point={this.state.newMessageNum > 0 || this.state.newMessageNoticesNum > 0 ? true : false}
                                          rightText={false} callBack={this.loadPage.bind(this, 'messageCenter', {
                                    title: '消息中心',
                                    newMessageNum: this.state.newMessageNum,
                                    newMessageNoticesNum: this.state.newMessageNoticesNum
                                })}/>
                                : null
                        }
                        <ListItem title='官方微信' rightText='etdzixun' callBack={this.focusOnWechat.bind(this)}/>
                        <ListItem title='客服电话' rightText={systemInfos.customer_service_tel_num}
                                  callBack={this.callService.bind(this)}/>
                        <ListItem title='在线客服' last={true} callBack={this.loadPage.bind(this, 'webview', {
                            title: '在线客服',
                            source: {uri: systemInfos.online_webchat_url + '?custAcc=' + this.state.userPhone + '&vip=0&mediaType=5'},
                            h5Page: true,
                            OnlineWebchat: true,
                        })}/>
                        {
                            __DEV__ ?
                                <View>
                                    <Line full/>
                                    <ListItem title='开发者工具'
                                              color="red"
                                              callBack={() => this.toDevelopPage()}
                                    />
                                </View>

                                :
                                null
                        }
                    </View>
                    <View style={[MoreStyles.btn, this.state.isLogin && {paddingTop: Util.pixel * 38}]}>
                        {
                            this.state.isLogin ?
                                <Btn title='退出登录' callBack={this.signOut.bind(this)}/>
                                :
                                <View>
                                    <Btn title='注册' callBack={this.loadPage.bind(this, 'register', '')}/>
                                    <View style={{height: Util.pixel * 10}}></View>
                                    <Btn title='我有账号去登录' style={{
                                        backgroundColor: '#f2f2f2',
                                        borderWidth: Util.pixel * 1,
                                        borderColor: '#d8d8d8'
                                    }} textStyle={{color: '#888889'}} callBack={this.loadPage.bind(this, 'login', '')}/>
                                </View>
                        }
                    </View>
                </ScrollView>
                <InviteFriends ref={ref => this.inviteFriends = ref} root={this} navigation={this.props.navigation}/>
                <EAlert ref={ref => this.eAlert = ref}/>
                <Loading ref={ref => this.loading = ref}/>
            </View>
        );
    }
    toDevelopPage() {
        this.props.navigation.navigate('developPage')
    }
}
