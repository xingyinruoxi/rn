/**
 * Created by liuzhenli on 2017/8/23.
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
    InteractionManager
} from 'react-native';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import Line from './../../../commons/line';
import Header from './../../components/commonHeader';
import Util,{ Grow }  from './../../../commons/util';
import Fetch from './../../../commons/fetch';
var Storage = require('./../../../commons/storage');
var StorageKeys = require('./../../../commons/storageKey');
var px = Util.pixel;
import { Radio ,Option} from './../radio/option';
export default class RiskAssess extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false,

    });
    constructor(props){
        super(props);
        this.state = {
            userInfo: null,
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKeys.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
        });
    };
    onSelect(data){
        console.log('data',data);
    };
    render() {
        return (
            <View style={FingerPrintStyle.container}>
                <Header leftIcon leftButton title="风险测评" goBack navigation={this.props.navigation}/>
                <View  style={FingerPrintStyle.contentBox}>
                    <View style={FingerPrintStyle.topRemindBox}>
                        <Text allowFontScaling={false} style={FingerPrintStyle.topRemind}>应监管要求，在出借钱需要您完成风险测评</Text>
                    </View>
                    <Line/>
                    <View style={FingerPrintStyle.ItemBox}>
                        <View style={FingerPrintStyle.titleBox}>
                            <Text>1.请问您一般更喜欢进行以下哪种投资？</Text>
                        </View>
                        <View style={FingerPrintStyle.radioBox}>
                            <Radio onSelect={this.onSelect} defaultSelect={this.state.optionSelected - 1}>
                                <Option color="#4A4A4A" selectedColor="#025FCB" title='1213123123123123123123'>
                                    <Text allowFontScaling={false} style={{fontSize:Util.commonFontSize(13),color:'#3F3A39'}} title='werwrwerwerwer'>
                                        选项1
                                    </Text>
                                </Option>
                                <Option color="#4A4A4A" selectedColor="#025FCB" title='1213123123123123123123'>
                                    <Text allowFontScaling={false} style={{fontSize:Util.commonFontSize(13),color:'#3F3A39'}} title='werwrwerwerwer'>
                                        选项2
                                    </Text>
                                </Option>
                                <Option color="#4A4A4A" selectedColor="#025FCB" title='1213123123123123123123'>
                                    <Text allowFontScaling={false} style={{fontSize:Util.commonFontSize(13),color:'#3F3A39'}} title='werwrwerwerwer'>
                                        选项3
                                    </Text>
                                </Option>
                                <Option color="#4A4A4A" selectedColor="#025FCB" title='1213123123123123123123'>
                                    <Text allowFontScaling={false} style={{fontSize:Util.commonFontSize(13),color:'#3F3A39'}} title='werwrwerwerwer'>
                                        选项4
                                    </Text>
                                </Option>
                            </Radio>
                        </View>
                    </View>
                </View>
                <EAlert ref={ref => this.eAlert = ref}/>
                <Loading ref={ref => this.loading = ref}/>
            </View>
        );
    }
}
const FingerPrintStyle = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    contentBox:{
        flex:1,
    },
    ItemBox:{
        minHeight: 150 * px,
        width: Util.size.width,
        paddingHorizontal: 12 * px,
        backgroundColor:'#fff'
    },
    titleBox:{
        height: 40 * px,
        backgroundColor:'#fff',
        justifyContent:'center',
    },
    radioBox:{
        minHeight: 100 * px,
        justifyContent: 'center',
        paddingHorizontal: 5 * px,
    },
    topRemindBox:{
        height: 45 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    topRemind:{
        color:'#025FCB',
        fontSize: Util.commonFontSize(15)
    }
});