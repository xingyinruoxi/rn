/**
 * Created by liuzhenli on 2017/7/7.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Modal,
    Animated,
} from 'react-native';
import Util from './../../commons/util';
var px = Util.pixel;
import Line from './../../commons/line';
var fontSize = Util.commonFontSize;
export default class EAlert extends Component {
    static navigationOptions = () => ({
        gesturesEnabled: false
    });
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            scale: new Animated.Value(0),
            content: '',
            callback: null,
            type: 'alert',
            submitTitle: null,
            cancelCallback: null,
            cancelHide: false,
            obj: null
        };
    };
    show(type,content,callback,submitTitle,cancelCallback,cancelHide,cancelTitle){
        this.setState({
            type: type,
            visible: true,
            content: content,
            callback: callback,
            submitTitle: submitTitle,
            cancelCallback: cancelCallback,
            cancelHide: cancelHide,
            cancelTitle: cancelTitle

        });
        Animated.spring(this.state.scale,{
            toValue: 1,
            duration: 10,
            tension: 30,
            friction: 4
        }).start();
    };
    hide(callback){
        if(!this.state.cancelHide){
            Animated.spring(this.state.scale,{
                toValue: 0,
                duration: 10,
                tension: 10,
                friction: 4
            }).start();
            setTimeout(() => {
                this.setState({
                    scale: new Animated.Value(0),
                    visible: false
                });
            });
        }
       if(callback && callback != 'cancelCallback'){
            setTimeout(() => {
                this.state.callback && this.state.callback();
            },300);
        }
        if(callback == 'cancelCallback'){
            this.state.cancelCallback && this.state.cancelCallback();
        }
    };
    render() {
        return (

            <Modal visible={this.state.visible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => {this.hide()}}>
                <View style={EAlertStyles.container}>
                    {
                        this.state.type == 'alert' ?
                            <Animated.View style={[EAlertStyles.alertBox,{transform:[{scale: this.state.scale}]}]}>
                                <View style={EAlertStyles.mainTitleBox}>
                                    <Text allowFontScaling={false} style={EAlertStyles.mainTitle}>提示</Text>
                                </View>
                                <View style={EAlertStyles.contentBox}>
                                   <Text allowFontScaling={false} style={EAlertStyles.content}>{this.state.content}</Text>
                                </View>
                                <Line color="rgb(169,169,169)" height={StyleSheet.hairlineWidth}/>
                                <View style={EAlertStyles.buttonBox}>
                                    <TouchableOpacity style={EAlertStyles.singleButtonSure} activeOpacity={0.7}onPress={this.hide.bind(this,true)}>
                                        <Text allowFontScaling={false}  style={EAlertStyles.singleButtonText}>{this.state.submitTitle || '确定'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                            :
                        this.state.type == 'confirm' ?
                            <Animated.View style={[EAlertStyles.confirmBox,{transform:[{scale: this.state.scale}]}]}>
                                <View style={EAlertStyles.titleBox}>
                                    <Text allowFontScaling={false} style={EAlertStyles.title}>提示</Text>
                                </View>

                                <View style={EAlertStyles.confirmContentBox}>
                                    <Text allowFontScaling={false} style={EAlertStyles.content}>{this.state.content}</Text>
                                </View>
                                <Line color="rgb(169,169,169)" height={StyleSheet.hairlineWidth}/>
                                <View style={EAlertStyles.confirmButtonBox}>
                                    <TouchableOpacity style={EAlertStyles.cancelBox} activeOpacity={0.7}onPress={this.hide.bind(this,'cancelCallback')}>
                                        <Text allowFontScaling={false}  style={[EAlertStyles.singleButtonText,{color:'#3F3A39'}]}>{this.state.cancelTitle || '取消'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.7}style={[EAlertStyles.cancelBox,{borderRightWidth:0}]} onPress={this.hide.bind(this,true)}>
                                        <Text allowFontScaling={false}  style={[EAlertStyles.singleButtonText,{}]}>{this.state.submitTitle || '确定'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                            :
                            <Animated.View style={[EAlertStyles.alertBoxNoTitle,{transform:[{scale: this.state.scale}]}]}>
                                <View style={EAlertStyles.contentBoxNotitle}>
                                    <Text allowFontScaling={false} style={EAlertStyles.content}>{this.state.content}</Text>
                                </View>
                                <Line color="rgb(169,169,169)" height={StyleSheet.hairlineWidth}/>
                                <View style={EAlertStyles.buttonBox}>
                                    <TouchableOpacity style={EAlertStyles.singleButtonSure} activeOpacity={0.7} onPress={this.hide.bind(this,true)}>
                                        <Text allowFontScaling={false}  style={EAlertStyles.singleButtonText}>{this.state.submitTitle || '确定'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>

                    }

                </View>

            </Modal>

        );
    }
};
const EAlertStyles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.2)',
        justifyContent:'center',
        alignItems:'center',
        zIndex: 9999,
    },
    alertBox:{
        minHeight: 10 * px,
        width: Util.size.width - 120 * px,
        backgroundColor:'#fff',
        borderRadius: 7 * px,
        overflow: 'hidden',
        alignItems:'center'
    },
    alertBoxNoTitle:{
        height: 105 * px,
        width: Util.size.width - 150 * px,
        backgroundColor:'#fff',
        borderRadius: 7 * px,
        overflow: 'hidden',
        alignItems:'center'
    },
    confirmBox:{
        minHeight: 100 * px,
        width: Util.size.width - 120 * px,
        backgroundColor:'#fff',
        borderRadius: 7 * px,
        overflow: 'hidden',
        alignItems:'center'
    },
    title:{
        fontSize: fontSize(16),
        color:'#000',
        fontWeight: '600'
    },
    titleBox:{
        height: 30 * px,
        justifyContent:'center',
        alignItems:'center',
        paddingTop: 15 * px,
    },
    contentBox:{
        minHeight: 35 * px,
        width: Util.size.width - 110 * px,
        paddingTop: 5 * px,
        alignItems:'center',
    },
    contentBoxNotitle:{
        height: 65 * px,
        width: Util.size.width - 150 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    confirmContentBox:{
        minHeight: 40 * px,
        width: Util.size.width - 120 * px,
        paddingTop: 5 * px,
        alignItems:'center',

    },
    buttonBox:{
        justifyContent:'center',
        alignItems:'center',
    },
    singleButtonSure:{
        justifyContent:'center',
        alignItems:'center',
        height: 40 * px,
        width: Util.size.width - 150 * px,
    },
    singleButtonText:{
        fontSize: fontSize(16),
        color:'#025FCB'
    },
    content:{
        fontSize: fontSize(13),
        textAlign:'center',
        width: Util.size.width - 150 * px,
        lineHeight: Util.lineHeight(18),
        marginBottom: 10 * px,
    },
    confirmButtonBox:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    cancelBox:{
        height:37 * px,
        justifyContent:'center',
        alignItems:'center',
        width: (Util.size.width - 150 * px)/2,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: 'rgb(169,169,169)'
    },
    sureBox:{
        height:37 * px,
        justifyContent:'center',
        alignItems:'center',
        width: (Util.size.width - 150 * px)/2,
    },
    mainTitle:{
        fontSize: Util.commonFontSize(16)
    },
    mainTitleBox:{
        height: 25 * px,
        width:Util.size.width - 150 * px,
        justifyContent:'flex-end',
        alignItems:'center',
    }
});