/**
 * Created by liuzhenli on 2017/7/20.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    StatusBar,
    Image,
    TouchableOpacity,
    WebView,
    ActivityIndicator
} from 'react-native';
import {webViewWithBridgePageStyle} from './../../styles/common/webViewWithBridgeStyle';
import Util,{ Grow } from './../../commons/util';
import EAlert from './../components/ealert';
import Loading from './../components/loading';
import MineHeader from '../components/commonHeader';
import {appVersion, appAndroidVersion} from './../../commons/config';
import  DeviceInfo from 'react-native-device-info';
export default class WebViewWithBridge extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false
    });
    constructor(props){
        super(props);
        this.state = {
            title: this.props.navigation.state.params.title || '即将跳转',
            body: this.props.navigation.state.params.body,
            method: this.props.navigation.state.params.method,
            url: this.props.navigation.state.params.url,
            canGoBack: false,
            toPage: true
        };
        this.userAgent = DeviceInfo.getUserAgent() + ' etongdai/' + (Util.isIOS ? appVersion : appAndroidVersion);
    };
    componentDidMount(){
        this.loading.show();
    };
    leftButtonHandler(){
        if(this.state.canGoBack){
            this.webView.goBack();
        }else{
            this.props.navigation.goBack();
        }
    };
    onLoadEnd(){
        this.loading.hide();
    };
    onLoad(data){
        this.setState({
            title: this.props.navigation.state.params.title
        });
        this.loading.hide();
    };
    onError(){
        this.props.navigation.state.params.callback && this.props.navigation.state.params.callback();
        this.props.navigation.goBack();
    };
    onNavigationStateChange(navigation){
        if(navigation.navigationType && navigation.navigationType == 'formsubmit'){
            this.loading.show()
        }else{
            this.loading.hide();
        }
    };
    onShouldStartLoadWithRequest(navigation){
        if(navigation.navigationType && navigation.navigationType == 'formsubmit'){
            this.loading.show()
        }else{
            this.loading.hide();
        }
        return true;
    };
    onLoadStart(e){
        this.loading.show()
    };
    onMessage(e){
        let fnName = e.nativeEvent.data.split(';;;')[0];
        switch(fnName) {
            case "toInvesment" :
                global.forbidTransition = true;
                this.props.navigation.navigate('list');
                setTimeout(() => global.forbidTransition = false);
                break;
        }
    };
    render() {
        return (
            <View style={webViewWithBridgePageStyle.container}>
                <MineHeader title={this.state.title} leftButton leftIcon callback={this.leftButtonHandler.bind(this)} navigation={this.props.navigation}/>
                <View style={webViewWithBridgePageStyle.contentBox}>
                    <WebView style={webViewWithBridgePageStyle.webView}
                             ref={(ref) => this.webView = ref}
                             injectedJavaScript={Util.getInjectScript()}
                             source={{uri: this.state.url,method: this.state.method,body: this.state.body}}
                             domStorageEnabled={true}
                             startInLoadingState={this.props.navigation.state.params.loadingState ? true : false}
                             onLoadStart={this.onLoadStart.bind(this)}
                             onLoadEnd={this.onLoadEnd.bind(this)}
                             onLoad={this.onLoad.bind(this)}
                             onError={this.onError.bind(this)}
                             renderError={() => <View style={{flex:1}}></View>}
                             mixedContentMode="compatibility"
                             onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                             renderError={()=> <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator style={[{height: 80}]} size="large" /></View>}
                             onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest.bind(this)}
                             onLoadStart={this.onLoadStart.bind(this)}
                             onMessage={this.onMessage.bind(this)}
                             userAgent={this.userAgent}

                    />
                    <EAlert ref={(ref) => this.eAlert = ref}/>
                    <Loading ref={(ref) => this.loading = ref}/>
                </View>

            </View>
        );
    }
}