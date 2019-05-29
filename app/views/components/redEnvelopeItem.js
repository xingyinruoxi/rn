/**
 * Created by glzc on 2017/7/13.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Util,{Grow} from './../../commons/util';

export default class RedEnvelopeItem extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    };
    checkedRedPacket(item){
        if(this.props.radio){
            this.props.checkedRedPacked(item.ticId);
            this.props.callBack && this.props.callBack(this.props.checked == item.ticId ? '' : item);;
        }else{
					Grow.track('elbn_my_myred_touse_click',{'elbn_my_myred_touse_click':'立即使用按钮点击量'});
            this.props.callBack && this.props.callBack(item);
        };
    };
    
    render(){
        let item = this.props.data;
        let isUnuse = item.ticUseState === "UNUSED";
        return (
            <View>
                <TouchableOpacity activeOpacity= {0.8} disabled={!isUnuse} onPress={this.checkedRedPacket.bind(this,item)}>
                    <View style={[reiStyles.container,reiStyles.flexRow]}>
                        <View style={[reiStyles.redEnvelope]}>
                            <View style={reiStyles.flexRow}>
                                <Image style={reiStyles.redEnvelope} source={ isUnuse ? require('./../../imgs/projectList/active_redPacket_bg.png') : require('./../../imgs/projectList/redPacket_bg.png')} />
                            </View>
                            <View style={[reiStyles.redEnvelopeBg,reiStyles.flexRow,{justifyContent: 'space-between'}]}>
                                <View style={[reiStyles.flexColumn,reiStyles.leftContent,{justifyContent: 'space-around'}]}>
                                    <Text allowFontScaling={false} style={[reiStyles.maxText,{paddingTop: Util.pixel*5}]}>{item.actName}</Text>
                                    <View style={[reiStyles.flexRow,{alignItems: 'flex-end'}]}>
                                        <Text allowFontScaling={false} style={[reiStyles.supmaxText]}>{item.ticValue}</Text>
                                        <Text allowFontScaling={false} style={[reiStyles.maxText,{marginBottom: Util.pixel*8}]}>元</Text>
                                    </View>
                                    <Text allowFontScaling={false} style={[reiStyles.minText,{paddingLeft: Util.pixel*8,paddingBottom: Util.pixel*6}]}>失效日期：{item.ticEndDate && item.ticEndDate.slice(0,10)}</Text>
                                </View>
                                <View style={[reiStyles.centerContent,reiStyles.flexColumn,{justifyContent: 'space-around',alignItems: 'flex-start'}]}>
                                    <Text allowFontScaling={false} style={[reiStyles.midText,{color: '#9b9b9b'}]}>来源：{item.ticResource}</Text>
                                    <Text allowFontScaling={false} style={[reiStyles.maxText,{color: '#3F3A39',}]}>{item.ticRemark.replace('单笔投资','单笔出借')}</Text>
                                </View>
                                <View style={[reiStyles.rightContent,reiStyles.flexRow]}>
                                {
                                    this.props.radio ?
                                        <View style={[reiStyles.radio,reiStyles.flexRow,this.props.checked == item.ticId && {borderColor: '#e94639'}]}>
                                            {
                                                this.props.checked == item.ticId ?
                                                    <View style={reiStyles.radioIn}></View>
                                                    : null
                                            }
                                        </View>
                                        :
                                        <View style={[reiStyles.btn,reiStyles.flexRow,!isUnuse && {borderColor: '#888889'}]}>
                                            <Text allowFontScaling={false} style={[reiStyles.midText,isUnuse ? {color: '#e94639'} : {color: '#888889'}]}>{isUnuse ? '立即使用' : '已使用'}</Text>
                                        </View>
                                }
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

};

const reiStyles = StyleSheet.create({
    container: {
        paddingTop: Util.pixel*10,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexColumn: {
        justifyContent: 'center',
        alignItems: 'center',
				backgroundColor: 'transparent',
				paddingBottom: 10,
				paddingTop: 10
    },
    redEnvelope: {
        width: Util.pixel*(Util.size.width <= 320 ? 300 : 355),
        height: Util.pixel*(Util.size.width <= 320 ? 85 : 100),
        position: 'relative'
    },
    redEnvelopeBg: {
        width: Util.pixel*(Util.size.width <= 320 ? 300 : 355),
        height: Util.pixel*(Util.size.width <= 320 ? 85 : 100),
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    leftContent: {
        width: Util.pixel*(Util.size.width <= 320 ? 106.5 : 126),
        height: (Util.size.width <= 320 ? 85 : 100),
    },
    centerContent: {
        width: Util.pixel*(Util.size.width <= 320 ? 120 : 142),
        height: (Util.size.width <= 320 ? 85 : 100),
        marginLeft: Util.pixel*(Util.size.width <= 320 ? 7 : 8),
        paddingTop: Util.pixel*5,
        paddingBottom: Util.pixel*5,
    },
    rightContent: {
        width: Util.pixel*(Util.size.width <= 320 ? 66.5 : 79),
        height: (Util.size.width <= 320 ? 85 : 100),
    },
    minText: {
        fontSize: Util.commonFontSize(Util.size.width <= 320 ? 8 : 10),
        color: '#fff',
        backgroundColor: 'transparent',
    },
    midText: {
        fontSize: Util.commonFontSize(Util.size.width <= 320 ? 10 : 12),
        color: '#fff',
        backgroundColor: 'transparent',

    },
    maxText: {
        fontSize: Util.commonFontSize(Util.size.width <= 320 ? 12 : 13),
        color: '#fff',
        backgroundColor: 'transparent',
				lineHeight: Util.lineHeight(Util.size.width <= 320 ? 15 : 18)
    },
    supmaxText: {
        fontSize: Util.commonFontSize(Util.size.width <= 320 ? 34 : 36),
        color: '#fff',
        backgroundColor: 'transparent',
    },
    radio: {
        width: Util.pixel*25,
        height: Util.pixel*25,
        borderWidth: Util.pixel*0.5,
        borderRadius: Util.pixel*13,
        borderColor: '#888889',
    },
    radioIn: {
        width: Util.pixel*12,
        height: Util.pixel*12,
        borderRadius: Util.pixel*6,
        backgroundColor: '#e94639',
    },
    btn: {
        width: Util.pixel*(Util.size.width <= 320 ? 50 : 60),
        height: Util.pixel*(Util.size.width <= 320 ? 25 : 30),
        borderWidth: Util.pixel*0.5,
        borderColor: '#e94639',
        borderRadius: Util.pixel*4,
    }
});
