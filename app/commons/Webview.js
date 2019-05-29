/**
 * Created by glzc on 2017/7/7.
 */
import React,{Component} from 'React';
import {
    WebView,
    View,
    Text,
    StyleSheet,
    BackHandler,
    requireNativeComponent,
} from 'react-native';
import Util from './util';
import HeaderBar from './headerBar';
import Loading from './../views/components/loading';
import { NavigationActions } from 'react-navigation';
import InviteFriends from './../views/home/component/inviteFriends';
import EAlert from './../views/components/ealert';
import {appVersion, appAndroidVersion} from './config';
import  DeviceInfo from 'react-native-device-info';
const Storage = require('./storage');
const StorageKeys = require('./storageKey');
const ETDWebView = Util.isIOS ? null : requireNativeComponent('ETDWebView',null);
const EventEmitter = require('RCTDeviceEventEmitter');
export default class WebViewCom extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            canGoBack : false,
            postParams: this.props.navigation.state.params.source ? this.props.navigation.state.params.source.body : null,
            source: this.props.navigation.state.params.source,
            userInfo: null,
            user: null,
            useId: null,
            sessionId: null,
            userPhone: null,
            isShowLoading: true,
        };
        this.userAgent = DeviceInfo.getUserAgent() + ' etongdai/' + (Util.isIOS ? appVersion : appAndroidVersion);
		EventEmitter.addListener('getUserInfoToken',() => {
			this.getUserInfo()
		});
    };
    componentWillMount(){
        this.getUserInfo();
    };
    componentDidMount(){
        this.backHandlerEvent = BackHandler.addEventListener('back',() => {this.changeState()});
    };
    componentWillUnmount(){
        this.backHandlerEvent.remove();
    };
	
    getUserInfo(){
        Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
            if(res) {
                let userInfo = {
                    token: res.user_token,
                    useId: res.sftUserMdl.useId,
                    phone: res.sftUserMdl.useMobilePhones,
                };
                this.setState({
                    userInfo,
                    user: res.sftUserMdl,
                    useId: res.sftUserMdl.useId,
                    sessionId: res.sessionId,
                    userPhone: res.sftUserMdl.useMobilePhones,
                },() => {
                    this.refs.webview && this.refs.webview.reload();
                });
            }
        });
    };
    setGoBack(canGoBack){
        this.setState({
            canGoBack:canGoBack
        })
    };
    loadPage(routeName,params){
        this.props.navigation.navigate(routeName,params);
    };
    loadSuccess(){
        //console.log('webview end');
        this.loading.hide();
    };
    loadStart(){
        //console.log('webview start');
        if(this.state.isShowLoading){
            this.setState({
                isShowLoading: false,
            });
            this.loading.show();
        }
    };
    back(key){
        this.props.navigation.goBack(key)
    };
    changeState(){
        if(this.state.canGoBack && this.refs.webview){
            this.refs.webview.goBack();
        };
        return false;
    };
    getInjectScript() {
        var originalPostMessage = window.postMessage;

        var patchedPostMessage = function(message, targetOrigin, transfer) {
            originalPostMessage(message, targetOrigin, transfer);
        };

        patchedPostMessage.toString = function() {
            return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
        };
        window.postMessage = patchedPostMessage;
    };
    _onMessage(e){
			console.log('e', e)
        let type = e.nativeEvent.data.indexOf('{') > -1 ? JSON.parse(e.nativeEvent.data).type : e.nativeEvent.data;
        switch (type){
            case 'toInvest':
                this.props.navigation.navigate('tab',{fromWebview: true},NavigationActions.navigate({routeName: 'list'}));
                break;
            case 'toLogin':
								global.forbidTransition = false;
                this.props.navigation.navigate('login',{callback: () => {this.getUserInfo();}});
						global.forbidTransition = true;
                break;
            case 'toRegister':
                global.forbidTransitionWithRegiser = true;
                setTimeout(() => {
                    global.forbidTransitionWithRegiser = false;
                },800);
                this.props.navigation.navigate('register',{fromHome: true});
                break;
            case 'toRedPacket':
                this.props.navigation.navigate('redPacket');
                break;
            case 'toRealNameAccount':
                if(this.state.user.useAuthRealName == '1'){
                    this.props.navigation.navigate('createRealNameAccount',{haveCertify: true,userInfo:this.state.user})
                }else{
                    this.props.navigation.navigate('createRealNameAccount',{haveCertify: false,userInfo: this.state.user})
                }
                break;
            case 'inviteFriends':
                if(global.__isLogin == undefined || !global.__isLogin){
                    this.props.navigation.navigate('login',{callback: () => {this.getUserInfo();}});
                }else{
                    this.inviteFriends.showModal();
                }
                break;
            case 'unLoginInFr':
                let shareInfos = JSON.parse(e.nativeEvent.data);
                this.inviteFriends.inviteByWechatFriend(shareInfos.scene, JSON.stringify(shareInfos.shareInfos));
                break;
            default :
                break;
        }
    };
	_onShouldStartLoadWithRequest(navigation) {
		return true
	}
    render(){
        return(
            <View style={Styles.container}>
                <HeaderBar navigation={this.props.navigation}
                           root={this}
                           canGoBack={this.state.canGoBack}
                           noLine={true}
                    />
                <View style={[Styles.container,{backgroundColor: '#ffffff'}]}>
                    {
                        !Util.isIOS && (this.props.OnlineWebchat || this.props.navigation.state.params.OnlineWebchat) ?
                            <ETDWebView style={Styles.container} url={this.props.navigation.state.params.source.uri} />
                            :
                            (this.props.h5Page || this.props.navigation.state.params.h5Page) ?
                                <WebView
                                    ref='webview'
                                    style={Styles.container}
                                    domStorageEnabled={true}
                                    dataDetectorTypes={'none'}
                                    source={this.state.source}
                                    startInLoadingState={false}
                                    javaScriptEnabled={true}
                                    mixedContentMode={'always'}
                                    domStorageEnabled={true}
                                    onError={() => <View style={{height: Util.size.height,width: Util.size.width}}></View>}
																		renderError={() => <View style={{flex:1}}/>}
                                    mixedContentMode="compatibility"
                                    onNavigationStateChange={(event) => {
                                        if(event.url && event.url != ''){
                                            if(event.canGoBack){
                                                this.setGoBack(event.canGoBack);
                                            }else{
                                                let hash = (event.url.indexOf('#') > -1) ? event.url.split('#') : null;
                                                let hashStr = hash ? (hash[1].indexOf('?') > -1 ? hash[1].split('?')[0] : hash[1]) : null;
                                                this.setGoBack(hashStr ? (hashStr.length > 1 ? true : false) : false );
                                            }
                                        }
                                    }}
																		onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this)}
                                    onLoadStart={this.loadStart.bind(this)}
                                    onLoadEnd={this.loadSuccess.bind(this)}
                                    userAgent={this.userAgent}
                                    />
                                :
                                <WebView
                                    ref='webview'
                                    style={[Styles.container,{marginTop: this.props.navigation.state.params.noSpace ? Util.pixel*10 : 0}]}
                                    injectedJavaScript={'('+ String(this.getInjectScript)+')();rn_userInfo='+JSON.stringify(this.state.userInfo)}
                                    domStorageEnabled={true}
                                    dataDetectorTypes={'none'}
                                    source={this.state.source}
																		renderError={() => <View style={{flex:1}}/>}
                                    onNavigationStateChange={(event) => {
                                        if(event.url && event.url != ''){
                                            if(event.canGoBack){
                                                this.setGoBack(event.canGoBack);
                                            }else{
                                                let hash = (event.url.indexOf('#') > -1) ? event.url.split('#') : null;
                                                let hashStr = hash ? (hash[1].indexOf('?') > -1 ? hash[1].split('?')[0] : hash[1]) : null;
                                                this.setGoBack(hashStr ? (hashStr.length > 1 ? true : false) : false );
                                            }
                                        }
                                    }}
                                    onLoadStart={this.loadStart.bind(this)}
                                    onLoadEnd={this.loadSuccess.bind(this)}
                                    onMessage={this._onMessage.bind(this)}
                                    startInLoadingState={false}
                                    mixedContentMode={'always'}
                                    javaScriptEnabled={true}
                                    onError={() => <View style={{flex:1}}></View>}
																		onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this)}
                                    mixedContentMode="compatibility"
                                    userAgent={this.userAgent}
                                    />

                    }
                </View>
                <Loading ref={ref => this.loading = ref} />
                <EAlert ref={ref => this.eAlert = ref}/>
                <InviteFriends ref={ref => this.inviteFriends=ref} root={this} navigation={this.props.navigation} />
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
