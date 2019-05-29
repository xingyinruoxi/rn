/**
 * Created by liuzhenli on 2017/7/28.
 */
import React,{ Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'
var Util = require('./../../commons/util');
var px = Util.pixel;
export default class CloseButton extends Component{
    render(){
        return(
            <TouchableOpacity  style={style.containerBox}activeOpacity={0.7} onPress={this.props.onPress}>
                <View style={style.container} >
                    <Text allowFontScaling={false} style={style.symble}>&times;</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const style = StyleSheet.create({
    container:{
        height: 15 * px,
        width: 15 * px,
        backgroundColor:'rgba(221,221,221,1)',
        borderRadius: 50,
        justifyContent:'center',
        alignItems:'center',
    },
    symble:{
        textAlign: 'center',
        lineHeight: Util.lineHeight(15),
        color:'#fff'
    },
    containerBox:{
        height: 40 * px,
        width: 18 * px,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent'
    }
});