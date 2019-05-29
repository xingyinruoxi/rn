/**
 * Created by glzc on 2017/7/6.
 */
import React,{Component} from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';
import Util from './../../../commons/util';
export default class Btn extends Component{
    constructor(props){
        super(props);
    };
    render(){
        return (
            <TouchableOpacity activeOpacity={0.8} disabled={this.props.disabled ? true : false} onPress={this.props.callBack}>
                <View style={[BtnStyles.button,this.props.buttonColor || BtnStyles.button,this.props.style]}>
                    <Text allowFontScaling={false} style={[BtnStyles.text,this.props.textStyle || BtnStyles.text]}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
};

const BtnStyles = StyleSheet.create({
    button: {
        width: Util.size.width - Util.pixel*20,
        height: Util.pixel*45,
        borderRadius: Util.pixel*4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#025fcb'
    },
    text: {
        color: '#ffffff',
        fontSize: Util.commonFontSize(17)
    }
});