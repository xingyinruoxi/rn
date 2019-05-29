/**
 * Created by liuzhenli on 2017/7/14.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const listItemPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    contentBox:{
        flex: 1,
        backgroundColor:'#f6f7fa',
        alignItems:'center',
        marginTop: 10 *px,
    },
    footerBox:{
        height: 40 * px,
        width: Util.size.width,
        alignItems:'center',
        justifyContent:'center',
    },
    footerTitle:{
        fontSize:  commonFontSize(13),
        color:'#9d9d9d',
    },
    emptyItemBox:{
        height: Util.size.height *0.7,
        width: Util.size.width,
        justifyContent:"center",
        alignItems:'center',
    },
    itemBox: {
        minHeight: 156 * px,
        width: Util.size.width,
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 10 * px,
        backgroundColor:'#fff'
    },
    itemBoxTop:{
        height: 40 * px,
        justifyContent:'center',
        paddingHorizontal: 14 * px,
        width: Util.size.width,
    },
    itemBoxCenter:{
        height: 90 * px,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width: Util.size.width,

    },
    itemBoxBottom:{
        height: 40 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        width: Util.size.width,
    },
    itemBoxTopTitle:{
        color:'#3F3A39',
        fontSize: commonFontSize(14)
    },
    itemBoxCenterLeft:{
        height: 90 * px,
        width: (Util.size.width - 28 * px)/3,
    },
    itemBoxSubTop:{
        height: 50 * px,
        width: (Util.size.width - 28 * px)/3,
        justifyContent:'flex-end',
        alignItems:'center',
        paddingBottom: 9 * px,
    },
    itemBoxSubTopLeft:{
        height: 50 * px,
        width: (Util.size.width)/3,
        justifyContent:'flex-end',
        paddingBottom: 8 * px,
    },
    itemBoxSubTopRight:{
        height: 50 * px,
        width: (Util.size.width - 28 * px)/3,
        justifyContent:'flex-end',
        alignItems:"flex-end",
        paddingBottom: Util.isIOS ? 9 * px : 14 * px,
    },
    itemBoxSubBottom:{
        height: 30 * px,
        width: (Util.size.width - 28 * px)/3,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
    },
    itemBoxSubTopText:{
        color:'#E94639',
        fontSize: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? commonFontSize(24) : commonFontSize(30) : commonFontSize(24),

    },
    itemBoxCenterCenterSubTopText:{
        color:'#4A4A4A',
        fontSize: Util.isIOS ?Util.deviceType == '5' || Util.deviceType == '5s' ?  commonFontSize(18) : commonFontSize(24) : commonFontSize(16),
        textAlign:'center'
    },
    itemBoxCenterCenterSubTopUnit:{
        fontSize: commonFontSize(13),
    },
    itemBoxCenterCenterSubTopUnitState:{
        fontSize: commonFontSize(15),
        marginBottom: 5 * px,
    },
    itemBoxCenterRightSubTopText:{
        color:'#025FCC',
        fontSize: Util.isIOS ?Util.deviceType == '5' || Util.deviceType == '5s' ?  commonFontSize(18) : commonFontSize(24) : commonFontSize(16),
    },
    itemBoxSubBottomText:{
        color:'#9B9B9B',
        fontSize: commonFontSize(14)
    },
    itemBoxBottomLeft:{
        height: 40 * px,
        width: (Util.size.width - 28 * px) / 3 *2,
        justifyContent:"center",
        alignItems:'flex-start',
        paddingLeft: 14 * px,
    },
    itemBoxBottomRight: {
       flex:1,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: 'flex-end',
        paddingRight: 14 * px,
    },
    itemBoxBottomRightText:{
        color:'#025FCC',
        fontSize: commonFontSize(14)
    },
    itemBoxBottomLeftText:{
        color:'#3F3A39',
        fontSize: commonFontSize(14)
    },

    emptyItem:{
        marginBottom: 20 * px,

    },
    emptyItemText:{
        color:'#9d9d9d',
        fontSize: commonFontSize(14),
        marginBottom: 60 * px,
    },
    footerLoadingBox:{
    	justifyContent: 'center',
        alignItems:'center',
    },
    footerLoadingImg:{
        marginRight: 10 * px,
    }
});
export {
    listItemPageStyle
}