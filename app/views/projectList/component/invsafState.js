/**
 * Created by glzc on 2017/7/18.
 */
import React,{Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Util,{Grow} from './../../../commons/util';
import HeaderBar from './../../../commons/headerBar';
const {systemInfos} = require('./../../../commons/config');
export default class InvsafState extends Component{
    static navigationOptions=({navigation}) => ({
       title: '',
       header: () => <HeaderBar navigation={navigation} />
    });
    constructor(props){
        super(props);
        this.state = {
            useId: null,
            sessionId: null,
            code: this.props.navigation.state.params.code,
            isSuccess: this.props.navigation.state.params.isSuccess,
            name: this.props.navigation.state.params.name,
        }
    };
    componentWillMount(){

    };
    componentDidMount(){
        this.growingIO(0);
        if(!Util.isIOS){
           this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.noBack)
        }
    };
    growingIO(n){
        switch (n){
            case 0:
                if(this.state.name == '出借'){
                    let eventName = this.state.isSuccess ? 'pg_invest_investok_userbrowse' : 'pg_invest_investfail_userbrowse';
                    let kv = this.state.isSuccess ? {'pg_invest_investok_userbrowse':'出借成功页浏览用户量'} : {'pg_invest_investfail_userbrowse':'出借失败页面浏览用户量'};
                    Grow.track(eventName,kv);
                }else{
                    let eventName = this.state.isSuccess ? 'pg_invest_transferok_userbrowse' : 'pg_invest_transferfail_userbrowse';
                    let kv = this.state.isSuccess ? {'pg_invest_transferok_userbrowse':'承接成功页面浏览用户量'} : {'pg_invest_transferfail_userbrowse':'承接失败页面浏览用户量'};
                    Grow.track(eventName,kv);
                }
                break;
            case 1:
                if(this.state.name == '出借'){
                    let eventName = this.state.isSuccess ? 'elbn_invest_investok_goon_click' : 'elbn_invest_investfail_again_click';
                    let kv = this.state.isSuccess ? {'elbn_invest_investok_goon_click':'继续出借按钮点击量'} : {'elbn_invest_investfail_again_click':'重新出借按钮点击量'};
                    Grow.track(eventName,kv);
                }else{
                    let eventName = this.state.isSuccess ? 'elbn_invest_transferok_goon_click' : 'elbn_invest_transferfail_again_click';
                    let kv = this.state.isSuccess ? {'elbn_invest_transferok_goon_click':'继续承接按钮点击量'} : {'elbn_invest_transferfail_again_click':'重新承接按钮点击量'};
                    Grow.track(eventName,kv);
                }
                break;
            case 2:
                if(this.state.name == '出借'){
                    let eventName = this.state.isSuccess ? 'elbn_invest_investok_record_click' : 'elbn_invest_investfail_gomyaccount_click';
                    let kv = this.state.isSuccess ? {'elbn_invest_investok_record_click':'查看出借记录按钮点击量'} : {'elbn_invest_investfail_gomyaccount_click':'去我的账户钮点击量'};
                    Grow.track(eventName,kv);
                }else{
                    let eventName = this.state.isSuccess ? 'elbn_invest_transferok_record_click' : 'elbn_invest_transferfail_gomyaccount_click';
                    let kv = this.state.isSuccess ? {'elbn_invest_transferok_record_click':'查看承接记录按钮点击量'} : {'elbn_invest_transferfail_gomyaccount_click':'去我的账户钮点击量'};
                    Grow.track(eventName,kv);
                }
                break;
            default :
                break;
        }
    };
    removeHandler(){
        if(!Util.isIOS){
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
        }
    };
    noBack(){
        return true;
    };
    _loadPage(routeName,flag){
        this.removeHandler();
        routeName === 'list' ? this.growingIO(1) : this.growingIO(2);
        if(flag){
            this.props.navigation.navigate(routeName,this.state.name == '出借' ? {page: 1,fromList: true} : {transfer: true,fromList: true})
        }else{
            let navigationAction = NavigationActions.navigate({
                routeName: 'tab',
                params: {toListDetail: true,page: this.state.name == '出借' ? 0 : 1},
                action: NavigationActions.navigate({routeName: routeName}),
            });
            this.props.navigation.dispatch(navigationAction);
        }
    };
    render(){
        return (
            <View style={{flex:1,backgroundColor: '#ffffff',position: 'relative'}}>
                <View style={invsafStateStyles.container}>
                    <Image source={this.state.isSuccess ? require('./../../../imgs/commons/success_icon.png') : require('./../../../imgs/commons/failure_icon.png')} />
                    <Text allowFontScaling={false} style={invsafStateStyles.stateContent}>{this.state.isSuccess ? '恭喜您'+this.state.name+'成功！' : '很抱歉，'+this.state.name+'失败'}</Text>
                    <Text allowFontScaling={false} style={invsafStateStyles.orderCode}>{this.state.name == '出借' ? '订单编号' : '交易流水号'}：{this.state.code}</Text>
                    <View style={invsafStateStyles.btnView}>
                        <TouchableOpacity
                            style={[invsafStateStyles.btn,{backgroundColor: '#025fcb'}]}
                            activeOpacity={0.7}
                            onPress={this._loadPage.bind(this,'list',false)}>
                            <Text allowFontScaling={false} style={invsafStateStyles.btnText}>{ this.state.isSuccess ? '继续'+this.state.name : '重新'+this.state.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[invsafStateStyles.btn]}
                            activeOpacity={0.7}
                            onPress={this._loadPage.bind(this,this.state.isSuccess ? 'myInvestment' : 'mine',this.state.isSuccess ? true : false)}>
                            <Text allowFontScaling={false} style={[invsafStateStyles.btnText,{color: '#025fcb'}]}>{ this.state.isSuccess ? '查看'+this.state.name+'记录' : '我的账户'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.isSuccess ?
                        null
                    :
                        <View style={invsafStateStyles.serviceTel}>
                            <View style={invsafStateStyles.flexCenter}>
                                <Text allowFontScaling={false} style={invsafStateStyles.serviceText}>如果您需要客服的帮助</Text>
                                <View style={[invsafStateStyles.flexCenter,{flexDirection: 'row',}]}>
                                    <Text allowFontScaling={false} style={invsafStateStyles.serviceText}>请拨打</Text>
                                    <Text allowFontScaling={false} style={[invsafStateStyles.serviceText,{color: '#025fcb'}]}>{systemInfos.customer_service_tel_num}</Text>
                                </View>
                            </View>
                        </View>
                }
            </View>
        )
    }
};

const invsafStateStyles = StyleSheet.create({
    container: {
        flex : 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: Util.pixel*55,
    },
    flexCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateContent: {
        color: '#025fcb',
        fontSize: Util.commonFontSize(15),
        marginTop: Util.pixel*15
    },
    orderCode: {
        color: '#9d9d9d',
        fontSize: Util.commonFontSize(12),
        marginTop: Util.pixel*15
    },
    btnView: {
        width: Util.size.width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: Util.pixel*57
    },
    btn: {
        width: Util.pixel*150,
        height: Util.pixel*40,
        borderWidth: Util.pixel*1,
        borderColor: '#025fcb',
        borderRadius: Util.pixel*4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        fontSize: Util.pixel*17,
        color: '#ffffff'
    },
    serviceTel: {
        width: Util.size.width,
        position: 'absolute',
        bottom: Util.pixel*32,
    },
    serviceText: {
        height: Util.pixel*25,
        fontSize: Util.commonFontSize(15),
        color: '#9b9b9b',
        alignItems: 'center'
    },
});