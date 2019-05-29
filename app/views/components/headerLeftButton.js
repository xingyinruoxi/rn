/**
 * Created by liuzhenli on 2017/7/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Util from './../../commons/util';
let px = Util.pixel;
let fontSize = Util.commonFontSize;
export default class HeaderLeftButton extends Component {
    _onPress = () =>{
       this.props.callback && this.props.callback();
        this.props.goBack && this.props.navigation.goBack();
    };
    render() {
        var { title,backTitle } = this.props;
        return (
            <TouchableOpacity activeOpacity={0.7}style={styles.container} onPress={this._onPress}>
                {
                    title ? 
                        <Text allowFontScaling={false} style={styles.buttonText}>{title}</Text>
                        :
                    backTitle && backTitle.length > 0 ?
                        <View style={styles.iconWithTitleBox}>
                            <View style={styles.buttonImg}/>
                            <Text allowFontScaling={false} style={styles.backTitle}>{backTitle}</Text>
                        </View>
                        :
                        <View style={styles.buttonImg}/>
                    

                }

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        width: 80 * px,
        backgroundColor:'transparent',
        justifyContent:'center',
        paddingLeft: 14* px
    },
    buttonText:{
        color:'#fff',
        fontSize: fontSize(14)
    },
    buttonImg:{
        height: 15 * px,
        width:  15 * px,
        borderTopWidth: Util.deviceId.indexOf('iPhone10') > -1 ? 2 * px : 1.5 * px,
        borderLeftWidth: Util.deviceId.indexOf('iPhone10') > -1 ? 2 * px : 1.5 * px,
        borderColor:"#fff",
        transform:[{
            rotate: '-45deg'
        }]
    },
    iconWithTitleBox:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },
    backTitle:{
        color:'#fff',
        fontSize: fontSize(16),
        marginLeft: 2 * px
    }
});