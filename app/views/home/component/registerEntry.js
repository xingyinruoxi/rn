/**
 * Created by glzc on 2017/8/17.
 */
import React,{Component} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';
import Util, { Grow } from './../../../commons/util';

export default class RegisterEntry extends Component{
    constructor(props){
        super(props);
    };
    componentDidMount(){

    };
    toRegisterPage(){
				Grow.track('elbn_home_nolog_fornew_click',{'elbn_home_nolog_fornew_click':'首页-未登录-新人福利'});
        global.forbidTransitionWithRegiser = true;
        this.props.navigation.navigate('register',{fromHome: true});
        setTimeout(() => {
            global.forbidTransitionWithRegiser = false;
        },800);
    };
    render(){
        return (
            <View style={registerEntryStyles.container}>
                <TouchableOpacity
                    activeOpacity= {0.8}
                    onPress={this.toRegisterPage.bind(this)}
                >
                    <View style={[registerEntryStyles.flexRow,registerEntryStyles.content,registerEntryStyles.shadow]} >
                        <View style={registerEntryStyles.leftContent}>
                            <Text allowFontScaling={false} style={registerEntryStyles.newWelfare}>新人福利</Text>
                            <View style={[registerEntryStyles.flexRow,{justifyContent: 'flex-start'}]}>
                                <Text allowFontScaling={false} style={registerEntryStyles.noticeText}>最高领取</Text>
                                <Text allowFontScaling={false} style={[registerEntryStyles.noticeText,{fontWeight: 'bold'}]}>1088</Text>
                                <Text allowFontScaling={false} style={registerEntryStyles.noticeText}>元红包</Text>
                            </View>
                            <View style={[registerEntryStyles.registerEntry,{marginTop: Util.pixel*12,}]}>
                                <View style={[registerEntryStyles.flexRow,{justifyContent: 'center',flex:1}]}>
                                    <Text allowFontScaling={false} style={registerEntryStyles.registerEntryText}>立即注册</Text>
                                    <Image source={require('./../../../imgs/home/right_icon.png')} />
                                </View>
                            </View>
                        </View>
                        <View>
                            <Image source={require('./../../../imgs/home/flow_redPicket.png')} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };
}

const registerEntryStyles=StyleSheet.create({
    container: {
        paddingTop: Util.pixel*10,
        paddingLeft: Util.pixel*14,
        paddingRight: Util.pixel*14,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        height: Util.pixel*(Util.size.width <= 320 ? 106 : 121),
        paddingLeft: Util.pixel*10,
        paddingRight: Util.pixel*10,
        backgroundColor: '#ffffff',
        borderRadius: 2,
    },
    leftContent: {
        height:  Util.pixel*(Util.size.width <= 320 ? 106 : 121),
        paddingTop: Util.pixel*(Util.size.width <= 320 ? 18 : 12),
    },
    newWelfare: {
        fontSize: Util.commonFontSize(Util.size.width <= 320 ? 15 : 17),
        color: '#4a4a4a',
    },
    noticeText: {
        fontSize: Util.commonFontSize(Util.size.width <= 320 ? 18 : 22),
        color: '#e94639',
        marginTop: Util.pixel*12,
    },
    registerEntry: {
        position: 'relative',
        width: Util.pixel*65,
        height: Util.pixel*17,
        borderRadius: Util.pixel*20,
        borderWidth: Util.pixel*0.5,
        borderColor: '#e94639',

    },
    registerEntryText: {
        fontSize: Util.commonFontSize(10),
        color: '#e94639',
        marginRight: Util.pixel*3,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    shadow: {
        shadowColor: '#4a4a4a',
        shadowOffset: {width: 1,height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
});