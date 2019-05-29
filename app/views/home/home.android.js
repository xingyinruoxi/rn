/**
 * Created by glzc on 2017/12/6.
 */
/**
 * eTongDai React Native App
 * This is home view
 * @John
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    RefreshControl,
    Modal,
    Linking,
    NativeModules,
    ToastAndroid,
    BackHandler,
    AppState,
    Animated,
} from 'react-native';
import { homePageStyle } from './../../styles/home/homeStyles';
import Line from './../../commons/line';
import Vline from './../../commons/vLine';
import Util,{Grow} from './../../commons/util';
import Fetch from './../../commons/fetch';
import DeviceInfo from 'react-native-device-info';
import HomeSwiper from './component/homeSwiper';
import Loading from './../components/loading';
import EAlert from './../components/ealert';
import RegistryEntry from './component/registerEntry';
import Tool from './component/tool';
import InviteFriends from './component/inviteFriends';
import Notices from './component/notice';
import codePush from "react-native-code-push";
import Button from "./../components/button";
const Config = require('./../../commons/config');
const Storage = require('./../../commons/storage');
const StorageKeys = require('./../../commons/storageKey');
const EventEmitter = require('RCTDeviceEventEmitter');
const {systemInfos, url} = require('./../../commons/config');

import * as launchImage from 'react-native-launch-image';
import PullRefreshScrollView from './../components/pullRefreshScrollView/PullRefreshScrollView';
import AdEnter from './component/popupAdEnter';
import JPushModule from 'jpush-react-native';
import {NavigationActions} from 'react-navigation';
export default class Home extends Component {
    constructor(props){
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            homeData:null,
            totalDealMoney:[],
            login: 2,    //1 =》已登录，2 =》 未登录
            auth: null  , //开户状态，1 =》 开户，2 =》 未开户,
            fingerPrint: false,
            isRefresh: false,
            useId: null,
            sessionId: null,
            tickCount: 0,
            newMessageNum: 0,    ////站内消息
            newMessageNoticesNum: 0,   //网站公告
            runTimeD: null,   //运营天数
            userPhone: null,  //用户手机号
            visible: false,
            newEdition: null,
            showLeading: false,
            isLogin: false,
            appState: AppState.currentState,
            opacity: new Animated.Value(1),
            showAd: false,
            timeDown: 3,
            netError: false,
            OpenScreeAd: global._OpenScreenAd,
            isInvested: false,
            showAdImg: true,
            notShow: true,
            dev: false,
            pullRefreshText: '',
            adInfos: null,
        };
        this.interValID = null;
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
        this.toAdPage = this.toAdPage.bind(this);
				this.toAdPageClick = this.toAdPageClick.bind(this);
        this.isLoginChange = false;    //判断登陆状态变化
    };
    componentWillMount(){
        if(__scenes.length == 1){
            EventEmitter.addListener('checkFingerPwd',() => {
                this.checkFingerPwd()
            });
            EventEmitter.addListener('toLogin',() => {
                setTimeout(() => {
                    this.props.navigation.navigate('login',{fromHome: true,dispatch: 'goBack'});
                },800);
            });
            EventEmitter.addListener('showLeading',() => {
                this.setState({
                    showLeading: global.__firstComeHome
                })
            })
					if(!(this.state.OpenScreeAd && this.state.OpenScreeAd.picUrl)){
						this.checkFingerPwd(true)
					}
        }
        //加载广告悬浮窗入口数据
        this._loadAdInfos();
    };
    _handleAppStateChange(nextAppState){
        if((nextAppState != this.state.appState) && nextAppState == 'background'){
            codePush.sync({ installMode: codePush.InstallMode.ON_NEXT_RESUME })
        }
        this.setState({appState: nextAppState});
    }
    growingIO(n){
        switch (n){
            case 0:
							this.state.login == 2 ? Grow.track('pg_home_userbrowse',{'pg_home_userbrowse':'首页浏览量'}) : Grow.track('pg_home_userlogoutbrowse',{'pg_home_userlogoutbrowse':'APP首页-未登录（浏览量）'});
							//首页浏览量
                break;
            case 1:
                Grow.track('elbn_home_checkin_click',{'elbn_home_checkin_click':'每日签到图标点击量'});  //每日签到图标点击量
                break;
            case 2:
                Grow.track('elbn_home_invite_click',{'elbn_home_invite_click':'邀请好友图标点击量'});   //邀请好友图标点击量
                break;
            case 3:
                Grow.track('elbn_home_recharge_click',{'elbn_home_recharge_click':'我要充值图标点击量'});  //我要充值图标点击量
                break;
            case 4:
                Grow.track('elbn_home_myred_click',{'elbn_home_myred_click':'我的红包图标点击量'});     //我的红包图标点击量
                break;
            case 5:
                Grow.track('elbn_home_moreprojects_click',{'elbn_home_moreprojects_click':'更多按钮点击量'}); //更多按钮点击量
                break;
            case 6:
                Grow.track('elbn_home_messagecenter_click',{'elbn_home_messagecenter_click':'消息中心按钮点击量'}); //消息中心按钮点击量
                break;
            default :
                break;
        }
    };
	checkFingerPwd(flag: firstLogin,toAdPge){
		if(global.__canCheck ){
			global.__canCheck = false;
			Storage.getItem(StorageKeys.eTD_FINGUERPRINT).then((data) => {

				if(data && global.__isLogin){
					global.forbidTransition = true;
					this.props.navigation.navigate('fingerPrint',{toAdPage: () => {if(toAdPge) {this.toAdPage()}}});
				}
				if(global.__isLogin && !data){
					this.checkGesture(flag ? "firstLogin" : null, toAdPge);
				}else{
					Storage.getItem(StorageKeys.eTD_GESTUREPWD).then((data) => {
						if(data &&  data.pwd && data.pwd.length > 0 && !data.hide){
							global.__haveSetGesture = true;
						}

					})
				}
			});
		}
	}
    exitApp(){
        if(this.lastPress && this.lastPress + 2000 >= Date.now()){
            BackHandler.exitApp();
        }else{
            ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
            this.lastPress = Date.now();
        }
    }
    checkVersion(){
        let data = {
            currentVersion: Util.isIOS ? Config.appVersion : Config.appAndroidVersion,
            useClientVersion: Util.isIOS ? 0 : 1,
        };
        console.log('checkVersion',data)
        Fetch.post('more/checkVersion',data,res => {
            console.log('more/checkVersion',res)
            if(res.success){
                this.setState({
                    newEdition: res.body,
                    visible: true,
                    showLeading: false,
                });
            }else{
                codePush.sync({ installMode: codePush.InstallMode.ON_NEXT_RESUME });
                if(global.__fromLaunch || global._OpenScreenAd){
                    this.setState({
                        showLeading: false,
                        visible: false,
                    })
                }else{
                    this.setState({
                        visible: false,
                        showLeading: global.__firstComeHome
                    });
                }

            }
        },error => {
            codePush.sync({ installMode: codePush.InstallMode.ON_NEXT_RESUME })
        })
    }
	checkGesture(status, toAdPge){
		Storage.getItem(StorageKeys.eTD_GESTUREPWD).then((data) => {

			if(data && !data.hide){
				if(status == 'firstLogin' && data.pwd && data.pwd.length > 0){
					global.__haveSetGesture = true;
				}else{
					Storage.setItem(StorageKeys.eTD_GESTUREPWD,"");
					global.__haveSetGesture = false;
				}
				global.forbidTransition = true;


				this.props.navigation.navigate('GesturePwd',{callback: () => {global.__haveSetGesture = false;},toAdPage: () => {if(toAdPge) {this.toAdPage()}}});

			}else{
				if(toAdPge){
					this.toAdPage()
				}
			}
		});
	}
	goHome(){
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({routeName: 'tab'})
			],
		});
		this.props.navigation.dispatch(resetAction)
	};
    componentDidMount(){

			JPushModule.addReceiveOpenNotificationListener((event) => {
				this.goHome()
				if(event.type){
					switch(event.type){
						case "home": this.props.navigation.navigate('home');break;
						case "project": this.props.navigation.navigate('list');break;
						case "my-red":  this.state.isLogin ? this.props.navigation.navigate('redPacket') : this.props.navigation.navigate('login',{callback: () => {this.props.navigation.navigate('redPacket')}}); break;
						case "my-increase": this.state.isLogin  ? this.props.navigation.navigate('tickets') : this.props.navigation.navigate('login',{callback: () => {this.props.navigation.navigate('tickets')}}); break;
						case "home-banner":this.props.navigation.navigate('webview', {source: {uri: event.url},title: event.title,h5Page: false})
					}
				}
			})
        // from local storage check user has login or not
        // user has login then auto login and get home data
        // is not login direct get home data
        // codePush.sync();
        this.setPullRefreshText();
        Util.isIOS ? launchImage.hide() : NativeModules.Splash.hide();
        this.getUserInfo(true);
        //this.getHomeData(false);
        EventEmitter.addListener('isHome',()=>{
            setTimeout(() => {this.getUserInfo(false)},200);
        });
        if(global.__toLogin ){
            global.__toLogin = false;
            if(global.__fromLaunch){
                this.setState({
                    showLeading: false,
                })
            }
            setTimeout(() => {
                this.props.navigation.navigate('register')
            },100);

        }


        if(__scenes.length == 1) {
            this.checkVersion();
            this.showAdScreen();
        }
    };
    showAdScreen () {
        //开屏广告
        let time = this.state.timeDown;
        this.setState({
            showAd: true
        });
        this.interValID = setInterval(() => {
            if(time > 1){
                time-- ;
                this.setState((preState) => {
                    return {
                        timeDown: time
                    }
                });
            }else{
                this.hideAdScreen();
            }
        },1000);
    }
    hideAdScreen () {
        clearInterval(this.interValID);
        Animated.timing(this.state.opacity,{
            toValue: 0,
            duration: 1000
        }).start((event) => {
            if(event && event.finished){
                this.setState((preState) => {
                    return {
                        showAd: false,
                        //showLeading: global.__firstComeHome
                    }
                })
							this.checkFingerPwd(true);
            }
        });
    }
    getUserInfo(flag, refresh) {
        if (this.view) {
            this.growingIO(0);
            Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
                //console.log('StorageKeys.eTD_USERINFO',global.__isLogin.sessionId,res.sessionId);
                if (res && res.sessionId) {
                    this.setState({
                        login: 1,
                        auth: res.sftUserMdl.accountState == 5 ? 1 : 2,
                        useId: res.sftUserMdl.useId,
                        sessionId: res.sessionId,
                        userPhone: res.sftUserMdl.useMobilePhones,
                        isLogin: true,
                    }, () => {
                        this.getTickcount();
                        this.getNotReadMsg();
                        !this.state.isInvested && this.isInvested();
                        (!this.isLoginChange || flag) && this.getHomeData(refresh);
                        this.isLoginChange = true
                    })
                } else {
                    this.setState({
                        login: 2,
                        auth: 2,
                        tickCount: 0,
                        newMessageNum: 0,    ////站内消息
                        newMessageNoticesNum: 0,   //网站公告
                        isLogin: false,
                        isInvested: false,
                    }, () => {
                        (this.isLoginChange || flag) && this.getHomeData(refresh);
                        this.isLoginChange = false
                    });
                }
            }, err => {
            });
        }else{
            //console.log('=====================');
        }
    };
    getRunD(){
        Fetch.post('more/runtime',{},res => {
            this.setState({
                runTimeD: res.runTimeD
            });
        },err => {

        });
    };
    // get home data from api
    getHomeData(refresh){
        this.getRunD();
        this.loading.show();
        let body = null;
        body = this.state.isLogin ? {
            useId: this.state.useId,
            sessionId: this.state.sessionId,
            idfa:DeviceInfo.getUniqueID(),
        } : {
            idfa:DeviceInfo.getUniqueID(),
        };
        Fetch.post('more/ind',body,(res) => {
            refresh && refresh.onRefreshEnd();
            this.loading && this.loading.hide();
            if (res.success) {
                let reg = /(?=(?!\b)(\d{4})+$)/g;
                this.setState({
                    homeData : res.body,
                    totalDealMoney: String(res.body.totalDealMoney).replace(reg, ',').split(','),
                });
            } else {
                //show network issue warning;
                this.loading.show('netFail',"网络错误",2000)
                this.setState({
                    netError: true,
                })
            }
        }, (error) => {
            // show network issue warning
            refresh && refresh.onRefreshEnd();
            this.loading.show('netFail',"网络错误",2000)
            this.setState({
                netError: true,
            });
        },null,this)
    };
    getTickcount(){
        let body = {
            useId: this.state.useId,
            sessionId: this.state.sessionId,
        };
        Fetch.post('investments/gettickcount',body,res => {

            if(res && res.success){
                this.setState({
                    tickCount: res.body.tickCount,
                })
            }else{
                this.setState({
                    tickCount: 0,
                });
            }
        },err => {
            this.loading &&  this.loading.show('netFail','网络超时',2000);
        },null,this);
    };
    getNotReadMsg(){
        let data = {
            useId: this.state.useId,
            sessionId: this.state.sessionId,
        };
        Fetch.post('more/noreadmsg',data,res => {
            if(res && res.success){
                this.setState({
                    newMessageNum: res.body.notReadMsg
                });
            }else{
                this.setState({
                    newMessageNum: 0,
                });
            }
        },err => {
            this.loading &&  this.loading.show('netFail','网络超时',2000)
        },null,this);
    };
    toPage(routeName,params, index){
			if(routeName == 'projectInfo'){
				if(params.througthButton && !this.state.isLogin){
					Grow.track('elbn_home_nolog_goinvest_click',{'elbn_home_nolog_goinvest_click':'首页-未登录-新手专区立即出借按钮（点击量）'});
				}else{
					if(this.state.isLogin){
						index == 0 && Grow.track('elbn_home_recommend1_goinvest_click',{'elbn_home_recommend1_goinvest_click':'首页-已登录-推荐项目-1立即出借按钮（点击量）'});
						index == 1 && Grow.track('elbn_home_recommend2_goinvest_click',{'elbn_home_recommend2_goinvest_click':'首页-已登录-推荐项目-2立即出借按钮（点击量）'});
						index == 2 && Grow.track('elbn_home_recommend3_goinvest_click',{'elbn_home_recommend3_goinvest_click':'首页-已登录-推荐项目-3立即出借按钮（点击量）'});

					}
				}
			}

			routeName === 'list' && this.growingIO(5);
        this.props.navigation.navigate(routeName,params);
    };
    _refresh(refresh){
        this.setPullRefreshText();
        this.getUserInfo(true, refresh);
    };
    hideModal(){
        this.setState({
            visible: false,
        })
        if(global.__fromLaunch){
            this.setState({
                showLeading: false,
            })
        }else{
            // this.setState({
            //     showLeading: global.__firstComeHome,
            // })
        }
    }
    update(){
        console.log('this.state.newEdition',this.state.newEdition)
        if(this.state.newEdition ){
            if(this.state.newEdition.isUsing == '1'){
                this.hideModal();
            }
            if(Util.isIOS){
                Linking.openURL(Config.appstore.ios)
            }else{
                NativeModules.ETDUpdateModule.startDownload(this.state.newEdition.ppctVersionMdl.url)
            }
        }
    };
    hideLeading(){
        this.setState({showLeading: false});
        global.__firstComeHome = false;
        Storage.setItem(StorageKeys.eTD_FIRSTCOMEHOME,true)
    };
    isInvested(){
        let data = {
            useId: this.state.useId,
            sessionId: this.state.sessionId,
        }
        Fetch.post('more/checkLendingBehavior',data,res => {
            if(res && res.success){
                this.setState({
                    isInvested: res.body
                })
            }
        }, err => {
            this.loading &&  this.loading.show('netFail','网络超时',2000);
        })
    };
    setPullRefreshText(){
        Util.getPullRefreshText((text) => {
            this.setState({
                pullRefreshText: text || '财富结缘，易生相伴'
            })
        })
    }
    _loadAdInfos(){
        Fetch.post('more/getSuspensionPosition', {}, res => {
            if(res && res.success){
                this.setState({
                    adInfos: res.body
                })
            }
        }, err => {})
    };
    render() {
        return (
            <View ref={ref => this.view=ref} style={homePageStyle.topLevelContainer}>
                <PullRefreshScrollView
                    style={homePageStyle.container}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    //refreshControl={<RefreshControl onRefresh={this._refresh.bind(this)} refreshing={this.state.isRefresh}  title="努力加载中..." />}
                    onRefresh={(pullRefresh) => {this._refresh(pullRefresh)}}
                    refreshText={this.state.pullRefreshText}
                    refreshedText={this.state.pullRefreshText}
                    refreshingText={this.state.pullRefreshText}
                    >
                    <View style={{backgroundColor: '#fff',position: 'relative'}}>
                        {
                            this.state.homeData != null && this.state.homeData.picList.length != 0 ?
                                <HomeSwiper navigation={this.props.navigation} picList={this.state.homeData.picList} />
                                :
                                this.state.netError ?
                                    <Image style={homePageStyle.swiper} source={require('./../../imgs/home/banner_fail.png')} />
                                    :
                                    <Image style={homePageStyle.swiper} source={require('./../../imgs/home/banner_loading.png')} />
                        }

                    </View>
									<View style={homePageStyle.marqueenContainer}>
										<Image source={require('./../../imgs/home/trumpet.png')}/>
										<View style={{flex:1}}>
											<Notices ref={ref => this.notices=ref} navigation={this.props.navigation} root={this} />
										</View>
										<Image source={require('./../../imgs/home/arrow_right.png')} />
									</View>
                    <View>
                        <Tool root={this} navigation={this.props.navigation} />
                    </View>
                    {
                        !this.state.isLogin ?
                            <View>
                                <RegistryEntry navigation={this.props.navigation} />
                            </View>
                            :null
                    }
                    {
                        this.state.isInvested ?
                            null
                            :
                            <View>
                                {
                                    this.state.homeData && this.state.homeData.iteList ?
                                        <View style={[homePageStyle.productLists,{paddingBottom: Util.pixel*22}]}>
                                            <View style={homePageStyle.padding}>
                                                <View style={[homePageStyle.header,homePageStyle.flexRow]}>
                                                    <View style={[homePageStyle.flexRow]}>
                                                        <Image source={require('./../../imgs/home/new_product_tag.png')}/>
                                                        <Text allowFontScaling={false} style={[homePageStyle.maxFontSize,{color: '#025fcb'}]}>新手专享</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Line full={true}/>
                                            <View style={{paddingBottom: Util.pixel*8}}>
                                                <View style={[homePageStyle.flexRow,{justifyContent: 'center',paddingTop: Util.pixel*15,paddingBottom: Util.pixel*15}]}>
                                                    <View style={[homePageStyle.flexColumn,]}>
                                                        <View style={[homePageStyle.flexRow,{height: Util.pixel*56}]}>
                                                            <Text allowFontScaling={false}
                                                                  style={[homePageStyle.rateFontSize,{height: Util.pixel*56,fontSize: Util.commonFontSize(40)}]}>{(this.state.homeData.iteList[0].yearRate * 100).toFixed(2)}</Text>
                                                            <Text allowFontScaling={false}
                                                                  style={[homePageStyle.rateUnit,{height: Util.pixel*56,paddingTop: Util.pixel*21}]}>%</Text>
                                                        </View>
                                                        <View>
                                                            <Text allowFontScaling={false}
                                                                  style={[homePageStyle.minFontSize,{marginTop: 0}]}>预期年回报率</Text>
                                                        </View>
                                                    </View>
                                                    <Vline color="#d8d8d8" height={30} style={{marginLeft: Util.pixel*30,marginRight: Util.pixel*30}} />
                                                    <View style={[homePageStyle.flexColumn,{alignItems: 'flex-start'}]}>
                                                        <View style={[homePageStyle.flexRow,{height: Util.pixel*56}]}>
                                                            <Text allowFontScaling={false} style={[homePageStyle.minFontSize,{marginTop: 0}]}>项目期限：</Text>
                                                            <Text allowFontScaling={false} style={[homePageStyle.minFontSize,{marginTop: 0,color: '#000000'}]}>{this.state.homeData.iteList[0].repayDate}{this.state.homeData.iteList[0].repayIntervalName || (this.state.homeData.iteList[0].repayInterval == 1 ? '个月' : '天')}</Text>
                                                        </View>
                                                        <View style={homePageStyle.flexRow}>
                                                            <Text allowFontScaling={false} style={[homePageStyle.minFontSize,{marginTop: 0}]}>起投金额：</Text>
                                                            <Text allowFontScaling={false} style={[homePageStyle.minFontSize,{marginTop: 0,color: '#000000'}]}>{this.state.homeData.iteList[0].iteBidMinYuan || '100'}元</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[homePageStyle.flexRow,{justifyContent: 'center'}]}>
                                                    <Button buttonName="立即出借" color="#e94639" width={Util.size.width - Util.pixel*74} onPress={this.toPage.bind(this,'projectInfo',{useType: 0,claId: this.state.homeData.iteList[0].claId,iteId: this.state.homeData.iteList[0].iteId,title: '项目详情',noLine: true, througthButton: true})} />
                                                </View>
                                            </View>
                                        </View>
                                        : null
                                }
                            </View>
                    }
                    <View style={homePageStyle.productLists}>
                        <View style={homePageStyle.padding}>
                            <View style={[homePageStyle.header,homePageStyle.flexRow]}>
                                <View style={[homePageStyle.flexRow]}>
                                    <Image source={require('./../../imgs/home/tag.png')}/>
                                    <Text allowFontScaling={false} style={homePageStyle.maxFontSize}>推荐项目</Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={this.toPage.bind(this,'list',{toListDetail: true,page: 0})}
                                    >
                                    <View
                                        style={[homePageStyle.moreBtn,homePageStyle.flexRow,{justifyContent: 'flex-end'}]}>
                                        <Text allowFontScaling={false}
                                              style={homePageStyle.minFontSize}>更多</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Line full={true}/>
                        {
                            this.state.homeData && this.state.homeData.iteList ? this.state.homeData.iteList.map((v, k) => {
                                if (k > 0) {
                                    return (
                                        <View key={k}>
                                            <View style={homePageStyle.padding}>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={this.toPage.bind(this,'projectInfo',{useType: 0,claId: v.claId,iteId: v.iteId,title: '项目详情',noLine: true},k)}
                                                    >
                                                    <View
                                                        style={[homePageStyle.productItem,homePageStyle.flexRow]}>
                                                        <View
                                                            style={{width: (Util.size.width-Util.pixel*28)/3,paddingLeft: Util.pixel*10}}>
                                                            <View
                                                                style={{flexDirection: 'row',alignItems: 'flex-end',height: Util.pixel*36}}>
                                                                <Text allowFontScaling={false}
                                                                      style={homePageStyle.rateFontSize}>{(v.yearRate * 100).toFixed(2)}</Text>
                                                                <Text allowFontScaling={false}
                                                                      style={homePageStyle.rateUnit}>%</Text>
                                                            </View>
                                                            <Text allowFontScaling={false}
                                                                  style={homePageStyle.minFontSize}>预期年回报率</Text>
                                                        </View>
                                                        <View
                                                            style={{width:  (Util.size.width-Util.pixel*28)/3,paddingLeft: Util.pixel*30,}}>
                                                            <View
                                                                style={{flexDirection: 'row',alignItems: 'flex-end',height: Util.pixel*36}}>
                                                                <Text allowFontScaling={false}
                                                                      style={[homePageStyle.rateFontSize,{color: '#4a4a4a',fontSize: Util.pixel*24,paddingTop: Util.pixel*6,}]}>{v.repayDate}</Text>
                                                                <Text allowFontScaling={false}
                                                                      style={[homePageStyle.rateUnit,{color: '#4a4a4a',fontSize: Util.pixel*13,paddingTop: Util.pixel*17,}]}>{v.repayIntervalName || (v.repayInterval == 1 ? '个月' : '天')}</Text>
                                                            </View>
                                                            <Text allowFontScaling={false}
                                                                  style={homePageStyle.minFontSize}>期限</Text>
                                                        </View>
                                                        <View
                                                            style={{alignItems: 'center',width: (Util.size.width-Util.pixel*28)/3}}>
                                                            <View
                                                                style={[homePageStyle.lendBtn,{alignItems: 'center',justifyContent: 'center'},v.isNewItem && v.isNewItem == 1 && {backgroundColor: '#e94639'}]}>
                                                                <Text allowFontScaling={false}
                                                                      style={[homePageStyle.maxFontSize,{color: '#e94639',marginLeft: 0},v.isNewItem && v.isNewItem == 1 && {color: '#fff'}]}>{(v.isNewItem && v.isNewItem == 1) ? '新手专享' : '立即出借'}</Text>
                                                            </View>
                                                            <Text allowFontScaling={false}
                                                                  style={homePageStyle.minFontSize}>{v.iteBidMinYuan || 100}元起投</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            { k < 3 ? <Line full={true}/> : null }
                                        </View>
                                    )
                                }
                            }) : null
                        }
                    </View>
                    <View style={homePageStyle.productLists}>
                        <View style={homePageStyle.padding}>
                            <View style={[homePageStyle.header,homePageStyle.flexRow]}>
                                <View style={[homePageStyle.flexRow]}>
                                    <Image source={require('./../../imgs/home/tag.png')}/>
                                    <Text allowFontScaling={false} style={homePageStyle.maxFontSize}>运营数据</Text>
                                </View>
                            </View>
                        </View>
                        <Line full={true}/>
                        <View style={homePageStyle.padding}>
                            <View
                                style={[homePageStyle.flexRow,{justifyContent: 'space-around'},homePageStyle.productItem]}>
                                <View
                                    style={[homePageStyle.flexColumn,{height: Util.pixel*50,justifyContent: 'space-between'}]}>
                                    <View style={{flexDirection: 'row',alignItems: 'flex-end'}}>
                                        <Text allowFontScaling={false}
                                              style={homePageStyle.operatingData}>{this.state.homeData ? Math.floor(this.state.homeData.totalUser / 10000) : '--'}</Text>
                                        <Text allowFontScaling={false}
                                              style={homePageStyle.minOperatingData}>万</Text>
                                    </View>
                                    <Text allowFontScaling={false}
                                          style={homePageStyle.minFontSize}>注册用户数</Text>
                                </View>
                                <Vline color='#f8f8f8' height={50} style={{width: 1}}/>
                                <View
                                    style={[homePageStyle.flexColumn,{height: Util.pixel*50,justifyContent: 'space-between'}]}>
                                    <View style={{flexDirection: 'row',alignItems: 'flex-end'}}>
                                        <Text allowFontScaling={false}
                                              style={homePageStyle.operatingData}>{this.state.homeData ? ((this.state.homeData.totalDealMoney / 10000) / 10000).toFixed(2) : '--'}</Text>
                                        <Text allowFontScaling={false}
                                              style={homePageStyle.minOperatingData}>亿</Text>
                                    </View>
                                    <Text allowFontScaling={false}
                                          style={homePageStyle.minFontSize}>已撮合借款</Text>
                                </View>
                                <Vline color='#f8f8f8' height={50} style={{width: 1}}/>
                                <View
                                    style={[homePageStyle.flexColumn,{height: Util.pixel*50,justifyContent: 'space-between'}]}>
                                    <View style={{flexDirection: 'row',alignItems: 'flex-end'}}>
                                        <Text allowFontScaling={false}
                                              style={homePageStyle.operatingData}>{this.state.runTimeD ? this.state.runTimeD : '--'}</Text>
                                        <Text allowFontScaling={false}
                                              style={homePageStyle.minOperatingData}>天</Text>
                                    </View>
                                    <Text allowFontScaling={false} style={homePageStyle.minFontSize}>平稳运营</Text>
                                </View>
                            </View>
                        </View>
                    </View>
									{/*TODO*/}
									<View style={homePageStyle.safeAndInfoContainer}>
										<TouchableOpacity activeOpacity={0.75} onPress={this.toWebPage.bind(this,systemInfos.infomation_announce_url,'信息披露')}>
											<Image source={require('./../../imgs/home/infoOutSide.png')} style={homePageStyle.safeImageContainer} >
												<View style={homePageStyle.safeImageContent}>
													<Image source={require('./../../imgs/home/infoInSide.png')}/>
												</View>
												<View style={homePageStyle.safeTextContent}>
													<Text style={homePageStyle.safeText}>信息披露</Text>
													<Text style={[homePageStyle.safeText,{fontSize: 10,marginTop: 5}]}>坚守合规</Text>
												</View>
											</Image>
										</TouchableOpacity>
										<TouchableOpacity activeOpacity={0.75} onPress={this.toWebPage.bind(this,systemInfos.safety_Guarantee,'安全保障')}>
											<Image source={require('./../../imgs/home/safeOutSide.png')} style={homePageStyle.safeImageContainer}>
												<View style={homePageStyle.safeImageContent}>
													<Image source={require('./../../imgs/home/safeInSide.png')}/>
												</View>
												<View style={homePageStyle.safeTextContent}>
													<Text style={homePageStyle.safeText}>安全保障</Text>
													<Text style={[homePageStyle.safeText,{fontSize: 10,marginTop: 5}]}>如约兑付</Text>
												</View>
											</Image>
										</TouchableOpacity>
									</View>
                    <View
                        style={[homePageStyle.flexRow,{justifyContent: 'center',alignItems: 'flex-end',height: Util.pixel*60,}]}>
                        <Text allowFontScaling={false} style={homePageStyle.footerNotice}>市场有风险，选择需谨慎</Text>
                    </View>
                </PullRefreshScrollView>
                <InviteFriends ref={ref => this.inviteFriends=ref} root={this} navigation={this.navigation} />
                <Loading ref={ref => this.loading = ref}/>
                <EAlert ref={ref => this.eAlert = ref}/>
                {
                    this.state.visible ?
                        <Modal visible={this.state.visible}
                               animationType="fade"
                               transparent={true}
                               onRequestClose={this.exitApp.bind(this)}>
                            <View style={homePageStyle.m_container}>
                                <Image style={homePageStyle.m_contentBox} source={require('./../../imgs/commons/newEdition.png')}>
                                    <Text allowFontScaling={false} style={homePageStyle.m_contentTitle}>发现新版本</Text>
                                    <View style={homePageStyle.m_content}>
                                        <Text allowFontScaling={false} style={homePageStyle.m_contentItem}>{this.state.newEdition && this.state.newEdition.ppctVersionMdl.description}</Text>
                                    </View>
                                    <TouchableOpacity  activeOpacity={0.7} style={homePageStyle.m_updateButton} onPress={this.update.bind(this)}>
                                        <Text allowFontScaling={false} style={homePageStyle.m_updateButtonText}>立即更新</Text>
                                    </TouchableOpacity>
                                </Image>
                                {
                                    (this.state.newEdition && this.state.newEdition.isUsing == '1') ?
                                        <View style={homePageStyle.m_ButtonBox}>
                                            <TouchableOpacity style={homePageStyle.m_button} onPress={this.hideModal.bind(this)}>
                                                <Text allowFontScaling={false} style={homePageStyle.m_buttonTitle}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        null
                                }

                            </View>
                        </Modal>
                        :
                        null
                }

                {
                    this.state.showLeading ?
                        <Modal visible={this.state.showLeading}
                               animationType="fade"
                               transparent={true}
                               onRequestClose={() => {}}
                            >
                            <View style={homePageStyle.l_content}>
                                <Image style={[homePageStyle.l_justRegiste,(Util.deviceType == '5' || Util.deviceType == '5s') && {width: 300 * Util.pixel,height: 300 * Util.pixel/634 * 300}]} source={require('./../../imgs/commons/leading/justRegist.png')}/>
                                <TouchableOpacity activeOpacity={0.7} style={[homePageStyle.iKnow]} onPress={() => this.hideLeading()}>
                                    <Image  style={(Util.deviceType == '5' || Util.deviceType == '5s') && homePageStyle.iKnowImg}source={require('./../../imgs/commons/leading/IKnow.png')}/>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        :
                        null
                }

                {
                     this.state.OpenScreeAd && this.state.OpenScreeAd.picUrl ?
                        <Modal  visible={this.state.showAd}
                                transparent={true}
                                onRequestClose={() => this.hideAdScreen()}
                            >
                            <Animated.View style={[homePageStyle.a_content,{opacity: this.state.opacity}]}>
                                <TouchableOpacity activeOpacity={1}style={{flex:1}} onPress={this.toAdPageClick}>

                                    {
                                        this.state.showAdImg && this.state.OpenScreeAd ?
                                            <Image onError={() => this.setState({showAdImg: false})} style={{height: Util.size.width * 112 / 75,width: Util.size.width}} source={{uri: this.state.OpenScreeAd.picUrl}}/>
                                            :
                                            <Image style={{height: Util.size.width * 112 / 75,width: Util.size.width}} source={require('./../../imgs/adscreen.jpg')}/>

                                    }
                                    <TouchableOpacity acitveOpacity={0.75} style={[homePageStyle.a_timeDownBox]} onPress={() => {this.hideAdScreen();EventEmitter.emit('showLeading')}}>
                                        <Text style={[homePageStyle.a_timeDownTitle]}>跳过{this.state.timeDown}s</Text>
                                    </TouchableOpacity>
                                    <View style={[homePageStyle.a_bottomLogoBox]}>
                                        <Image source={require('./../../imgs/commons/smalllogo.png')} />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        </Modal>
                        :
                        null
                }
                {
                    this.state.adInfos ?
                        <View style={homePageStyle.adEnter}>
                            <AdEnter navigation={this.props.navigation} data={this.state.adInfos} />
                        </View>
                        : null
                }
            </View>

        );
    }
	toWebPage(url, title) {
		switch(title){
			case "信息披露":
				if(!this.state.isLogin){
					Grow.track("elbn_home_nolog_infodisclosure_click",{"elbn_home_nolog_infodisclosure_click": "信息披露"})
				}else{
					Grow.track("elbn_home_infodisclosure_click",{"elbn_home_infodisclosure_click": "信息披露(已登录)"})
				}
			case "安全保障":
				if(!this.state.isLogin) {
					Grow.track("elbn_home_nolog_safety_click", {"elbn_home_nolog_safety_click": "安全保障"});
				}else{
					Grow.track("elbn_home_safety_click", {"elbn_home_safety_click": "安全保障(已登录)r"});
				}
		}
		this.props.navigation.navigate('webview',{source:{uri: url},title: title})
	}
	toAdPageClick () {
		console.log(this.state.OpenScreeAd)
		console.log(this.state.isLogin)
		if(this.state.isLogin){
			this.setState({
				showAd: false
			},() => {
				setTimeout(() => {
					clearInterval(this.interValID);
					this.checkFingerPwd(true,true);
				},0)
			});
		}else{
			this.toAdPage()
		}
	}
	toAdPage() {
		let {navigation} = this.props;
		let {OpenScreeAd} = this.state;
		if (OpenScreeAd && OpenScreeAd.picGoUrl.split('://')[1].length > 0) {
			let url = OpenScreeAd.picGoUrl.indexOf('?') > -1 ? OpenScreeAd.picGoUrl.trim() + '&rct=true' : OpenScreeAd.picGoUrl.trim() + '?rct=true'
			this.setState({
				showAd: false
			});
			clearInterval(this.interValID);
			setTimeout(() => {
				navigation.navigate('webview', {source: {uri: url}, title: OpenScreeAd.picTitle, h5Page: false});
			},330)

		}
	}
}
