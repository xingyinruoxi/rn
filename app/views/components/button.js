/**
 * Created by liuzhenli on 2017/7/7.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet
} from 'react-native';
import Util from './../../commons/util';
var px = Util.pixel;
var commonFontSize = Util.commonFontSize;
export default class Button extends Component {
    render() {
        var { onPress,disable ,color,textColor ,borderColor,width, full} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.7} style={[styles.button,disable && {backgroundColor:'#9B9B9B'},color&&{backgroundColor:color},borderColor && {borderWidth:1,borderColor:borderColor},width && {width: width * px},full&&{width: width}]} onPress={onPress}>
                <Text allowFontScaling={false} style={[styles.buttonTitle,textColor && {color:textColor}]}>{
                    this.props.buttonName
                }</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        height: 45 * px,
        width: Util.size.width - 28 * px,
        backgroundColor:'#025FCB',
        borderRadius: 5 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonTitle:{
        fontSize: commonFontSize(18),
        color:'#fff'
    },
});