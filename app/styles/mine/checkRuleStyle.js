/**
 * Created by liuzhenli on 2017/7/12.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const checkRulePageStyle =  StyleSheet.create({
    container: {
        flex: 1,
    },
    userInfoBox:{
        alignItems:'center',
        justifyContent:'flex-start',

    },
    
});
export {
    checkRulePageStyle
}