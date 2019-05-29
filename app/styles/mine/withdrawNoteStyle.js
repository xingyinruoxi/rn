/**
 * Created by liuzhenli on 2017/7/13.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const withdrawNotesPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    contentBox:{
        minHeight: 100* px,
        marginTop: 15 * px,
        backgroundColor:'#fff',
        alignItems:'center',

    },
});
export {
    withdrawNotesPageStyle
}