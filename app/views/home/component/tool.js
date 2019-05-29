/**
 * Created by glzc on 2017/8/17.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Util from './../../../commons/util';
import Fetch from './../../../commons/fetch';
const {systemInfos, url} = require('./../../../commons/config');
import { Grow } from './../../../commons/util'
export default class Tool extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    };
    loadPage(routeName,params){
        routeName === 'webview' && this.props.root.growingIO(1);
        routeName === 'topUp' && this.props.root.growingIO(3);
        routeName === 'redPacket' && this.props.root.growingIO(4);
        if(!this.props.root.state.isLogin){
            this.props.navigation.navigate('login',{});
            return;
        }
        if(routeName == 'topUp'){
            this.props.root.loading.show();
            Fetch.post('payment/rechargeInput',{useId: this.props.root.state.useId,sessionId: this.props.root.state.sessionId},res => {
                //console.log('payment/rechargeInput',res)
                this.props.root.loading.hide();
                if(res.success){
                    this.props.navigation.navigate('topUp',{bankData: res.body})
                }else{
                    if(res.info && res.info.indexOf('实名认证') >= 0){
                        this.props.root.eAlert.show('alert',res.info,() => {
                            this.props.navigation.navigate('createRealNameAccount',{haveCertify: false,register: true})
                        })
                    }else if(res.info && res.info.indexOf('绑定银行卡') >= 0){
                        this.props.root.eAlert.show('alert',res.info,() => {
                            this.props.navigation.navigate('bindBankCard',{data: res.body.user})
                        })
                    }
                }
            },err => {
                this.props.root.loading.hide();
            })
        }else{
            this.props.navigation.navigate(routeName,params);
        }
    };
    
    inviteFriend(){
        this.props.root.growingIO(2);
        if(!this.props.root.state.isLogin){
            this.props.navigation.navigate('login',{});
            return;
        };
        this.props.root.loading.show();
        Fetch.post('more/getSysCurrTime',{},res => {
            this.props.root.loading.hide();
            if(res && res.success){
                if(res.body){
                    this.props.navigation.navigate('webview', {source: {uri: url.activeServer+'static/invite/index.html?rct=true'},title: '邀请新人有钱赚',h5Page: false})
                }else{
                    this.props.root.inviteFriends.showModal();
                }
            }
        },err => {
            this.props.root.loading.hide();
        });
    };
	toWebPage(url, title) {
		switch(title){
			case "运营报告":
				Grow.track("elbn_home_nolog_opratedata_click",{"elbn_home_nolog_opratedata_click": "运营报告"});break;
			case "发展历程":
				Grow.track("elbn_home_nolog_develop_click",{"elbn_home_nolog_develop_click": "发展历程"});break;
		}
		this.props.navigation.navigate('webview',{source:{uri: url},title: title})
	}
	render(){
		let isLoging = this.props.root.state.isLogin;
        return (
            <View style={toolStyles.container}>
                <View style={toolStyles.flexRow}>
									{
										isLoging
											?  <TouchableOpacity style={[toolStyles.flexRow,toolStyles.labelContent,{justifyContent: 'center',paddingTop: Util.pixel*3}]} activeOpacity={0.8} onPress={this.loadPage.bind(this,'webview',{source:{uri: systemInfos.sign_in_url},title: '每日签到'})}>
														<View style={[toolStyles.flexColumn,{}]}>
															<Image source={require('./../../../imgs/home/signIn.png')} />
															<Text allowFontScaling={false} style={toolStyles.label}>每日签到</Text>
														</View>
													</TouchableOpacity>
											:   <TouchableOpacity style={[toolStyles.flexRow,toolStyles.labelContent,{justifyContent: 'center',paddingTop: Util.pixel*3}]} activeOpacity={0.8} onPress={this.toWebPage.bind(this,systemInfos.run_report_url,'运营报告')}>
														<View style={[toolStyles.flexColumn,{paddingTop: Util.pixel*6}]}>
															<Image source={require('./../../../imgs/home/report.png')} />
															<Text allowFontScaling={false} style={toolStyles.label}>运营报告</Text>
														</View>
													</TouchableOpacity>
									}
									{
										isLoging
											? <TouchableOpacity style={[toolStyles.flexRow,toolStyles.labelContent,{justifyContent: 'center',paddingTop: Util.pixel*3}]} activeOpacity={0.8} onPress={this.inviteFriend.bind(this)} >
													<View style={toolStyles.flexColumn}>
														<Image source={require('./../../../imgs/home/invite_friends.png')} />
														<Text allowFontScaling={false} style={toolStyles.label}>邀请好友</Text>
													</View>
												</TouchableOpacity>
											:	<TouchableOpacity style={[toolStyles.flexRow,toolStyles.labelContent,{paddingTop: Util.pixel*6}]} activeOpacity={0.8} onPress={this.toWebPage.bind(this,systemInfos.develop_history_url,'发展历程')} >
													<View style={toolStyles.flexColumn}>
														<Image source={require('./../../../imgs/home/developHistory.png')} />
														<Text allowFontScaling={false} style={toolStyles.label}>发展历程</Text>
													</View>
												</TouchableOpacity>

									}
                    <TouchableOpacity style={[toolStyles.flexRow,toolStyles.labelContent,{justifyContent: 'center',paddingTop: Util.pixel*3}]} activeOpacity={0.8} onPress={this.loadPage.bind(this,'topUp',{})}>
                        <View style={toolStyles.flexColumn}>
                            <Image source={require('./../../../imgs/home/toTopUp.png')} />
                            <Text allowFontScaling={false} style={toolStyles.label}>我要充值</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[toolStyles.flexRow,toolStyles.labelContent,{justifyContent: 'center',paddingTop: Util.pixel*3}]} activeOpacity={0.8} onPress={this.loadPage.bind(this,'redPacket',{})} >
                        <View style={[toolStyles.flexColumn,toolStyles.labelContent,]}>
                            {/*<Image source={this.props.root.state.tickCount > 0 ? require('./../../../imgs/home/active_myRedPicketIcon.png') : require('./../../../imgs/home/myRedPicketIcon.png')} />*/}
                            <Image source={require('./../../../imgs/home/myRedPicketIcon.png')} />
                            <Text allowFontScaling={false} style={toolStyles.label}>我的红包</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
};

const toolStyles=StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        paddingTop: Util.pixel*9,
        paddingBottom: Util.pixel*10,
        paddingLeft: Util.pixel*27,
        paddingRight: Util.pixel*27,
        paddingHorizontal: 9 * Util.pixel,
        width: Util.size.width,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    flexColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: Util.commonFontSize(12),
        color: '#4a4a4a',
        marginTop: Util.pixel*5,
    },
    labelContent: {
        position: 'relative',
    },
    state: {
        width: Util.pixel*7,
        height: Util.pixel*7,
        position: 'absolute',
        top: 0,
        right: Util.pixel*14,
        zIndex: 20,
    }
});