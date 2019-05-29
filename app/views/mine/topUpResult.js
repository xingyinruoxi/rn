/**
 * Created by liuzhenli on 2017/7/13.
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
    BackHandler,
	Linking
} from 'react-native';
import {topUpResultPageStyle} from './../../styles/mine/topUpResultStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import Util,{ Grow } from './../../commons/util';
const {systemInfos} = require('./../../commons/config');
import { NavigationActions } from 'react-navigation';
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import Button from './../components/button';
export default class TopUpResult extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false
        };
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });

    };
    componentDidMount(){
			if(this.props.navigation.state.params.status == 'success'){
				Grow.track('pg_my_rechargeok_userbrowse',{'pg_my_rechargeok_userbrowse':'充值成功页浏览用户量'})
			}else{
				Grow.track('pg_my_rechargefail_userbrowse',{'pg_my_rechargefail_userbrowse':'充值失败页浏览用户量'})
			}
        if(!Util.isIOS){
            this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.forbidGoBack);
        }
    };
    forbidGoBack(){
        return true;
    };
    removeHandler(){
        if(!Util.isIOS){
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
        }
    }
    toAnotherPage(routeName){
        global.forbidTransition = true;
        this.removeHandler();
        const resetAction = NavigationActions.navigate({
            routeName: 'tab',
            params: {},
            action: NavigationActions.navigate({ routeName: routeName })
        });
        this.props.navigation.dispatch(resetAction);
        setTimeout(() => {global.forbidTransition = false},100)
    };
	showPhone(phone) {
		this.eAlert.show('confirm',`客服咨询时间：8:00-20:00，客服电话${phone}`,this.callPhone.bind(this,phone),'确定',() => {return},null,"取消")
	}
	callPhone(phone) {
		Linking.openURL(`tel:${phone}`)
	}
    render() {
        let status = this.props.navigation.state.params.status;
        let data = this.props.navigation.state.params.data;
				let bindingFlag = this.props.navigation.state.params.bindingFlag
        return (
            <View style={topUpResultPageStyle.container}>
                <MineHeader title="充值"  navigation={this.props.navigation}/>
                <View style={topUpResultPageStyle.contentBox}>
                    <View style={topUpResultPageStyle.contentTopBox}>
                        <View style={topUpResultPageStyle.contentImgBox}>
                            {
                                status == 'success' ?
                                    <Image source={require('./../../imgs/mine/successImg.png')}/>
                                    :
                                    <Image source={require('./../../imgs/mine/failImg.png')}/>
                            }
                        </View>

                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>
                            {
                                //TODO
                                status == 'success' ?
                                `恭喜您成功充值 ${data && data.recSum} 元！`
                                    :
                                    '很抱歉，充值失败！'
                            }</Text>
                        <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumberService}>订单编号：{data && (data.recOrderNo || data.recId) }</Text>
                        {
                            status == 'failed' ?
                                <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNumberService}>失败原因：</Text>
                            : null
                        }
                    </View>
                    <View style={topUpResultPageStyle.buttonBox}>
                        <Button buttonName={status == 'success' ? '再充一笔' : '重新充值' } width={150} onPress={() => {status == 'success' ? !bindingFlag ? Grow.track('elbn_my_rechargeok_again_click',{'elbn_my_rechargeok_again_click':'再充一笔按钮点击量'}): Grow.track('elbn_my_rechargefail_again_click',{'elbn_my_rechargefail_again_click':'重新充值按钮点击量'}) : null;this.removeHandler();this.props.navigation.goBack();this.props.navigation.state.params.callback && this.props.navigation.state.params.callback()}}/>
                        <Button buttonName={status == 'success' ? '去出借' : '充值记录' } width={150} color='#fff' textColor='#025FCC' borderColor='#025FCC'onPress={() => {status == 'success' ? !bindingFlag ?  Grow.track('elbn_my_rechargeok_goinvest_click',{'elbn_my_rechargeok_goinvest_click':'去投资按钮点击量'}): Grow.track('elbn_my_rechargefail_record_click',{'elbn_my_rechargefail_record_click':'充值记录按钮点击量'}) : null;this.removeHandler();status == 'success' ? this.toAnotherPage('list'): this.props.navigation.navigate('topUpNotes',{backKey: this.props.navigation.state.key})}}/>
                    </View>
                    {
                        status == 'fail' ?
                            <View style={[topUpResultPageStyle.bottomRemindBox,topUpResultPageStyle.bottomServiceBox,]}>
                                <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNumberService]}>如果您需要客服的帮助</Text>
                                <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNumberService]}>请拨打<Text allowFontScaling={false} style={{color:'#025FCB'}} onPress={this.showPhone.bind(this,systemInfos.customer_service_tel_num)}>{systemInfos.customer_service_tel_num}</Text></Text>
                            </View>
                            :
                            null
                    }

                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}