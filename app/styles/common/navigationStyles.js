/**
 * eTongDai React Native App
 * This define navigation css
 * @John
 */

import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize
const tabNavigatorStyles = StyleSheet.create({
    tabIcon:{

    },
    headerStyle:{
        height: Util.pixel * 50,
        backgroundColor:'#fff',
    },
    headerTitleStyle:{
    	alignSelf: 'center',
    	fontSize:commonFontSize(18),
        color:'#3f3a39',
    },
    mineHeader:{
        backgroundColor:"#2EA7E0",
        height: Util.pixel * 64,
    },
    mineHeaderTitle:{
        color:'#fff'
    },
    label: {
        fontSize: Util.commonFontSize(10),
        color: '#9b9b9b',
        textAlign:'center',
    },
    activeLabel: {
        color: '#025FCB'//'#025fcb'
    }
});


export {
    tabNavigatorStyles
};