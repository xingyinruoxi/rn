/**
 * Created by liuzhenli on 2017/7/10.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Image,
    StatusBar,
    BackHandler
} from 'react-native';
import Util from '../../commons/util';
import { NavigationActions } from 'react-navigation';
import LeftIcon from './headerLeftButton';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
var px = Util.pixel;
var commonFontSize = Util.commonFontSize;
const EventEmitter = require('RCTDeviceEventEmitter');
export default class MineHeader extends Component {
    constructor(props){
        super(props);

    };
    componentDidMount(){
        Storage.getItem(StorageKey.eTD_HIDEACCOUNTINFO).then((data) => {
            if(data != null) {
                this.setState({
                    visible: data
                });

            }
        });
    };
    componentWillUnmount(){
        
    };
    callback(){
        if(global.__fromLaunch){
          if(this.props.title == '注册'){
            EventEmitter.emit('showLeading');
            global.__fromLaunch = false;
          }
        }
        if(this.props.title == '登录'){
            global.__isLogin = null;
            Storage.removeItem(StorageKey.eTD_USERINFO);
            setTimeout(() => {
                global.forbidTransition = false;
            },500)
        }
        if(this.props.callback){
            this.props.callback();
        }
        if(this.props.navigation.state.params && this.props.navigation.state.params.callback){
            this.props.navigation.state.params.callback();
        }
        if(this.props.goBack){
            if(this.props.backKey){
                const backAction = NavigationActions.back({
                    key: this.props.backKey
                });
                this.props.navigation.dispatch(backAction)
            }else{
                this.props.navigation.goBack();
            }

        }
        if(this.props.dispatch){
            if(this.props.dispatch == 'goBack'){
                this.props.navigation.goBack();
            }else{
                this.resetTab();
            }
        }


    };
    resetTab(){
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'tab'})
            ],
        });
        Storage.removeItem(StorageKey.eTD_USERINFO).then(()=>{
            global.__isLogin = null;
            this.props.navigation.dispatch(resetAction)
        });

    }
    changeVisible = () => {
        this.props.rightButtonCallback && this.props.rightButtonCallback();
    };
    render() {
        let {
            leftButton,
            rightButton,
            title,
            leftIcon,
            withdraw,
            hideAccount,
            backTitle ,
            checkRule,
            topUpHistory,
            filter,
            leftTitle,
            color,
            closePage,
            currentMonth
        } = this.props;
        return (
            <View style={[styles.header,Util.isIOS ? { height: Util.deviceId.indexOf('iPhone10') != -1 ? 88 * px : 62 * px } : { height: 42 * px,},color && {backgroundColor:color},]} >
                {
                    Util.isIOS ?
                    color && color == '#fff' ? <StatusBar backgroundColor="blue" barStyle="dark-content" />
                        :
                        <StatusBar backgroundColor="blue" barStyle="light-content" />
                        :
                        null
                }

                {
                    leftButton || rightButton?
                        <View style={styles.titleBox}>
                            <View style={[styles.leftButtonBox]}>
                                {
                                    leftIcon ?
                                        <LeftIcon callback={this.callback.bind(this)} title={leftTitle} backTitle={backTitle}/>
                                        :
                                        null
                                }
                            </View>
                            <View style={styles.titleBoxWidthButton}>
                                <Text allowFontScaling={false} style={[styles.buttonTitle,]}>{title}</Text>
                            </View>
                            <TouchableOpacity style={[styles.rightButtonBox]} onPress={this.changeVisible}>
                                {
                                    rightButton || this.props.rightButton?
                                            <Text allowFontScaling={false} allowFontScaling={false} style={styles.checkRuleText}>{rightButton}</Text>
                                        :
                                        null
                                }
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={[styles.titleBox,color && color =='#fff' && styles.lightHeader]}>
                            <Text allowFontScaling={false} style={[styles.buttonTitle,color && color == '#fff' && {color: '#000'}]}>{title}</Text>
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        width: Util.size.width,
        backgroundColor:'#025FCB',
        justifyContent:'center',
        alignItems:'center',
    },
    headerBox:{
        height: 62 * px,
        width: Util.size.width,
        backgroundColor:'#006EEE',
        justifyContent:"center",
        alignItems:'center',
    },
    titleBox:{
        width: Util.size.width,
        height: 42 * px,
        position: 'absolute',
        left: 0,
        bottom: 0,
        alignItems:'center',
        justifyContent:"center",
        flexDirection:'row'
    },
    buttonTitle:{
        fontSize: commonFontSize(18),
        color:'#fff'
    },
    leftButtonBox:{
        height: 42 * px,
        width: Util.size.width/4,
        justifyContent:'center',
    },
    titleBoxWidthButton:{
        height: 42 * px,
        width: Util.size.width/2,
        justifyContent:'center',
        alignItems:'center',
    },
    rightButtonBox:{
        height: 42 * px,
        width: Util.size.width/4,
        justifyContent:'center',
        alignItems:'flex-end',
        paddingRight: 14 * px,
    },
    iconWithTitleBox:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor:'red'
    },
    checkRuleText:{
        color:'#fff',
        fontSize: commonFontSize(14)
    },
    topUpHistory:{
        color:'#fff',
        fontSize: commonFontSize(14)
    },
    lightHeader:{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(169,169,169)'
    }
});