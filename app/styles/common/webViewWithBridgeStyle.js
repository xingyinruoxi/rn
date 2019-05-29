/**
 * Created by liuzhenli on 2017/7/20.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const webViewWithBridgePageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    contentBox:{
        flex:1,
        width: Util.size.width,
        backgroundColor:'#fff',
        alignItems:'center',
    },
    webView:{
        flex:1,
        width: Util.size.width,
    }
});
export {
    webViewWithBridgePageStyle
}