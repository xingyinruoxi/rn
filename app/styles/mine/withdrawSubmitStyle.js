/**
 * Created by liuzhenli on 2017/7/13.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const withdrawSubmitPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        backgroundColor:'#f6f7fa',
    },
    contentBox:{
        minHeight: 100* px,
        marginTop: 15 * px,
        alignItems:'center',
    },
    dataBox:{
        flex:1,
        backgroundColor:'#f6f7fa',
    },
    bankBox:{
        width: Util.size.width,
        minHeight: 45 * px,
        flexDirection: 'row',
        backgroundColor:'#fff',
        paddingHorizontal: 12 * px,
        alignItems:'center',
        justifyContent:'center',
    },
    bankBoxRemarkBox:{
        width: Util.size.width,
        height: 45 * px,
        flexDirection: 'row',
        backgroundColor:'#fff',
        paddingHorizontal: 12 * px,
        alignItems:'center',
        justifyContent:'center',
    },
    bankBoxRemark:{

        height: 100 *px ,
    },
    bankSubBox:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',

    },
    bankSubSubBox:{
        width: Util.size.width,
        minHeight: 45 * px,
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems:'center',
        paddingRight: 22 * px
    },
    bankLogoBox:{
        height: 18 * px,
        width: 18 * px,
        alignSelf: 'center',
        backgroundColor:'red'
    },
    bankNameBox: {
        height: 45 * px,
        flex:1,
        justifyContent:'center',
        paddingHorizontal: 6 * px,
    },
    titleLabelBankName:{
        marginLeft: 5 * px
    },
    bankNoBox:{
        flex:1,
        minHeight: 45 * px,
        justifyContent:'center',
    },
    withdrawRulesBox:{
        minHeight: 50 * px,
        width: Util.size.width,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal: 14 * px,
				backgroundColor: '#fff'
    },
    input:{
        height: 44 * px,
        fontSize: commonFontSize(13),
        textAlign:'right',

    },
    bankNo:{
        alignSelf: 'flex-end',
        paddingRight: 10 * px,
    },
    handlingFee:{
        alignSelf: 'flex-end',
        paddingRight: 10 * px,
        color:'#E94639'
    },
    handlingFeeRules:{
        paddingRight: 10 * px,
        color:'#E94639',
        fontSize: commonFontSize(12),

    },
    handlingFeeContent:{
        color:'#E94639',
        fontSize: commonFontSize(12),
        textAlign:'left',
        lineHeight: Util.lineHeight(20),
				backgroundColor:'#fff'
    },
    userNameBox:{
        height: 44 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:  20 * px,
    },
    labelImg:{

    },
    labelImgBox:{
        height: 45 * px,
        width: Util.isIOS ? 70* px : 80* px ,
        justifyContent:'center',
        alignItems:'flex-start',
        paddingLeft: 8 * px,
    },
    verifyCodeInput:{
        height: 36 * px,
        width: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? 106 * px : 116 * px : 125 * px,
        fontSize: commonFontSize(13),
        marginLeft: 10 * px,
    },
    verifyCodeInputBox:{
        height: 36 * px,
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        marginRight: Util.isIOS ?  null : 10 * px,
    },
    verifyCodeBox:{
        height: 36*px,
        justifyContent:'center',
        alignItems:'center',
        width: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? 80 * px : Util.size.width - 240 * px : Util.size.width - 260 * px
    },
    getSmsButton:{
        height: 34 * px,
        width: 100* px,
        justifyContent:'center',
        alignItems:'center',
    },
    verifyCode:{
        height: 34 * px,
        width: 80 * px,
    },
    titleLabel:{
        color:'#3F3A39',
        fontSize: commonFontSize(15),
    },
    getSmsButtonTitle:{
        color:'#888889',
        fontSize: commonFontSize(12),
    },
    mesRemind:{
        height: 30 * px,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        paddingLeft: 28 * px,
    },
    mesRemindText:{
        color:'#9B9B9B',
        fontSize: commonFontSize(12),
    },
    forgetRemind:{
        height: 50 * px,
        alignItems:'center',
        justifyContent:'center',
    },
    forgetRemindText:{
        color:'#025FCB',
        fontSize: commonFontSize(12),
    },
    buttonBox:{
        height:45  *px,
        width: Util.size.width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        marginTop: Util.deviceType == '5' || Util.deviceType == '5s' ? 30 * px : 50 * px,
    },
    topTitle:{
        color:'#025FCB',
        fontSize: commonFontSize(14),
    }
});
export {
    withdrawSubmitPageStyle
}